import { getByTestId } from '../../../../support/getByTestId'
import { graphQlGetCollection } from '../../../../support/graphQlGetCollection'
import { graphQlGetCollections } from '../../../../support/graphQlGetCollections'
import { interceptUnauthenticatedCollections }
  from '../../../../support/interceptUnauthenticatedCollections'

import { commafy } from '../../../../../static/src/js/util/commafy'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
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

const { defaultCmrPageSize } = getApplicationConfig()

/**
 * Tests the search panel header and meta text for results size
 * @param {Integer} cmrHits Total number of collections that match the query
 */
const testResultsSize = (cmrHits) => {
  const expectedSize = Math.min(defaultCmrPageSize, cmrHits)

  getByTestId('panel-group_granule-results').within(() => {
    getByTestId('panel-group-header__heading-meta-text').should('have.text', `Showing ${expectedSize} of ${commafy(cmrHits)} matching ${pluralize('granule', cmrHits)}`)
  })
}

describe('Path /search/granules', () => {
  beforeEach(() => {
    // Mock the current date so timeline parameters won't change over time
    cy.clock(new Date('2021-06-01'), ['Date'])
  })

  describe('When the path is loaded with only the collectionId', () => {
    it('loads correctly', () => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1059170

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: noParamsGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

        req.reply({
          body: noParamsTimelineBody,
          headers: noParamsTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: noParamsGraphQlBody,
          headers: noParamsGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1214470488-ASF')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Readable granule name input is empty
      getByTestId('granule-filters__readable-granule-name').should('have.value', '')
    })
  })

  describe('When the path is loaded with readable granule name parameter', () => {
    it('loads with the Granule ID field populated', () => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&options%5Breadable_granule_name%5D%5Bpattern%5D=true&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&readable_granule_name%5B%5D=S1A_S3_SLC__1SDH_20140615T034444_20140615T034512_001055_00107C_16F1')

        req.reply({
          body: readableGranuleNameGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

        req.reply({
          body: readableGranuleNameTimelineBody,
          headers: readableGranuleNameTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: readableGranuleNameGraphQlBody,
          headers: readableGranuleNameGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1214470488-ASF&pg[0][id]=S1A_S3_SLC__1SDH_20140615T034444_20140615T034512_001055_00107C_16F1')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Readable granule name input is populated
      getByTestId('granule-filters__readable-granule-name').should('have.value', 'S1A_S3_SLC__1SDH_20140615T034444_20140615T034512_001055_00107C_16F1')
    })
  })

  describe('When the path is loaded with granule temporal', () => {
    describe('When the temporal range is not recurring', () => {
      it('loads with the temporal fields populated', () => {
        const conceptId = 'C1214470488-ASF'
        const cmrHits = 17231

        interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

        cy.intercept({
          method: 'POST',
          url: '**/search/granules.json'
        },
        (req) => {
          expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&temporal=2020-01-01T00%3A00%3A00.000Z%2C2020-01-31T23%3A59%3A59.999Z')

          req.reply({
            body: temporalGranulesBody,
            headers: {
              ...commonGranulesHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/search/granules/timeline'
        },
        (req) => {
          expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

          req.reply({
            body: temporalTimelineBody,
            headers: temporalTimelineHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/api'
        },
        (req) => {
          expect(req.body).to.eq(graphQlGetCollection(conceptId))

          req.reply({
            body: temporalGraphQlBody,
            headers: temporalGraphQlHeaders
          })
        })

        cy.visit('/search/granules?p=C1214470488-ASF&pg[0][qt]=2020-01-01T00%3A00%3A00.000Z%2C2020-01-31T23%3A59%3A59.999Z')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Readable granule name input is empty
        getByTestId('granule-filters__readable-granule-name').should('have.value', '')

        // Temporal is populated
        cy.get('#granule-filters__temporal-selection__temporal-form__start-date').should('have.value', '2020-01-01 00:00:00')
        cy.get('#granule-filters__temporal-selection__temporal-form__end-date').should('have.value', '2020-01-31 23:59:59')
      })
    })

    describe('When the temporal range is recurring', () => {
      it('loads with the temporal fields populated', () => {
        const conceptId = 'C1214470488-ASF'
        const cmrHits = 72946

        interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

        cy.intercept({
          method: 'POST',
          url: '**/search/granules.json'
        },
        (req) => {
          expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&temporal=2000-01-20T00%3A00%3A00.000Z%2C2020-01-31T23%3A59%3A59.999Z%2C1%2C31')

          req.reply({
            body: recurringTemporalGranulesBody,
            headers: {
              ...commonGranulesHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/search/granules/timeline'
        },
        (req) => {
          expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

          req.reply({
            body: temporalTimelineBody,
            headers: temporalTimelineHeaders
          })
        })

        cy.intercept({
          method: 'POST',
          url: '**/api'
        },
        (req) => {
          expect(req.body).to.eq(graphQlGetCollection(conceptId))

          req.reply({
            body: temporalGraphQlBody,
            headers: temporalGraphQlHeaders
          })
        })

        cy.visit('/search/granules?p=C1214470488-ASF&pg[0][qt]=2000-01-20T00%3A00%3A00.000Z%2C2020-01-31T23%3A59%3A59.999Z%2C1%2C31')

        // Ensure the correct number of results were loaded
        testResultsSize(cmrHits)

        // Readable granule name input is empty
        getByTestId('granule-filters__readable-granule-name').should('have.value', '')

        // Temporal is populated
        cy.get('#granule-filters__temporal-selection__temporal-form__start-date').should('have.value', '01-20 00:00:00')
        cy.get('#granule-filters__temporal-selection__temporal-form__end-date').should('have.value', '01-31 23:59:59')
        cy.get('#granule-filters__temporal-selection__recurring').should('be.checked')
        cy.get('.temporal-selection__range-label').should('have.text', '2000 - 2020')
      })
    })
  })

  describe('When the path is loaded with browse only set to true', () => {
    it('loads with the browse only checkbox checked', () => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 0

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('browse_only=true&echo_collection_id=C1214470488-ASF&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: browseOnlyGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

        req.reply({
          body: browseOnlyTimelineBody,
          headers: browseOnlyTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: browseOnlyGraphQlBody,
          headers: browseOnlyGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1214470488-ASF&pg[0][bo]=true')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Checkboxes are checked correctly
      getByTestId('granule-filters__browse-only').should('be.checked')
      getByTestId('granule-filters__online-only').should('not.be.checked')
    })
  })

  describe('When the path is loaded with online only set to true', () => {
    it('loads with the online only checkbox checked', () => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1059331

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&online_only=true&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: onlineOnlyGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

        req.reply({
          body: onlineOnlyTimelineBody,
          headers: onlineOnlyTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: onlineOnlyGraphQlBody,
          headers: onlineOnlyGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1214470488-ASF&pg[0][oo]=true')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Checkboxes are checked correctly
      getByTestId('granule-filters__browse-only').should('not.be.checked')
      getByTestId('granule-filters__online-only').should('be.checked')
    })
  })

  describe('When the path is loaded with orbit number parameters', () => {
    it('loads with the online only checkbox checked', () => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 227

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&options%5Bspatial%5D%5Bor%5D=true&orbit_number%5Bmin%5D=30000&orbit_number%5Bmax%5D=30005&page_num=1&page_size=20')

        req.reply({
          body: orbitNumberGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

        req.reply({
          body: orbitNumberTimelineBody,
          headers: orbitNumberTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: orbitNumberGraphQlBody,
          headers: orbitNumberGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1214470488-ASF&pg[0][on][min]=30000&pg[0][on][max]=30005')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Orbit number fields are populated
      getByTestId('granule-filters__orbit-number-min').should('have.value', '30000')
      getByTestId('granule-filters__orbit-number-max').should('have.value', '30005')
    })
  })

  describe('When the path is loaded with equatorial crossing longitude parameters', () => {
    it('loads with the equatorial crossing longitude field populated', () => {
      const conceptId = 'C1251101828-GES_DISC'
      const cmrHits = 6078

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1251101828-GES_DISC&equator_crossing_longitude%5Bmin%5D=-5&equator_crossing_longitude%5Bmax%5D=5&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: equatorialCrossingLongitudeGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1251101828-GES_DISC')

        req.reply({
          body: equatorialCrossingLongitudeTimelineBody,
          headers: equatorialCrossingLongitudeTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: equatorialCrossingLongitudeGraphQlBody,
          headers: equatorialCrossingLongitudeGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1251101828-GES_DISC&pg[0][ecl][min]=-5&pg[0][ecl][max]=5')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Equatorial crossing longitude fields are populated
      getByTestId('granule-filters__equatorial-crossing-longitude-min').should('have.value', '-5')
      getByTestId('granule-filters__equatorial-crossing-longitude-max').should('have.value', '5')
    })
  })

  describe('When the path is loaded with equatorial crossing date parameters', () => {
    it('loads with the equatorial crossing date field populated', () => {
      const conceptId = 'C1251101828-GES_DISC'
      const cmrHits = 31

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1251101828-GES_DISC&equator_crossing_date=2021-01-01T00%3A00%3A00.000Z%2C2021-01-31T23%3A59%3A59.999Z&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: equatorialCrossingDateGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1251101828-GES_DISC')

        req.reply({
          body: equatorialCrossingDateTimelineBody,
          headers: equatorialCrossingDateTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: equatorialCrossingDateGraphQlBody,
          headers: equatorialCrossingDateGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1251101828-GES_DISC&pg[0][ecd]=2021-01-01T00%3A00%3A00.000Z%2C2021-01-31T23%3A59%3A59.999Z')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Equatorial crossing date fields are populated
      cy.get('#granule-filters__equatorial-crossing-date-selection__temporal-form__start-date').should('have.value', '2021-01-01 00:00:00')
      cy.get('#granule-filters__equatorial-crossing-date-selection__temporal-form__end-date').should('have.value', '2021-01-31 23:59:59')
    })
  })

  describe('When the path is loaded with a sort key parameter', () => {
    it('loads with the correct sort key selected', () => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1059866

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C1214470488-ASF&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&sort_key=-end_date')

        req.reply({
          body: sortKeyGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C1214470488-ASF')

        req.reply({
          body: sortKeyTimelineBody,
          headers: sortKeyTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: sortKeyGraphQlBody,
          headers: sortKeyGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1214470488-ASF&pg[0][gsk]=-end_date')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Correct sort key is selected
      getByTestId('panel-group-header-dropdown__sort__1').click()
      cy.get('.radio-setting-dropdown-item--is-active').should('have.text', 'End Date, Newest First')
    })
  })

  describe('When the path is loaded with a cloud cover parameter', () => {
    it('loads with the cloud cover fields populated', () => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 15600

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('cloud_cover=10%2C15&echo_collection_id=C194001210-LPDAAC_ECS&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: cloudCoverGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C194001210-LPDAAC_ECS')

        req.reply({
          body: cloudCoverTimelineBody,
          headers: cloudCoverTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: cloudCoverGraphQlBody,
          headers: cloudCoverGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C194001210-LPDAAC_ECS&pg[0][cc][min]=10&pg[0][cc][max]=15')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Cloud cover fields are populated
      getByTestId('granule-filters__cloud-cover-min').should('have.value', '10')
      getByTestId('granule-filters__cloud-cover-max').should('have.value', '15')
    })
  })

  describe('When the path is loaded with a day night flag parameter', () => {
    it('loads with the day/night field populated', () => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 275357

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('day_night_flag=BOTH&echo_collection_id=C194001210-LPDAAC_ECS&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: dayNightGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C194001210-LPDAAC_ECS')

        req.reply({
          body: dayNightTimelineBody,
          headers: dayNightTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: dayNightGraphQlBody,
          headers: dayNightGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C194001210-LPDAAC_ECS&pg[0][dnf]=BOTH')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Cloud cover fields are populated
      getByTestId('granule-filters__day-night-flag').should('have.value', 'BOTH')
    })
  })

  describe('When the path is loaded with a tiling system/grid coords parameter', () => {
    it('loads with the tiling system and grid coords populated', () => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 868

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C194001210-LPDAAC_ECS&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&two_d_coordinate_system%5Bname%5D=MODIS%20Tile%20SIN&two_d_coordinate_system%5Bcoordinates%5D=0-0%3A0-0%2C15-15%3A15-15')

        req.reply({
          body: gridCoordsGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C194001210-LPDAAC_ECS')

        req.reply({
          body: gridCoordsTimelineBody,
          headers: gridCoordsTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: gridCoordsGraphQlBody,
          headers: gridCoordsGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C194001210-LPDAAC_ECS&pg[0][ts]=MODIS%20Tile%20SIN&pg[0][gc]=0-0%3A0-0%2C15-15%3A15-15')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Cloud cover fields are populated
      getByTestId('granule-filters__tiling-system').should('have.value', 'MODIS Tile SIN')
      getByTestId('granule-filters__grid-coordinates').should('have.value', '0,0 15,15')
    })
  })

  describe('When the path is loaded with timeline parameters', () => {
    it('loads with the timeline in the correct position', () => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 317

      cy.intercept({
        method: 'POST',
        url: '**/search/collections.json'
      },
      (req) => {
        expect(req.body).to.eq('include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Copensearch.granule.osdd&options%5Bscience_keywords_h%5D%5Bor%5D=true&options%5Bspatial%5D%5Bor%5D=true&options%5Btemporal%5D%5Blimit_to_granules%5D=true&page_num=1&page_size=20&temporal=2015-01-03T00%3A00%3A00.000Z%2C2015-01-03T23%3A59%3A59.999Z&sort_key%5B%5D=has_granules_or_cwic&sort_key%5B%5D=-usage_score')

        req.reply({
          body: timelineCollectionsBody,
          headers: timelineCollectionsHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C194001210-LPDAAC_ECS&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&temporal=2015-01-03T00%3A00%3A00.000Z%2C2015-01-03T23%3A59%3A59.999Z')

        req.reply({
          body: timelineGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2015-02-02T00%3A00%3A00.000Z&interval=hour&start_date=2014-12-04T00%3A00%3A00.000Z&concept_id%5B%5D=C194001210-LPDAAC_ECS')

        req.reply({
          body: timelineTimelineBody,
          headers: timelineTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        expect(req.body).to.eq(graphQlGetCollection(conceptId))

        req.reply({
          body: timelineGraphQlBody,
          headers: timelineGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C194001210-LPDAAC_ECS&ot=2015-01-03T00%3A00%3A00.000Z%2C2015-01-03T23%3A59%3A59.999Z&tl=1420268129.401!2!1420243200!1420329599.999')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Timeline is correct
      // Zoom level
      cy.get('.edsc-timeline-tools > :nth-child(1)').should('have.text', 'Day')
      // Focused Date
      cy.get('.edsc-timeline-tools__section--horizontal').should('have.text', '03 Jan 2015')
      // Position
      cy.get('.edsc-timeline-interval__interval-section-label').contains('Jan 2015').should('be.visible')
    })
  })

  describe('When the path is loaded with a focused granule', () => {
    it('loads with the granule focused', () => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 275361

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C194001210-LPDAAC_ECS&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&sort_key=-start_date')

        req.reply({
          body: focusedGranuleGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C194001210-LPDAAC_ECS')

        req.reply({
          body: focusedGranuleTimelineBody,
          headers: focusedGranuleTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        // If these requests change and are failing tests, console.log req.body to see the actual request being called
        if (req.body === graphQlGetCollection(conceptId)) {
          req.alias = 'graphQlCollectionQuery'
          req.reply({
            body: focusedGranuleCollectionGraphQlBody,
            headers: focusedGranuleGraphQlHeaders
          })
        }
        if (req.body === '{"query":"\\n    query GetGranule(\\n      $id: String!\\n    ) {\\n      granule(\\n        conceptId: $id\\n      ) {\\n        granuleUr\\n        granuleSize\\n        title\\n        onlineAccessFlag\\n        dayNightFlag\\n        timeStart\\n        timeEnd\\n        dataCenter\\n        originalFormat\\n        conceptId\\n        collectionConceptId\\n        spatialExtent\\n        temporalExtent\\n        relatedUrls\\n        dataGranule\\n        measuredParameters\\n        providerDates\\n      }\\n    }","variables":{"id":"G2058417402-LPDAAC_ECS"}}') {
          req.alias = 'graphQlGranuleQuery'
          req.reply({
            body: focusedGranuleGranuleGraphQlBody,
            headers: focusedGranuleGraphQlHeaders
          })
        }
      })

      cy.visit('/search/granules?p=C194001210-LPDAAC_ECS&pg[0][gsk]=-start_date&g=G2058417402-LPDAAC_ECS')
      cy.wait('@graphQlCollectionQuery')
      cy.wait('@graphQlGranuleQuery')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Granule is focused
      cy.get('.granule-results-item--active').contains('MYD11A2.A2021137.h21v17.006.2021146041018.hdf').should('be.visible')
      // Browse image is open
      cy.get('.granule-image--is-open').should('be.visible')
    })
  })

  describe('When the path is loaded with a project granule', () => {
    it('loads with a single granule in the project', () => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 275361

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        if (req.body === 'echo_collection_id=C194001210-LPDAAC_ECS&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20') {
          req.alias = 'granulesQuery'
          req.reply({
            body: projectGranuleGranulesBody,
            headers: {
              ...commonGranulesHeaders,
              'cmr-hits': cmrHits.toString()
            }
          })
        }
        if (req.body === 'echo_collection_id=C194001210-LPDAAC_ECS&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20&concept_id%5B%5D=G2058417402-LPDAAC_ECS') {
          req.alias = 'projectGranulesQuery'
          req.reply({
            body: projectGranuleProjectGranuleBody,
            headers: {
              ...commonGranulesHeaders,
              'cmr-hits': '1'
            }
          })
        }
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C194001210-LPDAAC_ECS')

        req.reply({
          body: projectGranuleTimelineBody,
          headers: projectGranuleTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        // If these requests change and are failing tests, console.log req.body to see the actual request being called
        if (req.body === graphQlGetCollection(conceptId)) {
          req.alias = 'graphQlCollectionQuery'
          req.reply({
            body: projectGranuleCollectionGraphQlBody,
            headers: projectGranuleGraphQlHeaders
          })
        }
        if (req.body === graphQlGetCollections('C194001210-LPDAAC_ECS')) {
          req.alias = 'graphQlCollectionsQuery'
          req.reply({
            body: projectGranuleCollectionsGraphQlBody,
            headers: projectGranuleGraphQlHeaders
          })
        }
      })

      cy.visit('/search/granules?p=C194001210-LPDAAC_ECS!C194001210-LPDAAC_ECS&pg[1][a]=2058417402!LPDAAC_ECS')
      cy.wait('@graphQlCollectionQuery')
      cy.wait('@graphQlCollectionsQuery')
      cy.wait('@granulesQuery')
      cy.wait('@projectGranulesQuery')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Project count is correct
      getByTestId('granule-results-actions__proj-action--remove').should('be.visible')
      getByTestId('granule-results-actions__download-all-button').get('.button__badge').should('have.text', '1')
    })
  })

  describe('When the path is loaded with a project collection', () => {
    it('loads with all granules in the project', () => {
      const conceptId = 'C194001210-LPDAAC_ECS'
      const cmrHits = 275361

      interceptUnauthenticatedCollections(collectionsBody, collectionsHeaders)

      cy.intercept({
        method: 'POST',
        url: '**/search/granules.json'
      },
      (req) => {
        expect(req.body).to.eq('echo_collection_id=C194001210-LPDAAC_ECS&options%5Bspatial%5D%5Bor%5D=true&page_num=1&page_size=20')

        req.reply({
          body: projectCollectionGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/search/granules/timeline'
      },
      (req) => {
        expect(req.body).to.eq('end_date=2023-12-01T00%3A00%3A00.000Z&interval=day&start_date=2018-12-01T00%3A00%3A00.000Z&concept_id%5B%5D=C194001210-LPDAAC_ECS')

        req.reply({
          body: projectCollectionTimelineBody,
          headers: projectCollectionTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/api'
      },
      (req) => {
        // If these requests change and are failing tests, console.log req.body to see the actual request being called
        if (req.body === graphQlGetCollection(conceptId)) {
          req.alias = 'graphQlCollectionQuery'
          req.reply({
            body: projectCollectionCollectionGraphQlBody,
            headers: projectCollectionGraphQlHeaders
          })
        }
        if (req.body === graphQlGetCollections('C194001210-LPDAAC_ECS')) {
          req.alias = 'graphQlCollectionsQuery'
          req.reply({
            body: projectCollectionCollectionsGraphQlBody,
            headers: projectCollectionGraphQlHeaders
          })
        }
      })

      cy.visit('/search/granules?p=C194001210-LPDAAC_ECS!C194001210-LPDAAC_ECS')
      cy.wait('@graphQlCollectionQuery')
      cy.wait('@graphQlCollectionsQuery')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Project count is correct
      getByTestId('granule-results-actions__proj-action--remove').should('be.visible')
      getByTestId('granule-results-actions__download-all-button').get('.button__badge').should('have.text', `${commafy(cmrHits)}`)
    })
  })

  describe('When the path is loaded with a collection with an active subscription', () => {
    it('loads with the subscription indicator active', () => {
      const conceptId = 'C1214470488-ASF'
      const cmrHits = 1059170
      cy.login()

      cy.intercept({
        method: 'POST',
        url: '**/collections'
      },
      (req) => {
        expect(JSON.parse(req.body).params).to.eql({
          include_facets: 'v2',
          include_granule_counts: true,
          include_has_granules: true,
          include_tags: 'edsc.*,opensearch.granule.osdd',
          options: {
            science_keywords_h: {
              or: true
            },
            spatial: {
              or: true
            },
            temporal: {
              limit_to_granules: true
            }
          },
          page_num: 1,
          page_size: 20,
          point: ['-77.04119,38.80585'],
          service_type: [],
          sort_key: [
            'has_granules_or_cwic',
            '-usage_score'
          ],
          tag_key: []
        })

        req.reply({
          body: collectionsBody,
          headers: collectionsHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/granules'
      },
      (req) => {
        expect(JSON.parse(req.body).params).to.eql({
          echo_collection_id: 'C1214470488-ASF',
          options: {
            spatial: {
              or: true
            }
          },
          page_num: 1,
          page_size: 20,
          concept_id: [],
          point: ['-77.04119,38.80585'],
          exclude: {},
          sort_key: '-start_date',
          two_d_coordinate_system: {}
        })

        req.reply({
          body: subscriptionGranulesBody,
          headers: {
            ...commonGranulesHeaders,
            'cmr-hits': cmrHits.toString()
          }
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/timeline'
      },
      (req) => {
        expect(JSON.parse(req.body).params).to.eql({
          end_date: '2023-12-01T00:00:00.000Z',
          interval: 'day',
          start_date: '2018-12-01T00:00:00.000Z',
          concept_id: ['C1214470488-ASF']
        })

        req.reply({
          body: subscriptionTimelineBody,
          headers: subscriptionTimelineHeaders
        })
      })

      cy.intercept({
        method: 'POST',
        url: '**/graphql'
      },
      (req) => {
        expect(JSON.parse(req.body).data).to.eql(JSON.parse(graphQlGetCollection(conceptId)))

        req.reply({
          body: subscriptionGraphQlBody,
          headers: subscriptionGraphQlHeaders
        })
      })

      cy.visit('/search/granules?p=C1214470488-ASF&pg[0][gsk]=-start_date&sp[0]=-77.04119%2C38.80585')

      // Ensure the correct number of results were loaded
      testResultsSize(cmrHits)

      // Subscription button is active
      getByTestId('granule-results-actions__subscriptions-button').should('have.class', 'granule-results-actions__action--is-active')
    })
  })
})
