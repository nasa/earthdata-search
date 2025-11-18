import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { kebabCase } from 'lodash-es'
import Badge from 'react-bootstrap/Badge'
import ProgressBar from 'react-bootstrap/ProgressBar'

import { getStateFromOrderStatus, formatOrderStatus } from '../../../../../sharedUtils/orderStatus'

import ExternalLink from '../ExternalLink/ExternalLink'

import './OrderProgressItem.scss'

export const OrderProgressItem = ({
  retrievalOrder
}) => {
  const {
    orderNumber: orderId,
    state: orderStatus,
    orderInformation = {},
    type
  } = retrievalOrder

  let numGranulesProccessed
  let totalGranulesInOrder
  let totalPercentProcessed
  let jobInformationHref

  if (type === 'Harmony') {
    const { progress = 0, request = '' } = orderInformation
    totalPercentProcessed = progress

    let domainName = ''

    if (request) {
      const requestUrl = new URL(request)
      domainName = requestUrl.origin
    }

    jobInformationHref = domainName && orderId ? `${domainName}/workflow-ui/${orderId}` : null
  }

  if (type === 'ESI') {
    const { requestStatus = {} } = orderInformation

    const {
      totalNumber = 0,
      numberProcessed = 0
    } = requestStatus

    numGranulesProccessed = numberProcessed
    totalGranulesInOrder = totalNumber

    if (totalGranulesInOrder === 0) {
      totalPercentProcessed = 0
    } else {
      totalPercentProcessed = Math.floor((numGranulesProccessed / totalGranulesInOrder) * 100)
    }
  }

  // Grab the order status if it exists and check if it's complete
  const { status = 'created' } = orderInformation

  if (type === 'SWODLR' && status === 'complete') {
    totalPercentProcessed = 100
  }

  const badgeClass = classNames(
    'order-progress-item__badge',
    {
      [`order-progress-item__badge--${kebabCase(getStateFromOrderStatus(orderStatus))}`]: getStateFromOrderStatus(orderStatus)
    }
  )

  return (
    <li
      key={orderId}
      className="order-progress-item"
    >
      <header className="order-progress-item__header">
        <div className="order-progress-item__header-primary">
          <h5 className="order-progress-item__title">
            {'Order ID: '}
            {orderId || 'Not provided'}
          </h5>
          <Badge
            role="status"
            className={badgeClass}
          >
            {formatOrderStatus(orderStatus)}
          </Badge>
        </div>
        <div className="order-progress-item__info">
          <span role="status" className="order-progress-item__processed">
            {
              !!(numGranulesProccessed && totalGranulesInOrder) && (
                `${numGranulesProccessed} of ${totalGranulesInOrder} granule(s) processed `
              )
            }
            {
              totalPercentProcessed != null && (
                `(${totalPercentProcessed}%)`
              )
            }
          </span>
        </div>
      </header>
      {
        type === 'Harmony' && jobInformationHref && (
          <ExternalLink href={jobInformationHref}>
            View Harmony Job Information
          </ExternalLink>
        )
      }
      <ProgressBar
        className="order-progress-item__bar"
        now={totalPercentProcessed}
      />
    </li>
  )
}

OrderProgressItem.propTypes = {
  retrievalOrder: PropTypes.shape({
    orderNumber: PropTypes.string,
    state: PropTypes.string,
    orderInformation: PropTypes.shape({}),
    type: PropTypes.string
  }).isRequired
}

export default OrderProgressItem
