import useEdscStore from '../../useEdscStore'

describe('createMapSlice', () => {
  it('sets the default state', () => {
    const state = useEdscStore.getState().map

    expect(state).toEqual({
      showMbr: false,
      setShowMbr: expect.any(Function)
    })
  })

  describe('setShowMbr', () => {
    it('updates showMbr', () => {
      const { setShowMbr } = useEdscStore.getState().map
      setShowMbr(true)

      const state = useEdscStore.getState().map
      expect(state.showMbr).toBe(true)
    })
  })
})
