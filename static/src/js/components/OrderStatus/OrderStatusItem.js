import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './OrderStatusItem.scss'

export const OrderStatusItem = ({ collection, type }) => {
  const {
    dataset_id: datasetId,
    order_status: orderStatus
  } = collection

  let itemBody

  if (type === 'download') {
    itemBody = <>download body</>
  }

  if (type === 'order') {
    const { service_options: serviceOptions } = collection

    const {
      orders,
      total_complete: totalComplete,
      total_orders: totalOrders,
      total_processed: totalProcessed,
      total_number: totalNumber
    } = serviceOptions

    const contactInfo = orders[0].contact
    const { name, email } = contactInfo

    itemBody = (
      <>
        <div className="order-status-item__state">
          <span className="order-status-item__state-display">
            {orderStatus}
          </span>
          <p className="order-status-item__state-text">
            {
              orderStatus === 'creating' && (
                'Your orders are pending processing. This may take some time.'
              )
            }
            {
              orderStatus === 'in progress' && (
                "Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you've provided."
              )
            }
            {
              orderStatus === 'complete' && (
                'Your orders are done processing and are available for download.'
              )
            }
          </p>
        </div>
        <div>
          <p className="order-status-item__stats">
            {`${totalComplete}/${totalOrders} orders complete`}
            <span className="order-status-item__percentage">
              {`(${totalProcessed / totalNumber}%)`}
            </span>
          </p>
        </div>
        <div>
          <span>
            {`For assistance, please contact ${name} at `}
            <a href={`mailto:${email}`}>{email}</a>
          </span>
        </div>
      </>
    )
  }

  if (type === 'serviceOrder') {
    itemBody = <>service order body</>
  }

  const hasErrored = (
    orderStatus === 'failed'
    || orderStatus === 'canceled'
    || orderStatus === 'cancelling'
    || orderStatus === 'submit_rejected'
    || orderStatus === 'submit_failed'
    || orderStatus === 'quote_rejected'
    || orderStatus === 'quote_failed'
    || orderStatus === 'not_validated'
  )

  const className = classNames(
    'order-status-item',
    {
      'order-status-item--complete': type === 'download',
      'order-status-item--in-progress': orderStatus === 'in progress',
      'order-status-item--errored': hasErrored
    }
  )

  return (
    <li className={className}>
      <header className="order-status-item__header">
        <h4 className="order-status-item__heading">{datasetId}</h4>
      </header>
      <div className="order-status-item__body">
        {itemBody}
      </div>
    </li>
  )
}

OrderStatusItem.propTypes = {
  collection: PropTypes.shape({}).isRequired,
  type: PropTypes.string.isRequired
}

export default OrderStatusItem
