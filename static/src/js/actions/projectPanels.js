import { PROJECT_PANELS_TOGGLE, PROJECT_PANELS_SET_PANEL } from '../constants/actionTypes'


export const togglePanels = value => ({
  type: PROJECT_PANELS_TOGGLE,
  payload: value
})

export const setActivePanel = panelId => ({
  type: PROJECT_PANELS_SET_PANEL,
  payload: panelId
})
