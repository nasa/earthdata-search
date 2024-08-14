import { test, expect } from 'playwright-test-coverage'

import { graphQlGetCollection } from '../../../../support/graphQlGetCollection'
import { graphQlGetCollections } from '../../../../support/graphQlGetCollections'
import { graphQlGetSubscriptionsQuery } from '../../../../support/graphQlGetSubscriptionsQuery'

import { commafy } from '../../../../../static/src/js/util/commafy'
import { pluralize } from '../../../../../static/src/js/util/pluralize'

import {
  interceptUnauthenticatedCollections
} from '../../../../support/interceptUnauthenticatedCollections'

import browseOnlyGranulesBody from './__mocks__/browse_only/granules.body.json'
import browseOnlyGraphQlBody from './__mocks__/browse_only/graphql.body.json'
import browseOnlyGraphQlHeaders from './__mocks__/browse_only/graphql.headers.json'
import browseOnlyTimelineBody from './__mocks__/browse_only/timeline.body.json'
import browseOnlyTimelineHeaders from './__mocks__/browse_only/timeline.headers.json'
import cloudCoverGranulesBody from './__mocks__/cloud_cover/granules.body.json'
import cloudCoverGraphQlBody from './__mocks__/cloud_cover/graphql.body.json'
import cloudCoverGraphQlHeaders from './__mocks__/cloud_cover/graphql.headers.json'
import cloudCoverTimelineBody from './__mocks__/cloud_cover/timeline.body.json'
import cloudCoverTimelineHeaders from './__mocks__/cloud_cover/timeline.headers.json'
import collectionsBody from './__mocks__/common/collections.body.json'
import collectionsHeaders from './__mocks__/common/collections.headers.json'
import commonBody from '../../../map/__mocks__/common_collections.body.json'
import commonHeaders from '../../../map/__mocks__/common_collections.headers.json'
import commonGranulesHeaders from './__mocks__/common/granules.headers.json'
import dayNightGranulesBody from './__mocks__/day_night/granules.body.json'
import dayNightGraphQlBody from './__mocks__/day_night/graphql.body.json'
import dayNightGraphQlHeaders from './__mocks__/day_night/graphql.headers.json'
import dayNightTimelineBody from './__mocks__/day_night/timeline.body.json'
import dayNightTimelineHeaders from './__mocks__/day_night/timeline.headers.json'
import equatorialCrossingDateGranulesBody from './__mocks__/equatorial_crossing_date/granules.body.json'
import equatorialCrossingDateGraphQlBody from './__mocks__/equatorial_crossing_date/graphql.body.json'
import equatorialCrossingDateGraphQlHeaders from './__mocks__/equatorial_crossing_date/graphql.headers.json'
import equatorialCrossingDateTimelineBody from './__mocks__/equatorial_crossing_date/timeline.body.json'
import equatorialCrossingDateTimelineHeaders from './__mocks__/equatorial_crossing_date/timeline.headers.json'
import equatorialCrossingLongitudeGranulesBody from './__mocks__/equatorial_crossing_longitude/granules.body.json'
import equatorialCrossingLongitudeGraphQlBody from './__mocks__/equatorial_crossing_longitude/graphql.body.json'
import equatorialCrossingLongitudeGraphQlHeaders from './__mocks__/equatorial_crossing_longitude/graphql.headers.json'
import equatorialCrossingLongitudeTimelineBody from './__mocks__/equatorial_crossing_longitude/timeline.body.json'
import equatorialCrossingLongitudeTimelineHeaders from './__mocks__/equatorial_crossing_longitude/timeline.headers.json'
import focusedGranuleCollectionGraphQlBody from './__mocks__/focused_granule/collection_graphql.body.json'
import focusedGranuleGranuleGraphQlBody from './__mocks__/focused_granule/granule_graphql.body.json'
import focusedGranuleGranulesBody from './__mocks__/focused_granule/granules.body.json'
import focusedGranuleGraphQlHeaders from './__mocks__/focused_granule/graphql.headers.json'
import focusedGranuleTimelineBody from './__mocks__/focused_granule/timeline.body.json'
import focusedGranuleTimelineHeaders from './__mocks__/focused_granule/timeline.headers.json'
import gridCoordsGranulesBody from './__mocks__/grid_coords/granules.body.json'
import gridCoordsGraphQlBody from './__mocks__/grid_coords/graphql.body.json'
import gridCoordsGraphQlHeaders from './__mocks__/grid_coords/graphql.headers.json'
import gridCoordsTimelineBody from './__mocks__/grid_coords/timeline.body.json'
import gridCoordsTimelineHeaders from './__mocks__/grid_coords/timeline.headers.json'
import noParamsGranulesBody from './__mocks__/no_params/granules.body.json'
import noParamsGraphQlBody from './__mocks__/no_params/graphql.body.json'
import noParamsGraphQlHeaders from './__mocks__/no_params/graphql.headers.json'
import noParamsTimelineBody from './__mocks__/no_params/timeline.body.json'
import noParamsTimelineHeaders from './__mocks__/no_params/timeline.headers.json'
import onlineOnlyGranulesBody from './__mocks__/online_only/granules.body.json'
import onlineOnlyGraphQlBody from './__mocks__/online_only/graphql.body.json'
import onlineOnlyGraphQlHeaders from './__mocks__/online_only/graphql.headers.json'
import onlineOnlyTimelineBody from './__mocks__/online_only/timeline.body.json'
import onlineOnlyTimelineHeaders from './__mocks__/online_only/timeline.headers.json'
import orbitNumberGranulesBody from './__mocks__/orbit_number/granules.body.json'
import orbitNumberGraphQlBody from './__mocks__/orbit_number/graphql.body.json'
import orbitNumberGraphQlHeaders from './__mocks__/orbit_number/graphql.headers.json'
import orbitNumberTimelineBody from './__mocks__/orbit_number/timeline.body.json'
import orbitNumberTimelineHeaders from './__mocks__/orbit_number/timeline.headers.json'
import projectGranuleCollectionGraphQlBody from './__mocks__/project_granule/collection_graphql.body.json'
import projectGranuleCollectionsGraphQlBody from './__mocks__/project_granule/collections_graphql.body.json'
import projectGranuleGranulesBody from './__mocks__/project_granule/granules.body.json'
import projectGranuleGraphQlHeaders from './__mocks__/project_granule/graphql.headers.json'
import projectGranuleProjectGranuleBody from './__mocks__/project_granule/project_granule.body.json'
import projectGranuleTimelineBody from './__mocks__/project_granule/timeline.body.json'
import projectGranuleTimelineHeaders from './__mocks__/project_granule/timeline.headers.json'
import readableGranuleNameGranulesBody from './__mocks__/readable_granule_name/granules.body.json'
import readableGranuleNameGraphQlBody from './__mocks__/readable_granule_name/graphql.body.json'
import readableGranuleNameGraphQlHeaders from './__mocks__/readable_granule_name/graphql.headers.json'
import readableGranuleNameTimelineBody from './__mocks__/readable_granule_name/timeline.body.json'
import readableGranuleNameTimelineHeaders from './__mocks__/readable_granule_name/timeline.headers.json'
import recurringTemporalGranulesBody from './__mocks__/temporal/recurringTemporalGranules.body.json'
import sortKeyGranulesBody from './__mocks__/sort_key/granules.body.json'
import sortKeyGraphQlBody from './__mocks__/sort_key/graphql.body.json'
import sortKeyGraphQlHeaders from './__mocks__/sort_key/graphql.headers.json'
import sortKeyTimelineBody from './__mocks__/sort_key/timeline.body.json'
import sortKeyTimelineHeaders from './__mocks__/sort_key/timeline.headers.json'
import subscriptionGranulesBody from './__mocks__/subscription/granules.body.json'
import subscriptionGraphQlBody from './__mocks__/subscription/graphql.body.json'
import subscriptionGraphQlHeaders from './__mocks__/subscription/graphql.headers.json'
import subscriptionTimelineBody from './__mocks__/subscription/timeline.body.json'
import subscriptionTimelineHeaders from './__mocks__/subscription/timeline.headers.json'
import temporalGranulesBody from './__mocks__/temporal/granules.body.json'
import temporalGraphQlBody from './__mocks__/temporal/graphql.body.json'
import temporalGraphQlHeaders from './__mocks__/temporal/graphql.headers.json'
import temporalTimelineBody from './__mocks__/temporal/timeline.body.json'
import temporalTimelineHeaders from './__mocks__/temporal/timeline.headers.json'
import timelineCollectionsBody from './__mocks__/timeline/collections.body.json'
import timelineCollectionsHeaders from './__mocks__/timeline/collections.headers.json'
import timelineGranulesBody from './__mocks__/timeline/granules.body.json'
import timelineGraphQlBody from './__mocks__/timeline/graphql.body.json'
import timelineGraphQlHeaders from './__mocks__/timeline/graphql.headers.json'
import timelineTimelineBody from './__mocks__/timeline/timeline.body.json'
import timelineTimelineHeaders from './__mocks__/timeline/timeline.headers.json'
import graphQlHeaders from './__mocks__/common/graphql.headers.json'

