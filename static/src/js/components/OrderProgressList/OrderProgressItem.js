import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { kebabCase } from 'lodash'

import { Badge, ProgressBar } from 'react-bootstrap'

import { getStateFromOrderStatus, formatOrderStatus } from '../../../../../sharedUtils/orderStatus'

import './OrderProgressItem.scss'

export const OrderProgressItem = ({
  order
}) => {
  const {
    order_number: orderId,
    state: orderStatus,
    order_information: orderInformation
  } = order

  const { requestStatus } = orderInformation

  const {
    totalNumber = 0,
    numberProcessed = 0
  } = requestStatus

  let totalPercentProcessed
  if (totalNumber === 0) {
    totalPercentProcessed = 0
  } else {
    totalPercentProcessed = Math.floor(numberProcessed / totalNumber * 100)
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
        <h5 className="order-progress-item__title">
          {'Order ID: '}
          <span>{orderId}</span>
        </h5>
        <div className="order-progress-item__info">
          <span className="order-progress-item__processed">
            {`${numberProcessed} of ${totalNumber} granule(s) processed (${totalPercentProcessed}%)`}
          </span>
          <Badge
            className={badgeClass}
          >
            {formatOrderStatus(orderStatus)}
          </Badge>
        </div>
      </header>
      <ProgressBar
        className="order-progress-item__bar"
        now={totalPercentProcessed}
      />
    </li>
  )
}

OrderProgressItem.propTypes = {
  order: PropTypes.shape({}).isRequired
}

export default OrderProgressItem
