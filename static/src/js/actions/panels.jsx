import {
  PANELS_TOGGLE,
  PANELS_SET_PANEL,
  PANELS_SET_PANEL_GROUP,
  PANELS_SET_PANEL_SECTION
} from '../constants/actionTypes'

export const togglePanels = (value) => ({
  type: PANELS_TOGGLE,
  payload: value
})

export const setActivePanel = (panelId) => ({
  type: PANELS_SET_PANEL,
  payload: panelId
})

export const setActivePanelGroup = (panelId) => ({
  type: PANELS_SET_PANEL_GROUP,
  payload: panelId
})

export const setActivePanelSection = (panelId) => ({
  type: PANELS_SET_PANEL_SECTION,
  payload: panelId
})
