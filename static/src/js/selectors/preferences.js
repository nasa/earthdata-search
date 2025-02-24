import { createSelector } from 'reselect'
import { collectionSortKeys } from '../constants/collectionSortKeys'

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
 * Retrieve the collection sort key from Redux
 * If set to the default of usage, return null
 * This function is used for inserting the sortKey
 * into the URL query parameters when a user selects
 * a different collection sorting key.
 * @param {Object} state Current state of Redux
 */
export const getNondefaultCollectionSortKey = (state) => {
  const { query } = state
  const { collection } = query
  const { sortKey } = collection

  return sortKey[0] !== collectionSortKeys.usageDescending ? sortKey[0] : null
}
