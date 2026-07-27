import useEdscStore from '../../useEdscStore'

describe('createHomeSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { home } = zustandState

    expect(home).toEqual({
      startDrawing: false,
      setStartDrawing: expect.any(Function),
      nlpMapAutCenterPending: false,
      setNlpMapAutCenterPending: expect.any(Function),
      openFacetGroup: null,
      setOpenFacetGroup: expect.any(Function)
    })
  })

  describe('setNlpMapAutoCenterPending', () => {
    test('updates nlpMapAutCenterPending', () => {
      const zustandState = useEdscStore.getState()
      const { home } = zustandState
      const { setNlpAutoCenterPending } = home
      setNlpAutoCenterPending(true)

      const updatedState = useEdscStore.getState()
      const { home: updatedHome } = updatedState
      expect(updatedHome.nlpAutoCenterPending).toBe(true)
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

  describe('setOpenFacetGroup', () => {
    test('updates openKeywordFacet', () => {
      const zustandState = useEdscStore.getState()
      const { home } = zustandState
      const { setOpenFacetGroup } = home
      setOpenFacetGroup('science_keywords')

      const updatedState = useEdscStore.getState()
      const { home: updatedHome } = updatedState
      expect(updatedHome.openFacetGroup).toEqual('science_keywords')
    })
  })
})
