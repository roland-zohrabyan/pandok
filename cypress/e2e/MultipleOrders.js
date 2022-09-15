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

        // 1.-----------------------------------------------------------------------------------------

        // selecting a hall
        cy.contains('ՍՐԱՀ 1')


        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });

        let servicePerc
        let discountPerc
        //selecting a table
        cy.get('.MuiContainer-root > div > div:nth-child(4) button')
            .contains("1-39") //hard code
            // .should('have.css', 'color', 'rgb(0, 0, 0)')
            .click()
            // .invoke('attr', 'class').should('contain', "MuiButton-outlinedPrimary")
            .then(() => {
                cy.get("[role='tooltip'] > div > div:nth-last-child(2) > em").then($el => {
                    servicePerc = $el.text()
                })
            })
            .then(() => {
                cy.get("[role='tooltip'] > div > div:nth-last-child(1) > em").then($el => {
                    discountPerc = $el.text()
                })
            })

        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });

        // selecting kitchen or bar
        cy.contains("ԽՈՀԱՆՈՑ").click()

        // selecting dish section
        cy.then(() => Cypress._.random(0, 7 - 1))
            .then((k) => {
                const dishArray = [" խորտիկ", "աղցան", "ապուր", "տաք ուտեստ", "մանղալ", "թոնիր", "ձկնեղեն"]
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
            .contains(Cypress._.random(1, 9))
            .then($el => {
                dishQuantity = $el.text()
            })
            .click()

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
        // /*\d*$
        cy.intercept(/api\/order\/*\d*$/).as("receive_order")
        cy.intercept("https://yp-dev-api.essentialsln.com/api/order/print-invoice").as("print_bill")
        cy.intercept("https://yp-dev-api.essentialsln.com/api/order/bill-payment").as("pay")

        cy.contains("Ընդունել").click() // relative end

        cy.wait("@receive_order", { timeout: 25000 })

        // cy.pause()

        // 2.----------------------------------------------------------------------------------------------------

        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });

        let servicePerc2
        let discountPerc2
        //selecting a table
        cy.get('.MuiContainer-root > div > div:nth-child(4) button')
            .contains("1-59") //hard code
            // .should('have.css', 'color', 'rgb(0, 0, 0)')
            .click()
            // .invoke('attr', 'class').should('contain', "MuiButton-outlinedPrimary")
            .then(() => {
                cy.get("[role='tooltip'] > div > div:nth-last-child(2) > em").then($el => {
                    servicePerc2 = $el.text()
                })
            })
            .then(() => {
                cy.get("[role='tooltip'] > div > div:nth-last-child(1) > em").then($el => {
                    discountPerc2 = $el.text()
                })
            })

        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });

        // selecting kitchen or bar
        cy.contains("ԽՈՀԱՆՈՑ").click()

        // selecting dish section
        cy.then(() => Cypress._.random(0, 7 - 1))
            .then((k) => {
                const dishArray = [" խորտիկ", "աղցան", "ապուր", "տաք ուտեստ", "մանղալ", "թոնիր", "ձկնեղեն"]
                cy.contains(dishArray[k]).click()
            })

        let dishPrice2
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
                        dishPrice2 = $el.text()
                    })
            })

        // cy.contains('Հավելումներ').should('exist')

        let dishQuantity2
        cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3)")
            .children()
            .children()
            .contains(Cypress._.random(1, 9))
            .then($el => {
                dishQuantity2 = $el.text()
            })
            .click()

        cy.contains("Enter").click()

        cy.contains('div', 'Ընդամենը')
            .parent()
            .siblings("div:nth-last-child(1)")
            .then($el => {
                let actResult2 = $el.text().replace(/\s/g, "")
                let netPrice2 = parseInt(dishPrice2 * dishQuantity2)
                let expResult2 = netPrice2 + (netPrice2 * parseInt(servicePerc2) / 100) - (netPrice2 * parseInt(discountPerc2) / 100)
                expect(actResult2).to.be.equal(expResult2.toString())
            })

        cy.contains("Անձերի թիվը").next().click()


        cy.contains("Ընդունել").click() // relative end 2

        cy.wait("@receive_order", { timeout: 25000 })

        // cy.pause()


        // 3.------------------------------------------------------------------------------------------


        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });

        //selecting a table
        cy.get('.MuiContainer-root > div > div:nth-child(4) button')
            .contains("1-39") //hard code
            // .should('have.css', 'color', 'rgb(0, 0, 0)')
            .click()
        // .invoke('attr', 'class').should('contain', "MuiButton-outlinedPrimary")


        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });

        // selecting kitchen or bar
        cy.contains("ԽՈՀԱՆՈՑ").click()

        // selecting dish section
        cy.then(() => Cypress._.random(0, 7 - 1))
            .then((k) => {
                const dishArray = [" խորտիկ", "աղցան", "ապուր", "տաք ուտեստ", "մանղալ", "թոնիր", "ձկնեղեն"]
                cy.contains(dishArray[k]).click()
            })

        let dishPrice3
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
                        dishPrice3 = $el.text()
                    })
            })

        // cy.contains('Հավելումներ').should('exist')

        let dishQuantity3
        cy.get(".MuiContainer-root > div > div:nth-child(7) > div:nth-child(3)")
            .children()
            .children()
            .contains(Cypress._.random(1, 9))
            .then($el => {
                dishQuantity3 = $el.text()
            })
            .click()

        cy.contains("Enter").click()

        cy.contains('div', 'Ընդամենը')
            .parent()
            .siblings("div:nth-last-child(1)")
            .then($el => {
                let actResult3 = $el.text().replace(/\s/g, "")

                // let netPrice3 = parseInt(dishPrice * dishQuantity) // to remove

                let totalNetPrice3 = parseInt(dishPrice * dishQuantity) + parseInt(dishPrice3 * dishQuantity3)

                let expResult3 = totalNetPrice3 + (totalNetPrice3 * parseInt(servicePerc) / 100) - (totalNetPrice3 * parseInt(discountPerc) / 100)
                // 400 * 4 + 2600 * 3 + (9400 * 10 / 100) - (9400 * 0 / 100) = 10340


                expect(actResult3).to.be.equal(expResult3.toString())
            })

        cy.contains("Անձերի թիվը").next().click()

        cy.contains("Ընդունել").click() // relative end 3

        cy.wait("@receive_order", { timeout: 25000 })

        // cy.pause()

        // 4.------------------------------------------------------------------------------------------


        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });

        //selecting a table
        cy.get('.MuiContainer-root > div > div:nth-child(4) button')
            .contains("1-59") //hard code
            // .should('have.css', 'color', 'rgb(0, 0, 0)')
            .click()
        // .invoke('attr', 'class').should('contain', "MuiButton-outlinedPrimary")

        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });


        cy.contains("button > span", "Հաշիվ").click()
        cy.wait("@print_bill", { timeout: 25000 })
        cy.contains("Հաշիվը տպված է։").should('exist')

        cy.contains("Մարել").click()
        cy.wait("@pay", { timeout: 25000 })
        cy.contains("Հաշիվը մարված է").should('exist')

        cy.contains("Մարած-զբաղված").click()
        cy.contains("Սեղանը զբաղված է").should('exist')

        cy.contains("button > span", "Ազատ").click()
        cy.contains("Սեղանը զբաղված է").should('not.exist')

        // cy.pause()


        // 5.----------------------------------------------------------------------------------------

        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });

        cy.get('.MuiContainer-root > div > div:nth-child(4) button')
            .contains("1-39") //hard code
            // .should('have.css', 'color', 'rgb(0, 0, 0)')
            .click()
        // .invoke('attr', 'class').should('contain', "MuiButton-outlinedPrimary")

        cy.get('body').then(() => {
            if (Cypress.$("p:contains('Ենթախմբեր')").length) {
                cy.contains('p', "Ենթախմբեր").next().click();
            }
        });
        cy.pause()

        cy.contains("button > span", "Հաշիվ").click()
        cy.wait("@print_bill", { timeout: 25000 })
        cy.contains("Հաշիվը տպված է։").should('exist')

        cy.contains("Մարել").click()
        cy.wait("@pay", { timeout: 25000 })
        cy.contains("Հաշիվը մարված է").should('exist')

        cy.contains("Մարած-զբաղված").click()
        cy.contains("Սեղանը զբաղված է").should('exist')

        cy.contains("button > span", "Ազատ").click()
        cy.contains("Սեղանը զբաղված է").should('not.exist')

        // cy.pause()



    }) // it

}) // describe