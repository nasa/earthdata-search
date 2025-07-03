import { translateDefaultCollectionSortKey } from '../../util/collections'
import useEdscStore from '../useEdscStore'

/**
 * Get map preferences from Zustand store
 */
export const getMapPreferences = () => {
  const preferences = useEdscStore.getState().preferences?.preferences

  return preferences?.mapView || {}
}

/**
 * Get collection sort key parameter with preference comparison
 * Returns null if the sort key matches user preference (to hide from URL)
 */
export const getCollectionSortKeyParameter = (state) => {
  const paramCollectionSortKey = state?.query?.collection?.paramCollectionSortKey

  if (!paramCollectionSortKey) {
    return null
  }

  // Get user preference from Zustand store
  const preferences = useEdscStore.getState().preferences?.preferences
  const userPrefSortKey = preferences?.collectionSort || 'default'

  const translatedUserPrefSortKey = translateDefaultCollectionSortKey(userPrefSortKey)

  // Do not show url parameter if preference matches the current query
  if (paramCollectionSortKey === translatedUserPrefSortKey) {
    return null
  }

  return paramCollectionSortKey
}
