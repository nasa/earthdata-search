import useEdscStore from '../../useEdscStore'

describe('createMapSlice', () => {
  test('sets the default state', () => {
    const state = useEdscStore.getState().map

    expect(state).toEqual({
      showMbr: false,
      setShowMbr: expect.any(Function)
    })
  })

  describe('setShowMbr', () => {
    test('updates showMbr', () => {
      const { setShowMbr } = useEdscStore.getState().map
      setShowMbr(true)

      const state = useEdscStore.getState().map
      expect(state.showMbr).toBe(true)
    })
  })
})
