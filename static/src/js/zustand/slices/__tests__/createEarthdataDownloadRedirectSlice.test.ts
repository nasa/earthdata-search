import useEdscStore from '../../useEdscStore'

describe('createEarthdataDownloadRedirectSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState

    expect(earthdataDownloadRedirect).toEqual({
      redirect: '',
      setRedirect: expect.any(Function)
    })
  })

  describe('setRedirect', () => {
    test('updates redirect', () => {
      const zustandState = useEdscStore.getState()
      const { earthdataDownloadRedirect } = zustandState
      const { setRedirect } = earthdataDownloadRedirect
      const newRedirect = 'earthdata-download://authCallback&token=abc123'

      setRedirect(newRedirect)

      const updatedState = useEdscStore.getState()
      const { earthdataDownloadRedirect: updatedRedirect } = updatedState
      expect(updatedRedirect.redirectUrl).toBe(newRedirect)
    })
  })
})
