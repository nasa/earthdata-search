import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  toggleAboutCwicModal,
  toggleAdvancedSearchModal,
  toggleFacetsModal,
  toggleOverrideTemporalModal,
  toggleRelatedUrlsModal,
  toggleShapefileUploadModal,
  toggleTooManyPointsModal
} from '../ui'

import {
  TOGGLE_ABOUT_CWIC_MODAL,
  TOGGLE_ADVANCED_SEARCH_MODAL,
  TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  TOGGLE_RELATED_URLS_MODAL,
  TOGGLE_SHAPEFILE_UPLOAD_MODAL,
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
