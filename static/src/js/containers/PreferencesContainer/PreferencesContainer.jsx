import React from 'react'
import { withRouter } from 'react-router-dom'

import useEdscStore from '../../zustand/useEdscStore'

import Preferences from '../../components/Preferences/Preferences'

export const PreferencesContainer = () => {
  // Get preferences state and actions from Zustand
  const {
    preferencesData,
    isSubmitting,
    isSubmitted,
    updatePreferences
  } = useEdscStore((state) => {
    // Extract only the data properties, not the action methods
    const {
      panelState,
      collectionListView,
      granuleListView,
      collectionSort,
      granuleSort,
      mapView,
      isSubmitting: preferenceIsSubmitting,
      isSubmitted: preferenceIsSubmitted
    } = state.preferences

    return {
      preferencesData: {
        panelState,
        collectionListView,
        granuleListView,
        collectionSort,
        granuleSort,
        mapView
      },
      isSubmitting: preferenceIsSubmitting,
      isSubmitted: preferenceIsSubmitted,
      updatePreferences: state.preferences.updatePreferences
    }
  })

  // Structure preferences the way the form expects it
  const preferences = {
    preferences: preferencesData,
    isSubmitting,
    isSubmitted
  }

  return (
    <Preferences
      preferences={preferences}
      onUpdatePreferences={updatePreferences}
    />
  )
}

export default withRouter(PreferencesContainer)
