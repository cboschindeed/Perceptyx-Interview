const DRAW_A_CARD_API = 'https://www.deckofcardsapi.com/api/deck/new/draw/'
const SHUFFLE_CARDS_API = 'https://www.deckofcardsapi.com/api/deck/new/shuffle/'


describe('Deck of Cards API - Draw a Card', () => {
  it('Draw more than 1 card from an existing deck', () => {
    const DECK_COUNT = 1
    const DRAW_COUNT = 2

    // Shuffle a new deck of cards and retrieve the deck_id
    cy.request({
      method: 'GET',
      url: SHUFFLE_CARDS_API,
      qs: {
        deck_count: DECK_COUNT
      }
    }).then((shuffleResponse) => {
      const DECK_ID = shuffleResponse.body.deck_id

      // Draw cards from the shuffled deck_id
      cy.request({
        method: 'GET',
        url: `https://www.deckofcardsapi.com/api/deck/${DECK_ID}/draw/`,
        qs: {
          count: DRAW_COUNT
        }
      }).then((drawResponse) => {
        expect(drawResponse.status).to.eq(200)

        expect(drawResponse.body).to.have.property('success', true)
        expect(drawResponse.body).to.have.property('deck_id', DECK_ID)
        expect(drawResponse.body).to.have.property('remaining', 52 * DECK_COUNT - DRAW_COUNT)

        expect(drawResponse.body.cards).to.be.an('array').and.to.have.length(DRAW_COUNT)
        drawResponse.body.cards.forEach((card, index) => {
          expect(card).to.have.property('code', drawResponse.body.cards[index].code)
          expect(card).to.have.property('image', drawResponse.body.cards[index].image)
          expect(card).to.have.property('value', drawResponse.body.cards[index].value)
          expect(card).to.have.property('suit', drawResponse.body.cards[index].suit)
        })
      })
    })
  })

  it('Draw a card from an new deck', () => {
    const DRAW_COUNT = 1

    cy.request({
      method: 'GET',
      url: DRAW_A_CARD_API,
      qs: {
        count: DRAW_COUNT
      }
    }).then((drawResponse) => {
      expect(drawResponse.status).to.eq(200)

      expect(drawResponse.body).to.have.property('success', true)
      expect(drawResponse.body).to.have.property('deck_id', drawResponse.body.deck_id)
      expect(drawResponse.body).to.have.property('remaining', 52 - DRAW_COUNT)

      expect(drawResponse.body.cards).to.be.an('array').and.to.have.length(DRAW_COUNT)
      drawResponse.body.cards.forEach((card, index) => {
        expect(card).to.have.property('code', drawResponse.body.cards[index].code)
        expect(card).to.have.property('image', drawResponse.body.cards[index].image)
        expect(card).to.have.property('value', drawResponse.body.cards[index].value)
        expect(card).to.have.property('suit', drawResponse.body.cards[index].suit)
      })
    })
  })

  it('Draw more cards than are available from the deck', () => {
    const DRAW_COUNT = 64

    cy.request({
      method: 'GET',
      url: DRAW_A_CARD_API,
      qs: {
        count: DRAW_COUNT
      }
    }).then((drawResponse) => {
      expect(drawResponse.status).to.eq(200)

      expect(drawResponse.body.success).to.be.false
      expect(drawResponse.body).to.have.property('deck_id', drawResponse.body.deck_id)
      expect(drawResponse.body).to.have.property('remaining', 0)
      expect(drawResponse.body.error).to.eq(`Not enough cards remaining to draw ${DRAW_COUNT} additional`)
    })
  })
})