/* eslint-disable capitalized-comments */
/* eslint-disable no-unused-vars */
import { test, expect } from '@playwright/test'
import { getByTestId } from '../../../../support/getByTestId'
import { graphQlGetCollection } from '../../../../support/graphQlGetCollection'
import { graphQlGetCollections } from '../../../../support/graphQlGetCollections'
import { graphQlGetSubscriptionsQuery } from '../../../../support/graphQlGetSubscriptionsQuery'
import {
  interceptUnauthenticatedCollections
} from '../../../../support/interceptUnauthenticatedCollections'

import { commafy } from '../../../../../static/src/js/util/commafy'
// import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { pluralize } from '../../../../../static/src/js/util/pluralize'

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
import projectCollectionCollectionGraphQlBody from './__mocks__/project_collection/collection_graphql.body.json'
import projectCollectionCollectionsGraphQlBody from './__mocks__/project_collection/collections_graphql.body.json'
import projectCollectionGranulesBody from './__mocks__/project_collection/granules.body.json'
import projectCollectionGraphQlHeaders from './__mocks__/project_collection/graphql.headers.json'
import projectCollectionTimelineBody from './__mocks__/project_collection/timeline.body.json'
import projectCollectionTimelineHeaders from './__mocks__/project_collection/timeline.headers.json'
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

// const { defaultCmrPageSize } = getApplicationConfig()
const defaultCmrPageSize = 20

/**
 * Tests the search panel header and meta text for results size
 * @param {import('@playwright/test').Page} page - The Playwright page object
 * @param {Integer} cmrHits Total number of collections that match the query
 */
const testResultsSize = async (page, cmrHits) => {
  const expectedSize = Math.min(defaultCmrPageSize, cmrHits)

  const metaText = await page.locator('[data-testid="panel-group_granule-results"] [data-testid="panel-group-header__heading-meta-text"]').textContent()
  expect(metaText).toBe(`Showing ${expectedSize} of ${commafy(cmrHits)} matching ${pluralize('granule', cmrHits)}`)
}

test.describe('Path /search/granules', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      const mockDate = new Date('2021-06-01')
      Date.now = () => mockDate.getTime()
    })
  })

  test('loads correctly when the path is loaded with only the collectionId', async ({ page }) => {
    const conceptId = 'C1214470488-ASF'
    const cmrHits = 1059170

    await interceptUnauthenticatedCollections(page, collectionsBody, collectionsHeaders)

    await page.route('**/search/granules.json', async (route) => {
      const request = route.request()
      expect(request.postData()).toBe('echo_collection_id=C1214470488-ASF&page_num=1&page_size=20')

      await route.fulfill({
        status: 200,
        body: JSON.stringify(noParamsGranulesBody),
        headers: {
          ...commonGranulesHeaders,
          'cmr-hits': cmrHits.toString()
        }
      })
    })
  })
})
