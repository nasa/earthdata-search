const initialState = {
  masterOverlayPanel: {
    clickStartHeight: undefined,
    clickStartY: undefined,
    dragging: false,
    height: 500
  }
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MASTER_OVERLAY_PANEL_DRAG_START': {
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          clickStartHeight: action.payload.clickStartHeight,
          clickStartY: action.payload.clickStartY,
          dragging: true
        }
      }
    }
    case 'MASTER_OVERLAY_PANEL_DRAG_END': {
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          clickStartHeight: undefined,
          clickStartY: undefined,
          dragging: false
        }
      }
    }
    case 'MASTER_OVERLAY_PANEL_UPDATE_RESIZE': {
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          height: action.payload
        }
      }
    }
    default:
      return state
  }
}

export default uiReducer
