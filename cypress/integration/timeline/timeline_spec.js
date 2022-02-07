import { getByTestId } from '../../support/getByTestId'
import collectionsGraphJson from './timeline_mocks/collections_graph.json'
import timeline from './timeline_mocks/timeline.json'
import granules from './timeline_mocks/granules.json'
import providers from './timeline_mocks/providers.json'
import accessMethods from './timeline_mocks/access_methods.json'
import collectionFixture from './timeline_mocks/authenticated_collections.json'

import { getAuthHeaders } from '../utils/getAuthHeaders'

describe('Timeline spec', () => {
  it('should resize the leaflet controls', () => {
    cy.login()

    const authHeaders = getAuthHeaders()

    cy.intercept(
      'POST',
      '**/graphql',
      {
        body: collectionsGraphJson.body,
        headers: authHeaders
      }
    )
    cy.intercept(
      'POST',
      '**/granules/timeline',
      {
        body: timeline.body,
        headers: authHeaders
      }
    )
    cy.intercept(
      'POST',
      '**/dqs',
      {
        body: []
      }
    )
    cy.intercept(
      'POST',
      '**/granules',
      {
        body: granules.body,
        headers: {
          ...authHeaders,
          'cmr-hits': '42'
        }
      }
    )
    cy.intercept(
      'GET',
      '**/providers',
      {
        body: providers.body
      }
    )
    cy.intercept(
      'POST',
      '**/access_methods',
      {
        body: accessMethods.body
      }
    )
    cy.intercept(
      'POST',
      '**/collections',
      {
        body: collectionFixture.body,
        headers: collectionFixture.headers
      }
    )

    cy.visit('/projects?p=!C1443528505-LAADS&sb=-77.15071678161621%2C38.78817179999825%2C-76.89801406860352%2C38.99784152603538&m=37.64643450971326!-77.407470703125!7!1!0!0%2C2&qt=2020-01-06T04%3A15%3A27.310Z%2C2020-01-13T07%3A32%3A50.962Z&ff=Map%20Imagery&tl=1563377338!4!!')

    // Click the back to search button
    getByTestId('back-to-search-button').click()

    // Click a collection that exists in the project
    getByTestId('collection-result-item_C1443528505-LAADS').click()

    // Confirm the leaflet tools are the correct
    cy.get('.leaflet-control-container').should('have.css', 'height', '759px')
  })
})
