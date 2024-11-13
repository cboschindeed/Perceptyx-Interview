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

Cypress.Commands.add('getCheckerSpace', (checkerSpaceSelector) => {
    cy.get(`img[name="${checkerSpaceSelector}"]`) // checkerSpaceSelector example: space20
})

Cypress.Commands.add('waitForCpuMovement', () => {
    // CPU move has started
    cy.get('img[src$="me2.gif"]')
        .should('exist') // me2.gif exists in the DOM
        .should('be.visible') // me2.gif is visible on the screen

    // CPU move has ended
    cy.get('img[src$="me2.gif"]')
        .should('not.exist') // me2.gif does not exists in the DOM
})

Cypress.Commands.add('clickPlayerCheckerSpace', (checkerSpaceSelector) => {
    cy.getCheckerSpace(checkerSpaceSelector)
        .should('have.attr', 'src', 'you1.gif')
        .click()
        .should('have.attr', 'src', 'you2.gif') 
})

/*
 * There's an issue with chaining commands due to how Cypress commands are queued and executed.
 * Cypress commands, like .get(), .click(), and .should(), are asynchronous, and chaining too 
 * many assertions together in a single command can cause issues. By separating the assertions 
 * and the click into two commands, you're allowing Cypress to fully resolve the first assertion 
 * before moving on to the second. This avoids any timing-related issues where the state might 
 * change between assertions (e.g., when the src attribute is updated after the click).
*/
Cypress.Commands.add('clickEmptySpace', (emptySpaceSelector) => {
    // We're waiting for the src attribute to be checked before moving on to the next step.
    // This ensures that the check for 'black.gif' or 'gray.gif' is done before any other action is attempted.
    cy.getCheckerSpace(emptySpaceSelector).should('have.attr', 'src').and('match', /black.gif|gray.gif/)
    
    // After the first check is complete, we perform the .click() then verify that the src is now 'gray.gif' or 'you1.gif'.
    cy.getCheckerSpace(emptySpaceSelector).click().should('have.attr', 'src').and('match', /gray.gif|you1.gif/)

    // THIS CODE DOESN'T WORK.  HAVE TO CALL getCheckerSpace TWICE TO WORK
    // const SPACE_TO_CLICK = cy.getCheckerSpace(emptySpaceSelector)
    // SPACE_TO_CLICK.should('have.attr', 'src').then((src) => {
    //     expect(src).to.be.oneOf(['black.gif', 'gray.gif'])
    // })
    // SPACE_TO_CLICK.click().should('have.attr', 'src', 'you1.gif')
})