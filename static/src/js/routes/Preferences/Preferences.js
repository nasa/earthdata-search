import React from 'react'
import { withRouter } from 'react-router-dom'

import PreferencesContainer from '../../containers/PreferencesContainer/PreferencesContainer'

export const Preferences = () => (
  <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
    <div className="route-wrapper__content">
      <div className="route-wrapper__content-inner">
        <PreferencesContainer />
      </div>
    </div>
  </div>
)

export default withRouter(Preferences)
