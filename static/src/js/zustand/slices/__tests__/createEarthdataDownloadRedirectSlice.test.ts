import useEdscStore from '../../useEdscStore'

describe('createEarthdataDownloadRedirectSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState

    expect(earthdataDownloadRedirect).toEqual({
      redirectUrl: '',
      setRedirectUrl: expect.any(Function)
    })
  })

  describe('setRedirectUrl', () => {
    test('updates redirect', () => {
      const zustandState = useEdscStore.getState()
      const { earthdataDownloadRedirect } = zustandState
      const { setRedirectUrl } = earthdataDownloadRedirect
      const newRedirect = 'earthdata-download://authCallback&token=abc123'

      setRedirectUrl(newRedirect)

      const updatedState = useEdscStore.getState()
      const { earthdataDownloadRedirect: updatedRedirect } = updatedState
      expect(updatedRedirect.redirectUrl).toBe(newRedirect)
    })
  })
})
