import {
  buildCollectionSearchParams,
  prepareCollectionParams,
  translateDefaultCollectionSortKey
} from '../collections'
import { collectionSortKeys } from '../../constants/collectionSortKeys'
import * as getApplicationConfig from '../../../../../sharedUtils/config'

describe('#translateDefaultCollectionSortKey', () => {
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      collectionSearchResultsSortKey: collectionSortKeys.usageDescending
    }))
  })

  test('returns default value of collectionSortKeys.usageDescending when sortKey is set to default', () => {
    expect(translateDefaultCollectionSortKey('default')).toEqual(collectionSortKeys.usageDescending)
  })

  test('returns default value of collectionSortKeys.usageDescending when sortKey undefined', () => {
    expect(translateDefaultCollectionSortKey(undefined)).toEqual(collectionSortKeys.usageDescending)
  })

  test('returns the sortKey as is when it is not set to default', () => {
    const { scoreDescending } = collectionSortKeys
    expect(translateDefaultCollectionSortKey(scoreDescending)).toEqual(scoreDescending)
  })
})

describe('#prepareCollectionParams', () => {
  describe('when the customize facet is selected', () => {
    test('includes the correct serviceType', () => {
      const params = prepareCollectionParams({
        facetsParams: {
          feature: {
            customizable: true
          }
        }
      })

      expect(params).toEqual(
        expect.objectContaining({
          serviceType: [
            'esi',
            'opendap',
            'harmony'
          ]
        })
      )
    })
  })

  describe('when paramCollectionSortKey is populated', () => {
    test('includes the correct SortKey', () => {
      const params = prepareCollectionParams({
        query: {
          collection: {
            paramCollectionSortKey: collectionSortKeys.startDateAscending
          }
        }
      })

      expect(params).toEqual(
        expect.objectContaining({
          sortKey: [collectionSortKeys.startDateAscending]
        })
      )
    })
  })

  describe('when paramCollectionSortKey is not populated', () => {
    test('includes the User Preferences Sort Key', () => {
      const params = prepareCollectionParams({
        preferences: {
          preferences: {
            collectionSort: collectionSortKeys.endDateDescending
          }
        }
      })

      expect(params).toEqual(
        expect.objectContaining({
          sortKey: [collectionSortKeys.endDateDescending]
        })
      )
    })
  })

  describe('when paramCollectionSortKey and preferences is not populated', () => {
    test('includes the Default Sort Key', () => {
      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        collectionSearchResultsSortKey: collectionSortKeys.usageDescending
      }))

      const params = prepareCollectionParams({})

      expect(params).toEqual(
        expect.objectContaining({
          sortKey: [collectionSortKeys.usageDescending]
        })
      )
    })
  })
})

describe('#buildCollectionSearchParams', () => {
  describe('when the keyword does not have a quoted string', () => {
    test('the wildcard character is added between words', () => {
      const params = buildCollectionSearchParams({
        featureFacets: {},
        keyword: 'modis terra',
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        keyword: 'modis* terra*'
      }))
    })
  })

  describe('when the keyword has a quoted string', () => {
    test('the wildcard character is not added between words', () => {
      const params = buildCollectionSearchParams({
        featureFacets: {},
        keyword: '"modis" terra',
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        keyword: '"modis" terra'
      }))
    })
  })

  describe('options parameter', () => {
    test('adds correct options when multiple science keywords facets exist', () => {
      const params = buildCollectionSearchParams({
        cmrFacets: {
          science_keywords_h: [{
            topic: 'Agriculture'
          }, {
            topic: 'Atmosphere'
          }]
        },
        featureFacets: {},
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          science_keywords_h: {
            or: true
          }
        }
      }))
    })

    test('adds correct options when multiple platforms facets exist', () => {
      const params = buildCollectionSearchParams({
        cmrFacets: {
          platforms_h: [{
            basis: 'Space-based Platforms'
          }, {
            basis: 'Air-based Platforms'
          }]
        },
        featureFacets: {},
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          platforms_h: {
            or: true
          }
        }
      }))
    })

    test('adds correct options when multiple spatial exists', () => {
      const params = buildCollectionSearchParams({
        point: [
          38.8048355,
          -77.0469214
        ],
        bounding_box: [
          -77.0372879,
          -77.144359,
          38.845011,
          38.785216
        ],
        featureFacets: {},
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          spatial: {
            or: true
          }
        }
      }))
    })

    test('adds correct options when temporal exists', () => {
      const params = buildCollectionSearchParams({
        temporalString: '2022-01-01T00:00:00.000Z,2022-01-31T23:59:59.999Z',
        featureFacets: {},
        sortKey: [],
        viewAllFacets: {}
      })

      expect(params).toEqual(expect.objectContaining({
        options: {
          temporal: {
            limit_to_granules: true
          }
        }
      }))
    })
  })
})
