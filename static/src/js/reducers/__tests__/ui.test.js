import uiReducer from '../ui'
import {
  MASTER_OVERLAY_PANEL_DRAG_END,
  MASTER_OVERLAY_PANEL_DRAG_START,
  MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
  MASTER_OVERLAY_PANEL_TOGGLE,
  GRANULE_RESULTS_PANEL_UPDATE_SORT_ORDER,
  GRANULE_RESULTS_PANEL_UPDATE_SEARCH_VALUE,
  TOGGLE_VIEW_ALL_FACETS_MODAL,
  TOGGLE_RELATED_URLS_MODAL,
  TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  TOGGLE_SHAPEFILE_UPLOAD_MODAL
} from '../../constants/actionTypes'

const initialState = {
  facetsModal: {
    isOpen: false
  },
  granuleResultsPanel: {
    sortOrder: '-start_date',
    searchValue: ''
  },
  grid: {
    selectingNewGrid: false
  },
  map: {
    drawingNewLayer: false
  },
  masterOverlayPanel: {
    clickStartHeight: undefined,
    clickStartY: undefined,
    dragging: false,
    height: 0,
    isOpen: true,
    previousHeight: 0
  },
  overrideTemporalModal: {
    isOpen: false
  },
  relatedUrlsModal: {
    isOpen: false
  },
  shapefileUploadModal: {
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
        height,
        previousHeight: height
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('MASTER_OVERLAY_PANEL_TOGGLE', () => {
  describe('when the panel is open', () => {
    test('returns the correct state', () => {
      const initial = {
        ...initialState,
        masterOverlayPanel: {
          ...initialState.masterOverlayPanel,
          height: 42,
          previousHeight: 42,
          isOpen: true
        }
      }

      const action = {
        type: MASTER_OVERLAY_PANEL_TOGGLE
      }

      const expectedState = {
        ...initialState,
        masterOverlayPanel: {
          ...initialState.masterOverlayPanel,
          height: 0,
          previousHeight: 42,
          isOpen: false
        }
      }

      expect(uiReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('when the panel is closed', () => {
    test('returns the correct state', () => {
      const initial = {
        ...initialState,
        masterOverlayPanel: {
          ...initialState.masterOverlayPanel,
          height: 0,
          previousHeight: 42,
          isOpen: false
        }
      }

      const action = {
        type: MASTER_OVERLAY_PANEL_TOGGLE
      }

      const expectedState = {
        ...initialState,
        masterOverlayPanel: {
          ...initialState.masterOverlayPanel,
          height: 42,
          previousHeight: 42,
          isOpen: true
        }
      }

      expect(uiReducer(initial, action)).toEqual(expectedState)
    })
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

describe('TOGGLE_OVERRIDE_TEMPORAL_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_OVERRIDE_TEMPORAL_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      overrideTemporalModal: { isOpen: true }
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

  describe('TOGGLE_SHAPEFILE_UPLOAD_MODAL', () => {
    test('returns the correct state', () => {
      const action = {
        type: TOGGLE_SHAPEFILE_UPLOAD_MODAL,
        payload: true
      }

      const expectedState = {
        ...initialState,
        shapefileUploadModal: { isOpen: true }
      }

      expect(uiReducer(undefined, action)).toEqual(expectedState)
    })
  })
})
