import { ImmerStateCreator, UiSlice } from '../types'

const createUiSlice: ImmerStateCreator<UiSlice> = (set) => ({
  ui: {
    panels: {
      panelsWidth: 0,
      setPanelsWidth: (panelsWidth: number) => {
        set((state) => {
          state.ui.panels.panelsWidth = panelsWidth
        })
      }
    },
    tour: {
      runTour: false,
      setRunTour: (runTour: boolean) => {
        set((state) => {
          state.ui.tour.runTour = runTour
        })
      },
      onSearchLoaded: () => {
        const hasUserDisabledTour = localStorage.getItem('dontShowTour') === 'true'
        const shouldShowTour = !hasUserDisabledTour

        set((state) => {
          state.ui.tour.runTour = shouldShowTour
        })
      }
    }
  }
})

export default createUiSlice
