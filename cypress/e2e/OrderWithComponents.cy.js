describe('pandok tests', () => {

    // let fixtureData

    before(() => {

        // cy.fixture('test_data').then(data => fixtureData = data)
        // cy.fixture('test_data').as('fixtureData')


    });

    beforeEach(() => {

        cy.fixture('test_data').as('fixtureData').then(data => {
            cy.login(Cypress.env("username"), Cypress.env('password'), data.permissionList)
        })
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
                const dishArray = ["2-34", "2-35", "2-51", "2-58", "2-67", "2-70"] // "2-34", "2-35", "2-51", "2-58", "2-67", "2-70" // hardcode
                cy.contains(dishArray[k]).click()
            })
            .then(() => {
                cy.get("[role='tooltip'] > div > div:nth-last-child(2)").then($el => {
                    servicePerc = $el.text().replace("%", "")
                })
            })
            .then(() => {
                cy.get("[role='tooltip'] > div > div:nth-last-child(1)").then($el => {
                    discountPerc = $el.text().replace("%", "")
                })
            })

        // selecting kitchen or bar
        cy.contains("ԽՈՀԱՆՈՑ").click()

        cy.contains("11 թոնրի խորովածի տեսականի").click()

        let dishPrice
        cy.contains(".MuiContainer-root > div > div:nth-child(6) tr > td:nth-child(1)", "թոնրի խորովածի տեսականի")
            .next()
            .then($el => {
                dishPrice = parseInt($el.text())
            })
            .click()

        let compCount1
        cy.contains("div[role='button']", "կարտոֆիլ խորոված թոնիր Պ/Ֆ").as("dishComp1")
        cy.get("@dishComp1").then($el => {
            cy.wrap($el).click()
            cy.get("@dishComp1").next().children("button:nth-child(2)").then($el => {
                compCount1 = Cypress._.random(1, 10)
                for (let i = 0; i < compCount1 - 1; i++) {
                    cy.wrap($el).click()
                }
                console.log(compCount1)
                cy.pause()

            })
        })

        let compCount2
        cy.contains("div[role='button']", "գառան խորոված թոնիր Պ/Ֆ").as("dishComp2")
        cy.get("@dishComp2").then($el => {
            cy.wrap($el).click()
            cy.get("@dishComp2").next().children("button:nth-child(2)").then($el => {
                compCount2 = Cypress._.random(1, 10)
                for (let i = 0; i < compCount2 - 1; i++) {
                    cy.wrap($el).click()
                }
                console.log(compCount2)
                cy.pause()
            })
        })


        cy.contains('div', 'Ընդամենը').parent().siblings("div:nth-last-child(1)").as("finalBill")
        cy.get("@finalBill").then($el => {
            let dishQantity = (compCount1 + compCount2) / 2
            let actResult = parseInt($el.text().replace(/\s/g, ""))
            let netPrice = dishPrice * dishQantity // dish quantity is hardcode
            let expResult = netPrice + (netPrice * parseInt(servicePerc) / 100) - (netPrice * parseInt(discountPerc) / 100)

            expect(actResult).to.be.equal(expResult)
        })

        cy.contains("Enter").click()


        cy.contains("Անձերի թիվը").next().click()
        cy.contains("Ընդունել").click()

        cy.contains("button > span", "Հաշիվ").click()
        cy.contains("Հաշիվը տպված է։").should('exist')

        cy.contains("Մարել").click()
        cy.contains("Հաշիվը մարված է").should('exist')


    })

})