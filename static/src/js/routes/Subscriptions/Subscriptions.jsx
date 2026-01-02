import React from 'react'
import { Helmet } from 'react-helmet'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import SubscriptionsList from '../../components/SubscriptionsList/SubscriptionsList'

/**
 * The Subscriptions route component
*/
export const Subscriptions = () => {
  const { edscHost } = getEnvironmentConfig()

  return (
    <>
      <Helmet>
        <title>Subscriptions</title>
        <meta name="title" content="Subscriptions" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}`} />
      </Helmet>
      <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
        <div className="route-wrapper__content">
          <div className="route-wrapper__content-inner">
            <SubscriptionsList />
          </div>
        </div>
      </div>
    </>
  )
}

Subscriptions.propTypes = {}

export default Subscriptions
