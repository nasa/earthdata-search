import React from 'react'
import { withRouter } from 'react-router-dom'

import useEdscStore from '../../zustand/useEdscStore'

import Preferences from '../../components/Preferences/Preferences'

export const PreferencesContainer = () => {
  const {
    preferencesData,
    isSubmitting,
    isSubmitted,
    updatePreferences
  } = useEdscStore((state) => {
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
