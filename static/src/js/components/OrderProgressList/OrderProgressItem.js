import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { kebabCase } from 'lodash'

import { Badge, ProgressBar } from 'react-bootstrap'

import { getStateFromOrderStatus, formatOrderStatus } from '../../util/orderStatus'

import './OrderProgressItem.scss'

export const OrderProgressItem = ({
  order,
  totalNumber,
  totalProcessed
}) => {
  const {
    order_number: orderId,
    state: orderStatus
  } = order

  let totalPercentProcessed
  if (totalNumber === 0) {
    totalPercentProcessed = 0
  } else {
    totalPercentProcessed = Math.floor(totalProcessed / totalNumber * 100)
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
            { `${totalProcessed} of ${totalNumber} granule(s) processed (${totalPercentProcessed}%)`}
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
  order: PropTypes.shape({}).isRequired,
  totalNumber: PropTypes.number.isRequired,
  totalProcessed: PropTypes.number.isRequired
}

export default OrderProgressItem
