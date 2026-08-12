import { GrowthBookSlice, ImmerStateCreator } from '../types'

// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../../sharedUtils/config'

// Default the value to the config value, but allow it to be overridden by the feature flag
const { nlpSearch } = getApplicationConfig()

const createGrowthBookSlice: ImmerStateCreator<GrowthBookSlice> = (set) => ({
  growthbook: {
    featureFlags: {
      nlpSearch: nlpSearch && nlpSearch === 'true'
    },
    setFeatureFlags: (key, value) => {
      set((state) => {
        state.growthbook.featureFlags[key] = value
      })
    }
  }
})

export default createGrowthBookSlice
