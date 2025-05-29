import useEdscStore from '../../useEdscStore'

describe('createEarthdataDownloadRedirectSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState

    expect(earthdataDownloadRedirect).toEqual({
      redirect: '',
      setRedirect: expect.any(Function),
      clearRedirect: expect.any(Function)
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
      expect(updatedRedirect.redirect).toBe(newRedirect)
    })

    test('can clear redirect by setting empty string', () => {
      const zustandState = useEdscStore.getState()
      const { earthdataDownloadRedirect } = zustandState
      const { setRedirect } = earthdataDownloadRedirect

      setRedirect('earthdata-download://authCallback')
      setRedirect('')

      const updatedState = useEdscStore.getState()
      const { earthdataDownloadRedirect: updatedRedirect } = updatedState
      expect(updatedRedirect.redirect).toBe('')
    })

    test('can handle various redirect URL formats', () => {
      const zustandState = useEdscStore.getState()
      const { earthdataDownloadRedirect } = zustandState
      const { setRedirect } = earthdataDownloadRedirect

      setRedirect('earthdata-download://authCallback&token=abc123')
      let updatedState = useEdscStore.getState()
      expect(updatedState.earthdataDownloadRedirect.redirect).toBe('earthdata-download://authCallback&token=abc123')

      setRedirect('earthdata-download://eulaCallback')
      updatedState = useEdscStore.getState()
      expect(updatedState.earthdataDownloadRedirect.redirect).toBe('earthdata-download://eulaCallback')
    })
  })

  describe('clearRedirect', () => {
    test('clears the redirect', () => {
      const zustandState = useEdscStore.getState()
      const { earthdataDownloadRedirect } = zustandState
      const { setRedirect, clearRedirect } = earthdataDownloadRedirect

      setRedirect('earthdata-download://authCallback&token=abc123')

      let updatedState = useEdscStore.getState()
      expect(updatedState.earthdataDownloadRedirect.redirect).toBe('earthdata-download://authCallback&token=abc123')

      clearRedirect()

      updatedState = useEdscStore.getState()
      expect(updatedState.earthdataDownloadRedirect.redirect).toBe('')
    })
  })
})
