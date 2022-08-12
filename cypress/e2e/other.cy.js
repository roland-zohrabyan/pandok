describe('pandok tests', () => {

    let fixtureData

    before(() => {
        cy.fixture('test_data').then(data => fixtureData = data)
    });

    beforeEach(() => {

        cy.login(Cypress.env("username"), Cypress.env('password'), fixtureData.permissionList)

        cy.visit("/dashboard")
            .its("location.href")
            .should("equals", "https://yp-stage.essentialsln.com/dashboard")

    });

    it('Նյութերի մուտք ներքին գումարով/գնով - 1. Գումարով', () => {

        cy.visit('/operations/materials').then(window => {
            expect(window.location.href).to.be.equal("https://yp-stage.essentialsln.com/operations/materials")
            expect(window.document.title).to.contain("Նյութերի մուտք և տեղափոխում")
        })

        cy.intercept("https://yp-stage-api.essentialsln.com/api/dish").as("dishReq")
        cy.intercept("https://yp-stage-api.essentialsln.com/api/product").as("productReq")

        cy.wait("@dishReq")
        cy.wait("@productReq")

        cy.contains('label', /^Մուտք$/)
            .find('.Mui-checked')

        cy.contains('label', 'Ներքին')
            .find('.Mui-checked')


        cy.contains('Ժամանակ')
            .parent()
            .should('be.visible')
            .click()
            .clear()
            .type("22/01/2022 22:22")
            .click()


        cy.contains("Մատակարար")
            .parent()
            .click()

        cy.contains('Արցախ գործարան')
            .parent('ul')
            .children().as("Suppliers") // prints li elements 
            .should('have.length.greaterThan', 1)
            .its('length')
            .then((n) => Cypress._.random(0, n - 1))
            .then((k) => {
                cy.get('@Suppliers') // li elements
                    .eq(k)
                    .click()
            })

        cy.contains('>')
            .prev('div.MuiFormControl-root')
            .click()
        cy.contains('ՏԵՐՅԱՆ').click()

        cy.contains('>')
            .next('div.MuiFormControl-root')
            .click()
        cy.contains('ԽՈՀԱՆՈՑ')
            .parent('ul')
            .children().as('Sections')
            .should('have.length.greaterThan', 1)
            .its('length')
            .then((n) => Cypress._.random(0, n - 1))
            .then(k => {
                cy.get('@Sections') // li elements
                    .eq(k)
                    .click()
            })

        cy.contains('>')
            .next()
            .next()
            .click()

        cy.contains('Պատրաստի').click() // hardcode 
        // .parent('ul')
        // .children().as('Products')
        // .should('have.length.greaterThan', 1)
        // .its('length')
        // .then((n) => Cypress._.random(0, n - 1))
        // .then(k => {
        //   cy.get('@Products') // li elements
        //     .eq(k)
        //     .click()
        // })

        cy.contains('label', 'Գումարով')
            .children('span')
            .should('have.class', 'Mui-checked')

        // cy.contains("[style='position: absolute; left: 770px; top: 144px; height: 24px; width: 170px;']", "")
        // .should('have.length.greaterThan', '100')

        // cy.get("div:contains('2150497')") // hardcode - not applicable for other sections
        //   .then(cy.log)
        //   .contains('div', '2150497')
        // // .scrollIntoView()

        cy.get('.styles_dataContainer__3oB7o').eq(0).parent().parent().scrollTo('bottom')
        // cy.get("input").tab()
        // cy.get("input").tab({ shift: true })

        cy.contains('ֆրապպե')
            .parent('div')
            .next()
            .next()
            .find('input')
            .click({ force: true })
            .type('2', { force: true }) //replace with randomizer
            // .type("{enter}", { force: true })
            .parent()
            .parent()
            .next()
            .find('input')
            .type('1000', { force: true }) ////replace with randomizer
            .type("{enter}", { force: true })
            .then(() => {
                cy.contains('label', 'Ընդհանուր').next().find('input').should('have.attr', 'value', '1 000.26')
            })

        cy.contains("Ապրանքագիր").click()

        // add check for pdf file content containing the total price

    }) // it

    it('Ճաշացուցակ չեկլիստ', () => {

        cy.visit('/references/menu').then(window => {
            expect(window.location.href).to.be.equal("https://yp-stage.essentialsln.com/references/menu")
            expect(window.document.title).to.contain("Ճաշացուցակ")
        })

        cy.intercept("https://yp-stage-api.essentialsln.com/api/dish").as("dishReq")
        cy.intercept("https://yp-stage-api.essentialsln.com/api/dish/bulk?restaurants=7").as("restRequest")


        cy.wait("@dishReq")

        cy.contains("label", "Ռեստորան").next().click()
        cy.contains('span', 'ՏԵՐՅԱՆ Պանդոկ Երևան').click().prev('span').should('have.class', 'Mui-checked')
        cy.contains('Փակել').click()

        cy.wait("@restRequest", { timeout: 15000 })

        cy.get('.styles_scrollableColumn__2I8hn').then(els => {

            cy.wrap(els).contains('Կոդ').rightclick({ force: true })
            cy.wrap(els).contains('Անվանում')
            cy.wrap(els).contains('Բաժին')
            cy.wrap(els).contains('Խումբ')
            cy.wrap(els).contains(/^Կ{1}$/)
            cy.wrap(els).contains('Չափ. չ.մ.')
            cy.wrap(els).contains('Վաճ.գին.1')
            cy.wrap(els).contains('Վաճ.գին 2')
            cy.wrap(els).contains('Վաճ.գին 3')
            cy.wrap(els).contains('Վաճ.գին 4')
            cy.wrap(els).contains('Համագործ․գին')
            cy.wrap(els).contains('Տպիչ')
            cy.wrap(els).contains('Չափ. 1')
            cy.wrap(els).contains('Առաքում')
            cy.wrap(els).contains('Չափ. 2')
        })



    })



}) // describe