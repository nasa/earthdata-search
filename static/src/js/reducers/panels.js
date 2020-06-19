import { PANELS_TOGGLE, PANELS_SET_PANEL } from '../constants/actionTypes'

const initialState = {
  isOpen: true,
  activePanel: '0.0.0'
}

const panelsReducer = (state = initialState, action) => {
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
    default:
      return state
  }
}

export default panelsReducer
