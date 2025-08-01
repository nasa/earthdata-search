import { EdscStore } from '../types'

/**
 * Get preferences from Zustand store
 */
export const getPreferences = (state: EdscStore) => state.preferences.preferences

/**
 * Get map preferences from Zustand store
 */
export const getMapPreferences = (state: EdscStore) => {
  const preferences = getPreferences(state)

  return preferences?.mapView
}

/**
 * Get collection sort preference from Zustand store
 */
export const getCollectionSortPreference = (state: EdscStore) => {
  const preferences = getPreferences(state)

  return preferences?.collectionSort
}
