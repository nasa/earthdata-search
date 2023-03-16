import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  toggleAboutCSDAModal,
  toggleAboutCwicModal,
  toggleAdvancedSearchModal,
  toggleChunkedOrderModal,
  toggleDeprecatedParameterModal,
  toggleDrawingNewLayer,
  toggleEditSubscriptionModal,
  toggleFacetsModal,
  toggleKeyboardShortcutsModal,
  toggleOverrideTemporalModal,
  togglePortalBrowserModal,
  toggleRelatedUrlsModal,
  toggleSecondaryOverlayPanel,
  toggleShapefileUploadModal,
  toggleSpatialPolygonWarning,
  toggleTimeline,
  toggleTooManyPointsModal
} from '../ui'

import {
  TOGGLE_ABOUT_CSDA_MODAL,
  TOGGLE_ABOUT_CWIC_MODAL,
  TOGGLE_ADVANCED_SEARCH_MODAL,
  TOGGLE_CHUNKED_ORDER_MODAL,
  TOGGLE_DEPRECATED_PARAMETER_MODAL,
  TOGGLE_DRAWING_NEW_LAYER,
  TOGGLE_EDIT_SUBSCRIPTION_MODAL,
  TOGGLE_KEYBOARD_SHORTCUTS_MODAL,
  TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  TOGGLE_PORTAL_BROWSER_MODAL,
  TOGGLE_RELATED_URLS_MODAL,
  TOGGLE_SECONDARY_OVERLAY_PANEL,
  TOGGLE_SHAPEFILE_UPLOAD_MODAL,
  TOGGLE_SPATIAL_POLYGON_WARNING,
  TOGGLE_TIMELINE,
  TOGGLE_TOO_MANY_POINTS_MODAL,
  TOGGLE_VIEW_ALL_FACETS_MODAL
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('toggleAboutCwicModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        aboutCwicModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleAboutCwicModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_ABOUT_CWIC_MODAL,
      payload: true
    })
  })
})

describe('toggleAdvancedSearchModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        advancedSearch: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleAdvancedSearchModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_ADVANCED_SEARCH_MODAL,
      payload: true
    })
  })
})

describe('toggleFacetsModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleFacetsModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_VIEW_ALL_FACETS_MODAL,
      payload: true
    })
  })
})

describe('toggleOverrideTemporalModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleOverrideTemporalModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_OVERRIDE_TEMPORAL_MODAL,
      payload: true
    })
  })
})

describe('toggleRelatedUrlsModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleRelatedUrlsModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_RELATED_URLS_MODAL,
      payload: true
    })
  })
})

describe('toggleShapefileUploadModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        shapefileUploadModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleShapefileUploadModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_SHAPEFILE_UPLOAD_MODAL,
      payload: true
    })
  })
})

describe('tooManyPointModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        tooManyPointsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleTooManyPointsModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_TOO_MANY_POINTS_MODAL,
      payload: true
    })
  })
})

describe('toggleKeyboardShortcutsModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        keyboardShortcutsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleKeyboardShortcutsModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_KEYBOARD_SHORTCUTS_MODAL,
      payload: true
    })
  })
})

describe('deprecatedParameterModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        deprecatedParameterModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleDeprecatedParameterModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_DEPRECATED_PARAMETER_MODAL,
      payload: true
    })
  })
})

describe('chunkedOrderModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        chunkedOrderModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleChunkedOrderModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_CHUNKED_ORDER_MODAL,
      payload: true
    })
  })
})

describe('toggleTimeline', () => {
  test('should create an action to toggle timeline', () => {
    const payload = false
    const expectedAction = {
      type: TOGGLE_TIMELINE,
      payload
    }
    expect(toggleTimeline(payload)).toEqual(expectedAction)
  })
})

describe('togglePortalBrowserModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(togglePortalBrowserModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_PORTAL_BROWSER_MODAL,
      payload: true
    })
  })
})

describe('toggleAboutCSDAModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleAboutCSDAModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_ABOUT_CSDA_MODAL,
      payload: true
    })
  })
})

describe('toggleDrawingNewLayer', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleDrawingNewLayer(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_DRAWING_NEW_LAYER,
      payload: true
    })
  })
})

describe('toggleEditSubscriptionModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleEditSubscriptionModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_EDIT_SUBSCRIPTION_MODAL,
      payload: true
    })
  })
})

describe('toggleSecondaryOverlayPanel', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleSecondaryOverlayPanel(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_SECONDARY_OVERLAY_PANEL,
      payload: true
    })
  })
})

describe('toggleSpatialPolygonWarning', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleSpatialPolygonWarning(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_SPATIAL_POLYGON_WARNING,
      payload: true
    })
  })
})
