import { getByTestId } from '../../../../../support/getByTestId'
import { graphQlGetCollection } from '../../../../../support/graphQlGetCollection'

import collectionsBody from './__mocks__/collections.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import getCollectionGraphQlBody from './__mocks__/getCollection.graphql.body.json'
import getGranuleGraphQlBody from './__mocks__/getGranule.graphql.body.json'
import granulesBody from './__mocks__/granules.body.json'
import graphQlHeaders from './__mocks__/graphql.headers.json'
import formattedGranuleMetadata from './__mocks__/formattedGranuleMetadata.json'

describe('Path /search/granules/granule-details', () => {
  describe('When loading a granule', () => {
    it('loads correctly', () => {
      const collectionId = 'C1214470488-ASF'
      const granuleId = 'G1287941210-ASF'
      const cmrHits = 8180
      const granuleHits = 1074221

      cy.intercept({
        method: 'POST',
        url: '**/search/collections.json'
      },
      (req) => {
        expect(req.body).to.eq('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&page_num=1&page_size=20&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

        req.reply({
          body: collectionsBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20')

        req.reply({
          body: granulesBody,
          headers: {
            ...commonHeaders,
            'cmr-hits': granuleHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        // If these requests change and are failing tests, console.log req.body to see the actual request being called
        if (JSON.stringify(req.body) === graphQlGetCollection(collectionId)) {
          req.alias = 'graphQlCollectionQuery'
          req.reply({
            body: getCollectionGraphQlBody,
            headers: graphQlHeaders
          })
        }
        if (JSON.stringify(req.body) === '{"query":"\\n    query GetGranule(\\n      $id: String!\\n    ) {\\n      granule(\\n        conceptId: $id\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"id":"G1287941210-ASF"}}') {
          req.alias = 'graphQlGranuleQuery'
          req.reply({
            body: getGranuleGraphQlBody,
            headers: graphQlHeaders
          })
        }
      })

      cy.visit(`/search/granules/granule-details?p=${collectionId}&g=${granuleId}`)
      cy.wait('@graphQlCollectionQuery')
      cy.wait('@graphQlGranuleQuery')

      // Displays the granule title
      getByTestId('panel-group_granule-details').within(() => {
        getByTestId('panel-group-header__heading-primary').should('have.text', 'S1A_S3_SLC__1SDH_20140615T034444_20140615T034512_001055_00107C_16F1-SLC')
      })

      // Displays the metadata in the Information tab
      getByTestId('granule-details-info__content').should('have.text', JSON.stringify(formattedGranuleMetadata, null, 2))

      // Displays the metadata links in the Metadata Tab
      getByTestId('granule-details-body').contains('Metadata').click()
      getByTestId('granule-details-metadata__list').contains('Native').should('have.attr', 'href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF')
      getByTestId('granule-details-metadata__list').contains('UMM-G').should('have.attr', 'href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF.umm_json')
      getByTestId('granule-details-metadata__list').contains('ATOM').should('have.attr', 'href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF.atom')
      getByTestId('granule-details-metadata__list').contains('ECHO 10').should('have.attr', 'href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF.echo10')
      getByTestId('granule-details-metadata__list').contains('ISO 19115').should('have.attr', 'href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF.iso19115')

      // Displays collection info in the sidebar
      getByTestId('collection-details-highlights__version-id').should('have.text', '1')
      getByTestId('collection-details-highlights__temporal').should('have.text', '2014-04-03 ongoing')
      getByTestId('collection-details-highlights__description').should('have.text', 'Sentinel-1A slant-range product')
    })
  })
})
