import useEdscStore from '../../useEdscStore'

describe('createUiSlice', () => {
  it('sets the default state', () => {
    const state = useEdscStore.getState().ui

    expect(state).toEqual({
      panels: {
        panelsWidth: 0,
        setPanelsWidth: expect.any(Function)
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
      it('updates panelsWidth', () => {
        const { setPanelsWidth } = useEdscStore.getState().ui.panels
        setPanelsWidth(100)

        const state = useEdscStore.getState().ui.panels
        expect(state.panelsWidth).toBe(100)
      })
    })
  })

  describe('tour', () => {
    describe('setRunTour', () => {
      it('updates runTour', () => {
        const { setRunTour } = useEdscStore.getState().ui.tour
        setRunTour(true)

        const state = useEdscStore.getState().ui.tour
        expect(state.runTour).toBe(true)
      })
    })

    describe('onSearchLoaded', () => {
      describe('when localstorage dontShowTour is true', () => {
        it('sets runTour to false', () => {
          jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('true')

          const { onSearchLoaded } = useEdscStore.getState().ui.tour

          onSearchLoaded()

          const state = useEdscStore.getState().ui.tour
          expect(state.runTour).toBe(false)
        })
      })

      describe('when localstorage dontShowTour is false', () => {
        it('sets runTour to true', () => {
          jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('false')

          const { onSearchLoaded } = useEdscStore.getState().ui.tour

          onSearchLoaded()

          const state = useEdscStore.getState().ui.tour
          expect(state.runTour).toBe(true)
        })
      })
    })
  })
})
