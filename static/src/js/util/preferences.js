import useEdscStore from '../zustand/useEdscStore'

/**
 * Utility functions for managing preferences via Zustand
 * These are examples of how to use the new preference setters
 */

/**
 * Set collection list view preference
 * @param {string} view - The view type ('list', 'table', etc.)
 */
export const setCollectionListViewPreference = (view) => {
  const { setCollectionListView } = useEdscStore.getState().preferences
  setCollectionListView(view)
}

/**
 * Set granule list view preference
 * @param {string} view - The view type ('list', 'table', etc.)
 */
export const setGranuleListViewPreference = (view) => {
  const { setGranuleListView } = useEdscStore.getState().preferences
  setGranuleListView(view)
}

/**
 * Set panel state preference
 * @param {string} state - The panel state
 */
export const setPanelStatePreference = (state) => {
  const { setPanelState } = useEdscStore.getState().preferences
  setPanelState(state)
}

/**
 * Set collection sort preference
 * @param {string} sortKey - The sort key
 */
export const setCollectionSortPreference = (sortKey) => {
  const { setCollectionSort } = useEdscStore.getState().preferences
  setCollectionSort(sortKey)
}

/**
 * Set granule sort preference
 * @param {string} sortKey - The sort key
 */
export const setGranuleSortPreference = (sortKey) => {
  const { setGranuleSort } = useEdscStore.getState().preferences
  setGranuleSort(sortKey)
}

/**
 * Set preferences from JWT token
 * @param {string} jwtToken - The JWT token containing preferences
 */
export const setPreferencesFromJwtToken = (jwtToken) => {
  const { setPreferencesFromJwt } = useEdscStore.getState().preferences
  setPreferencesFromJwt(jwtToken)
}

/**
 * Update preferences via API
 * @param {Object} preferencesData - The preferences data to save
 * @returns {Promise} Promise that resolves when preferences are saved
 */
export const updatePreferencesViaAPI = async (preferencesData) => {
  const { updatePreferences } = useEdscStore.getState().preferences

  return updatePreferences({ formData: preferencesData })
}

/**
 * Get current preferences from Zustand
 * @returns {Object} Current preferences object
 */
export const getCurrentPreferences = () => {
  const { preferences } = useEdscStore.getState()
  const {
    // Extract and ignore action methods
    setPreferences,
    setIsSubmitting,
    setIsSubmitted,
    resetPreferences,
    setPanelState,
    setCollectionListView,
    setGranuleListView,
    setCollectionSort,
    setGranuleSort,
    setMapView,
    setPreferencesFromJwt,
    updatePreferences,
    // Rest are the actual preference data
    ...preferencesData
  } = preferences

  // Avoid "unused variable" warnings by referencing the action methods
  void setPreferences
  void setIsSubmitting
  void setIsSubmitted
  void resetPreferences
  void setPanelState
  void setCollectionListView
  void setGranuleListView
  void setCollectionSort
  void setGranuleSort
  void setMapView
  void setPreferencesFromJwt
  void updatePreferences

  return preferencesData
}

/**
 * Get preferences submission state
 * @returns {Object} Submission state
 */
export const getPreferencesSubmissionState = () => {
  const { isSubmitting, isSubmitted } = useEdscStore.getState().preferences

  return {
    isSubmitting,
    isSubmitted
  }
}
