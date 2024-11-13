const A_PARTIAL_DECK = 'https://www.deckofcardsapi.com/api/deck/new/shuffle/?cards=AC,AD,AH,AS,KC,KD,KH,KS,QC,QD,QH,QS,JC,JD,JH,JS'

describe('Deck of Cards API - Adding to Piles', () => {
  beforeEach(() => {
    // Create a partial deck
    cy.request({
      method: 'GET',
      url: A_PARTIAL_DECK
    }).then((partialDeckResponse) => {
      expect(partialDeckResponse.status).to.eq(200)
      expect(partialDeckResponse.body).to.have.property('success', true)

      cy.wrap(partialDeckResponse.body.deck_id).as('DECK_ID')
    })

    // Draw cards from the partial deck
    cy.get('@DECK_ID').then((DECK_ID) => {
      const DRAW_COUNT = 10

      cy.request({
        method: 'GET',
        url: `https://www.deckofcardsapi.com/api/deck/${DECK_ID}/draw/`,
        qs: {
          count: DRAW_COUNT
        }
      }).then((drawResponse) => {
        expect(drawResponse.status).to.eq(200)
        expect(drawResponse.body).to.have.property('success', true)

        cy.wrap(drawResponse.body.cards).as('HAND')
      })
    })
  })

  it('Adding to Piles', () => {
    const PILE_NAME = 'discarded'

    cy.get('@DECK_ID').then((DECK_ID) => {
      cy.get('@HAND').then((HAND) => {
        const CARDS_TO_DISCARD = HAND.map((card) => card.code).slice(0, 2).join(',')
        const UPDATED_HAND  = HAND.filter((card) => !CARDS_TO_DISCARD.split(',').includes(card.code))
        cy.log('CARDS_TO_DISCARD', CARDS_TO_DISCARD)
        cy.log('UPDATED_HAND', UPDATED_HAND)

        // Adding cards to the 'discarded' pile
        cy.getDeckOfCardsPilesApiRequest({
          deck_id: DECK_ID,
          pile_name: PILE_NAME,
          action: 'add',
          qs: { cards: CARDS_TO_DISCARD }
        }).then((addingResponse) => {
          cy.log(addingResponse.body)
          expect(addingResponse.status).to.eq(200)

          expect(addingResponse.body).to.have.property('success', true)
          expect(addingResponse.body).to.have.property('deck_id', DECK_ID)
          expect(addingResponse.body).to.have.property('remaining', addingResponse.body.remaining) // Cards remaining in the partial deck, not your hand
          expect(addingResponse.body.piles).to.have.property(PILE_NAME)
          expect(addingResponse.body.piles[PILE_NAME]).to.have.property('remaining', CARDS_TO_DISCARD.split(',').length)
          expect(UPDATED_HAND.length).to.eq(HAND.length - CARDS_TO_DISCARD.split(',').length)
        })
      })
    })
  })
  
  it('Adding to Piles - HEARTS only', () => {
    const PILE_NAME = 'discarded'

    cy.get('@DECK_ID').then((DECK_ID) => {
      cy.get('@HAND').then((HAND) => {
        const CARDS_TO_DISCARD = HAND.filter((card) => card.suit === 'HEARTS').map((card) => card.code)
        const UPDATED_HAND  = HAND.filter((card) => !CARDS_TO_DISCARD.includes(card.code))
        cy.log('CARDS_TO_DISCARD', CARDS_TO_DISCARD)
        cy.log('UPDATED_HAND', UPDATED_HAND)

        // Adding cards to the 'discarded' pile
        cy.getDeckOfCardsPilesApiRequest({
          deck_id: DECK_ID,
          pile_name: PILE_NAME,
          action: 'add',
          qs: { cards: CARDS_TO_DISCARD }
        }).then((addingResponse) => {
          cy.log(addingResponse.body)
          expect(addingResponse.status).to.eq(200)

          expect(addingResponse.body).to.have.property('success', true)
          expect(addingResponse.body).to.have.property('deck_id', DECK_ID)
          expect(addingResponse.body).to.have.property('remaining', addingResponse.body.remaining) // Cards remaining in the partial deck, not your hand
          expect(addingResponse.body.piles).to.have.property(PILE_NAME)
          expect(addingResponse.body.piles[PILE_NAME]).to.have.property('remaining', CARDS_TO_DISCARD.length)
          expect(UPDATED_HAND.length).to.eq(HAND.length - CARDS_TO_DISCARD.length)
        })
      })
    })
  })
})