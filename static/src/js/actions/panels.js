import { PANELS_TOGGLE, PANELS_SET_PANEL } from '../constants/actionTypes'


export const togglePanels = value => ({
  type: PANELS_TOGGLE,
  payload: value
})

export const setActivePanel = panelId => ({
  type: PANELS_SET_PANEL,
  payload: panelId
})
