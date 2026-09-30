import { EdscStore } from '../types'
import { getSitePreferences } from './user'

/**
 * Selector to get the feature flags from the GrowthBook slice of the store.
 */
export const getFeatureFlags = (state: EdscStore) => state.growthbook.featureFlags

/**
 * Selector to get the NLP search mode from the GrowthBook slice of the store.
 * Priority is given to the user selected value, then the user's site preference,
 * and finally the feature flag value (which is the experiment value, defaulting to the
 * deployment variable default).
 */
export const getNlpSearchMode = (state: EdscStore) => {
  const { nlpSearch } = getFeatureFlags(state)
  const { featureFlagValue, userSelectedValue } = nlpSearch

  // If the user selection has been changed, return the user selected value
  if (userSelectedValue !== 'default') return userSelectedValue

  // If the site preference has been changed, return the site preference value
  const preferences = getSitePreferences(state)
  const { homeSearchMode } = preferences
  if (homeSearchMode !== 'default') return homeSearchMode

  // If neither the user nor the site preference has specified a value, return the feature flag value
  return featureFlagValue ? 'nlp' : 'traditional'
}
