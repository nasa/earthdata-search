import { getByTestId } from '../../support/getByTestId'
import collectionResults from './collection_results'
import collectionResultsModis from './collection_results_modis'

// Example test to show how to create mock data for Cypress tests
// First, write the test using real requests to CMR and/or Serverless

// After the test is passing, use the Cypress Chrome console's Network tab to view the responses for network requests
// Copy those responses into json files similar to collection_results.json and collection_results_modis.json

// Verify that your requests are mocked from within Cypress, you should see `(XHR STUB)` next to your network requests

describe('Mock data example', () => {
  it('How to setup mock data', () => {
    // // // //
    // Do not add these lines until after you have copied successfull responses into json files
    // You only need cy.server() once per test
    cy.server()

    // cy.route() must be before the action that creates the network request,
    // in this case the initial page load, cy.visit('/')
    cy.route({
      method: 'POST',
      url: '**/collections.json',
      response: collectionResults.body,
      headers: collectionResults.headers
    })
    // // // //

    cy.visit('/')

    getByTestId('collection-results-list')
      .should('not.be.empty')
      .children().should('have.length', 7)


    // // // //
    // Do not add these lines until after you have copied successfull responses into json files
    // The action that creates this network request is typing into the keyword search field
    cy.route({
      method: 'POST',
      url: '**/collections.json',
      response: collectionResultsModis.body,
      headers: collectionResultsModis.headers
    })
    // // // //

    getByTestId('keywordSearchInput')
      .type('MODIS{enter}')

    cy.url()
      .should('include', '?q=MODIS')

    getByTestId('collection-results-list')
      .should((list) => {
        expect(list.first()).to.contain('MODIS')
      })
      .children().should('have.length', 7)
  })
})
