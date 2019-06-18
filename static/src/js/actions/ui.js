import {
  GRANULE_RESULTS_PANEL_UPDATE_SEARCH_VALUE,
  GRANULE_RESULTS_PANEL_UPDATE_SORT_ORDER,
  MASTER_OVERLAY_PANEL_DRAG_END,
  MASTER_OVERLAY_PANEL_DRAG_START,
  MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
  TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  TOGGLE_RELATED_URLS_MODAL,
  TOGGLE_VIEW_ALL_FACETS_MODAL
} from '../constants/actionTypes'

export const masterOverlayPanelDragStart = data => (dispatch) => {
  dispatch({
    type: MASTER_OVERLAY_PANEL_DRAG_START,
    payload: data
  })
}

export const masterOverlayPanelDragEnd = () => (dispatch) => {
  dispatch({
    type: MASTER_OVERLAY_PANEL_DRAG_END
  })
}

export const masterOverlayPanelResize = newHeight => (dispatch) => {
  dispatch({
    type: MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
    payload: newHeight
  })
}

export const granuleResultsPanelUpdateSortOrder = sortOrder => (dispatch) => {
  dispatch({
    type: GRANULE_RESULTS_PANEL_UPDATE_SORT_ORDER,
    payload: sortOrder
  })
}

export const granuleResultsPanelUpdateSearchValue = searchValue => (dispatch) => {
  dispatch({
    type: GRANULE_RESULTS_PANEL_UPDATE_SEARCH_VALUE,
    payload: searchValue
  })
}

export const toggleFacetsModal = state => ({
  type: TOGGLE_VIEW_ALL_FACETS_MODAL,
  payload: state
})

export const toggleOverrideTemporalModal = state => ({
  type: TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  payload: state
})

export const toggleRelatedUrlsModal = state => ({
  type: TOGGLE_RELATED_URLS_MODAL,
  payload: state
})
