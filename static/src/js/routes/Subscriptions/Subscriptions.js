import React from 'react'
import { withRouter } from 'react-router-dom'

import SubscriptionsListContainer from '../../containers/SubscriptionsListContainer/SubscriptionsListContainer'

export const Subscriptions = () => (
  <div className="route-wrapper route-wrapper--dark route-wrapper--content-page">
    <div className="route-wrapper__content">
      <div className="route-wrapper__content-inner">
        <SubscriptionsListContainer />
      </div>
    </div>
  </div>
)

Subscriptions.propTypes = {}

export default withRouter(Subscriptions)
