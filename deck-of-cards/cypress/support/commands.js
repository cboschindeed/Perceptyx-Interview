// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getDeckOfCardsPilesApiRequest', ({ deck_id, pile_name, action, qs = {} }) => {
    const PILES_API_REQUEST = `https://www.deckofcardsapi.com/api/deck/${deck_id}/pile/${pile_name}/${action}/`

    return cy.request({
        method: 'GET',
        url: PILES_API_REQUEST,
        qs,
        failOnStatusCode: false // Prevent automatic test failure for non-2xx Status Code responses
    })
})