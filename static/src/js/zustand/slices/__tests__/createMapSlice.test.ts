import useEdscStore from '../../useEdscStore'

describe('createMapSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { map } = zustandState

    expect(map).toEqual({
      showMbr: false,
      setShowMbr: expect.any(Function)
    })
  })

  describe('setShowMbr', () => {
    test('updates showMbr', () => {
      const zustandState = useEdscStore.getState()
      const { map } = zustandState
      const { setShowMbr } = map
      setShowMbr(true)

      const updatedState = useEdscStore.getState()
      const { map: updatedMap } = updatedState
      expect(updatedMap.showMbr).toBe(true)
    })
  })
})
