import collectionsResultsReducer from '../collectionsResults'
import {
  ADD_MORE_COLLECTION_RESULTS,
  FINISHED_COLLECTIONS_TIMER,
  LOADED_COLLECTIONS,
  LOADING_COLLECTIONS,
  STARTED_COLLECTIONS_TIMER,
  UPDATE_COLLECTION_RESULTS
} from '../../constants/actionTypes'

const initialState = {
  keyword: false,
  hits: null,
  byId: {},
  allIds: [],
  isLoading: false,
  isLoaded: false,
  loadTime: 0,
  timerStart: null
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(collectionsResultsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('STARTED_COLLECTIONS_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: STARTED_COLLECTIONS_TIMER
    }

    // Mock current time to equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 5)

    const expectedState = {
      ...initialState,
      timerStart: 5
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('FINISHED_COLLECTIONS_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: FINISHED_COLLECTIONS_TIMER
    }

    // Set current time to 10, and future time to 15
    // Load time will equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 15)

    const start = 10

    const expectedState = {
      ...initialState,
      timerStart: null,
      loadTime: 5
    }

    expect(collectionsResultsReducer({ ...initialState, timerStart: start }, action))
      .toEqual(expectedState)
  })
})

describe('UPDATE_COLLECTION_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_COLLECTION_RESULTS,
      payload: {
        results: [{
          id: 'mockCollectionId',
          mockCollectionData: 'goes here'
        }],
        hits: 0,
        keyword: 'search keyword'
      }
    }

    const expectedState = {
      ...initialState,
      keyword: 'search keyword',
      hits: 0,
      allIds: ['mockCollectionId'],
      byId: {
        mockCollectionId: {
          id: 'mockCollectionId',
          mockCollectionData: 'goes here'
        }
      }
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('ADD_MORE_COLLECTION_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: ADD_MORE_COLLECTION_RESULTS,
      payload: {
        results: [{
          id: 'mockCollectionId2',
          mockCollectionData: 'goes here 2'
        }],
        hits: 0,
        keyword: 'search keyword'
      }
    }

    const initial = {
      ...initialState,
      allIds: ['mockCollectionId1'],
      byId: {
        mockCollectionId1: {
          id: 'mockCollectionId1',
          mockCollectionData: 'goes here 1'
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['mockCollectionId1', 'mockCollectionId2'],
      byId: {
        mockCollectionId1: {
          id: 'mockCollectionId1',
          mockCollectionData: 'goes here 1'
        },
        mockCollectionId2: {
          id: 'mockCollectionId2',
          mockCollectionData: 'goes here 2'
        }
      }
    }

    expect(collectionsResultsReducer(initial, action)).toEqual(expectedState)
  })
})

describe('LOADING_COLLECTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADING_COLLECTIONS
    }

    const expectedState = {
      ...initialState,
      isLoading: true,
      isLoaded: false
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADED_COLLECTIONS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_COLLECTIONS,
      payload: {
        loaded: true
      }
    }

    const expectedState = {
      ...initialState,
      isLoading: false,
      isLoaded: true
    }

    expect(collectionsResultsReducer(undefined, action)).toEqual(expectedState)
  })
})
