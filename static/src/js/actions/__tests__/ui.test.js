import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  masterOverlayPanelDragStart,
  masterOverlayPanelDragEnd,
  masterOverlayPanelResize,
  granuleResultsPanelUpdateSortOrder,
  granuleResultsPanelUpdateSearchValue,
  toggleFacetsModal
} from '../ui'

import {
  MASTER_OVERLAY_PANEL_DRAG_END,
  MASTER_OVERLAY_PANEL_DRAG_START,
  MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
  GRANULE_RESULTS_PANEL_UPDATE_SORT_ORDER,
  GRANULE_RESULTS_PANEL_UPDATE_SEARCH_VALUE,
  TOGGLE_VIEW_ALL_FACETS_MODAL
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('masterOverlayPanelDragStart', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        masterOverlayPanel: {
          dragging: false,
          height: 350
        }
      }
    })

    const payload = ['test payload']
    store.dispatch(masterOverlayPanelDragStart(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: MASTER_OVERLAY_PANEL_DRAG_START,
      payload: ['test payload']
    })
  })
})

describe('masterOverlayPanelDragEnd', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        masterOverlayPanel: {
          dragging: false,
          height: 350
        }
      }
    })

    store.dispatch(masterOverlayPanelDragEnd())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: MASTER_OVERLAY_PANEL_DRAG_END
    })
  })
})

describe('masterOverlayPanelResize', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        masterOverlayPanel: {
          dragging: false,
          height: 350
        }
      }
    })

    const payload = 100
    store.dispatch(masterOverlayPanelResize(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
      payload: 100
    })
  })
})

describe('granuleResultsPanelUpdateSortOrder', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        granuleResultsPanel: {
          sortOrder: '-start_date',
          searchValue: ''
        }
      }
    })

    const payload = ['new sort order']
    store.dispatch(granuleResultsPanelUpdateSortOrder(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: GRANULE_RESULTS_PANEL_UPDATE_SORT_ORDER,
      payload: ['new sort order']
    })
  })
})

describe('granuleResultsPanelUpdateSearchValue', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        granuleResultsPanel: {
          sortOrder: '-start_date',
          searchValue: ''
        }
      }
    })

    const payload = 'some new value'
    store.dispatch(granuleResultsPanelUpdateSearchValue(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: GRANULE_RESULTS_PANEL_UPDATE_SEARCH_VALUE,
      payload: 'some new value'
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
