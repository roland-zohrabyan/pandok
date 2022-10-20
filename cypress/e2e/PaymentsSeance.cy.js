describe('pandok tests', () => {

  let fixtureData

  before(() => {

    cy.fixture('test_data').then(data => fixtureData = data)

  });

  beforeEach(() => {

    cy.login(Cypress.env("username"), Cypress.env('password'), fixtureData.permissionList)
    cy.visit("/dashboard")
      .its("location.href")
      .should("equals", "https://yp-dev.essentialsln.com/dashboard")

  });

  it('Պատվերի գրանցում և մարում', function () {

    cy.intercept(/ingredient-dish-restaurant\?restaurantId=4/).as("dishListReq1")

    cy.intercept(/ingredient-dish-restaurant\?restaurantId=7/).as("dishListReq2")

    cy.visit('/operations/orders').then(window => {
      expect(window.location.href).to.be.equal("https://yp-dev.essentialsln.com/operations/orders")
      expect(window.document.title).to.contain("Պատվեր")
    })

    cy.wait("@dishListReq1", { timeout: 25000 })
    cy.contains('ԽՈՐԵՆԱՑԻ').click()
    cy.contains('ՏԵՐՅԱՆ').click()

    cy.wait("@dishListReq2", { timeout: 25000 })

    // selecting a hall
    cy.contains('ՍՐԱՀ 1')
      .click()
    cy.contains('ul div', 'ՍՐԱՀ 2').click()


    cy.get('body').then(() => {
      if (Cypress.$("p:contains('Ենթախմբեր')").length) {
        cy.contains('p', "Ենթախմբեր").next().click();
      }
    });

    let servicePerc
    let discountPerc
    // selecting a table
    cy.then(() => Cypress._.random(0, 6 - 1))
      .then((k) => {
        const dishArray = ["2-34", "2-35", "2-51", "2-58", "2-67", "2-70"]
        cy.contains(dishArray[k]).click()
      })
      .then(() => {
        cy.get("[role='tooltip'] > div > div:nth-last-child(2) > em").then($el => {
          servicePerc = $el.text().slice(0, -1)
        })
      })
      .then(() => {
        cy.get("[role='tooltip'] > div > div:nth-last-child(1) > em").then($el => {
          discountPerc = $el.text().slice(0, -1)
        })
      })


    // selecting kitchen or bar
    cy.contains("ԽՈՀԱՆՈՑ").click()

    // selecting dish section
    cy.then(() => Cypress._.random(0, 7 - 1))
      .then((k) => {
        const dishArray = ["խորտիկ", "աղցան", "ապուր", "տաք ուտեստ", "մանղալ", "թոնիր", "ձկնեղեն"]
        cy.contains(dishArray[k]).click()
      })


    let dishPrice
    // selecting dish(es)
    cy.get(".MuiContainer-root > div > div:nth-child(6) tr")
      .should('have.length.greaterThan', 0)
      .its('length')
      .then((n) => Cypress._.random(0, n - 1))
      .then((k) => {
        cy.get('.MuiContainer-root > div > div:nth-child(6) tr > td:nth-child(2)')
          .eq(k)
          .click({ force: true })
          // .invoke('css', 'border').should('equal', "2px solid rgb(79, 139, 148)")
          .then($el => {
            dishPrice = $el.text()
          })
      })

    // cy.contains('Հավելումներ').should('exist')

    let dishQuantity
    cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3)")
      .children()
      .children()
      .contains(Cypress._.random(1, 9)) // add .toString() if necessary
      .then($el => {
        dishQuantity = $el.text()
      })
      .click()

    cy.then(() => { console.log(dishQuantity) })

    cy.contains("Enter").click()

    let actResult
    let expResult
    let servicePercAmount
    let discPercAmount
    cy.contains('div', 'Ընդամենը')
      .parent()
      .siblings("div:nth-last-child(1)")
      .then($el => {
        actResult = parseInt($el.text().replace(/\s/g, ""))
        let netPrice = parseInt(dishPrice * dishQuantity)
        servicePercAmount = netPrice * parseInt(servicePerc) / 100
        discPercAmount = netPrice * parseInt(discountPerc) / 100

        expResult = netPrice + (netPrice * parseInt(servicePerc) / 100) - (netPrice * parseInt(discountPerc) / 100)
        // expResult = netPrice + servicePercAmount - discPercAmount

        expect(actResult.toString()).to.be.equal(expResult.toString())

        cy.wrap(expResult).as("expResult")
        cy.wrap(actResult).as("actResult")
      })

    cy.contains("Անձերի թիվը").next().click()

    cy.contains("Ընդունել").click()

    cy.contains("button > span", "Հաշիվ").click()
    cy.contains("Հաշիվը տպված է։").should('exist')


    cy.get("@expResult").then(function (expResult) { cy.payByThreeMethods(expResult) })
    // cy.then(function () {cy.payByThreeMethods(this.actResult) }) // working alternative
    // cy.payByThreeMethods(this.actResult) // not working
    // cy.payByThreeMethods(actResult)  // not working

    cy.contains("Մարել").click()
    // cy.contains("Հաշիվը մարված է").should('exist') // makes tests flaky

    let seanceNum
    cy.request({
      method: "GET",
      url: "https://yp-dev-api.essentialsln.com/api/seance?restaurantId=7",
      headers: {
        'accessToken': window.localStorage.getItem("refreshToken")
      }
    })
      .then((resp) => {
        seanceNum = resp.body.number
        console.log(seanceNum)
      })


    cy.request({
      method: "POST",
      url: "https://yp-dev-api.essentialsln.com/api/trade",
      headers: {
        'accessToken': window.localStorage.getItem("refreshToken")
      },
      body: {
        departmentIds: [1, 2],
        fromCardNumber: "",
        fromDate: new Date().toJSON(),
        toDate: new Date().toJSON(),
        fromSeance: seanceNum,
        hallId: 0,
        periodTypeEnum: "SEANCE",
        restaurantIds: [7],
        tableGroupId: 0,
        tableIds: fixtureData.tableIds,
        toCardNumber: "",
        toSeance: seanceNum,
        tradeFilterTypeEnum: "RECEIPT"
      },
    })
      .should(function (resp) {
        // for (let i = 0; i < resp.body.length; i++) {
        expect(resp.body[0].serviceFee).to.equal(servicePercAmount) // 400 servicefee1 servicefee2
        expect(resp.body[0].discountAmount).to.equal(discPercAmount) // 0
        expect(resp.body[0].orderAmount).to.equal(expResult) // 4400
        expect(resp.body[0].paidAmount).to.equal(this.cashValueWrapped) // 4400
        expect(resp.body[0].cardPaidAmount).to.equal(this.cardValueWrapped) // 0
        expect(resp.body[0].accountPaidAmount).to.equal(this.balanceValueWrapped) // 0
        // }

      })


  }) // it

}) // describe