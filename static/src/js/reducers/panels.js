import {
  PANELS_TOGGLE,
  PANELS_SET_PANEL,
  PANELS_SET_PANEL_GROUP,
  PANELS_SET_PANEL_SECTION
} from '../constants/actionTypes'

const initialState = {
  isOpen: true,
  activePanel: '0.0.0'
}

const panelsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case PANELS_TOGGLE: {
      return {
        ...state,
        isOpen: action.payload
      }
    }
    case PANELS_SET_PANEL: {
      return {
        ...state,
        activePanel: action.payload
      }
    }
    case PANELS_SET_PANEL_GROUP: {
      const { activePanel } = state
      const panelStateParts = activePanel.split('.')
      panelStateParts[1] = action.payload

      return {
        ...state,
        activePanel: panelStateParts.join('.')
      }
    }
    case PANELS_SET_PANEL_SECTION: {
      const { activePanel } = state
      const panelStateParts = activePanel.split('.')
      panelStateParts[0] = action.payload

      return {
        ...state,
        activePanel: panelStateParts.join('.')
      }
    }
    default:
      return state
  }
}

export default panelsReducer
