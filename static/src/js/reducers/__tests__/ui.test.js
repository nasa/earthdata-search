import uiReducer from '../ui'
import {
  MASTER_OVERLAY_PANEL_DRAG_END,
  MASTER_OVERLAY_PANEL_DRAG_START,
  MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
  GRANULE_RESULTS_PANEL_UPDATE_SORT_ORDER,
  GRANULE_RESULTS_PANEL_UPDATE_SEARCH_VALUE,
  TOGGLE_VIEW_ALL_FACETS_MODAL,
  TOGGLE_RELATED_URLS_MODAL
} from '../../constants/actionTypes'

const initialState = {
  masterOverlayPanel: {
    clickStartHeight: undefined,
    clickStartY: undefined,
    dragging: false,
    height: 0
  },
  granuleResultsPanel: {
    sortOrder: '-start_date',
    searchValue: ''
  },
  facetsModal: {
    isOpen: false
  },
  relatedUrlsModal: {
    isOpen: false
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(uiReducer(undefined, action)).toEqual(initialState)
  })
})

describe('MASTER_OVERLAY_PANEL_DRAG_END', () => {
  test('returns the correct state', () => {
    const action = {
      type: MASTER_OVERLAY_PANEL_DRAG_END
    }

    const expectedState = {
      ...initialState,
      masterOverlayPanel: {
        ...initialState.masterOverlayPanel,
        clickStartHeight: undefined,
        clickStartY: undefined,
        dragging: false
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('MASTER_OVERLAY_PANEL_DRAG_START', () => {
  test('returns the correct state', () => {
    const payload = {
      clickStartHeight: 123,
      clickStartY: 456
    }
    const action = {
      type: MASTER_OVERLAY_PANEL_DRAG_START,
      payload
    }

    const expectedState = {
      ...initialState,
      masterOverlayPanel: {
        ...initialState.masterOverlayPanel,
        clickStartHeight: payload.clickStartHeight,
        clickStartY: payload.clickStartY,
        dragging: true
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('MASTER_OVERLAY_PANEL_UPDATE_RESIZE', () => {
  test('returns the correct state', () => {
    const height = 42
    const action = {
      type: MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
      payload: height
    }

    const expectedState = {
      ...initialState,
      masterOverlayPanel: {
        ...initialState.masterOverlayPanel,
        height
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('GRANULE_RESULTS_PANEL_UPDATE_SORT_ORDER', () => {
  test('returns the correct state', () => {
    const sortOrder = 'sort order'
    const action = {
      type: GRANULE_RESULTS_PANEL_UPDATE_SORT_ORDER,
      payload: sortOrder
    }

    const expectedState = {
      ...initialState,
      granuleResultsPanel: {
        ...initialState.granuleResultsPanel,
        sortOrder
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('GRANULE_RESULTS_PANEL_UPDATE_SEARCH_VALUE', () => {
  test('returns the correct state', () => {
    const searchValue = 'new search value'
    const action = {
      type: GRANULE_RESULTS_PANEL_UPDATE_SEARCH_VALUE,
      payload: searchValue
    }

    const expectedState = {
      ...initialState,
      granuleResultsPanel: {
        ...initialState.granuleResultsPanel,
        searchValue
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_VIEW_ALL_FACETS_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_VIEW_ALL_FACETS_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      facetsModal: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_RELATED_URLS_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_RELATED_URLS_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      relatedUrlsModal: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})
