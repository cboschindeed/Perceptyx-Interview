const SHUFFLE_CARDS_API = 'https://www.deckofcardsapi.com/api/deck/new/shuffle/'

describe('Deck of Cards API - Shuffle the Cards (GET)', () => {
  it('Shuffle a new deck of cards and return correct response', () => {
    cy.request({
      method: 'GET',
      url: SHUFFLE_CARDS_API,
      qs: {
        deck_count: 1
      }
    }).then((response) => {
      expect(response.status).to.eq(200)

      expect(response.body).to.have.property('success', true)
      expect(response.body).to.have.property('deck_id').and.to.be.a('string')
      expect(response.body).to.have.property('shuffled', true)
      expect(response.body).to.have.property('remaining', 52)
    })
  })

  it('Shuffle multiple decks of cards and return correct response', () => {
    const DECK_COUNT = 6

    cy.request({
      method: 'GET',
      url: SHUFFLE_CARDS_API,
      qs: {
        deck_count: DECK_COUNT
      }
    }).then((response) => {
      expect(response.status).to.eq(200)

      expect(response.body).to.have.property('success', true)
      expect(response.body).to.have.property('deck_id').and.to.be.a('string')
      expect(response.body).to.have.property('shuffled', true)
      expect(response.body).to.have.property('remaining', 52 * DECK_COUNT)
    })
  })

  it('Shuffle less than the minimum number of decks of cards and return correct response', () => {
    const DECK_COUNT = 0

    cy.request({
      method: 'GET',
      url: SHUFFLE_CARDS_API,
      qs: {
        deck_count: DECK_COUNT
      }
    }).then((response) => {
      expect(response.status).to.eq(200)

      expect(response.body.success).to.be.false
      expect(response.body.error).to.eq('The min number of Decks is 1.')
    })
  })

  it('Shuffle more than the maximum number of decks of cards and return correct response', () => {
    const DECK_COUNT = 21

    cy.request({
      method: 'GET',
      url: SHUFFLE_CARDS_API,
      qs: {
        deck_count: DECK_COUNT
      }
    }).then((response) => {
      expect(response.status).to.eq(200)

      expect(response.body.success).to.be.false
      expect(response.body.error).to.eq('The max number of Decks is 20.')
    })
  })

  it('Shuffle default number of decks and return correct response', () => {
    cy.request({
      method: 'GET',
      url: SHUFFLE_CARDS_API
    }).then((response) => {
      expect(response.status).to.eq(200)

      expect(response.body).to.have.property('success', true)
      expect(response.body).to.have.property('deck_id').and.to.be.a('string')
      expect(response.body).to.have.property('shuffled', true)
      expect(response.body).to.have.property('remaining', 52)
    })
  })

  it('Set DECK_COUNT to a String', () => {
    const DECK_COUNT = 'Perceptyx'

    cy.request({
      method: 'GET',
      url: SHUFFLE_CARDS_API,
      qs: {
        deck_count: DECK_COUNT
      },
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(500)
    })
  })
})