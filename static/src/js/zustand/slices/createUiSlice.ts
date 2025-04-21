import { StateCreator } from 'zustand'

import { EdscStore, UiSlice } from '../types'

const createUiSlice: StateCreator<UiSlice> = (set) => ({
  ui: {
    panels: {
      panelsWidth: 0,
      setPanelsWidth: (panelsWidth: number) => {
        set((state: EdscStore) => ({
          ...state,
          ui: {
            ...state.ui,
            panels: {
              ...state.ui.panels,
              panelsWidth
            }
          }
        }))
      }
    },
    tour: {
      runTour: false,
      setRunTour: (runTour: boolean) => {
        set((state: EdscStore) => ({
          ...state,
          ui: {
            ...state.ui,
            tour: {
              ...state.ui.tour,
              runTour
            }
          }
        }))
      },
      onSearchLoaded: () => {
        const hasUserDisabledTour = localStorage.getItem('dontShowTour') === 'true'
        const shouldShowTour = !hasUserDisabledTour

        set((state: EdscStore) => ({
          ...state,
          ui: {
            ...state.ui,
            tour: {
              ...state.ui.tour,
              runTour: shouldShowTour
            }
          }
        }))
      }
    }
  }
})

export default createUiSlice
