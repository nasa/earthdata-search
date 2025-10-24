import React from 'react'
import { Helmet } from 'react-helmet'

import PreferencesForm from '../../components/Preferences/PreferencesForm'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { routes } from '../../constants/routes'

/**
 * The Preferences route component
*/
const Preferences = () => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <>
      <Helmet>
        <title>Preferences</title>
        <meta name="title" content="Preferences" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}${routes.PREFERENCES}`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <div className="preferences">
              <PreferencesForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Preferences
