describe('Checkers - Negative tests', () => {
  beforeEach(() => {
    cy.viewport(1000, 800)
    cy.visit('https://www.gamesforthebrain.com/game/checkers/')
    cy.get('[id=board]').should('be.visible')
  })

  // Selects a space with an occupied player checker and tries to move left and then right of it's original position
  it('Confirm player cannot move horizontally', () => {
    cy.getCheckerSpace('space22').should('have.attr', 'src', 'you1.gif').click().should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space32').click().should('not.have.attr', 'src', 'you1.gif')
    cy.getCheckerSpace('space22').should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space12').click().should('not.have.attr', 'src', 'you1.gif')
  })

  // Selects a space with an occupied player checker and tries to move up and then down from it's original position
  it('Confirm player cannot move vertically', () => {
    cy.getCheckerSpace('space22').should('have.attr', 'src', 'you1.gif').click().should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space23').click().should('not.have.attr', 'src', 'you1.gif')
    cy.getCheckerSpace('space22').should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space21').click().should('not.have.attr', 'src', 'you1.gif')
  })

  // Selects an uncrowned player checker, moves it one space diagonally, then tries to move back to previous position
  it('Uncrowned player checker cannot move back to previous position', () => {
    cy.getCheckerSpace('space22').should('have.attr', 'src', 'you1.gif').click().should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space13').should('not.have.attr', 'src', 'you1.gif').click().should('have.attr', 'src', 'you1.gif')
    cy.getCheckerSpace('space24').should('have.attr', 'src', 'me1.gif')
    cy.getCheckerSpace('space13').should('have.attr', 'src', 'you1.gif').click().should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space22').click().should('not.have.attr', 'src', 'you1.gif')
    cy.getCheckerSpace('space13').should('have.attr', 'src', 'you2.gif')
  })

  // Displays a help message when the player selects an unoccupied space instead of a player checker first
  it('Selecting unoccupied space first displays message', () => {
    cy.get('p[id="message"]').should('contain.text', 'Select an orange piece to move.')
    cy.getCheckerSpace('space13').should('have.attr', 'src', 'gray.gif').click()
    cy.get('p[id="message"]').should('contain.text', 'Click on your orange piece, then click where you want to move it.')
  })

  // Selects an uncrowned player checker, and confirms that it cannot be moved to an already occuped CPU checker space
  it('Confirm player cannot move to an already occupied CPU checker space', () => {
    cy.getCheckerSpace('space22').should('have.attr', 'src', 'you1.gif').click().should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space13').should('not.have.attr', 'src', 'you1.gif').click().should('have.attr', 'src', 'you1.gif')
    cy.getCheckerSpace('space24').should('have.attr', 'src', 'me1.gif')
    // Confirm already occuppied CPU space
    cy.getCheckerSpace('space13').click().should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space24').click().should('have.attr', 'src', 'me1.gif')
    cy.getCheckerSpace('space13').should('have.attr', 'src', 'you2.gif')
  })

  // Selects an uncrowned player checker, and confirms that it cannot be moved to an already occuped player checker space
  it('Confirm player cannot move to an already occupied player checker space', () => {
    cy.getCheckerSpace('space11').should('have.attr', 'src', 'you1.gif').click().should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space22').click().should('have.attr', 'src', 'you2.gif')
    cy.getCheckerSpace('space11').should('have.attr', 'src', 'you1.gif')
  })
})