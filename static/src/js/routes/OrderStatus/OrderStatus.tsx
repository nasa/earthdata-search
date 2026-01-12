import React from 'react'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

// @ts-expect-error This file does not have types
import OrderStatusComponent from '../../components/OrderStatus/OrderStatus'

const { edscHost } = getEnvironmentConfig()

/**
 * The OrderStatus route component
*/
const OrderStatusContainer = () => (
  <>
    <Helmet>
      <title>OrderStatus</title>
      <meta name="title" content="OrderStatus" />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="canonical" href={`${edscHost}`} />
    </Helmet>

    <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
      <div className="route-wrapper__content">
        <div className="route-wrapper__content-inner">
          <OrderStatusComponent />
        </div>
      </div>
    </div>
  </>
)

export default OrderStatusContainer
