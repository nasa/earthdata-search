import { translateDefaultCollectionSortKey } from '../../util/collections'

/**
 * Get map preferences from Zustand store
 */
export const getMapPreferences = (state) => {
  const { preferences } = state.preferences

  return preferences?.mapView
}

/**
 * Get collection sort preference from Zustand store
 */
export const getCollectionSortPreference = (state) => {
  const { preferences } = state.preferences || {}

  return preferences?.collectionSort
}

/**
 * Get collection sort key parameter with preference comparison
 * Returns null if the sort key matches user preference (to hide from URL)
 */
export const getCollectionSortKeyParameter = (paramCollectionSortKey, state) => {
  if (!paramCollectionSortKey) {
    return null
  }

  // Get user preference from Zustand state
  const { preferences } = state.preferences || {}
  const userPrefSortKey = preferences?.collectionSort

  const translatedUserPrefSortKey = translateDefaultCollectionSortKey(userPrefSortKey)

  // Do not show url parameter if preference matches the current query
  if (paramCollectionSortKey === translatedUserPrefSortKey) {
    return null
  }

  return paramCollectionSortKey
}
