import facetsReducer from '../facets'
import {
  LOADING_FACETS,
  LOADED_FACETS,
  UPDATE_FACETS
} from '../../constants/actionTypes'

const initialState = {
  byId: {},
  allIds: [],
  isLoading: false,
  isLoaded: false
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(facetsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('UPDATE_FACETS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_FACETS,
      payload: {
        facets: [{
          title: 'Keywords',
          children: {
            title: 'Keyword facet'
          }
        }],
        hits: 0,
        keyword: 'search keyword'
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['Keywords'],
      byId: {
        Keywords: {
          title: 'Keywords',
          children: {
            title: 'Keyword facet'
          },
          totalSelected: 0
        }
      }
    }

    expect(facetsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADING_FACETS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADING_FACETS
    }

    const expectedState = {
      ...initialState,
      isLoading: true,
      isLoaded: false
    }

    expect(facetsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADED_FACETS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_FACETS,
      payload: {
        loaded: true
      }
    }

    const expectedState = {
      ...initialState,
      isLoading: false,
      isLoaded: true
    }

    expect(facetsReducer(undefined, action)).toEqual(expectedState)
  })
})
