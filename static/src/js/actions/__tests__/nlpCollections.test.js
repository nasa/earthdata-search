import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import {
  getNlpCollections,
  updateFacets,
  onFacetsLoading,
  onFacetsLoaded,
  onFacetsErrored
} from '../nlpCollections'

import {
  ERRORED_FACETS,
  LOADED_FACETS,
  LOADING_FACETS,
  UPDATE_FACETS
} from '../../constants/actionTypes'

import useEdscStore from '../../zustand/useEdscStore'
import polygonWithManyPoints from './fixtures/polygonWithManyPoints.json'

const mockStore = configureMockStore([thunk])

const mockZustandState = {
  earthdataEnvironment: { currentEnvironment: 'prod' },
  shapefile: {
    isLoaded: false,
    isLoading: false,
    isErrored: false,
    shapefileName: '',
    selectedFeatures: [],
    updateShapefile: jest.fn()
  },
  collections: {
    collections: {
      count: 0,
      isLoaded: false,
      isLoading: false,
      loadTime: 0,
      items: []
    },
    setCollectionsLoading: jest.fn(),
    setCollectionsLoaded: jest.fn(),
    setCollectionsErrored: jest.fn()
  },
  query: {
    collection: {
      keyword: 'test search',
      pageNum: 1,
      temporal: {}
    },
    setNlpSearchCompleted: jest.fn(),
    clearNlpSearchCompleted: jest.fn(),
    changeQuery: jest.fn()
  }
}

jest.mock('../../zustand/useEdscStore', () => ({
  getState: jest.fn(() => mockZustandState)
}))

beforeEach(() => {
  jest.clearAllMocks()
  useEdscStore.getState.mockReturnValue(mockZustandState)
})

