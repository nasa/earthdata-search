import { localStorageKeys } from '../../constants/localStorageKeys'
import { ImmerStateCreator, UiSlice } from '../types'

const createUiSlice: ImmerStateCreator<UiSlice> = (set) => ({
  ui: {
    map: {
      displaySpatialMbrWarning: false,
      setDisplaySpatialMbrWarning: (displaySpatialMbrWarning) => {
        set((state) => {
          state.ui.map.displaySpatialMbrWarning = displaySpatialMbrWarning
        })
      },
      drawingNewLayer: false,
      setDrawingNewLayer: (drawingNewLayer) => {
        set((state) => {
          state.ui.map.drawingNewLayer = drawingNewLayer
        })
      }
    },
    modals: {
      openModal: null,
      modalData: undefined,
      setOpenModal: (modalName, modalData) => {
        set((state) => {
          state.ui.modals.openModal = modalName
          state.ui.modals.modalData = modalData
        })
      }
    },
    panels: {
      panelsWidth: 0,
      setPanelsWidth: (panelsWidth) => {
        set((state) => {
          state.ui.panels.panelsWidth = panelsWidth
        })
      },
      panelsLoaded: false,
      setPanelsLoaded: (panelsLoaded) => {
        set((state) => {
          state.ui.panels.panelsLoaded = panelsLoaded
        })
      },
      sidebarWidth: 0,
      setSidebarWidth: (sidebarWidth) => {
        set((state) => {
          state.ui.panels.sidebarWidth = sidebarWidth
        })
      }
    },
    tour: {
      runTour: false,
      setRunTour: (runTour) => {
        set((state) => {
          state.ui.tour.runTour = runTour
        })
      },
      onSearchLoaded: () => {
        const hasUserDisabledTour = localStorage.getItem(localStorageKeys.dontShowTour) === 'true'
        const shouldShowTour = !hasUserDisabledTour

        set((state) => {
          state.ui.tour.runTour = shouldShowTour
        })
      }
    }
  }
})

export default createUiSlice
