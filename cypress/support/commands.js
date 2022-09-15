import { getRandomOptionIndex } from '../support/helpers';

Cypress.Commands.add("getBySelector", (selectorType, selectorValue) => {
    cy.get(`[${selectorType}="${selectorValue}"]`) //id, name, class or other attribute
})

Cypress.Commands.add("selectOptionAndVerify", (elNameValue, isCustomField) => {

    cy.get(`[name='${isCustomField ? "customFields." : ""}${elNameValue}']> option`).its("length").then((length) => {
        console.log(elNameValue)
        const index = getRandomOptionIndex(length)
        console.log(index)
        cy.get(`[name='${isCustomField ? "customFields." : ""}${elNameValue}'] > option:nth-child(${index + 1})`).then(($el) => {

            const value = $el.attr("value")
            console.log(value)
            cy.get(`[name='${isCustomField ? "customFields." : ""}${elNameValue}']`).select(index).should("have.value", value)

        })
    })
})

Cypress.Commands.add("login", (username, password, permissions) => {

    cy.session("loginByAPI", () => {

        cy.request(
            'Post',
            "https://yp-dev-api.essentialsln.com/api/auth/login", // <<<<<<<<<<<<<
            { username: username, password: password })
            .then((response) => {
                const token = response.body.token
                const refreshToken = response.body.refreshToken
                window.localStorage.setItem('token', token)
                window.localStorage.setItem('refreshToken', refreshToken)
                window.localStorage.setItem('username', username)
                window.localStorage.setItem('permissions', JSON.stringify(permissions)) // <<< refactor? 
                window.localStorage.setItem('authSelectedRestaurants', JSON.stringify([1, 4, 5, 6, 7, 8, 9]))

                // cy.wrap(refreshToken).as("refreshTokenWrapped").then(e => console.log(e))
                // console.log(refreshToken)

            })
    });
});

Cypress.Commands.add("verifyCurrentUrl", () => {

    cy.url().then(value => {
        cy.log('The current real URL is: ', value)
    })
})

Cypress.Commands.add("selectRandomElement", (selector, className) => {

    cy.get(selector)
        .should('have.length, greaterThan', 0)
        .then(cy.log)
        .its('length')
        .then(cy.log)
        .then((n) => Cypress._.random(0, n - 1))
        .then((k) => {
            cy.get(selector)
                .eq(k)
                .click()
                .should('have.class', className)
        })
})

Cypress.Commands.add("payByThreeMethods", function (total) {

    cy.get('body').then(() => {
        let cashValue = Math.floor(Math.random() * (total - 5 - 5 + 1) + 5)
        let cardValue = Math.floor(Math.random() * (total - cashValue - 0 + 1) + 0)
        let balanceValue = total - cashValue - cardValue
        console.log(cashValue)
        console.log(cardValue)
        console.log(balanceValue)

        cy.contains("label", "Կանխիկ").siblings("div").click()
        cy.contains("Del").click()
        let cashValueArr = cashValue.toString().split('');
        cashValueArr.forEach((item) => {
            console.log(item, "1")
            cy.contains("div:nth-child(7) > div:nth-child(3) button", item).click()
        });

        cy.contains("Քարտով").click()
        cy.contains("label", "Քարտով").siblings("div").click()
        cy.contains("Del").click()
        let cardValueArr = cardValue.toString().split('');
        cardValueArr.forEach((item) => {
            console.log(item, "2")
            cy.contains("div:nth-child(7) > div:nth-child(3) button", item).click()
        });

        cy.contains("Հաշվով").click()
        cy.contains("label", "Հաշվով").siblings("div").click()
        cy.contains("Del").click()
        let balanceValueArr = balanceValue.toString().split('');
        balanceValueArr.forEach((item) => {
            console.log(item, "3")
            cy.contains("div:nth-child(7) > div:nth-child(3) button", item).click()
        });

        cy.contains('div', 'Հաշվով').parent().next().click()
        cy.contains("ul", "ABS")
            .children("li").as("companies")
            .should('have.length.greaterThan', 0)
            .its('length')
            .then((n) => Cypress._.random(1, n - 1))
            .then((k) => {
                cy.get("@companies").eq(k).click()
            })

        cy.wrap(cashValue).as('cashValueWrapped')
        cy.wrap(cardValue).as('cardValueWrapped')
        cy.wrap(balanceValue).as('balanceValueWrapped')


    });
})