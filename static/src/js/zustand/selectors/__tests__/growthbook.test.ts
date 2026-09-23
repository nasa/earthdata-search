import useEdscStore from '../../useEdscStore'
import { getFeatureFlags, getNlpSearchMode } from '../growthbook'

describe('growthbook selectors', () => {
  describe('getFeatureFlags', () => {
    test('returns the feature flags', () => {
      const result = getFeatureFlags(useEdscStore.getState())
      expect(result).toEqual({
        nlpSearch: {
          featureFlagValue: true,
          userSelectedValue: 'default'
        }
      })
    })
  })

  describe('getNlpSearchMode', () => {
    describe('when the user has no preference', () => {
      describe('when the user has not made a selection', () => {
        test('returns the featureFlagValue', () => {
          useEdscStore.setState((state) => {
            state.growthbook.featureFlags.nlpSearch.featureFlagValue = true
            state.growthbook.featureFlags.nlpSearch.userSelectedValue = 'default'
            state.user.sitePreferences.homeSearchMode = 'default'
          })

          const result = getNlpSearchMode(useEdscStore.getState())
          expect(result).toBe('nlp')
        })
      })

      describe('when the user has made a selection', () => {
        test('returns the userSelectedValue', () => {
          useEdscStore.setState((state) => {
            state.growthbook.featureFlags.nlpSearch.featureFlagValue = true
            state.growthbook.featureFlags.nlpSearch.userSelectedValue = 'traditional'
            state.user.sitePreferences.homeSearchMode = 'default'
          })

          const result = getNlpSearchMode(useEdscStore.getState())
          expect(result).toBe('traditional')
        })
      })
    })

    describe('when the user has a preference', () => {
      describe('when the user has not made a selection', () => {
        test('returns the user preference', () => {
          useEdscStore.setState((state) => {
            state.growthbook.featureFlags.nlpSearch.featureFlagValue = true
            state.growthbook.featureFlags.nlpSearch.userSelectedValue = 'default'
            state.user.sitePreferences.homeSearchMode = 'traditional'
          })

          const result = getNlpSearchMode(useEdscStore.getState())
          expect(result).toBe('traditional')
        })
      })

      describe('when the user has made a selection', () => {
        test('returns the userSelectedValue', () => {
          useEdscStore.setState((state) => {
            state.growthbook.featureFlags.nlpSearch.featureFlagValue = true
            state.growthbook.featureFlags.nlpSearch.userSelectedValue = 'nlp'
            state.user.sitePreferences.homeSearchMode = 'traditional'
          })

          const result = getNlpSearchMode(useEdscStore.getState())
          expect(result).toBe('nlp')
        })
      })
    })
  })
})
