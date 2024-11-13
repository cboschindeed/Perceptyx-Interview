// const { expect } = require("chai")
const WIKIPEDIA = 'https://en.wikipedia.org'
const ENGLISH_DRAUGHTS_WIKI_RULES_STARTING_POSITION = 'https://en.wikipedia.org/wiki/English_draughts#Starting_position'

describe('Checkers - Positive tests', () => {
  beforeEach(() => {
    cy.viewport(1000, 800)
    cy.visit('https://www.gamesforthebrain.com/game/checkers/')
    cy.get('[id=board]').should('be.visible')
  })

  // CPU will capture one of the player's checker pieces, then the player will capture one of the CPU's checker pieces
  it('Confirm CPU and player can capture checker pieces', () => {
    cy.clickPlayerCheckerSpace('space22')
    cy.clickEmptySpace('space13')
    cy.waitForCpuMovement().getCheckerSpace('space24').should('have.attr', 'src', 'me1.gif')
    // CPU captures player's checker piece
    cy.clickPlayerCheckerSpace('space42')
    cy.clickEmptySpace('space33') // Player checker piece captured
    cy.waitForCpuMovement().getCheckerSpace('space42').should('have.attr', 'src', 'me1.gif')
    // Player captures CPU's checker piece
    cy.clickPlayerCheckerSpace('space51')
    cy.clickEmptySpace('space33') // CPU checker piece captured
    cy.waitForCpuMovement().getCheckerSpace('space44').should('have.attr', 'src', 'me1.gif') // CPU moves checker piece to space (4, 4)
    cy.getCheckerSpace('space42').should('have.attr', 'src', 'gray.gif') // Confirm CPU's checker piece no longer on space (4, 2)
    cy.getCheckerSpace('space51').should('have.attr', 'src').and('include', 'gray.gif') // Confirm player's checker piece no longer on space (5, 1)
  })

  // Clicks the 'Restart...' link then verifiys the checker board is reset
  it('Restart game', () => {
    // Move some checker pieces
    cy.clickPlayerCheckerSpace('space22')
    cy.clickEmptySpace('space13')
    cy.waitForCpuMovement().getCheckerSpace('space24').should('have.attr', 'src', 'me1.gif')
    // Reset the checker board
    cy.get('.footnote').contains('a', 'Restart').click()
    cy.get('[id=board').should('be.visible')
    // Verify checker board was reset
    cy.get('.line').should('have.length', 8).each(($line, index) => {
      switch(index) {
        case 0:
        case 1:
        case 2:
          // First 3 rows (0, 1, 2): Expect all images to have src of either 'black.gif' or 'me1.gif'
          cy.wrap($line).find('img').each(($img) => {
            cy.wrap($img).should('have.attr', 'src').and('match', /black.gif|me1.gif/)
          })
          break

        case 3:
        case 4:
          // Fourth and fifth rows (3, 4): Expect all images to have src of either 'black.gif' or 'gray.gif'
          cy.wrap($line).find('img').each(($img) => {
            cy.wrap($img).should('have.attr', 'src').and('match', /black.gif|gray.gif/)
          })
          break

        case 5:
        case 6:
        case 7:
          // Last 3 rows (5, 6, 7): Expect all images to have src of either 'black.gif' or 'you1.gif'
          cy.wrap($line).find('img').each(($img) => {
            cy.wrap($img).should('have.attr', 'src').and('match', /black.gif|you1.gif/)
          })
          break

        default:
          // Default case
      }
    })
  })

  // Clicks the 'Rules' link then verifiys user is navigated to the English draughts wiki
  it('Game rules', () => {
    cy.get('.footnote').contains('a', 'Rules').click()
    cy.origin(WIKIPEDIA, { args: ENGLISH_DRAUGHTS_WIKI_RULES_STARTING_POSITION}, (ENGLISH_DRAUGHTS_WIKI_RULES_STARTING_POSITION) => {
      cy.url().should('eq', ENGLISH_DRAUGHTS_WIKI_RULES_STARTING_POSITION)
    })
  })
})