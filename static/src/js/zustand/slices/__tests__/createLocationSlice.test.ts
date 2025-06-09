import useEdscStore from '../../useEdscStore'

describe('createLocationSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { location } = zustandState

    expect(location).toEqual({
      // location: {
      //   pathname: '/',
      //   search: ''
      // },
      // setLocation: expect.any(Function),
      navigate: expect.any(Function),
      setNavigate: expect.any(Function)
    })
  })

  // describe('setLocation', () => {
  //   test('updates startDrawing', () => {
  //     const zustandState = useEdscStore.getState()
  //     const { location } = zustandState
  //     const { setLocation } = location
  //     setLocation({
  //       pathname: '/new-path',
  //       search: '?query=example'
  //     })

  //     const updatedState = useEdscStore.getState()
  //     const { location: updatedlocation } = updatedState
  //     expect(updatedlocation.location).toEqual({
  //       pathname: '/new-path',
  //       search: '?query=example'
  //     })
  //   })
  // })

  describe('setNavigate', () => {
    test('updates openKeywordFacet', () => {
      const mockNavigate = jest.fn()

      const zustandState = useEdscStore.getState()
      const { location } = zustandState
      const { setNavigate } = location
      setNavigate(mockNavigate)

      const updatedState = useEdscStore.getState()
      const { location: updatedlocation } = updatedState
      expect(updatedlocation.navigate).toEqual(mockNavigate)
    })
  })
})
