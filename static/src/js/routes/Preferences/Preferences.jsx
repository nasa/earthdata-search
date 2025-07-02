import React from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import useEdscStore from '../../zustand/useEdscStore'
import PreferencesComponent from '../../components/Preferences/Preferences'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export const Preferences = () => {
  const { edscHost } = getEnvironmentConfig()

  const {
    preferencesData,
    isSubmitting,
    isSubmitted,
    submitAndUpdatePreferences
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
      submitAndUpdatePreferences: state.preferences.submitAndUpdatePreferences
    }
  })

  const preferences = {
    preferences: preferencesData,
    isSubmitting,
    isSubmitted
  }

  return (
    <>
      <Helmet>
        <title>Preferences</title>
        <meta name="title" content="Preferences" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}/preferences`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <PreferencesComponent
              preferences={preferences}
              onUpdatePreferences={submitAndUpdatePreferences}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(Preferences)
