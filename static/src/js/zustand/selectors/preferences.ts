import { EdscStore } from '../types'
// @ts-expect-error The file does not have types
import { translateDefaultCollectionSortKey } from '../../util/collections'
// @ts-expect-error The file does not have types
import configureStore from '../../store/configureStore'
// @ts-expect-error The file does not have types
import { getParamCollectionSortKey } from '../../selectors/query'

/**
 * Get preferences from Zustand store
 */
export const getPreferences = (state: Pick<EdscStore, 'preferences'>) => state.preferences.preferences

/**
 * Get map preferences from Zustand store
 */
export const getMapPreferences = (state: Pick<EdscStore, 'preferences'>) => {
  const preferences = getPreferences(state)

  return preferences?.mapView
}

/**
 * Get collection sort preference from Zustand store
 */
export const getCollectionSortPreference = (state: Pick<EdscStore, 'preferences'>) => {
  const preferences = getPreferences(state)

  return preferences?.collectionSort
}

/**
 * Get collection sort key parameter from URL compared against user preferences
 * Fetches paramCollectionSortKey from Redux and compares with Zustand preferences
 */
export const getCollectionSortKeyParameter = (state: Pick<EdscStore, 'preferences'>): string | null => {
  // Fetch paramCollectionSortKey from Redux
  const { getState: reduxGetState } = configureStore()
  const reduxState = reduxGetState()
  const paramCollectionSortKey = getParamCollectionSortKey(reduxState)

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
