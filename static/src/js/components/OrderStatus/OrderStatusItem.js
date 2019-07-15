import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getStateFromOrderStatus } from '../../util/orderStatus'
import OrderStatusItemBody from './OrderStatusItemBody'

import './OrderStatusItem.scss'

export const OrderStatusItem = ({ collection, onChangePath, type }) => {
  const { collection_metadata: collectionMetadata } = collection
  const { dataset_id: datasetId } = collectionMetadata
  let {
    order_status: orderStatus
  } = collectionMetadata

  if (type === 'download') orderStatus = 'complete'

  const className = classNames(
    'order-status-item',
    {
      'order-status-item--success': getStateFromOrderStatus(orderStatus) === 'success',
      'order-status-item--in-progress': getStateFromOrderStatus(orderStatus) === 'in progress',
      'order-status-item--errored': getStateFromOrderStatus(orderStatus) === 'errored'
    }
  )

  return (
    <li className={className}>
      <header className="order-status-item__header">
        <h4 className="order-status-item__heading">{datasetId}</h4>
      </header>
      <div className="order-status-item__body">
        <OrderStatusItemBody
          type={type}
          collection={collection}
          onChangePath={onChangePath}
        />
      </div>
    </li>
  )
}

OrderStatusItem.propTypes = {
  collection: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}

export default OrderStatusItem
