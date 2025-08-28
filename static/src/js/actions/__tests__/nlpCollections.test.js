import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import {
  getNlpCollections,
  addMoreCollectionResults,
  updateCollectionResults,
  updateCollectionMetadata,
  onCollectionsLoading,
  onCollectionsLoaded,
  onCollectionsErrored,
  updateFacets,
  onFacetsLoading,
  onFacetsLoaded,
  onFacetsErrored,
  startCollectionsTimer,
  finishCollectionsTimer
} from '../nlpCollections'

import {
  ADD_MORE_COLLECTION_RESULTS,
  ERRORED_COLLECTIONS,
  ERRORED_FACETS,
  FINISHED_COLLECTIONS_TIMER,
  LOADED_COLLECTIONS,
  LOADED_FACETS,
  LOADING_COLLECTIONS,
  LOADING_FACETS,
  STARTED_COLLECTIONS_TIMER,
  UPDATE_COLLECTION_METADATA,
  UPDATE_COLLECTION_RESULTS,
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
    selectedFeatures: []
  },
  query: {
    collection: {
      keyword: 'test search',
      pageNum: 1,
      temporal: {}
    },
    setNlpSearchCompleted: jest.fn(),
    clearNlpSearchCompleted: jest.fn()
  }
}

const mockSetState = jest.fn()

jest.mock('../../zustand/useEdscStore', () => ({
  getState: jest.fn(() => mockZustandState),
  setState: jest.fn()
}))

beforeEach(() => {
  jest.clearAllMocks()
  useEdscStore.getState.mockReturnValue(mockZustandState)
  useEdscStore.setState.mockImplementation(mockSetState)
})

describe('nlpCollections action', () => {
  describe('action creators', () => {
    test('should create an action to add more collection results', () => {
      const payload = { results: [] }
      const expectedAction = {
        type: ADD_MORE_COLLECTION_RESULTS,
        payload
      }

      expect(addMoreCollectionResults(payload)).toEqual(expectedAction)
    })

    test('should create an action to update collection results', () => {
      const payload = { results: [] }
      const expectedAction = {
        type: UPDATE_COLLECTION_RESULTS,
        payload
      }

      expect(updateCollectionResults(payload)).toEqual(expectedAction)
    })

    test('should create an action to update collection metadata', () => {
      const payload = []
      const expectedAction = {
        type: UPDATE_COLLECTION_METADATA,
        payload
      }

      expect(updateCollectionMetadata(payload)).toEqual(expectedAction)
    })

    test('should create an action to indicate collections are loading', () => {
      const expectedAction = {
        type: LOADING_COLLECTIONS
      }

      expect(onCollectionsLoading()).toEqual(expectedAction)
    })

    test('should create an action to indicate collections are loaded', () => {
      const payload = { loaded: true }
      const expectedAction = {
        type: LOADED_COLLECTIONS,
        payload
      }

      expect(onCollectionsLoaded(payload)).toEqual(expectedAction)
    })

    test('should create an action to indicate collections errored', () => {
      const expectedAction = {
        type: ERRORED_COLLECTIONS
      }

      expect(onCollectionsErrored()).toEqual(expectedAction)
    })

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

    test('should create an action to start the collections timer', () => {
      const expectedAction = {
        type: STARTED_COLLECTIONS_TIMER
      }

      expect(startCollectionsTimer()).toEqual(expectedAction)
    })

    test('should create an action to finish the collections timer', () => {
      const expectedAction = {
        type: FINISHED_COLLECTIONS_TIMER
      }

      expect(finishCollectionsTimer()).toEqual(expectedAction)
    })
  })

  describe('getNlpCollections', () => {
    test('should create the correct actions on successful NLP search', async () => {
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

      expect(storeActions[0]).toEqual({
        type: UPDATE_COLLECTION_RESULTS,
        payload: { results: [] }
      })

      expect(storeActions[1]).toEqual({ type: LOADING_COLLECTIONS })
      expect(storeActions[2]).toEqual({ type: LOADING_FACETS })
      expect(storeActions[3]).toEqual({ type: STARTED_COLLECTIONS_TIMER })
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
      expect(mockSetState).toHaveBeenCalledWith(expect.any(Function))

      const setStateCall = mockSetState.mock.calls[0][0]
      const updatedState = setStateCall(mockZustandState)
      expect(updatedState.shapefile.file).toEqual({
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
      })

      expect(updatedState.shapefile.isLoaded).toBe(true)

      expect(updatedState.shapefile.shapefileName).toBe('NLP Spatial Area')
      expect(updatedState.shapefile.selectedFeatures).toEqual(['0'])
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

      // Verify temporal data was processed and state updated
      expect(mockSetState).toHaveBeenCalledWith(expect.any(Function))

      const temporalUpdateCall = mockSetState.mock.calls.find((call) => {
        const updatedState = call[0](mockZustandState)

        return (
          updatedState.query
          && updatedState.query.collection
          && updatedState.query.collection.temporal
        )
      })

      expect(temporalUpdateCall).toBeDefined()
    })

    test('should create the correct actions on failed NLP search', async () => {
      nock(/localhost/)
        .post(/nlpSearch/)
        .reply(500, { error: 'Server Error' })

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getNlpCollections('test search'))

      const storeActions = store.getActions()

      expect(storeActions).toContainEqual({ type: ERRORED_COLLECTIONS })
      expect(storeActions).toContainEqual({ type: ERRORED_FACETS })
      expect(storeActions).toContainEqual({ type: FINISHED_COLLECTIONS_TIMER })
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
        type: UPDATE_COLLECTION_RESULTS,
        payload: {
          facets: [],
          hits: 0,
          keyword: 'nonexistent search',
          results: []
        }
      })
    })
  })
})
