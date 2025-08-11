import {
  getCollectionsQuery,
  getCollectionsQuerySpatial,
  getCollectionsQueryTemporal,
  getCollectionSubscriptionQueryObj,
  getCollectionSubscriptionQueryString,
  getFocusedCollectionGranuleQuery,
  getGranuleSubscriptionQueryObj,
  getGranuleSubscriptionQueryString
} from '../query'

import useEdscStore from '../../useEdscStore'

// @ts-expect-error: This file does not have types
import configureStore from '../../../store/configureStore'

import { initialGranuleState, initialState } from '../../slices/createQuerySlice'

jest.mock('../../../store/configureStore', () => jest.fn())

describe('query selectors', () => {
  describe('getCollectionsQuery', () => {
    test('returns the collection query', () => {
      const collectionsQuery = getCollectionsQuery(useEdscStore.getState())
      expect(collectionsQuery).toEqual(initialState.collection)
    })
  })

  describe('getCollectionsQuerySpatial', () => {
    test('returns the collection spatial query', () => {
      const spatialQuery = getCollectionsQuerySpatial(useEdscStore.getState())
      expect(spatialQuery).toEqual({
        boundingBox: [],
        circle: [],
        line: [],
        point: [],
        polygon: []
      })
    })
  })

  describe('getCollectionsQueryTemporal', () => {
    test('returns the collection temporal query', () => {
      const temporalQuery = getCollectionsQueryTemporal(useEdscStore.getState())
      expect(temporalQuery).toEqual(initialState.collection.temporal)
    })
  })

  describe('getFocusedCollectionGranuleQuery', () => {
    test('returns the focused collection granule query', () => {
      configureStore.mockReturnValue({
        getState: () => ({
          focusedCollection: 'collectionId'
        })
      })

      useEdscStore.setState(() => ({
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: initialGranuleState
              }
            }
          }
        }
      }))

      const granuleQuery = getFocusedCollectionGranuleQuery(useEdscStore.getState())
      expect(granuleQuery).toEqual(initialGranuleState)
    })

    test('returns an empty object when there is no focusedCollection', () => {
      configureStore.mockReturnValue({
        getState: () => ({
          focusedCollection: 'collectionId'
        })
      })

      const granuleQuery = getFocusedCollectionGranuleQuery(useEdscStore.getState())
      expect(granuleQuery).toEqual({})
    })
  })

  describe('getGranuleSubscriptionQueryObj', () => {
    test('returns the granule subscription query object', () => {
      configureStore.mockReturnValue({
        getState: () => ({
          focusedCollection: 'collectionId',
          metadata: {
            collections: {
              collectionId: {
                id: 'collectionId'
              }
            }
          }
        })
      })

      useEdscStore.setState(() => ({
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  ...initialGranuleState,
                  browseOnly: true,
                  pageNum: 2,
                  sortKey: '-start_date'
                }
              }
            },
            spatial: {
              point: '0,0'
            }
          }
        }
      }))

      const granuleSubscriptionQuery = getGranuleSubscriptionQueryObj()
      expect(granuleSubscriptionQuery).toEqual({
        browseOnly: true,
        point: '0,0'
      })
    })
  })

  describe('getGranuleSubscriptionQueryString', () => {
    test('returns the granule subscription query string', () => {
      configureStore.mockReturnValue({
        getState: () => ({
          focusedCollection: 'collectionId',
          metadata: {
            collections: {
              collectionId: {
                id: 'collectionId'
              }
            }
          },
          subscriptions: {
            disabledFields: {
              granule: {}
            }
          }
        })
      })

      useEdscStore.setState(() => ({
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  ...initialGranuleState,
                  browseOnly: true,
                  pageNum: 2,
                  sortKey: '-start_date'
                }
              }
            },
            spatial: {
              point: '0,0'
            }
          }
        }
      }))

      const granuleSubscriptionQuery = getGranuleSubscriptionQueryString()
      expect(granuleSubscriptionQuery).toEqual('browse_only=true&point=0,0')
    })
  })

  describe('getCollectionSubscriptionQueryObj', () => {
    test('returns the collection subscription query object', () => {
      configureStore.mockReturnValue({
        getState: () => ({
          focusedCollection: 'collectionId',
          metadata: {
            collections: {
              collectionId: {
                id: 'collectionId'
              }
            }
          }
        })
      })

      useEdscStore.setState(() => ({
        facetParams: {
          featureFacets: {
            availableInEarthdataCloud: true,
            customizable: false,
            mapImagery: false
          },
          cmrFacets: {
            data_center_h: [
              'National Snow and Ice Data Center (NSIDC)'
            ]
          }
        },
        query: {
          collection: {
            hasGranulesOrCwic: true,
            keyword: 'modis',
            spatial: {
              point: '0,0'
            }
          }
        }
      }))

      const collectionSubscriptionQuery = getCollectionSubscriptionQueryObj()
      expect(collectionSubscriptionQuery).toEqual({
        cloudHosted: true,
        consortium: [],
        dataCenterH: ['National Snow and Ice Data Center (NSIDC)'],
        hasGranulesOrCwic: true,
        keyword: 'modis*',
        serviceType: [],
        point: '0,0',
        tagKey: []
      })
    })
  })

  describe('getCollectionSubscriptionQueryString', () => {
    test('returns the collection subscription query string', () => {
      configureStore.mockReturnValue({
        getState: () => ({
          focusedCollection: 'collectionId',
          metadata: {
            collections: {
              collectionId: {
                id: 'collectionId'
              }
            }
          },
          subscriptions: {
            disabledFields: {
              collection: {
                keyword: true
              }
            }
          }
        })
      })

      useEdscStore.setState(() => ({
        facetParams: {
          featureFacets: {
            availableInEarthdataCloud: true,
            customizable: false,
            mapImagery: false
          },
          cmrFacets: {
            data_center_h: [
              'National Snow and Ice Data Center (NSIDC)'
            ]
          }
        },
        query: {
          collection: {
            hasGranulesOrCwic: true,
            keyword: 'modis',
            spatial: {
              point: '0,0'
            }
          }
        }
      }))

      const collectionSubscriptionQuery = getCollectionSubscriptionQueryString()
      expect(collectionSubscriptionQuery).toEqual('cloud_hosted=true&has_granules_or_cwic=true&data_center_h[]=National Snow and Ice Data Center (NSIDC)&point=0,0')
    })
  })
})
