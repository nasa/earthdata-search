import {
  getCollectionsQuery,
  getCollectionsQuerySpatial,
  getCollectionsQueryTemporal,
  getCollectionSubscriptionQueryObj,
  getCollectionSubscriptionQueryString,
  getFocusedCollectionGranuleQuery,
  getGranuleSubscriptionQueryObj,
  getGranuleSubscriptionQueryString,
  getNlpCollection,
  getNlpSpatialData,
  getNlpTemporalData,
  getSelectedRegionQuery
} from '../query'

import useEdscStore from '../../useEdscStore'

// @ts-expect-error: This file does not have types
import configureStore from '../../../store/configureStore'

import { initialState } from '../../slices/createQuerySlice'

// @ts-expect-error: This file does not have types
import { initialGranuleQuery } from '../../../util/url/collectionsEncoders'

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

  describe('getSelectedRegionQuery', () => {
    test('returns the selected region query', () => {
      const selectedRegionQuery = getSelectedRegionQuery(useEdscStore.getState())
      expect(selectedRegionQuery).toEqual(initialState.selectedRegion)
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
      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collectionId'
        },
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }))

      const granuleQuery = getFocusedCollectionGranuleQuery(useEdscStore.getState())
      expect(granuleQuery).toEqual(initialGranuleQuery)
    })

    test('returns an empty object when there is no focusedCollection', () => {
      const granuleQuery = getFocusedCollectionGranuleQuery(useEdscStore.getInitialState())
      expect(granuleQuery).toEqual({})
    })
  })

  describe('getGranuleSubscriptionQueryObj', () => {
    test('returns the granule subscription query object', () => {
      configureStore.mockReturnValue({
        getState: () => ({})
      })

      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collectionId',
          collectionMetadata: {
            collectionId: {
              id: 'collectionId'
            }
          }
        },
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  ...initialGranuleQuery,
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

      const granuleSubscriptionQuery = getGranuleSubscriptionQueryObj(useEdscStore.getState())
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
          subscriptions: {
            disabledFields: {
              granule: {}
            }
          }
        })
      })

      useEdscStore.setState(() => ({
        collection: {
          collectionId: 'collectionId',
          collectionMetadata: {
            collectionId: {
              id: 'collectionId'
            }
          }
        },
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  ...initialGranuleQuery,
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

      const granuleSubscriptionQuery = getGranuleSubscriptionQueryString(useEdscStore.getState())
      expect(granuleSubscriptionQuery).toEqual('browse_only=true&point=0,0')
    })
  })

  describe('getCollectionSubscriptionQueryObj', () => {
    test('returns the collection subscription query object', () => {
      configureStore.mockReturnValue({
        getState: () => ({
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
        collection: {
          collectionId: 'collectionId'
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
        collection: {
          collectionId: 'collectionId'
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

  describe('getNlpCollection', () => {
    test('returns the nlp collection when it exists', () => {
      useEdscStore.setState(() => ({
        query: {
          nlpCollection: {
            query: 'Texas',
            spatial: {
              geoJson: { type: 'Polygon' },
              geoLocation: 'Texas'
            }
          }
        }
      }))

      const nlpCollection = getNlpCollection(useEdscStore.getState())
      expect(nlpCollection).toEqual({
        query: 'Texas',
        spatial: {
          geoJson: { type: 'Polygon' },
          geoLocation: 'Texas'
        }
      })
    })

    test('returns null when nlp collection does not exist', () => {
      useEdscStore.setState(() => ({
        query: {}
      }))

      const nlpCollection = getNlpCollection(useEdscStore.getState())
      expect(nlpCollection).toBeNull()
    })

    test('returns null when query is undefined', () => {
      useEdscStore.setState(() => ({}))

      const nlpCollection = getNlpCollection(useEdscStore.getState())
      expect(nlpCollection).toBeNull()
    })
  })

  describe('getNlpSpatialData', () => {
    test('returns spatial data when nlp collection has spatial data', () => {
      useEdscStore.setState(() => ({
        query: {
          nlpCollection: {
            query: 'Texas',
            spatial: {
              geoJson: { type: 'Polygon' },
              geoLocation: 'Texas'
            }
          }
        }
      }))

      const spatialData = getNlpSpatialData(useEdscStore.getState())
      expect(spatialData).toEqual({
        geoJson: { type: 'Polygon' },
        geoLocation: 'Texas'
      })
    })

    test('returns null when nlp collection exists but has no spatial data', () => {
      useEdscStore.setState(() => ({
        query: {
          nlpCollection: {
            query: 'Texas'
          }
        }
      }))

      const spatialData = getNlpSpatialData(useEdscStore.getState())
      expect(spatialData).toBeNull()
    })

    test('returns null when nlp collection does not exist', () => {
      useEdscStore.setState(() => ({
        query: {}
      }))

      const spatialData = getNlpSpatialData(useEdscStore.getState())
      expect(spatialData).toBeNull()
    })
  })

  describe('getNlpTemporalData', () => {
    test('returns temporal data when nlp collection has temporal data', () => {
      useEdscStore.setState(() => ({
        query: {
          nlpCollection: {
            query: 'data from 2023',
            temporal: {
              startDate: '2023-01-01',
              endDate: '2023-12-31'
            }
          }
        }
      }))

      const temporalData = getNlpTemporalData(useEdscStore.getState())
      expect(temporalData).toEqual({
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      })
    })

    test('returns null when nlp collection exists but has no temporal data', () => {
      useEdscStore.setState(() => ({
        query: {
          nlpCollection: {
            query: 'some data'
          }
        }
      }))

      const temporalData = getNlpTemporalData(useEdscStore.getState())
      expect(temporalData).toBeNull()
    })

    test('returns null when nlp collection does not exist', () => {
      useEdscStore.setState(() => ({
        query: {}
      }))

      const temporalData = getNlpTemporalData(useEdscStore.getState())
      expect(temporalData).toBeNull()
    })
  })
})
