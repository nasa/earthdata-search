import granulesReducer from '../granules'
import {
  ADD_MORE_GRANULES,
  FINISHED_GRANULES_TIMER,
  LOADED_GRANULES,
  LOADING_GRANULES,
  STARTED_GRANULES_TIMER,
  UPDATE_GRANULES,
  ADD_GRANULES_FROM_COLLECTIONS
} from '../../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  hits: null,
  isCwic: null,
  isLoaded: false,
  isLoading: false,
  loadTime: 0,
  timerStart: null
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(granulesReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_GRANULES,
      payload: {
        results: [{
          id: 'mockGranuleId',
          mockGranuleData: 'goes here'
        }],
        hits: null,
        keyword: 'search keyword',
        isCwic: true
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['mockGranuleId'],
      byId: {
        mockGranuleId: {
          id: 'mockGranuleId',
          mockGranuleData: 'goes here'
        }
      },
      isCwic: true
    }

    expect(granulesReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('ADD_MORE_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: ADD_MORE_GRANULES,
      payload: {
        results: [{
          id: 'mockCollectionId2',
          mockGranuleData: 'goes here 2'
        }],
        hits: 0,
        keyword: 'search keyword'
      }
    }

    const initial = {
      ...initialState,
      allIds: ['mockGranuleId1'],
      byId: {
        mockGranuleId1: {
          id: 'mockGranuleId1',
          mockGranuleData: 'goes here 1'
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['mockGranuleId1', 'mockCollectionId2'],
      byId: {
        mockGranuleId1: {
          id: 'mockGranuleId1',
          mockGranuleData: 'goes here 1'
        },
        mockCollectionId2: {
          id: 'mockCollectionId2',
          mockGranuleData: 'goes here 2'
        }
      }
    }

    expect(granulesReducer(initial, action)).toEqual(expectedState)
  })
})

describe('LOADING_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADING_GRANULES
    }

    const expectedState = {
      ...initialState,
      isLoading: true,
      isLoaded: false
    }

    expect(granulesReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADED_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_GRANULES,
      payload: {
        loaded: true
      }
    }

    const expectedState = {
      ...initialState,
      isLoading: false,
      isLoaded: true
    }

    expect(granulesReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('STARTED_GRANULES_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: STARTED_GRANULES_TIMER
    }

    // Mock current time to equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 5)

    const expectedState = {
      ...initialState,
      timerStart: 5
    }

    expect(granulesReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('FINISHED_GRANULES_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: FINISHED_GRANULES_TIMER
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

    expect(granulesReducer({ ...initialState, timerStart: start }, action)).toEqual(expectedState)
  })
})

describe('ADD_GRANULES_FROM_COLLECTIONS', () => {
  test('returns the correct state', () => {
    const payload = {
      allIds: ['granule1'],
      byId: {
        granule1: { mock: 'data' }
      },
      isCwic: false,
      hits: 1
    }
    const action = {
      type: ADD_GRANULES_FROM_COLLECTIONS,
      payload
    }

    const expectedState = {
      ...initialState,
      ...payload,
      isLoaded: true
    }

    expect(granulesReducer(undefined, action)).toEqual(expectedState)
  })
})
