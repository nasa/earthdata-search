import {
  ImmerStateCreator,
  PanelsSlice,
  activePanelConfiguration
} from '../types'

const initialPanelsData = {
  isOpen: true,
  activePanel: '0.0.0' as activePanelConfiguration
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
        state.projectPanels.panels.activePanel = activePanel as activePanelConfiguration
      })
    },

    setPanelGroup: (group) => {
      set((state) => {
        const panelStateParts = state.projectPanels.panels.activePanel.split('.')
        panelStateParts[1] = group
        state.projectPanels.panels.activePanel = panelStateParts.join('.') as activePanelConfiguration
      })
    },

    setPanelSection: (section) => {
      set((state) => {
        const panelStateParts = state.projectPanels.panels.activePanel.split('.')
        panelStateParts[0] = section
        state.projectPanels.panels.activePanel = panelStateParts.join('.') as activePanelConfiguration
      })
    }
  }
})

export default createProjectPanelsSlice
