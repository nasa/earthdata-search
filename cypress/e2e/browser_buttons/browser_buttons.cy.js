import { graphQlGetSubscriptionsQuery } from '../../support/graphQlGetSubscriptionsQuery'

import collectionsSearchBody from './__mocks__/collectionsSearch.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import getCollectionsGraphQlBody from './__mocks__/getCollectionsGraphql.body.json'
import getSubscriptionsGraphQlBody from './__mocks__/getSubscriptions.graphql.body.json'
import granulesBody from './__mocks__/granules.body.json'
import granulesGraphQlBody from './__mocks__/granulesGraphql.body.json'
import graphQlHeaders from './__mocks__/graphql.headers.json'
import timeline from './__mocks__/timeline.json'

import { getByTestId } from '../../support/getByTestId'
import { graphQlGetCollection } from '../../support/graphQlGetCollection'
import { graphQlGetCollections } from '../../support/graphQlGetCollections'

const conceptId = 'C1214470488-ASF'

describe('Browser Buttons', () => {
  beforeEach(() => {
    const granuleHits = 1

    cy.intercept(
      'POST',
      '**/collections',
      {
        body: collectionsSearchBody,
        headers: {
          ...commonHeaders,
          'cmr-hits': '7648'
        }
      }
    )

    cy.intercept({
      method: 'POST',
      url: '**/granules'
    },
    (req) => {
      expect(JSON.parse(req.body).params).to.eql({
        concept_id: [],
        echo_collection_id: conceptId,
        exclude: {},
        options: {},
        page_num: 1,
        page_size: 20,
        sort_key: '-start_date',
        two_d_coordinate_system: {}
      })

      req.alias = 'granulesQuery'
      req.reply({
        body: granulesBody,
        headers: {
          ...commonHeaders,
          'cmr-hits': granuleHits.toString()
        }
      })
    })

    cy.intercept(
      'POST',
      '**/granules/timeline',
      {
        body: timeline.body
      }
    )

    cy.intercept({
      method: 'POST',
      url: '**/graphql'
    },
    (req) => {
      if (JSON.parse(req.body).data.query === graphQlGetSubscriptionsQuery) {
        req.alias = 'graphQlSubscriptionsQuery'
        req.reply({
          body: getSubscriptionsGraphQlBody,
          headers: graphQlHeaders
        })
      }

      if (JSON.parse(req.body).data.query === JSON.parse(graphQlGetCollection(conceptId)).query) {
        req.alias = 'graphQlCollectionQuery'
        req.reply({
          body: granulesGraphQlBody,
          headers: graphQlHeaders
        })
      }

      if (JSON.parse(req.body).data.query === JSON.parse(graphQlGetCollections(conceptId)).query) {
        req.alias = 'graphQlCollectionsQuery'
        req.reply({
          body: getCollectionsGraphQlBody,
          headers: graphQlHeaders
        })
      }
    })

    cy.login()

    cy.visit('/')
  })

  describe('when pressing the back button', () => {
    beforeEach(() => {
      getByTestId(`collection-result-item_${conceptId}`).click()

      getByTestId('granule-results-actions__download-all-button').click()

      cy.wait('@granulesQuery')
      cy.wait('@graphQlSubscriptionsQuery')
      cy.wait('@graphQlCollectionQuery')
      cy.wait('@graphQlCollectionsQuery')

      getByTestId('project-download-data').should('be.enabled')

      cy.go('back')

      cy.wait('@granulesQuery')
    })

    it('loads the correct context', () => {
      getByTestId('granule-results-actions__download-all-button').should('be.enabled')
    })

    describe('when pressing the forward button', () => {
      beforeEach(() => {
        cy.go('forward')

        cy.wait('@graphQlSubscriptionsQuery')
        // cy.wait('@graphQlCollectionQuery')
        cy.wait('@graphQlCollectionsQuery')
      })

      it('loads the correct context', () => {
        getByTestId('project-download-data').should('be.enabled')
      })
    })
  })
})
