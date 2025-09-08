import useEdscStore from '../../useEdscStore'

describe('createUiSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { ui } = zustandState

    expect(ui).toEqual({
      panels: {
        panelsWidth: 0,
        setPanelsWidth: expect.any(Function),
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
