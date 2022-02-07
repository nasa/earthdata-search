import singleCollection from './single_collection.json'

describe('Panel Behavior', () => {
  beforeEach(() => {
    cy.intercept(
      'POST',
      '**/search/collections.json',
      {
        body: singleCollection.body,
        headers: singleCollection.headers
      }
    )

    cy.visit('/')
  })

  it('is present by default on page load', () => {
    // Panel is visible
    cy.get('.panels--is-open').should('have.length', 1)
    cy.get('.panels--is-minimized').should('have.length', 0)

    // Handle is visible
    cy.get('.panels__handle').should('be.visible')
  })

  it('opens and closes when clicking the handle', () => {
    // Click the handle
    cy.get('.panels__handle').click()

    // Panel is minimized
    cy.get('.panels--is-open').should('have.length', 0)
    cy.get('.panels--is-minimized').should('have.length', 1)

    // Click the handle
    cy.get('.panels__handle').click()

    // Panel is minimized
    cy.get('.panels--is-open').should('have.length', 1)
    cy.get('.panels--is-minimized').should('have.length', 0)
  })

  it('opens and closes when using keyboard shortcuts', () => {
    // Press the key
    cy.window().trigger('keyup', { key: ']' })

    // Panel is minimized
    cy.get('.panels--is-open').should('have.length', 0)
    cy.get('.panels--is-minimized').should('have.length', 1)

    // Press the key
    cy.window().trigger('keyup', { key: ']' })

    // Panel is visible
    cy.get('.panels--is-open').should('have.length', 1)
    cy.get('.panels--is-minimized').should('have.length', 0)
  })
})
