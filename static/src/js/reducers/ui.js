// import { UPDATE_SEARCH_QUERY } from '../constants/actionTypes'

const initialState = {
  masterOverlayPanel: {
    dragging: false,
    height: 500,
    clickStartY: undefined,
    clickStartHeight: undefined
  }
}

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MASTER_OVERLAY_PANEL_DRAG_START': {
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          dragging: true,
          clickStartY: action.payload.clickStartY,
          clickStartHeight: action.payload.clickStartHeight
        }
      }
    }
    case 'MASTER_OVERLAY_PANEL_DRAG_END': {
      return {
        ...state,
        masterOverlayPanel: {
          ...state.masterOverlayPanel,
          dragging: false,
          clickStartY: undefined,
          clickStartHeight: undefined
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
