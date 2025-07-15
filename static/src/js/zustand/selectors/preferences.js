import { translateDefaultCollectionSortKey } from '../../util/collections'

/**
 * Get preferences from Zustand store
 */
export const getPreferences = (state) => state.preferences.preferences

/**
 * Get map preferences from Zustand store
 */
export const getMapPreferences = (state) => {
  const preferences = getPreferences(state)

  return preferences?.mapView
}

/**
 * Get collection sort preference from Zustand store
 */
export const getCollectionSortPreference = (state) => {
  const preferences = getPreferences(state)

  return preferences?.collectionSort
}

/**
 * Creates a selector function for collection sort key parameter with preference comparison
 * Returns a selector function that only takes Zustand state
 */
export const createCollectionSortKeyParameter = (paramCollectionSortKey) => (state) => {
  if (!paramCollectionSortKey) {
    return null
  }

  // Get user preference from Zustand state
  const preferences = getPreferences(state)
  const userPrefSortKey = preferences?.collectionSort
  const translatedUserPrefSortKey = translateDefaultCollectionSortKey(userPrefSortKey)

  // Do not show url parameter if preference matches the current query
  if (paramCollectionSortKey === translatedUserPrefSortKey) {
    return null
  }

  return paramCollectionSortKey
}
