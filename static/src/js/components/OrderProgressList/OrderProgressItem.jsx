import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { kebabCase } from 'lodash-es'
import Badge from 'react-bootstrap/Badge'
import ProgressBar from 'react-bootstrap/ProgressBar'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { getStateFromOrderStatus, formatOrderStatus } from '../../../../../sharedUtils/orderStatus'

import './OrderProgressItem.scss'

export const OrderProgressItem = ({
  order
}) => {
  const {
    order_number: orderId,
    state: orderStatus,
    order_information: orderInformation = {},
    type
  } = order

  let numGranulesProccessed
  let totalGranulesInOrder
  let totalPercentProcessed
  let edscId
  let jobInformationHref

  if (type === 'Harmony') {
    const { progress = 0 } = orderInformation
    totalPercentProcessed = progress

    const { labels } = orderInformation
    const [edscIdFromLabels] = labels
    edscId = edscIdFromLabels
    jobInformationHref = `https://harmony.earthdata.nasa.gov/workflow-ui?tableFilter=[{%22value%22:%22label:%20${edscId}%22}]`
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
        type === 'Harmony' && (
          <span>
            <a href={jobInformationHref} target="_blank" rel="noreferrer">View Harmony Job Information</a>
            <FaExternalLinkAlt className="ms-2 small" style={{ opacity: 0.625 }} />
          </span>

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
  order: PropTypes.shape({
    order_number: PropTypes.string,
    state: PropTypes.string,
    order_information: PropTypes.shape({}),
    type: PropTypes.string
  }).isRequired
}

export default OrderProgressItem
