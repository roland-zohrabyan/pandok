import { getRandomOptionIndex } from '../support/helpers';
import 'cypress-shadow-dom'

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
            "https://yp-stage-api.essentialsln.com/api/auth/login",
            { username: username, password: password })
            .then((response) => {
                console.log(response.body)
                const token = response.body.token
                const refreshToken = response.body.refreshToken
                console.log(permissions)
                window.localStorage.setItem('token', token)
                window.localStorage.setItem('refreshToken', refreshToken)
                window.localStorage.setItem('username', username)
                window.localStorage.setItem('permissions', JSON.stringify(permissions))
                window.localStorage.setItem('authSelectedRestaurants', JSON.stringify([1, 4, 5, 6, 7, 8, 9]))

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

