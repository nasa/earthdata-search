import { ImmerStateCreator, PanelsSlice } from '../types'

const initialPanelsData = {
  isOpen: true,
  activePanel: '0.0.0'
}

const initialState = {
  panels: initialPanelsData
}

const createPanelsSlice: ImmerStateCreator<PanelsSlice> = (set) => ({
  panels: {
    ...initialState,

    setIsOpen: (isOpen) => {
      set((state) => {
        console.log('🚀 ~ file: createPanelsSlice.ts:40 ~ isOpen:', isOpen)

        state.panels.panels.isOpen = isOpen
      })
    },

    setActivePanel: (activePanel) => {
      set((state) => {
        state.panels.panels.activePanel = activePanel
      })
    },

    setPanelGroup: (group) => {
      set((state) => {
        const panelStateParts = state.panels.panels.activePanel.split('.')
        panelStateParts[1] = group
        state.panels.panels.activePanel = panelStateParts.join('.')
      })
    },

    setPanelSection: (section) => {
      set((state) => {
        const panelStateParts = state.panels.panels.activePanel.split('.')
        panelStateParts[0] = section
        state.panels.panels.activePanel = panelStateParts.join('.')
      })
    }
  }
})

export default createPanelsSlice
