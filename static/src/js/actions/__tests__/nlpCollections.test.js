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

      nock(/localhost/)
        .post(/nlpSearch/)
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

      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledWith(1)
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

      nock(/localhost/)
        .post(/nlpSearch/)
        .reply(200, nlpResponse)

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('test search california'))

      // Verify spatial data store was updated with NLP spatial data
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

      nock(/localhost/)
        .post(/nlpSearch/)
        .reply(200, nlpResponse)

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('test search 2020'))

      // Verify temporal data was processed and changeQuery was called
      expect(mockZustandState.query.changeQuery).toHaveBeenCalledWith({
        collection: {
          temporal: expect.any(Object)
        },
        skipCollectionSearch: true
      })
    })

    test('should handle failed NLP search correctly', async () => {
      nock(/localhost/)
        .post(/nlpSearch/)
        .reply(500, { error: 'Server Error' })

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('test search'))

      const storeActions = store.getActions()

      expect(storeActions).toContainEqual({ type: ERRORED_FACETS })
      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledWith(1)
      expect(mockZustandState.collections.setCollectionsErrored).toHaveBeenCalled()
      expect(mockZustandState.query.clearNlpSearchCompleted).toHaveBeenCalled()
    })

    test('should handle empty NLP response', async () => {
      const nlpResponse = {
        metadata: {
          feed: {
            entry: []
          }
        }
      }

      nock(/localhost/)
        .post(/nlpSearch/)
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

      expect(mockZustandState.collections.setCollectionsLoading).toHaveBeenCalledWith(1)
      expect(mockZustandState.collections.setCollectionsLoaded).toHaveBeenCalledWith([], 0, 1)
    })
  })
})
