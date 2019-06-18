import { PROJECT_PANELS_TOGGLE, PROJECT_PANELS_SET_PANEL } from '../constants/actionTypes'

const initialState = {
  isOpen: true,
  activePanel: '0.0.0'
}

const projectPanelsReducer = (state = initialState, action) => {
  switch (action.type) {
    case PROJECT_PANELS_TOGGLE: {
      return {
        ...state,
        isOpen: action.payload
      }
    }
    case PROJECT_PANELS_SET_PANEL: {
      return {
        ...state,
        activePanel: action.payload,
        isOpen: true
      }
    }
    default:
      return state
  }
}

export default projectPanelsReducer
