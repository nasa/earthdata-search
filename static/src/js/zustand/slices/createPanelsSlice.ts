import { ImmerStateCreator, PanelsSlice } from '../types'

const initialState = {
  isOpen: true,
  activePanel: '0.0.0'
}

const createPanelsSlice: ImmerStateCreator<PanelsSlice> = (set) => ({
  panels: {
    ...initialState,

    setIsOpen: (isOpen) => {
      set((state) => {
        state.panels.isOpen = isOpen
      })
    },

    setActivePanel: (activePanel) => {
      set((state) => {
        state.panels.activePanel = activePanel
      })
    },

    setPanelGroup: (group) => {
      set((state) => {
        const panelStateParts = state.panels.activePanel.split('.')
        panelStateParts[1] = group
        state.panels.activePanel = panelStateParts.join('.')
      })
    },

    setPanelSection: (section) => {
      set((state) => {
        const panelStateParts = state.panels.activePanel.split('.')
        panelStateParts[0] = section
        state.panels.activePanel = panelStateParts.join('.')
      })
    }
  }
})

export default createPanelsSlice
