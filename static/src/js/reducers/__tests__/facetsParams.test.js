import {
  cmrFacetsReducer,
  featureFacetsReducer,
  viewAllFacetsReducer
} from '../facetsParams'

import {
  COPY_CMR_FACETS_TO_VIEW_ALL,
  TOGGLE_VIEW_ALL_FACETS_MODAL,
  UPDATE_SELECTED_CMR_FACET,
  UPDATE_SELECTED_FEATURE_FACET,
  UPDATE_SELECTED_VIEW_ALL_FACET,
  RESTORE_FROM_URL,
  CLEAR_FILTERS,
  ADD_CMR_FACET,
  REMOVE_CMR_FACET
} from '../../constants/actionTypes'

describe('cmrFacetsReducer', () => {
  const initialState = {}
  describe('INITIAL_STATE', () => {
    test('is correct', () => {
      const action = { type: 'dummy_action' }

      expect(cmrFacetsReducer(undefined, action)).toEqual(initialState)
    })
  })

  describe('UPDATE_SELECTED_CMR_FACET', () => {
    test('returns the correct state', () => {
      const action = {
        type: UPDATE_SELECTED_CMR_FACET,
        payload: {
          science_keywords_h: [{
            topic: 'Argriculture'
          }]
        }
      }

      const expectedState = {
        ...initialState,
        science_keywords_h: [{
          topic: 'Argriculture'
        }]
      }

      expect(cmrFacetsReducer(undefined, action)).toEqual(expectedState)
    })
  })

  describe('RESTORE_FROM_URL', () => {
    test('returns the correct state', () => {
      const cmrFacets = {
        science_keywords_h: [{
          topic: 'Argriculture'
        }]
      }

      const action = {
        type: RESTORE_FROM_URL,
        payload: {
          cmrFacets
        }
      }

      const expectedState = cmrFacets

      expect(cmrFacetsReducer(undefined, action)).toEqual(expectedState)
    })
  })

  describe('ADD_CMR_FACET', () => {
    test('returns the correct state', () => {
      const action = {
        type: ADD_CMR_FACET,
        payload: {
          platform_h: 'Terra'
        }
      }

      const initial = initialState

      const expectedState = {
        ...initialState,
        platform_h: ['Terra']
      }

      expect(cmrFacetsReducer(initial, action)).toEqual(expectedState)
    })

    test('returns the correct state when the initial state already has the key', () => {
      const action = {
        type: ADD_CMR_FACET,
        payload: {
          platform_h: 'Terra'
        }
      }

      const initial = {
        ...initialState,
        platform_h: ['Aqua']
      }

      const expectedState = {
        ...initialState,
        platform_h: ['Aqua', 'Terra']
      }

      expect(cmrFacetsReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('REMOVE_CMR_FACET', () => {
    test('returns the correct state', () => {
      const action = {
        type: REMOVE_CMR_FACET,
        payload: {
          platform_h: 'Terra'
        }
      }

      const initial = {
        ...initialState,
        platform_h: ['Aqua', 'Terra']
      }

      const expectedState = {
        ...initialState,
        platform_h: ['Aqua']
      }

      expect(cmrFacetsReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('CLEAR_FILTERS', () => {
    test('returns the correct state', () => {
      const action = { type: CLEAR_FILTERS }

      expect(cmrFacetsReducer(undefined, action)).toEqual(initialState)
    })
  })
})

describe('featureFacetsReducer', () => {
  const initialState = {
    availableInEarthdataCloud: false,
    customizable: false,
    mapImagery: false,
    nearRealTime: false
  }

  describe('INITIAL_STATE', () => {
    test('is correct', () => {
      const action = { type: 'dummy_action' }

      expect(featureFacetsReducer(undefined, action)).toEqual(initialState)
    })
  })

  describe('UPDATE_SELECTED_FEATURE_FACET', () => {
    test('returns the correct state', () => {
      const action = {
        type: UPDATE_SELECTED_FEATURE_FACET,
        payload: {
          mapImagery: true
        }
      }

      const expectedState = {
        ...initialState,
        mapImagery: true
      }

      expect(featureFacetsReducer(undefined, action)).toEqual(expectedState)
    })
  })

  describe('RESTORE_FROM_URL', () => {
    test('returns the correct state', () => {
      const featureFacets = {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false,
        nearRealTime: false
      }

      const action = {
        type: RESTORE_FROM_URL,
        payload: {
          featureFacets
        }
      }

      const expectedState = featureFacets

      expect(featureFacetsReducer(undefined, action)).toEqual(expectedState)
    })
  })

  describe('CLEAR_FILTERS', () => {
    test('returns the correct state', () => {
      const action = { type: CLEAR_FILTERS }

      expect(featureFacetsReducer(undefined, action)).toEqual(initialState)
    })
  })
})

describe('viewAllFacetsReducer', () => {
  const initialState = {}

  describe('INITIAL_STATE', () => {
    test('is correct', () => {
      const action = { type: 'dummy_action' }

      expect(viewAllFacetsReducer(undefined, action)).toEqual(initialState)
    })
  })

  describe('UPDATE_SELECTED_VIEW_ALL_FACET', () => {
    test('returns the correct state', () => {
      const action = {
        type: UPDATE_SELECTED_VIEW_ALL_FACET,
        payload: {
          platform_h: ['Aqua']
        }
      }

      const expectedState = {
        ...initialState,
        platform_h: ['Aqua']
      }

      expect(viewAllFacetsReducer(undefined, action)).toEqual(expectedState)
    })
  })

  describe('TOGGLE_VIEW_ALL_FACETS_MODAL', () => {
    test('returns the correct state for true', () => {
      const initial = {
        platform_h: ['Aqua']
      }

      const action = {
        type: TOGGLE_VIEW_ALL_FACETS_MODAL,
        payload: true
      }

      expect(viewAllFacetsReducer(initial, action)).toEqual(initial)
    })

    test('returns the correct state for false', () => {
      const initial = {
        platform_h: ['Aqua']
      }

      const action = {
        type: TOGGLE_VIEW_ALL_FACETS_MODAL,
        payload: false
      }

      const expectedState = {
        ...initialState
      }

      expect(viewAllFacetsReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('COPY_CMR_FACETS_TO_VIEW_ALL', () => {
    test('returns the correct state', () => {
      const action = {
        type: COPY_CMR_FACETS_TO_VIEW_ALL,
        payload: {
          platform_h: ['Aqua']
        }
      }

      const expectedState = {
        ...initialState,
        platform_h: ['Aqua']
      }

      expect(viewAllFacetsReducer(undefined, action)).toEqual(expectedState)
    })
  })
})
