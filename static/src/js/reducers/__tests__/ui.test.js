import uiReducer from '../ui'
import {
  EXPORT_FINISHED,
  EXPORT_STARTED,
  RESTORE_FROM_URL,
  TOGGLE_ABOUT_CSDA_MODAL,
  TOGGLE_ABOUT_CWIC_MODAL,
  TOGGLE_ADVANCED_SEARCH_MODAL,
  TOGGLE_CHUNKED_ORDER_MODAL,
  TOGGLE_DEPRECATED_PARAMETER_MODAL,
  TOGGLE_DRAWING_NEW_LAYER,
  TOGGLE_EDIT_SUBSCRIPTION_MODAL,
  TOGGLE_KEYBOARD_SHORTCUTS_MODAL,
  TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  TOGGLE_RELATED_URLS_MODAL,
  TOGGLE_SECONDARY_OVERLAY_PANEL,
  TOGGLE_SHAPEFILE_UPLOAD_MODAL,
  TOGGLE_SPATIAL_POLYGON_WARNING,
  TOGGLE_TIMELINE,
  TOGGLE_TOO_MANY_POINTS_MODAL,
  TOGGLE_VIEW_ALL_FACETS_MODAL
} from '../../constants/actionTypes'

const initialState = {
  aboutCSDAModal: {
    isOpen: false
  },
  aboutCwicModal: {
    isOpen: false
  },
  advancedSearchModal: {
    isOpen: false
  },
  chunkedOrderModal: {
    isOpen: false
  },
  deprecatedParameterModal: {
    deprecatedUrlParams: [],
    isOpen: false
  },
  editSubscriptionModal: {
    isOpen: false,
    subscriptionConceptId: '',
    type: ''
  },
  export: {
    isExportRunning: {
      csv: false,
      json: false
    }
  },
  facetsModal: {
    isOpen: false
  },
  granuleResultsPanel: {
    searchValue: '',
    sortOrder: '-start_date'
  },
  keyboardShortcutsModal: {
    isOpen: false
  },
  map: {
    drawingNewLayer: false
  },
  overrideTemporalModal: {
    isOpen: false
  },
  relatedUrlsModal: {
    isOpen: false
  },
  secondaryOverlayPanel: {
    isOpen: false
  },
  shapefileUploadModal: {
    isOpen: false
  },
  spatialPolygonWarning: {
    isDisplayed: false
  },
  timeline: {
    isOpen: true
  },
  tooManyPointsModal: {
    isOpen: false
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(uiReducer(undefined, action)).toEqual(initialState)
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
})

describe('TOGGLE_DRAWING_NEW_LAYER', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_DRAWING_NEW_LAYER,
      payload: 'marker'
    }

    const expectedState = {
      ...initialState,
      map: { drawingNewLayer: 'marker' }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
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

describe('TOGGLE_SECONDARY_OVERLAY_PANEL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_SECONDARY_OVERLAY_PANEL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      secondaryOverlayPanel: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_ADVANCED_SEARCH_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_ADVANCED_SEARCH_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      advancedSearchModal: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_TOO_MANY_POINTS_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_TOO_MANY_POINTS_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      tooManyPointsModal: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_CHUNKED_ORDER_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_CHUNKED_ORDER_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      chunkedOrderModal: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_ABOUT_CSDA_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_ABOUT_CSDA_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      aboutCSDAModal: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_ABOUT_CWIC_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_ABOUT_CWIC_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      aboutCwicModal: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_SPATIAL_POLYGON_WARNING', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_SPATIAL_POLYGON_WARNING,
      payload: true
    }

    const expectedState = {
      ...initialState,
      spatialPolygonWarning: { isDisplayed: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_KEYBOARD_SHORTCUTS_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_KEYBOARD_SHORTCUTS_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      keyboardShortcutsModal: { isOpen: true }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_TIMELINE', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_TIMELINE,
      payload: false
    }

    const expectedState = {
      ...initialState,
      timeline: { isOpen: false }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_DEPRECATED_PARAMETER_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_DEPRECATED_PARAMETER_MODAL,
      payload: true
    }

    const expectedState = {
      ...initialState,
      deprecatedParameterModal: {
        deprecatedUrlParams: [],
        isOpen: true
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_EDIT_SUBSCRIPTION_MODAL', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_EDIT_SUBSCRIPTION_MODAL,
      payload: {
        isOpen: true,
        subscriptionConceptId: 'SUB1'
      }
    }

    const expectedState = {
      ...initialState,
      editSubscriptionModal: {
        isOpen: true,
        subscriptionConceptId: 'SUB1'
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('EXPORT_STARTED', () => {
  test('returns the correct state', () => {
    const action = {
      type: EXPORT_STARTED,
      payload: 'json'
    }

    const expectedState = {
      ...initialState,
      export: {
        isExportRunning: {
          csv: false,
          json: true
        }
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('EXPORT_FINISHED', () => {
  test('returns the correct state', () => {
    const action = {
      type: EXPORT_FINISHED,
      payload: 'json'
    }

    const initial = {
      ...initialState,
      export: {
        isExportRunning: {
          csv: false,
          json: true
        }
      }
    }

    const expectedState = {
      ...initialState,
      export: {
        isExportRunning: {
          csv: false,
          json: false
        }
      }
    }

    expect(uiReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        deprecatedUrlParams: ['m']
      }
    }

    const expectedState = {
      ...initialState,
      deprecatedParameterModal: {
        deprecatedUrlParams: ['m'],
        isOpen: true
      }
    }

    expect(uiReducer(undefined, action)).toEqual(expectedState)
  })
})
