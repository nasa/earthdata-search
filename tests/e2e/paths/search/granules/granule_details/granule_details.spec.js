import { test, expect } from 'playwright-test-coverage'

import { graphQlGetCollection } from '../../../../../support/graphQlGetCollection'
import { setupTests } from '../../../../../support/setupTests'

import collectionsBody from './__mocks__/collections.body.json'
import commonHeaders from './__mocks__/common.headers.json'
import getCollectionGraphQlBody from './__mocks__/getCollection.graphql.body.json'
import getGranuleGraphQlBody from './__mocks__/getGranule.graphql.body.json'
import granulesBody from './__mocks__/granules.body.json'
import graphQlHeaders from './__mocks__/graphql.headers.json'
import formattedGranuleMetadata from './__mocks__/formattedGranuleMetadata.json'

test.describe('Path /search/granules/granule-details', () => {
  test.beforeEach(async ({ page, context }) => {
    await setupTests({
      page,
      context
    })
  })

  test('granule loads correctly', async ({ page }) => {
    const collectionId = 'C1214470488-ASF'
    const granuleId = 'G1287941210-ASF'
    const cmrHits = 8180
    const granuleHits = 1074221

    await page.route(/cmr-graphql-proxy/, (route) => {
      // If these requests change and are failing tests, console.log req.body to see the actual request being called
      const postData = route.request().postData()

      if (postData === graphQlGetCollection(collectionId)) {
        route.fulfill({
          json: getCollectionGraphQlBody,
          headers: graphQlHeaders
        })
      } else if (postData === `{"query":"\\n    query GetGranule(\\n      $params: GranuleInput\\n    ) {\\n      granule(\\n        params: $params\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"params":{"conceptId":"${granuleId}"}}}`) {
        route.fulfill({
          json: getGranuleGraphQlBody,
          headers: graphQlHeaders
        })
      }
    })

    await page.route(/collections.json/, (route) => {
      // Check that the request bodies match up
      expect(route.request().postData()).toEqual('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&sort_key[]=has_granules_or_cwic&sort_key[]=-score&sort_key[]=-create-data-date')

      route.fulfill({
        json: collectionsBody,
        headers: {
          ...commonHeaders,
          'cmr-hits': cmrHits.toString()
        }
      })
    })

    await page.route(/granules.json/, (route) => {
      // Check that the request bodies match up
      expect(route.request().postData()).toEqual('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20')

      route.fulfill({
        json: granulesBody,
        headers: {
          ...commonHeaders,
          'cmr-hits': granuleHits.toString()
        }
      })
    })

    await page.goto(`/search/granules/granule-details?p=${collectionId}&g=${granuleId}`)

    // Displays the granule title
    await expect(page.getByTestId('panel-group_granule-details').getByTestId('panel-group-header__heading-primary')).toContainText('S1A_S3_SLC__1SDH_20140615T034444_20140615T034512_001055_00107C_16F1')

    // Displays the metadata in the Information tab
    await expect(page.getByTestId('granule-details-info__content')).toHaveText(JSON.stringify(formattedGranuleMetadata, null, 2))

    // Displays the metadata links in the Metadata Tab
    await page.getByTestId('granule-details-body').getByText('Metadata').first().click()

    await expect(page.getByTestId('granule-details-metadata__list').getByRole('link', { name: 'Native' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF')
    await expect(page.getByTestId('granule-details-metadata__list').getByRole('link', { name: 'UMM-G' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF.umm_json')
    await expect(page.getByTestId('granule-details-metadata__list').getByRole('link', { name: 'ISO 19115' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF.iso19115')
    await expect(page.getByTestId('granule-details-metadata__list').getByRole('link', { name: 'ATOM' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF.atom')
    await expect(page.getByTestId('granule-details-metadata__list').getByRole('link', { name: 'ECHO 10' })).toHaveAttribute('href', 'https://cmr.earthdata.nasa.gov/search/concepts/G1287941210-ASF.echo10')

    // Displays collection info in the sidebar
    await expect(page.getByTestId('collection-details-highlights__version-id')).toHaveText('1')
    await expect(page.getByTestId('collection-details-highlights__temporal')).toHaveText('2014-04-03 to Present')
    await expect(page.getByTestId('collection-details-highlights__description')).toHaveText('Sentinel-1A slant-range product')
  })
})
