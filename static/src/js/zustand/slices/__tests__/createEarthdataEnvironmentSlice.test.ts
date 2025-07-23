import useEdscStore from '../../useEdscStore'

describe('createEarthdataDownloadRedirectSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { earthdataEnvironment } = zustandState

    expect(earthdataEnvironment).toEqual({
      currentEnvironment: 'prod'
    })
  })
})
