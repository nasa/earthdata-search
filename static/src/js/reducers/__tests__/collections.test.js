import collectionsReducer from '../collections'
import {
  UPDATE_COLLECTIONS,
  LOADING_COLLECTIONS,
  LOADED_COLLECTIONS
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

    expect(collectionsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_COLLECTIONS', () => {
  test('returns the correct state', () => {

    const action = {
      type: UPDATE_COLLECTIONS,
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

    expect(collectionsReducer(undefined, action)).toEqual(expectedState)
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

    expect(collectionsReducer(undefined, action)).toEqual(expectedState)
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

    expect(collectionsReducer(undefined, action)).toEqual(expectedState)
  })
})
