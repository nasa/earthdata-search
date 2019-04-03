export const masterOverlayPanelDragStart = data => (dispatch) => {
  dispatch({
    type: 'MASTER_OVERLAY_PANEL_DRAG_START',
    payload: data
  })
}

export const masterOverlayPanelDragEnd = () => (dispatch) => {
  dispatch({
    type: 'MASTER_OVERLAY_PANEL_DRAG_END'
  })
}

export const masterOverlayPanelResize = newHeight => (dispatch) => {
  dispatch({
    type: 'MASTER_OVERLAY_PANEL_UPDATE_RESIZE',
    payload: newHeight
  })
}
