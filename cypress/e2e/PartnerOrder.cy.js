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

    // ---------------------

    // selecting a table
    let servicePerc
    let tableDiscountPerc
    // selecting a table
    cy.then(() => Cypress._.random(0, 1 - 1))
      .then((k) => {
        const dishArray = ["2-34", "2-51", "2-58", "2-70"] // "2-34", "2-51", "2-58", "2-70"
        cy.contains(dishArray[k]).click()
      })
      .then(() => {
        cy.get("[role='tooltip'] > div > div:nth-last-child(2)").then($el => {
          servicePerc = parseInt($el.text().replace("%", ""))
          console.log(servicePerc)
        })
      })
      .then(() => {
        cy.get("[role='tooltip'] > div > div:nth-last-child(1)").then($el => {
          tableDiscountPerc = parseInt($el.text().replace("%", ""))
          console.log(tableDiscountPerc)
        })
      })

    // ---------------------

    cy.get("[type='password']").click()

    cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3) > * > *").contains("0").then((num) => {
      for (let i = 0; i <= 5; i++) {
        cy.wrap(num).click()
      }
    })

    cy.contains("Enter").click()

    // ---------------------

    cy.contains("span", "Պատվերի No").next("div").click()

    cy.contains("123444").click()

    // ---------------------

    let staffCount
    cy.contains("span", "Պատվերի No").next("div").next("div").click()

    cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3) > * > *")
      .then($el => {
        staffCount = Cypress._.random(6, 9)
        console.log(staffCount)
        cy.wrap($el).contains(staffCount).click()
      })

    cy.contains("Enter").click()


    // ---------------------

    let guideCount
    cy.contains("span", "Գիդ").next().click()

    cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3) > * > *")
      .then($el => {
        guideCount = Cypress._.random(1, 4)
        console.log(guideCount)
        cy.wrap($el).contains(guideCount).click()
      })

    cy.contains("Enter").click()

    // ---------------------

    cy.contains("span", "Քարտ No").next().click()

    cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3) > * > *")
      .contains("0") //hardcode
      .click()

    cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3) > * > *")
      .contains("0") //hardcode
      .click()

    cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3) > * > *")
      .contains("2") //hardcode
      .click()

    cy.contains("Enter").click()

    cy.contains("Համագործակցողի տվյալները հաջողությամբ ստացվեցին").should("exist")

    // ----------------------

    //  պատվերի գումար -(պատվերի գումար x սեղանի զեղչ) = սեղանի զեղչով պատվերի գումար 
    //  սեղանի զեղչով պատվերի գումար  - սեղանի զեղչով պատվերի գումար  x (համագործակցողի զեղչ)
    cy.contains('div', 'Ընդամենը')
      .parent()
      .siblings("div:nth-last-child(1)")
      .then($el => {
        cy.contains('div', 'Ընդամենը').parent().siblings("div:nth-child(1)").find("div:nth-child(2)").invoke("text").then(initialBillRaw => {

          console.log(initialBillRaw)

          cy.contains('div', 'Ընդամենը').next().invoke("text").then(preBillRaw => {

            let preBill = preBillRaw.replace(/\s/g, "")
            console.log(preBill, "preBill")

            cy.contains('div', 'Ընդամենը').parent().siblings("div:nth-child(2)").find("div:nth-child(2)").invoke("text").then(serviceFeeActualRaw => {

              let serviceFeeActual = serviceFeeActualRaw.replace(/\s/g, "")

              let initialBill = initialBillRaw.replace(/\s/g, "")
              console.log("ընդամենը", initialBill)

              let partnerDiscountPerc = 20
              console.log("partnerDiscountPerc", partnerDiscountPerc)

              let guideDiscountPerc = guideCount / staffCount * 100
              console.log(guideDiscountPerc, "guideDiscountPerc")
              let guideDiscountPercAmount = preBill * guideDiscountPerc / 100
              console.log(guideDiscountPercAmount, "guideDiscountPercAmount")

              let orderBillwTableDisc = initialBill - (initialBill * tableDiscountPerc / 100)
              console.log(orderBillwTableDisc, "orderBillwTableDisc")
              let expResult = orderBillwTableDisc - (orderBillwTableDisc * partnerDiscountPerc / 100) + (parseInt(serviceFeeActual)) - guideDiscountPercAmount
              console.log(expResult)

              let actResult = parseInt($el.text().replace(/\s/g, ""))
              console.log(actResult, "actual result")
              console.log(typeof actResult)
              console.log(typeof expResult)
              console.log(actResult)
              console.log(expResult)

              expect(actResult).to.be.closeTo(expResult, 1, "Failed, Mohammed bin Rashid Al Maktoum jan")
            })
          })
        })

      })

    // ----------------------

    cy.contains("Անձերի թիվը").next().click()
    cy.contains("Ընդունել").click()

    cy.contains("button > span", "Հաշիվ").click()
    cy.contains("Հաշիվը տպված է։").should('exist')

    cy.contains("Մարել").click()
    cy.contains("Հաշիվը մարված է").should('exist')

  }) // it

}) // describe