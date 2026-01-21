import useEdscStore from '../../useEdscStore'

vi.mock('../../../../../../sharedUtils/deployedEnvironment', () => ({
  deployedEnvironment: vi.fn().mockReturnValue('prod')
}))

describe('createEarthdataDownloadRedirectSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { earthdataEnvironment } = zustandState

    expect(earthdataEnvironment).toEqual({
      currentEnvironment: 'prod'
    })
  })
})
