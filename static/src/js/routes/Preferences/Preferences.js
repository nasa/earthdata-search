import React from 'react'
import { withRouter } from 'react-router-dom'

import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import PreferencesContainer from '../../containers/PreferencesContainer/PreferencesContainer'
import AppLogoContainer from '../../containers/AppLogoContainer/AppLogoContainer'

export const Preferences = () => (
  <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
    <div className="route-wrapper__content">
      <header className="route-wrapper__header">
        <div className="route-wrapper__header-primary">
          <AppLogoContainer />
          <SecondaryToolbarContainer />
        </div>
      </header>
      <div className="route-wrapper__content-inner">
        <PreferencesContainer />
      </div>
    </div>
  </div>
)

export default withRouter(Preferences)
