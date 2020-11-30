import React from 'react'
import { withRouter } from 'react-router-dom'

import SubscriptionsContainer from '../../containers/SubscriptionsContainer/SubscriptionsContainer'

export const Subscriptions = () => (
  <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
    <div className="route-wrapper__content">
      <div className="route-wrapper__content-inner">
        <SubscriptionsContainer />
      </div>
    </div>
  </div>
)

Subscriptions.propTypes = {}

export default withRouter(Subscriptions)
