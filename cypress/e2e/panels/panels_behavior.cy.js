import { getByTestId } from '../../support/getByTestId'
import singleCollection from './single_collection.json'

const dragPanelToX = (x) => {
  getByTestId('panels__handle')
    .trigger('mousedown', {
      button: 0
    })
    .trigger('mousemove', {
      clientX: x
    })
    .trigger('mouseup', {
      force: true
    })
}

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

  it('drags the panel to a specific width', () => {
    dragPanelToX(800)

    getByTestId('panels-section').should('have.css', 'width', '505px')
  })

  it('drags the panel to closed', () => {
    dragPanelToX(300)

    cy.get('.panels--is-open.panels--will-minimize').should('have.length', 1)
  })

  it('drags the panel to open from being closed', () => {
    // Click the handle
    cy.get('.panels__handle').click()

    // Panel is minimized
    cy.get('.panels--is-open').should('have.length', 0)
    cy.get('.panels--is-minimized').should('have.length', 1)

    dragPanelToX(900)

    getByTestId('panels-section').should('have.css', 'width', '595px')
    cy.get('.panels--is-open').should('have.length', 1)
  })

  it('drags the panel to maximum width', () => {
    dragPanelToX(1500)

    getByTestId('panels-section').should('have.css', 'width', '1059px')
  })
})
