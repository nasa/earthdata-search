import { MODAL_NAMES } from '../../../constants/modalNames'
import useEdscStore from '../../useEdscStore'

describe('createUiSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { ui } = zustandState

    expect(ui).toEqual({
      map: {
        displaySpatialMbrWarning: false,
        setDisplaySpatialMbrWarning: expect.any(Function),
        drawingNewLayer: false,
        setDrawingNewLayer: expect.any(Function)
      },
      modals: {
        openModal: null,
        modalData: undefined,
        setOpenModal: expect.any(Function)
      },
      panels: {
        panelsWidth: 0,
        setPanelsWidth: expect.any(Function),
        panelsLoaded: false,
        setPanelsLoaded: expect.any(Function),
        sidebarWidth: 0,
        setSidebarWidth: expect.any(Function)
      },
      tour: {
        runTour: false,
        setRunTour: expect.any(Function),
        onSearchLoaded: expect.any(Function)
      }
    })
  })

  describe('map', () => {
    describe('setDisplaySpatialMbrWarning', () => {
      test('sets displaySpatialMbrWarning', () => {
        const zustandState = useEdscStore.getState()
        const { ui } = zustandState
        const { map } = ui
        const { setDisplaySpatialMbrWarning } = map
        setDisplaySpatialMbrWarning(true)

        const updatedState = useEdscStore.getState()
        const { ui: updatedUi } = updatedState
        const { map: updatedMap } = updatedUi
        expect(updatedMap.displaySpatialMbrWarning).toBe(true)
      })
    })

    describe('setDrawingNewLayer', () => {
      test('sets drawingNewLayer', () => {
        const zustandState = useEdscStore.getState()
        const { ui } = zustandState
        const { map } = ui
        const { setDrawingNewLayer } = map
        setDrawingNewLayer(true)

        const updatedState = useEdscStore.getState()
        const { ui: updatedUi } = updatedState
        const { map: updatedMap } = updatedUi
        expect(updatedMap.drawingNewLayer).toBe(true)
      })
    })
  })

  describe('modals', () => {
    describe('setOpenModal', () => {
      test('sets the openModal', () => {
        const zustandState = useEdscStore.getState()
        const { ui } = zustandState
        const { modals } = ui
        const { setOpenModal } = modals
        setOpenModal(MODAL_NAMES.ABOUT_CSDA)

        const updatedState = useEdscStore.getState()
        const { ui: updatedUi } = updatedState
        const { modals: updatedModals } = updatedUi
        expect(updatedModals.openModal).toBe(MODAL_NAMES.ABOUT_CSDA)
        expect(updatedModals.modalData).toBe(undefined)
      })

      test('sets the openModal and modalData', () => {
        const zustandState = useEdscStore.getState()
        const { ui } = zustandState
        const { modals } = ui
        const { setOpenModal } = modals
        setOpenModal(MODAL_NAMES.ABOUT_CSDA, { deprecatedUrlParams: ['test'] })

        const updatedState = useEdscStore.getState()
        const { ui: updatedUi } = updatedState
        const { modals: updatedModals } = updatedUi
        expect(updatedModals.openModal).toBe(MODAL_NAMES.ABOUT_CSDA)
        expect(updatedModals.modalData).toEqual({ deprecatedUrlParams: ['test'] })
      })
    })
  })

  describe('panels', () => {
    describe('setPanelsWidth', () => {
      test('updates panelsWidth', () => {
        const zustandState = useEdscStore.getState()
        const { ui } = zustandState
        const { panels } = ui
        const { setPanelsWidth } = panels
        setPanelsWidth(100)

        const updatedState = useEdscStore.getState()
        const { ui: updatedUi } = updatedState
        const { panels: updatedPanels } = updatedUi
        expect(updatedPanels.panelsWidth).toBe(100)
      })
    })

    describe('setPanelsLoaded', () => {
      test('updates panelsWidth', () => {
        const zustandState = useEdscStore.getState()
        const { ui } = zustandState
        const { panels } = ui
        const { setPanelsLoaded } = panels
        setPanelsLoaded(true)

        const updatedState = useEdscStore.getState()
        const { ui: updatedUi } = updatedState
        const { panels: updatedPanels } = updatedUi
        expect(updatedPanels.panelsLoaded).toBe(true)
      })
    })

    describe('setSidebarWidth', () => {
      test('updates sidebarWidth', () => {
        const zustandState = useEdscStore.getState()
        const { ui } = zustandState
        const { panels } = ui
        const { setSidebarWidth } = panels
        setSidebarWidth(100)

        const updatedState = useEdscStore.getState()
        const { ui: updatedUi } = updatedState
        const { panels: updatedPanels } = updatedUi
        expect(updatedPanels.sidebarWidth).toBe(100)
      })
    })
  })

  describe('tour', () => {
    describe('setRunTour', () => {
      test('updates runTour', () => {
        const zustandState = useEdscStore.getState()
        const { ui } = zustandState
        const { tour } = ui
        const { setRunTour } = tour
        setRunTour(true)

        const updatedState = useEdscStore.getState()
        const { ui: updatedUi } = updatedState
        const { tour: updatedTour } = updatedUi
        expect(updatedTour.runTour).toBe(true)
      })
    })

    describe('onSearchLoaded', () => {
      describe('when localstorage dontShowTour is true', () => {
        test('sets runTour to false', () => {
          jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('true')

          const zustandState = useEdscStore.getState()
          const { ui } = zustandState
          const { tour } = ui
          const { onSearchLoaded } = tour

          onSearchLoaded()

          const updatedState = useEdscStore.getState()
          const { ui: updatedUi } = updatedState
          const { tour: updatedTour } = updatedUi
          expect(updatedTour.runTour).toBe(false)
        })
      })

      describe('when localstorage dontShowTour is false', () => {
        test('sets runTour to true', () => {
          jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('false')

          const zustandState = useEdscStore.getState()
          const { ui } = zustandState
          const { tour } = ui
          const { onSearchLoaded } = tour

          onSearchLoaded()

          const updatedState = useEdscStore.getState()
          const { ui: updatedUi } = updatedState
          const { tour: updatedTour } = updatedUi
          expect(updatedTour.runTour).toBe(true)
        })
      })
    })
  })
})
