import { getByTestId } from '../../support/getByTestId'
import collectionResults from './collection_results.json'
import collectionResultsModis from './collection_results_modis.json'

// Example test to show how to create mock data for Cypress tests
// First, write the test using real requests to CMR and/or Serverless

// After the test is passing, use the Cypress Chrome console's Network tab to view the responses for network requests
// Copy those responses into json files similar to collection_results.json and collection_results_modis.json

// Verify that your requests are mocked from within Cypress, you should see `(XHR STUB)` next to your network requests

describe('Mock data example', () => {
  it('How to setup mock data', () => {
    // // // //
    // Do not add these lines until after you have copied successfull responses into json files
    //
    cy.intercept(
      'POST',
      '**/collections.json',
      {
        body: collectionResults.body,
        headers: collectionResults.headers
      }
    )
    cy.intercept(
      'POST',
      '**/collections.json',
      {
        body: collectionResultsModis.body,
        headers: collectionResultsModis.headers
      }
    )
    // // // //

    cy.visit('/')

    getByTestId('collection-results-list')
      .should('not.be.empty')
      .children().should('have.length', 7)

    getByTestId('keyword-search-input')
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
