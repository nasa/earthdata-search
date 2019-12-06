import {
  MASTER_OVERLAY_PANEL_DRAG_END,
  MASTER_OVERLAY_PANEL_DRAG_START,
  MASTER_OVERLAY_PANEL_TOGGLE,
  MASTER_OVERLAY_PANEL_UPDATE_RESIZE,
  TOGGLE_ADVANCED_SEARCH_MODAL,
  TOGGLE_CHUNKED_ORDER_MODAL,
  TOGGLE_DRAWING_NEW_LAYER,
  TOGGLE_OVERRIDE_TEMPORAL_MODAL,
  TOGGLE_RELATED_URLS_MODAL,
  TOGGLE_SECONDARY_OVERLAY_PANEL,
  TOGGLE_SELECTING_NEW_GRID,
  TOGGLE_SHAPEFILE_UPLOAD_MODAL,
  TOGGLE_TOO_MANY_POINTS_MODAL,
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

export const masterOverlayPanelToggle = () => (dispatch) => {
  dispatch({
    type: MASTER_OVERLAY_PANEL_TOGGLE
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

export const toggleDrawingNewLayer = state => ({
  type: TOGGLE_DRAWING_NEW_LAYER,
  payload: state
})

export const toggleSecondaryOverlayPanel = state => ({
  type: TOGGLE_SECONDARY_OVERLAY_PANEL,
  payload: state
})

export const toggleSelectingNewGrid = state => ({
  type: TOGGLE_SELECTING_NEW_GRID,
  payload: state
})

export const toggleAdvancedSearchModal = state => ({
  type: TOGGLE_ADVANCED_SEARCH_MODAL,
  payload: state
})

export const toggleShapefileUploadModal = state => ({
  type: TOGGLE_SHAPEFILE_UPLOAD_MODAL,
  payload: state
})

export const toggleTooManyPointsModal = state => ({
  type: TOGGLE_TOO_MANY_POINTS_MODAL,
  payload: state
})

export const toggleChunkedOrderModal = state => ({
  type: TOGGLE_CHUNKED_ORDER_MODAL,
  payload: state
})
