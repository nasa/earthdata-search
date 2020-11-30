import React from 'react'

import { withRouter } from 'react-router-dom'

import AppLogoContainer from '../../containers/AppLogoContainer/AppLogoContainer'
import SecondaryToolbarContainer
  from '../../containers/SecondaryToolbarContainer/SecondaryToolbarContainer'
import SubscriptionsContainer from '../../containers/SubscriptionsContainer/SubscriptionsContainer'

export const Subscriptions = () => (
  <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
    <div className="route-wrapper__content">
      <header className="route-wrapper__header">
        <div className="route-wrapper__header-primary">
          <AppLogoContainer />
          <SecondaryToolbarContainer />
        </div>
      </header>
      <div className="route-wrapper__content-inner">
        <SubscriptionsContainer />
      </div>
    </div>
  </div>
)

Subscriptions.propTypes = {}

export default withRouter(Subscriptions)
