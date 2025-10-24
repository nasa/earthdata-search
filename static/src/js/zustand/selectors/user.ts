import { EdscStore } from '../types'

/**
 * Retrieve user information from Zustand store
 */
export const getUser = (state: EdscStore) => state.user

/**
 * Get username from Zustand store
 */
export const getUsername = (state: EdscStore) => {
  const user = getUser(state)

  return user?.username
}

/**
 * Get site preferences from Zustand store
 */
export const getSitePreferences = (state: EdscStore) => {
  const user = getUser(state)

  return user?.sitePreferences
}

/**
 * Get map preferences from Zustand store
 */
export const getMapPreferences = (state: EdscStore) => {
  const preferences = getSitePreferences(state)

  return preferences?.mapView
}

/**
 * Get collection sort preference from Zustand store
 */
export const getCollectionSortPreference = (state: EdscStore) => {
  const preferences = getSitePreferences(state)

  return preferences?.collectionSort
}
