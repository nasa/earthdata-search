import useEdscStore from '../../useEdscStore'

describe('createHomeSlice', () => {
  it('sets the default state', () => {
    const state = useEdscStore.getState().home

    expect(state).toEqual({
      startDrawing: false,
      setStartDrawing: expect.any(Function),
      openKeywordFacet: false,
      setOpenKeywordFacet: expect.any(Function)
    })
  })

  describe('setStartDrawing', () => {
    it('updates startDrawing', () => {
      const { setStartDrawing } = useEdscStore.getState().home
      setStartDrawing(true)

      const state = useEdscStore.getState().home
      expect(state.startDrawing).toBe(true)
    })
  })

  describe('setOpenKeywordFacet', () => {
    it('updates openKeywordFacet', () => {
      const { setOpenKeywordFacet } = useEdscStore.getState().home
      setOpenKeywordFacet(true)

      const state = useEdscStore.getState().home
      expect(state.openKeywordFacet).toBe(true)
    })
  })
})
