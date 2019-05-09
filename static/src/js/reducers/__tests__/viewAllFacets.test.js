import viewAllFacetsReducer from '../viewAllFacets'
import {
  LOADING_VIEW_ALL_FACETS,
  LOADED_VIEW_ALL_FACETS,
  UPDATE_VIEW_ALL_FACETS,
  TOGGLE_VIEW_ALL_FACETS_MODAL
} from '../../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {},
  hits: null,
  isLoaded: false,
  isLoading: false,
  selectedCategory: null
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(viewAllFacetsReducer(undefined, action)).toEqual(initialState)
  })
})

describe('LOADING_VIEW_ALL_FACETS', () => {
  test('returns the correct state when selected category is provided', () => {
    const action = {
      type: LOADING_VIEW_ALL_FACETS,
      payload: {
        selectedCategory: 'Test Category'
      }
    }

    const expectedState = {
      ...initialState,
      selectedCategory: 'Test Category',
      isLoading: true
    }

    expect(viewAllFacetsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('LOADING_VIEW_ALL_FACETS', () => {
  test('returns the correct state when selected category is not provided', () => {
    const action = {
      type: LOADING_VIEW_ALL_FACETS,
      payload: {
        selectedCategory: ''
      }
    }

    const startingState = {
      ...initialState,
      selectedCategory: 'Test Category'
    }

    const expectedState = {
      ...initialState,
      selectedCategory: 'Test Category',
      isLoading: true
    }

    expect(viewAllFacetsReducer(startingState, action)).toEqual(expectedState)
  })
})

describe('LOADED_VIEW_ALL_FACETS', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_VIEW_ALL_FACETS,
      payload: {
        loaded: true
      }
    }

    const expectedState = {
      ...initialState,
      isLoaded: true
    }

    expect(viewAllFacetsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('UPDATE_VIEW_ALL_FACETS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_VIEW_ALL_FACETS,
      payload: {
        facets: [
          {
            title: 'Test Category 1',
            children: [
              {
                title: 'Child 1'
              }
            ]
          },
          {
            title: 'Test Category 2',
            children: [
              {
                title: 'A Child 2',
                applied: true
              },
              {
                title: 'B Child 2',
                applied: false
              }
            ]
          }
        ],
        hits: 2,
        selectedCategory: 'Test Category 2'
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        'Test Category 2': {
          title: 'Test Category 2',
          totalSelected: 1,
          startingLetters: ['A', 'B'],
          children: [
            {
              title: 'A Child 2',
              applied: true
            },
            {
              title: 'B Child 2',
              applied: false
            }
          ]
        }
      },
      allIds: ['Test Category 2'],
      hits: 2
    }

    expect(viewAllFacetsReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_VIEW_ALL_FACETS_MODAL', () => {
  test('returns the correct state when false', () => {
    const action = {
      type: TOGGLE_VIEW_ALL_FACETS_MODAL,
      payload: false
    }

    const startingState = {
      ...initialState,
      byId: {
        'Test Category 2': {
          title: 'Test Category 2',
          totalSelected: 1,
          startingLetters: ['A', 'B'],
          children: [
            {
              title: 'A Child 2',
              applied: true
            },
            {
              title: 'B Child 2',
              applied: false
            }
          ]
        }
      },
      allIds: ['Test Category 2'],
      hits: 2
    }

    const expectedState = {
      ...initialState
    }

    expect(viewAllFacetsReducer(startingState, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_VIEW_ALL_FACETS_MODAL', () => {
  test('returns the correct state when not false', () => {
    const action = {
      type: TOGGLE_VIEW_ALL_FACETS_MODAL,
      payload: true
    }

    const startingState = {
      ...initialState,
      byId: {
        'Test Category 2': {
          title: 'Test Category 2',
          totalSelected: 1,
          startingLetters: ['A', 'B'],
          children: [
            {
              title: 'A Child 2',
              applied: true
            },
            {
              title: 'B Child 2',
              applied: false
            }
          ]
        }
      },
      allIds: ['Test Category 2'],
      hits: 2
    }

    const expectedState = {
      ...startingState
    }

    expect(viewAllFacetsReducer(startingState, action)).toEqual(expectedState)
  })
})
