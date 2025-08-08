import {
  ActivePanelConfiguration,
  ImmerStateCreator,
  PanelsSlice
} from '../types'

const initialPanelsData = {
  isOpen: true,
  activePanel: '0.0.0' as ActivePanelConfiguration
}

const initialState = {
  panels: initialPanelsData
}

const createProjectPanelsSlice: ImmerStateCreator<PanelsSlice> = (set) => ({
  projectPanels: {
    ...initialState,

    setIsOpen: (isOpen) => {
      set((state) => {
        state.projectPanels.panels.isOpen = isOpen
      })
    },

    setActivePanel: (activePanel) => {
      set((state) => {
        state.projectPanels.panels.activePanel = activePanel as ActivePanelConfiguration
      })
    },

    setPanelGroup: (group) => {
      set((state) => {
        const panelStateParts = state.projectPanels.panels.activePanel.split('.')
        panelStateParts[1] = group
        state.projectPanels.panels.activePanel = panelStateParts.join('.') as ActivePanelConfiguration
      })
    },

    setPanelSection: (section) => {
      set((state) => {
        const panelStateParts = state.projectPanels.panels.activePanel.split('.')
        panelStateParts[0] = section
        state.projectPanels.panels.activePanel = panelStateParts.join('.') as ActivePanelConfiguration
      })
    }
  }
})

export default createProjectPanelsSlice