import { login } from '../../../../support/login'

const defaultCmrPageSize = 20

/**
 * Tests the search panel header and meta text for results size
 * @param {Page} page Playwright page object
 * @param {Integer} cmrHits Total number of collections that match the query
 */
const testResultsSize = async (page, cmrHits) => {
  const expectedSize = Math.min(defaultCmrPageSize, cmrHits)

  const metaText = await page.getByTestId('panel-group_granule-results')
    .getByTestId('panel-group-header__heading-meta-text')
    .textContent()

  expect(metaText).toBe(`Showing ${expectedSize} of ${commafy(cmrHits)} matching ${pluralize('granule', cmrHits)}`)
}

test.describe('Path /search/granules', () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(new Date('2021-06-01'))
  })

  test.describe('When the path is loaded with only the collectionId', () => {
    test('loads correctly', async ({ page }) => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1059170

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(noParamsGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()
        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
        }

        route.fulfill({
          body: JSON.stringify(noParamsTimelineBody),
          headers: noParamsTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(noParamsGraphQlBody),
          headers: noParamsGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C1214470488-ASF')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Readable granule name input is empty
      await expect(page.getByTestId('granule-filters__readable-granule-name')).toHaveValue('')
    })
  })

  test.describe('When the path is loaded with readable granule name parameter', () => {
    test('loads with the Granule ID field populated', async ({ page }) => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C1214470488-ASF&options[readable_granule_name][pattern]=true&page_num=1&page_size=20&readable_granule_name[]=S1A_S3_SLC__1SDH_20140615T034444_20140615T034512_001055_00107C_16F1')

        route.fulfill({
          body: JSON.stringify(readableGranuleNameGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
        }

        route.fulfill({
          body: JSON.stringify(readableGranuleNameTimelineBody),
          headers: readableGranuleNameTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(readableGranuleNameGraphQlBody),
          headers: readableGranuleNameGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C1214470488-ASF&pg[0][id]=S1A_S3_SLC__1SDH_20140615T034444_20140615T034512_001055_00107C_16F1')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Readable granule name input is populated
      await expect(page.getByTestId('granule-filters__readable-granule-name')).toHaveValue('S1A_S3_SLC__1SDH_20140615T034444_20140615T034512_001055_00107C_16F1')
    })
  })

  test.describe('When the path is loaded with granule temporal', () => {
    test.describe('When the temporal range is not recurring', () => {
      test('loads with the temporal fields populated', async ({ page }) => {
        const conceptId = 'C1214470488-ASF'
        const cmrHits = 17231

        await page.route('**/search/granules.json', (route) => {
          const request = route.request()
          const body = request.postData()

          expect(body).toBe('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20&temporal=2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z')

          route.fulfill({
            body: JSON.stringify(temporalGranulesBody),
            headers: {
              ...commonGranulesHeaders,
              'access-control-expose-headers': 'cmr-hits',
              'cmr-hits': cmrHits
            }
          })
        })

        await page.route('**/search/granules/timeline', (route) => {
          const request = route.request()
          const body = request.postData()

          if (body) {
            expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
          }

          route.fulfill({
            json: temporalTimelineBody,
            headers: temporalTimelineHeaders
          })
        })

        await page.route('**/api', (route) => {
          const request = route.request()
          const body = JSON.stringify(request.postData())
          const expectedBody = JSON.stringify(graphQlGetCollection(conceptId))
          const requestBody = JSON.parse(body)
          const expectedRequestBody = JSON.parse(expectedBody)

          expect(requestBody).toEqual(expectedRequestBody)

          route.fulfill({
            body: JSON.stringify(temporalGraphQlBody),
            headers: temporalGraphQlHeaders
          })
        })

        await page.goto('/search/granules?p=C1214470488-ASF&pg[0][qt]=2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Readable granule name input is empty
        await expect(page.getByTestId('granule-filters__readable-granule-name')).toHaveValue('')

        // Temporal is populated
        await expect(page.locator('#granule-filters__temporal-selection__temporal-form__start-date')).toHaveValue('2020-01-01 00:00:00')
        await expect(page.locator('#granule-filters__temporal-selection__temporal-form__end-date')).toHaveValue('2020-01-31 23:59:59')
      })
    })

    test.describe('When the temporal range is recurring', () => {
      test('loads with the temporal fields populated', async ({ page }) => {
        const conceptId = 'C1214470488-ASF'
        const cmrHits = 72946

        await page.route('**/search/granules.json', (route) => {
          const request = route.request()
          const body = request.postData()

          expect(body).toBe('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20&temporal=2000-01-20T00:00:00.000Z,2020-01-31T23:59:59.999Z,1,31')

          route.fulfill({
            body: JSON.stringify(recurringTemporalGranulesBody),
            headers: {
              ...commonGranulesHeaders,
              'access-control-expose-headers': 'cmr-hits',
              'cmr-hits': cmrHits
            }
          })
        })

        await page.route('**/search/granules/timeline', (route) => {
          const request = route.request()
          const body = request.postData()

          if (body) {
            expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
          }

          route.fulfill({
            json: temporalTimelineBody,
            headers: temporalTimelineHeaders
          })
        })

        await page.route('**/api', (route) => {
          const request = route.request()
          const body = JSON.stringify(request.postData())
          const expectedBody = JSON.stringify(graphQlGetCollection(conceptId))
          const requestBody = JSON.parse(body)
          const expectedRequestBody = JSON.parse(expectedBody)

          expect(requestBody).toEqual(expectedRequestBody)

          route.fulfill({
            body: JSON.stringify(temporalGraphQlBody),
            headers: temporalGraphQlHeaders
          })
        })

        await page.goto('/search/granules?p=C1214470488-ASF&pg[0][qt]=2000-01-20T00:00:00.000Z,2020-01-31T23:59:59.999Z,1,31')

        // Ensure the correct number of results were loaded
        await testResultsSize(page, cmrHits)

        // Readable granule name input is empty
        await expect(page.getByTestId('granule-filters__readable-granule-name')).toHaveValue('')

        // Temporal is populated
        await expect(page.locator('#granule-filters__temporal-selection__temporal-form__start-date')).toHaveValue('01-20 00:00:00')
        await expect(page.locator('#granule-filters__temporal-selection__temporal-form__end-date')).toHaveValue('01-31 23:59:59')
        await expect(page.locator('#granule-filters__temporal-selection__recurring')).toBeChecked()
        await expect(page.locator('.temporal-selection__range-label')).toHaveText('2000 - 2020')
      })
    })
  })

  test.describe('When the path is loaded with browse only set to true', () => {
    test('loads with the browse only checkbox checked', async ({ page }) => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 0

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('browse_only=true&echo_collection_id=C1214470488-ASF&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(browseOnlyGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
        }

        route.fulfill({
          body: JSON.stringify(browseOnlyTimelineBody),
          headers: browseOnlyTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(browseOnlyGraphQlBody),
          headers: browseOnlyGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C1214470488-ASF&pg[0][bo]=true')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Checkboxes are checked correctly
      await expect(page.getByTestId('granule-filters__browse-only')).toBeChecked()
      await expect(page.getByTestId('granule-filters__online-only')).not.toBeChecked()
    })
  })

  test.describe('When the path is loaded with online only set to true', () => {
    test('loads with the online only checkbox checked', async ({ page }) => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1059331

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C1214470488-ASF&online_only=true&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(onlineOnlyGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
        }

        route.fulfill({
          body: JSON.stringify(onlineOnlyTimelineBody),
          headers: onlineOnlyTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(onlineOnlyGraphQlBody),
          headers: onlineOnlyGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C1214470488-ASF&pg[0][oo]=true')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Checkboxes are checked correctly
      await expect(page.getByTestId('granule-filters__browse-only')).not.toBeChecked()
      await expect(page.getByTestId('granule-filters__online-only')).toBeChecked()
    })
  })

  test.describe('When the path is loaded with orbit number parameters', () => {
    test('loads with the orbit number fields populated', async ({ page }) => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 227

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C1214470488-ASF&orbit_number[min]=30000&orbit_number[max]=30005&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(orbitNumberGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
        }

        route.fulfill({
          body: JSON.stringify(orbitNumberTimelineBody),
          headers: orbitNumberTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(orbitNumberGraphQlBody),
          headers: orbitNumberGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C1214470488-ASF&pg[0][on][min]=30000&pg[0][on][max]=30005')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Orbit number fields are populated
      await expect(page.getByTestId('granule-filters__orbit-number-min')).toHaveValue('30000')
      await expect(page.getByTestId('granule-filters__orbit-number-max')).toHaveValue('30005')
    })
  })

  test.describe('When the path is loaded with equatorial crossing longitude parameters', () => {
    test('loads with the equatorial crossing longitude fields populated', async ({ page }) => {
      const conceptId = 'C1251101828-GES_DISC'
      const cmrHits = 6078

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C1251101828-GES_DISC&equator_crossing_longitude[min]=-5&equator_crossing_longitude[max]=5&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(equatorialCrossingLongitudeGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1251101828-GES_DISC')
        }

        route.fulfill({
          body: JSON.stringify(equatorialCrossingLongitudeTimelineBody),
          headers: equatorialCrossingLongitudeTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(equatorialCrossingLongitudeGraphQlBody),
          headers: equatorialCrossingLongitudeGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C1251101828-GES_DISC&pg[0][ecl][min]=-5&pg[0][ecl][max]=5')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Equatorial crossing longitude fields are populated
      await expect(page.getByTestId('granule-filters__equatorial-crossing-longitude-min')).toHaveValue('-5')
      await expect(page.getByTestId('granule-filters__equatorial-crossing-longitude-max')).toHaveValue('5')
    })
  })

  test.describe('When the path is loaded with equatorial crossing date parameters', () => {
    test('loads with the equatorial crossing date fields populated', async ({ page }) => {
      const conceptId = 'C1251101828-GES_DISC'
      const cmrHits = 31

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C1251101828-GES_DISC&equator_crossing_date=2021-01-01T00:00:00.000Z,2021-01-31T23:59:59.999Z&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(equatorialCrossingDateGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1251101828-GES_DISC')
        }

        route.fulfill({
          body: JSON.stringify(equatorialCrossingDateTimelineBody),
          headers: equatorialCrossingDateTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(equatorialCrossingDateGraphQlBody),
          headers: equatorialCrossingDateGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C1251101828-GES_DISC&pg[0][ecd]=2021-01-01T00:00:00.000Z,2021-01-31T23:59:59.999Z')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Equatorial crossing date fields are populated
      await expect(page.locator('#granule-filters__equatorial-crossing-date-selection__temporal-form__start-date')).toHaveValue('2021-01-01 00:00:00')
      await expect(page.locator('#granule-filters__equatorial-crossing-date-selection__temporal-form__end-date')).toHaveValue('2021-01-31 23:59:59')
    })
  })

  test.describe('When the path is loaded with a sort key parameter', () => {
    test('loads with the correct sort key selected', async ({ page }) => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1059866

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20&sort_key=-end_date')

        route.fulfill({
          body: JSON.stringify(sortKeyGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
        }

        route.fulfill({
          body: JSON.stringify(sortKeyTimelineBody),
          headers: sortKeyTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(sortKeyGraphQlBody),
          headers: sortKeyGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C1214470488-ASF&pg[0][gsk]=-end_date')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Correct sort key is selected
      await page.getByTestId('panel-group-header-dropdown__sort__1').click()
      await expect(page.locator('.radio-setting-dropdown-item--is-active')).toHaveText('End Date, Newest First')
    })
  })

  test.describe('When the path is loaded with a cloud cover parameter', () => {
    test('loads with the cloud cover fields populated', async ({ page }) => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 15600

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('cloud_cover=10,15&echo_collection_id=C194001210-LPDAAC_ECS&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(cloudCoverGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C194001210-LPDAAC_ECS')
        }

        route.fulfill({
          body: JSON.stringify(cloudCoverTimelineBody),
          headers: cloudCoverTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(cloudCoverGraphQlBody),
          headers: cloudCoverGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C194001210-LPDAAC_ECS&pg[0][cc][min]=10&pg[0][cc][max]=15')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Cloud cover fields are populated
      await expect(page.getByTestId('granule-filters__cloud-cover-min')).toHaveValue('10')
      await expect(page.getByTestId('granule-filters__cloud-cover-max')).toHaveValue('15')
    })
  })

  test.describe('When the path is loaded with a day night flag parameter', () => {
    test('loads with the day/night field populated', async ({ page }) => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 275357

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('day_night_flag=BOTH&echo_collection_id=C194001210-LPDAAC_ECS&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(dayNightGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C194001210-LPDAAC_ECS')
        }

        route.fulfill({
          body: JSON.stringify(dayNightTimelineBody),
          headers: dayNightTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(dayNightGraphQlBody),
          headers: dayNightGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C194001210-LPDAAC_ECS&pg[0][dnf]=BOTH')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Day/Night field is populated
      await expect(page.getByTestId('granule-filters__day-night-flag')).toHaveValue('BOTH')
    })
  })

  test.describe('When the path is loaded with a tiling system/grid coords parameter', () => {
    test('loads with the tiling system and grid coords populated', async ({ page }) => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 868

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C194001210-LPDAAC_ECS&page_num=1&page_size=20&two_d_coordinate_system[name]=MODIS Tile SIN&two_d_coordinate_system[coordinates]=0-0:0-0,15-15:15-15')

        route.fulfill({
          body: JSON.stringify(gridCoordsGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C194001210-LPDAAC_ECS')
        }

        route.fulfill({
          body: JSON.stringify(gridCoordsTimelineBody),
          headers: gridCoordsTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(gridCoordsGraphQlBody),
          headers: gridCoordsGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C194001210-LPDAAC_ECS&pg[0][ts]=MODIS Tile SIN&pg[0][gc]=0-0:0-0,15-15:15-15')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Tiling system and grid coords fields are populated
      await expect(page.getByTestId('granule-filters__tiling-system')).toHaveValue('MODIS Tile SIN')
      await expect(page.getByTestId('granule-filters__grid-coordinates')).toHaveValue('0,0 15,15')
    })
  })

  test.describe('When the path is loaded with timeline parameters', () => {
    test('loads with the timeline in the correct position', async ({ page }) => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 317

      await page.route('**/search/collections.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&temporal=2015-01-03T00:00:00.000Z,2015-01-03T23:59:59.999Z&sort_key[]=has_granules_or_cwic&sort_key[]=-score')

        route.fulfill({
          body: JSON.stringify(timelineCollectionsBody),
          headers: timelineCollectionsHeaders
        })
      })

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C194001210-LPDAAC_ECS&page_num=1&page_size=20&temporal=2015-01-03T00:00:00.000Z,2015-01-03T23:59:59.999Z')

        route.fulfill({
          body: JSON.stringify(timelineGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2015-02-02T00:00:00.000Z&interval=hour&start_date=2014-12-04T00:00:00.000Z&concept_id[]=C194001210-LPDAAC_ECS')
        }

        route.fulfill({
          body: JSON.stringify(timelineTimelineBody),
          headers: timelineTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const requestBody = JSON.parse(route.request().postData())
        const expectedBody = JSON.parse(graphQlGetCollection(conceptId))

        expect(requestBody).toEqual(expectedBody)

        route.fulfill({
          body: JSON.stringify(timelineGraphQlBody),
          headers: timelineGraphQlHeaders
        })
      })

      await page.goto('/search/granules?p=C194001210-LPDAAC_ECS&ot=2015-01-03T00:00:00.000Z,2015-01-03T23:59:59.999Z&tl=1420268129.401!2!1420243200!1420329599.999')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Timeline is correct
      // Zoom level
      await expect(page.locator('.edsc-timeline-tools > :nth-child(1)')).toHaveText('Day')
      // Focused Date
      await expect(page.locator('.edsc-timeline-tools__section--horizontal')).toHaveText('03 Jan 2015')
      // Position
      await expect(page.locator('.edsc-timeline-interval__interval-section-label').filter({ hasText: 'Jan 2015' })).toBeVisible()
    })
  })

  test.describe('When the path is loaded with a focused granule', () => {
    test('loads with the granule focused', async ({ page }) => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 275361

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C194001210-LPDAAC_ECS&page_num=1&page_size=20&sort_key=-start_date')

        route.fulfill({
          body: JSON.stringify(focusedGranuleGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C194001210-LPDAAC_ECS')
        }

        route.fulfill({
          body: JSON.stringify(focusedGranuleTimelineBody),
          headers: focusedGranuleTimelineHeaders
        })
      })

      await page.route('**/api', (route) => {
        const body = JSON.stringify(route.request().postData())

        if (body === JSON.stringify(graphQlGetCollection(conceptId))) {
          route.fulfill({
            body: JSON.stringify(focusedGranuleCollectionGraphQlBody),
            headers: focusedGranuleGraphQlHeaders
          })
        } else if (body === '{"query":"\\n    query GetGranule(\\n      $params: GranuleInput\\n    ) {\\n      granule(\\n        params: $params\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"params":{"conceptId":"G2058417402-LPDAAC_ECS"}}}') {
          route.fulfill({
            body: JSON.stringify(focusedGranuleGranuleGraphQlBody),
            headers: focusedGranuleGraphQlHeaders
          })
        }
      })

      await page.goto('/search/granules?p=C194001210-LPDAAC_ECS&pg[0][gsk]=-start_date&g=G2058417402-LPDAAC_ECS')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      // Granule is focused
      await expect(page.locator('.granule-results-item--active').filter({ hasText: 'MYD11A2.A2021137.h21v17.006.2021146041018.hdf' })).toBeVisible()
      // Browse image is open
      await expect(page.locator('.granule-results-focused-meta')).toBeVisible()
    })
  })

  test.describe('When the path is loaded with a project granule', () => {
    test('loads with a single granule in the project', async ({ page }) => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 275361

      await interceptUnauthenticatedCollections({
        page,
        body: collectionsBody,
        headers: collectionsHeaders
      })

      // Intercept granules.json request
      await page.route('**/search/granules.json', async (route) => {
        const request = route.request()
        const body = request.postData()

        if (body === 'echo_collection_id=C194001210-LPDAAC_ECS&page_num=1&page_size=20') {
          await route.fulfill({
            body: JSON.stringify(projectGranuleGranulesBody),
            headers: {
              ...commonGranulesHeaders,
              'access-control-expose-headers': 'cmr-hits',
              'cmr-hits': cmrHits.toString()
            }
          })
        } else if (body === 'echo_collection_id=C194001210-LPDAAC_ECS&page_num=1&page_size=1&concept_id[]=G2058417402-LPDAAC_ECS') {
          await route.fulfill({
            body: JSON.stringify(projectGranuleProjectGranuleBody),
            headers: {
              ...commonGranulesHeaders,
              'access-control-expose-headers': 'cmr-hits',
              'cmr-hits': '1'
            }
          })
        }
      })

      // Intercept granules timeline request
      await page.route('**/search/granules/timeline', async (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C194001210-LPDAAC_ECS')
        }

        await route.fulfill({
          body: JSON.stringify(projectGranuleTimelineBody),
          headers: projectGranuleTimelineHeaders
        })
      })

      await page.route(/saved_access_configs/, async (route) => {
        await route.fulfill({
          json: {}
        })
      })

      // Intercept GraphQL request
      await page.route('**/api', async (route) => {
        const request = route.request()
        const body = JSON.stringify(request.postData())
        const expectedBody = JSON.stringify(graphQlGetCollection(conceptId))
        const requestBody = JSON.parse(body)
        const expectedRequestBody = JSON.parse(expectedBody)

        if (JSON.stringify(requestBody) === JSON.stringify(expectedRequestBody)) {
          await route.fulfill({
            body: JSON.stringify(projectGranuleCollectionGraphQlBody),
            headers: projectGranuleGraphQlHeaders
          })
        } else if (JSON.stringify(requestBody) === JSON.stringify(graphQlGetCollections('C194001210-LPDAAC_ECS'))) {
          await route.fulfill({
            body: JSON.stringify(projectGranuleCollectionsGraphQlBody),
            headers: projectGranuleGraphQlHeaders
          })
        }
      })

      // Go to collection in the project context
      await page.goto('/search/granules?p=C194001210-LPDAAC_ECS!C194001210-LPDAAC_ECS&pg[1][a]=2058417402!LPDAAC_ECS')

      // Ensure the correct number of results were loaded
      await testResultsSize(page, cmrHits)

      const removeButtonLocator = page.getByTestId('granule-results-actions__proj-action--remove')

      await removeButtonLocator.waitFor({ state: 'visible' })
      await expect(removeButtonLocator).toBeVisible()

      const downloadAllButtonLocator = page
        .getByTestId('granule-results-actions__download-all-button')
        .locator('.button__badge')

      await downloadAllButtonLocator.waitFor({ state: 'visible' })
    })
  })

  test.describe('When the path is loaded with a project collection', () => {
    test('loads with all granules in the project', async ({ page }) => {
      const cmrHits = 15073

      await page.route('**/search/granules.json', (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toBe('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20')

        route.fulfill({
          body: JSON.stringify(noParamsGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', (route) => {
        const request = route.request()
        const body = request.postData()

        if (body) {
          expect(body).toBe('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')
        }

        route.fulfill({
          body: JSON.stringify(noParamsTimelineBody),
          headers: noParamsTimelineHeaders
        })
      })

      await page.route(/saved_access_configs/, async (route) => {
        await route.fulfill({
          json: {}
        })
      })

      await page.route('**/api', (route) => {
        route.fulfill({
          body: JSON.stringify(noParamsGraphQlBody),
          headers: noParamsGraphQlHeaders
        })
      })

      // Go to collection in the project context
      await page.goto('/search/granules?p=C1214470488-ASF!C1214470488-ASF')

      // Project count is correct
      await expect(page.getByTestId('granule-results-actions__proj-action--remove')).toBeVisible()
      await expect(page
        .getByTestId('granule-results-actions__download-all-button')
        .locator('.button__badge')).toHaveText(commafy(cmrHits))
    })
  })

  test.describe('When the path is loaded with a collection with an active subscription', () => {
    test('loads with the subscription indicator active', async ({ page, context }) => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 229

      await login(context)

      await page.route('**/search/collections.json', async (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toEqual('has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.*,opensearch.granule.osdd&page_num=1&page_size=20&point[]=-77.04119,38.80585&sort_key[]=has_granules_or_cwic&sort_key[]=-score')

        await route.fulfill({
          body: JSON.stringify(commonBody),
          headers: commonHeaders
        })
      })

      await page.route('**/search/granules.json', async (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toEqual('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20&point[]=-77.04119,38.80585&sort_key=-start_date')

        await route.fulfill({
          body: JSON.stringify(subscriptionGranulesBody),
          headers: {
            ...commonGranulesHeaders,
            'access-control-expose-headers': 'cmr-hits',
            'cmr-hits': cmrHits
          }
        })
      })

      await page.route('**/search/granules/timeline', async (route) => {
        const request = route.request()
        const body = request.postData()

        expect(body).toEqual('end_date=2023-12-01T00:00:00.000Z&interval=day&start_date=2018-12-01T00:00:00.000Z&concept_id[]=C1214470488-ASF')

        await route.fulfill({
          body: JSON.stringify(subscriptionTimelineBody),
          headers: subscriptionTimelineHeaders
        })
      })

      await page.route('**/graphql', async (route) => {
        const request = route.request()
        const body = JSON.parse(request.postData())

        if (body.data.query === graphQlGetSubscriptionsQuery) {
          await route.fulfill({
            body: JSON.stringify({
              data: {
                subscriptions: {
                  items: []
                }
              }
            }),
            headers: subscriptionGraphQlHeaders
          })
        } else if (body.data.query === JSON.parse(graphQlGetCollection(conceptId)).query) {
          await route.fulfill({
            body: JSON.stringify(subscriptionGraphQlBody),
            headers: graphQlHeaders
          })
        }
      })

      await page.goto('/search/granules?p=C1214470488-ASF&pg[0][gsk]=-start_date&sp[0]=-77.04119,38.80585')

      // Subscription button is active
      await expect(page.getByTestId('granule-results-actions__subscriptions-button')).toHaveClass(/granule-results-actions__action--is-active/)
    })
  })
})
