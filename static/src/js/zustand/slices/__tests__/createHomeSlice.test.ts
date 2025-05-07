import useEdscStore from '../../useEdscStore'

describe('createHomeSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { home } = zustandState

    expect(home).toEqual({
      startDrawing: false,
      setStartDrawing: expect.any(Function),
      openKeywordFacet: false,
      setOpenKeywordFacet: expect.any(Function)
    })
  })

  describe('setStartDrawing', () => {
    test('updates startDrawing', () => {
      const zustandState = useEdscStore.getState()
      const { home } = zustandState
      const { setStartDrawing } = home
      setStartDrawing(true)

      const updatedState = useEdscStore.getState()
      const { home: updatedHome } = updatedState
      expect(updatedHome.startDrawing).toBe(true)
    })
  })

  describe('setOpenKeywordFacet', () => {
    test('updates openKeywordFacet', () => {
      const zustandState = useEdscStore.getState()
      const { home } = zustandState
      const { setOpenKeywordFacet } = home
      setOpenKeywordFacet(true)

      const updatedState = useEdscStore.getState()
      const { home: updatedHome } = updatedState
      expect(updatedHome.openKeywordFacet).toBe(true)
    })
  })
})
