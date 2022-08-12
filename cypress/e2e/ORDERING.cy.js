

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

  it.only('Պատվերի գրանցում և մարում', () => {

    cy.intercept(/ingredient-dish-restaurant\?restaurantId=4/).as("dishListReq1")

    cy.visit('/operations/orders').then(window => {
      expect(window.location.href).to.be.equal("https://yp-dev.essentialsln.com/operations/orders")
      expect(window.document.title).to.contain("Պատվեր")
    })

    cy.intercept(/ingredient-dish-restaurant\?restaurantId=7/).as("dishListReq2")



    cy.wait("@dishListReq1", { timeout: 25000 })
    cy.contains('ԽՈՐԵՆԱՑԻ').click()
    cy.contains('ՏԵՐՅԱՆ').click()

    cy.wait("@dishListReq2", { timeout: 25000 })


    let hallTextValue

    // selecting a hall
    cy.contains('ՍՐԱՀ 1')
      .click()
    cy.contains('ul div', 'ՍՐԱՀ 1')
      .parents('ul')
      .children().as("Halls") // prints li elements 
      .should('have.length.greaterThan', 1)
      .its('length')
      .then((n) => Cypress._.random(0, n - 1))
      .then((k) => {
        cy.get('@Halls') // li elements
          .eq(k)
          .then(($el) => {
            hallTextValue = $el.text() // looks for a text in $el OR ITS CHILDREN 
            cy.wrap($el).click({ force: true })
            cy.contains('ՍՐԱՀ').invoke('text').should('equal', hallTextValue)
          })
      })


    let servicePerc
    let discountPerc
    //selecting a table
    cy.get('.MuiContainer-root > div > div:nth-child(4) button')
      .should('have.length.greaterThan', 1)
      .its('length')
      .then((n) => Cypress._.random(0, n - 1))
      .then((k) => {
        cy.get('.MuiContainer-root > div > div:nth-child(4) button')
          .eq(k)
          // .should('have.css', 'color', 'rgb(0, 0, 0)')
          .click()
          .invoke('attr', 'class').should('contain', "MuiButton-outlinedPrimary")
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
      })

    cy.then(() => {
      console.log(servicePerc)
      console.log(discountPerc)
    })

    //selecting kitchen or bar
    cy.contains('ԲԱՐ').parent().children().as("Section")
    cy.get('@Section')
      .should('have.length.greaterThan', 1)
      .its('length')
      .then((n) => Cypress._.random(0, n - 1))
      .then((k) => {
        cy.get('@Section')
          .eq(k)
          .click()
          .should('have.css', "background-color", "rgb(231, 231, 231)")
      })

    // selecting dish section
    cy.get(".MuiContainer-root > div > div:nth-child(1) > div > div")
      .should('have.length.greaterThan', 1)
      .its('length')
      .then((n) => Cypress._.random(0, n - 1))
      .then((k) => {
        cy.get('.MuiContainer-root > div > div:nth-child(1) > div > div')
          .eq(k)
          .click()
          .invoke('css', 'background-color').should('equal', "rgb(231, 231, 231)")
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

    cy.then(() => {
      console.log(dishPrice)
    })

    cy.contains('Հավելումներ').should('exist')

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
        console.log(expResult)
        console.log(typeof expResult)


        console.log(typeof actResult)
        console.log(typeof netPrice)
        console.log(typeof dishPrice)
        console.log(typeof dishQuantity)
        console.log(typeof servicePerc)
        console.log(typeof discountPerc)

        expect(actResult).to.be.equal(expResult.toString())


      })

    cy.contains("Անձերի թիվը").next().click()

    cy.contains("Ընդունել").click()

    cy.contains("button > span", "Հաշիվ").click()
    cy.contains("Հաշիվը տպված է։").should('exist')


  }) // it



}) // describe