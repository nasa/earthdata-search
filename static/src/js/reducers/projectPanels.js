// import {
//   MASTER_OVERLAY_PANEL_DRAG_END
// } from '../constants/actionTypes'

export const PROJECT_PANELS_TOGGLE = 'PROJECT_PANELS_TOGGLE'
export const PROJECT_PANELS_SET_PANEL = 'PROJECT_PANELS_SET_PANEL'

export const togglePanels = value => ({
  type: PROJECT_PANELS_TOGGLE,
  payload: value
})

export const setActivePanel = panelId => ({
  type: PROJECT_PANELS_SET_PANEL,
  payload: panelId
})

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
