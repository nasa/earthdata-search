import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getStateFromOrderStatus, aggregatedOrderStatus } from '../../util/orderStatus'
import OrderStatusItemBody from './OrderStatusItemBody'

import './OrderStatusItem.scss'

export class OrderStatusItem extends PureComponent {
  componentDidMount() {
    const { collection, onFetchRetrievalCollection, type } = this.props

    if (collection && !['download', 'opendap'].includes(type)) {
      const { id } = collection

      if (id) {
        // Fetch the retrieval collection before waiting for the interval
        onFetchRetrievalCollection(id)

        // Start refreshing the retrieval collection every 20 seconds
        setInterval(() => {
          try {
            onFetchRetrievalCollection(id)
          } catch (e) {
            console.log(e)
          }
        }, 20000)
      }
    }
  }

  render() {
    const {
      collection,
      onChangePath,
      onFetchRetrievalCollection,
      type
    } = this.props

    const {
      collection_metadata: collectionMetadata,
      isLoaded,
      orders = []
    } = collection

    // Downloadable orders dont maintain a status
    const hasStatus = !['download', 'opendap'].includes(type)

    if (isLoaded) {
      const { dataset_id: datasetId } = collectionMetadata

      const orderStatus = aggregatedOrderStatus(orders)

      const className = classNames(
        'order-status-item',
        {
          'order-status-item--complete': hasStatus && getStateFromOrderStatus(orderStatus) === 'complete',
          'order-status-item--in-progress': hasStatus && getStateFromOrderStatus(orderStatus) === 'in progress',
          'order-status-item--failed': hasStatus && getStateFromOrderStatus(orderStatus) === 'failed'
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
              orderStatus={orderStatus}
              onChangePath={onChangePath}
              onFetchRetrievalCollection={onFetchRetrievalCollection}
            />
          </div>
        </li>
      )
    }

    // TODO: Render a loading state
    return null
  }
}

OrderStatusItem.propTypes = {
  collection: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}

export default OrderStatusItem
