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


    let hallTextValue

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
          .click()
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

    cy.contains('div', 'Ընդամենը')
      .parent()
      .siblings("div:nth-last-child(1)")
      .then($el => {
        let actResult = $el.text().replace(/\s/g, "")
        let netPrice = parseInt(dishPrice * dishQuantity)
        let expResult = netPrice + (netPrice * parseInt(servicePerc) / 100) - (netPrice * parseInt(discountPerc) / 100)
        expect(actResult).to.be.equal(expResult.toString())
      })

    cy.contains("Անձերի թիվը").next().click()

    cy.contains("Ընդունել").click()

    cy.contains("button > span", "Հաշիվ").click()
    cy.contains("Հաշիվը տպված է։").should('exist')

    cy.contains("Մարել").click()
    cy.contains("Հաշիվը մարված է").should('exist')



  }) // it

}) // describe