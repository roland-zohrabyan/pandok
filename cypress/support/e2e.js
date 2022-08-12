// Import commands.js using ES2015 syntax:
import './commands'

require('cypress-xpath');

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Screenshot.defaults({
    screenshotOnRunFailure: true
})

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
})