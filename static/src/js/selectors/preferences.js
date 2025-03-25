import { createSelector } from 'reselect'
import { translateDefaultCollectionSortKey } from '../util/collections'

/**
 * Retrieve all preferences from Redux
 * @param {Object} state Current state of Redux
 */
export const getPreferences = (state) => {
  const { preferences = {} } = state
  const { preferences: preferencesObj = {} } = preferences

  return preferencesObj
}

/**
 * Retrieve the paramCollectionSortKey from Redux
 * @param {Object} state Current state of Redux
 */
export const getParamCollectionSortKey = (state) => {
  const { query } = state
  const { collection } = query
  const { paramCollectionSortKey } = collection

  return paramCollectionSortKey
}

/**
 * Retrieve the map preferences from Redux
 */
export const getMapPreferences = createSelector(
  [getPreferences],
  (preferences) => {
    const { mapView = {} } = preferences

    return mapView
  }
)

/**
 * Retrieve the collection sort preference from Redux
 */
export const getCollectionSortPreference = createSelector(
  [getPreferences],
  (preferences) => {
    const { collectionSort = 'default' } = preferences

    return collectionSort
  }
)

/**
 * Retrieve the granule sort preference from Redux
 */
export const getGranuleSortPreference = createSelector(
  [getPreferences],
  (preferences) => {
    const { granuleSort = 'default' } = preferences

    return granuleSort
  }
)

/**
 * Retrieve the parameter collection sort key from Redux
 * If it is the same as the user preference sort key, return null.
 * This function is used for inserting the sortKey
 * into the URL query parameters when a user selects
 * a different collection sorting key.
 */
export const getCollectionSortKeyParameter = createSelector(
  [getParamCollectionSortKey, getCollectionSortPreference],
  (paramCollectionSortKey, userPrefSortKey) => {
    const translatedUserPrefSortKey = translateDefaultCollectionSortKey(userPrefSortKey)

    // Do not show url parameter if preference matches the current query
    if (paramCollectionSortKey === translatedUserPrefSortKey) {
      return null
    }

    return paramCollectionSortKey
  }
)
