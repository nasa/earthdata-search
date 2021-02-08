import { createSelector } from 'reselect'

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
