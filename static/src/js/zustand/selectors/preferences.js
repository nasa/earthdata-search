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
 * Returns a function that takes paramCollectionSortKey and returns null if it matches user preference
 */
export const getCollectionSortKeyParameterSelector = (state) => {
  const preferences = getPreferences(state)
  const userPrefSortKey = preferences?.collectionSort
  const translatedUserPrefSortKey = translateDefaultCollectionSortKey(userPrefSortKey)

  // Return a function that can be used to compare against paramCollectionSortKey
  return (paramCollectionSortKey) => {
    if (!paramCollectionSortKey) {
      return null
    }

    // Do not show url parameter if preference matches the current query
    if (paramCollectionSortKey === translatedUserPrefSortKey) {
      return null
    }

    return paramCollectionSortKey
  }
}
