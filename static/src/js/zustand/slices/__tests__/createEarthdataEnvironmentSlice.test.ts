import useEdscStore from '../../useEdscStore'

jest.mock('../../../../../../sharedUtils/deployedEnvironment', () => ({
  deployedEnvironment: jest.fn().mockReturnValue('prod')
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
