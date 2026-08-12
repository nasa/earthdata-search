import useEdscStore from '../../useEdscStore'

describe('createGrowthBookSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { growthbook } = zustandState

    expect(growthbook).toEqual({
      featureFlags: {
        nlpSearch: expect.any(Boolean)
      },
      setFeatureFlags: expect.any(Function)
    })
  })

  describe('setFeatureFlags', () => {
    test('updates featureFlags', () => {
      const zustandState = useEdscStore.getState()
      const { growthbook } = zustandState
      const { setFeatureFlags } = growthbook
      setFeatureFlags('nlpSearch', true)

      const updatedState = useEdscStore.getState()
      const { growthbook: updatedGrowthbook } = updatedState
      expect(updatedGrowthbook.featureFlags.nlpSearch).toBe(true)
    })
  })
})