describe('nlpCollections action', () => {
  describe('action creators', () => {
    test('should create an action to update facets', () => {
      const payload = { facets: [] }
      const expectedAction = {
        type: UPDATE_FACETS,
        payload
      }

      expect(updateFacets(payload)).toEqual(expectedAction)
    })

    test('should create an action to indicate facets are loading', () => {
      const expectedAction = {
        type: LOADING_FACETS
      }

      expect(onFacetsLoading()).toEqual(expectedAction)
    })

    test('should create an action to indicate facets are loaded', () => {
      const payload = { loaded: true }
      const expectedAction = {
        type: LOADED_FACETS,
        payload
      }

      expect(onFacetsLoaded(payload)).toEqual(expectedAction)
    })

    test('should create an action to indicate facets errored', () => {
      const expectedAction = {
        type: ERRORED_FACETS
      }

      expect(onFacetsErrored()).toEqual(expectedAction)
    })
  })

  describe('getNlpCollections', () => {
    test('should update Zustand state and create facets actions on successful NLP search', async () => {
      const nlpResponse = {
        metadata: {
          feed: {
            entry: [
              {
                id: 'C1000000-EDSC',
                title: 'Test Collection'
              }
            ]
          }
        },
        queryInfo: {
          spatial: {
            type: 'Polygon',
            coordinates: [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]
          },
          temporal: {
            startDate: '2020-01-01T00:00:00.000Z',
            endDate: '2020-12-31T23:59:59.999Z'
          }
        }
      }

      nock(/cmr\.sit\.earthdata\.nasa\.gov/)
        .get(/search\/nlp\/query\.json/)
        .query(true)
        .reply(200, nlpResponse)

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('test search'))

      const storeActions = store.getActions()

      expect(storeActions).toContainEqual({ type: LOADING_FACETS })
      expect(storeActions).toContainEqual({
        type: LOADED_FACETS,
        payload: { loaded: true }
      })

      expect(storeActions).toContainEqual({
        type: UPDATE_FACETS,
        payload: {
          facets: [],
          hits: 1,
          keyword: 'test search',
          results: nlpResponse.metadata.feed.entry
        }
      })

      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
        nlpResponse.metadata.feed.entry,
        1,
        1
      )
    })

    test('should handle NLP search with spatial data', async () => {
      const nlpResponse = {
        metadata: {
          feed: {
            entry: [
              {
                id: 'C1000000-EDSC',
                title: 'Test Collection'
              }
            ]
          }
        },
        queryInfo: {
          spatial: {
            type: 'Polygon',
            coordinates: [[[-120, 30], [-110, 30], [-110, 40], [-120, 40], [-120, 30]]]
          }
        }
      }

      nock(/cmr\.sit\.earthdata\.nasa\.gov/)
        .get(/search\/nlp\/query\.json/)
        .query(true)
        .reply(200, nlpResponse)

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('test search california'))

      // Verify collections were loaded
      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
        nlpResponse.metadata.feed.entry,
        1,
        1
      )

      // Verify spatial data store was updated with NLP spatial data
      expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledTimes(1)
      expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledWith({
        file: {
          type: 'FeatureCollection',
          name: 'NLP Extracted Spatial Area',
          features: [{
            type: 'Feature',
            properties: {
              source: 'nlp',
              query: 'test search california',
              edscId: '0'
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-120, 30], [-110, 30], [-110, 40], [-120, 40], [-120, 30]]]
            }
          }]
        },
        shapefileName: 'NLP Spatial Area',
        selectedFeatures: ['0']
      })
    })

    test('should handle NLP search with temporal data', async () => {
      const nlpResponse = {
        metadata: {
          feed: {
            entry: [
              {
                id: 'C1000000-EDSC',
                title: 'Test Collection'
              }
            ]
          }
        },
        queryInfo: {
          temporal: {
            startDate: '2020-01-01T00:00:00.000Z',
            endDate: '2020-12-31T23:59:59.999Z'
          }
        }
      }

      nock(/cmr\.sit\.earthdata\.nasa\.gov/)
        .get(/search\/nlp\/query\.json/)
        .query(true)
        .reply(200, nlpResponse)

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('test search 2020'))

      // Verify collections were loaded
      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
        nlpResponse.metadata.feed.entry,
        1,
        1
      )

      // Verify temporal data was processed and changeQuery was called
      expect(mockZustandState.query.changeQuery).toHaveBeenCalledTimes(1)
      expect(mockZustandState.query.changeQuery).toHaveBeenCalledWith({
        collection: {
          temporal: expect.any(Object)
        },
        skipCollectionSearch: true
      })
    })

    test('should handle failed NLP search correctly', async () => {
      nock(/cmr\.sit\.earthdata\.nasa\.gov/)
        .get(/search\/nlp\/query\.json/)
        .query(true)
        .reply(500, { error: 'Server Error' })

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('test search'))

      const storeActions = store.getActions()

      expect(storeActions).toContainEqual({ type: ERRORED_FACETS })
      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsErrored).toHaveBeenCalledTimes(1)
      expect(mockZustandState.query.clearNlpSearchCompleted).toHaveBeenCalledTimes(1)
    })

    test('should handle empty NLP response', async () => {
      const nlpResponse = {
        metadata: {
          feed: {
            entry: []
          }
        }
      }

      nock(/cmr\.sit\.earthdata\.nasa\.gov/)
        .get(/search\/nlp\/query\.json/)
        .query(true)
        .reply(200, nlpResponse)

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('nonexistent search'))

      const storeActions = store.getActions()

      expect(storeActions).toContainEqual({
        type: UPDATE_FACETS,
        payload: {
          facets: [],
          hits: 0,
          keyword: 'nonexistent search',
          results: []
        }
      })

      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith([], 0, 1)
    })

    test('should handle CMR response format', async () => {
      const nlpResponse = {
        metadata: {
          feed: {
            entry: [{
              id: 'C1000000-EDSC',
              title: 'Test Collection'
            }]
          }
        },
        queryInfo: {
          spatial: {
            geoLocation: 'texas',
            geoJson: {
              type: 'Polygon',
              coordinates: [[[-120, 30], [-110, 30], [-110, 40], [-120, 40], [-120, 30]]]
            }
          }
        }
      }

      nock(/cmr\.sit\.earthdata\.nasa\.gov/)
        .get(/search\/nlp\/query\.json/)
        .query(true)
        .reply(200, nlpResponse)

      const store = mockStore({ authToken: '' })
      await store.dispatch(getNlpCollections('test search texas'))

      // Verify collections were loaded
      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
        nlpResponse.metadata.feed.entry,
        1,
        1
      )

      expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledTimes(1)
      expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledWith({
        file: {
          type: 'FeatureCollection',
          name: 'NLP Extracted Spatial Area',
          features: [{
            type: 'Feature',
            properties: {
              source: 'nlp',
              query: 'test search texas',
              edscId: '0'
            },
            geometry: {
              type: 'Polygon',
              coordinates: [[[-120, 30], [-110, 30], [-110, 40], [-120, 40], [-120, 30]]]
            }
          }]
        },
        selectedFeatures: ['0'],
        shapefileName: 'NLP Spatial Area'
      })
    })

    describe('geometry simplification', () => {
      test('should handle null geometry', async () => {
        const nlpResponse = {
          metadata: {
            feed: {
              entry: [{
                id: 'C1000000-EDSC',
                title: 'Test Collection'
              }]
            }
          },
          queryInfo: {
            spatial: null
          }
        }

        nock(/cmr\.sit\.earthdata\.nasa\.gov/)
          .get(/search\/nlp\/query\.json/)
          .query(true)
          .reply(200, nlpResponse)

        const store = mockStore({ authToken: '' })
        const initialCallCount = mockZustandState.shapefile.updateShapefile.mock.calls.length

        await store.dispatch(getNlpCollections('test search'))

        // Verify collections were loaded normally
        expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
          nlpResponse.metadata.feed.entry,
          1,
          1
        )

        // Null spatial data should not trigger updateShapefile call
        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledTimes(initialCallCount)
      })

      test('should handle Point geometry without modification', async () => {
        const nlpResponse = {
          metadata: {
            feed: {
              entry: [{
                id: 'C1000000-EDSC',
                title: 'Test Collection'
              }]
            }
          },
          queryInfo: {
            spatial: {
              type: 'Point',
              coordinates: [-120, 35]
            }
          }
        }

        nock(/cmr\.sit\.earthdata\.nasa\.gov/)
          .get(/search\/nlp\/query\.json/)
          .query(true)
          .reply(200, nlpResponse)

        const store = mockStore({ authToken: '' })
        await store.dispatch(getNlpCollections('test search point'))

        // Verify collections were loaded
        expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
          nlpResponse.metadata.feed.entry,
          1,
          1
        )

        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledTimes(1)
        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledWith({
          file: expect.objectContaining({
            features: [expect.objectContaining({
              geometry: {
                type: 'Point',
                coordinates: [-120, 35]
              }
            })]
          }),
          shapefileName: 'NLP Spatial Area',
          selectedFeatures: ['0']
        })
      })

      test('should handle LineString geometry', async () => {
        const nlpResponse = {
          metadata: {
            feed: {
              entry: [{
                id: 'C1000000-EDSC',
                title: 'Test Collection'
              }]
            }
          },
          queryInfo: {
            spatial: {
              type: 'LineString',
              coordinates: [[-120, 30], [-110, 35], [-100, 40]]
            }
          }
        }

        nock(/cmr\.sit\.earthdata\.nasa\.gov/)
          .get(/search\/nlp\/query\.json/)
          .query(true)
          .reply(200, nlpResponse)

        const store = mockStore({ authToken: '' })
        await store.dispatch(getNlpCollections('test search line'))

        // Verify collections were loaded
        expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
          nlpResponse.metadata.feed.entry,
          1,
          1
        )

        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledTimes(1)
        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledWith({
          file: expect.objectContaining({
            features: [expect.objectContaining({
              geometry: {
                type: 'LineString',
                coordinates: [[-120, 30], [-110, 35], [-100, 40]]
              }
            })]
          }),
          shapefileName: 'NLP Spatial Area',
          selectedFeatures: ['0']
        })
      })

      test('should simplify large polygon with many points', async () => {
        const largePolygonCoords = polygonWithManyPoints.coordinates

        const nlpResponse = {
          metadata: {
            feed: {
              entry: [{
                id: 'C1000000-EDSC',
                title: 'Test Collection'
              }]
            }
          },
          queryInfo: {
            spatial: {
              type: 'Polygon',
              coordinates: [largePolygonCoords]
            }
          }
        }

        nock(/cmr\.sit\.earthdata\.nasa\.gov/)
          .get(/search\/nlp\/query\.json/)
          .query(true)
          .reply(200, nlpResponse)

        const store = mockStore({ authToken: '' })
        await store.dispatch(getNlpCollections('test search large polygon'))

        // Verify collections were loaded
        expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
          nlpResponse.metadata.feed.entry,
          1,
          1
        )

        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledTimes(1)
        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledWith({
          file: expect.objectContaining({
            features: [expect.objectContaining({
              geometry: expect.objectContaining({
                type: 'Polygon',
                coordinates: expect.any(Array)
              })
            })]
          }),
          shapefileName: 'NLP Spatial Area',
          selectedFeatures: ['0']
        })
      })

      test('should fix clockwise polygon orientation', async () => {
        // Create a clockwise polygon (normally should be counter-clockwise)
        const clockwiseCoords = [
          [-120, 30], [-110, 30], [-110, 40], [-120, 40], [-120, 30]
        ]

        const nlpResponse = {
          metadata: {
            feed: {
              entry: [{
                id: 'C1000000-EDSC',
                title: 'Test Collection'
              }]
            }
          },
          queryInfo: {
            spatial: {
              type: 'Polygon',
              coordinates: [clockwiseCoords]
            }
          }
        }

        nock(/cmr\.sit\.earthdata\.nasa\.gov/)
          .get(/search\/nlp\/query\.json/)
          .query(true)
          .reply(200, nlpResponse)

        const store = mockStore({ authToken: '' })
        await store.dispatch(getNlpCollections('test search clockwise polygon'))

        // Verify collections were loaded
        expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledTimes(1)
        expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith(
          nlpResponse.metadata.feed.entry,
          1,
          1
        )

        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledTimes(1)
        expect(mockZustandState.shapefile.updateShapefile).toHaveBeenCalledWith({
          file: expect.objectContaining({
            features: [expect.objectContaining({
              geometry: expect.objectContaining({
                type: 'Polygon',
                coordinates: expect.any(Array)
              })
            })]
          }),
          shapefileName: 'NLP Spatial Area',
          selectedFeatures: ['0']
        })
      })
    })
  })
})
