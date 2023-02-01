import { getByTestId } from '../../support/getByTestId'
import { testJwtToken } from '../../support/getJwtToken'
import { graphQlGetSubscriptionsQuery } from '../../support/graphQlGetSubscriptionsQuery'

import graphQlHeaders from './__mocks__/graphql.headers.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import collectionFixture from './__mocks__/authenticated_collections.json'

// At the default size, react-window will render 6 items
const expectedCollectionCount = 6

describe('Authentication', () => {
  it('logs the user in with the auth_callback endpoint and redirects the user', () => {
    cy.intercept(
      'POST',
      '**/collections',
      {
        body: collectionFixture.body,
        headers: collectionFixture.headers
      }
    )

    cy.intercept({
      method: 'POST',
      url: '**/graphql'
    },
    (req) => {
      expect(JSON.parse(req.body).data.query).to.eql(graphQlGetSubscriptionsQuery)
      req.reply({
        body: getSubscriptionsGraphQlBody,
        headers: graphQlHeaders
      })
    })

    cy.visit(`/auth_callback?jwt=${testJwtToken}&redirect=http://localhost:8080/`)

    cy.contains('Earthdata Login').should('not.exist')
    getByTestId('collection-results-list')
      .should('not.be.empty')
      .children().should('have.length', expectedCollectionCount)
  })

  it('sets auth cookie', () => {
    cy.intercept(
      'POST',
      '**/collections',
      {
        body: collectionFixture.body,
        headers: collectionFixture.headers
      }
    )

    cy.intercept({
      method: 'POST',
      url: '**/graphql'
    },
    (req) => {
      expect(JSON.parse(req.body).data.query).to.eql(graphQlGetSubscriptionsQuery)
      req.reply({
        body: getSubscriptionsGraphQlBody,
        headers: graphQlHeaders
      })
    })

    cy.getCookies().should('be.empty')
    // See cypress/support/commands.js for cy.login command
    cy.login()
    cy.getCookie('authToken').should('exist')

    cy.visit('/')

    cy.contains('Earthdata Login').should('not.exist')
    getByTestId('collection-results-list')
      .should('not.be.empty')
      .children().should('have.length', expectedCollectionCount)
  })
})
