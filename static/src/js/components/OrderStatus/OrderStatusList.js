import React from 'react'
import PropTypes from 'prop-types'

import OrderStatusItem from './OrderStatusItem'

import './OrderStatusList.scss'

export const OrderStatusList = ({
  collections,
  heading,
  introduction,
  onChangePath,
  onFetchRetrievalCollection,
  type
}) => (
  <div className="order-status-list">
    <h3 className="order-status-list__heading">{heading}</h3>
    <p className="order-status-list__introduction">{introduction}</p>
    <ul className="order-status-list__list">
      {
        collections && collections.map(collection => (
          <OrderStatusItem
            key={collection.collection_id}
            type={type}
            collection={collection}
            onChangePath={onChangePath}
            onFetchRetrievalCollection={onFetchRetrievalCollection}
          />
        ))
      }
    </ul>
  </div>
)

OrderStatusList.defaultProps = {
  collections: []
}

OrderStatusList.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.shape({})),
  heading: PropTypes.string.isRequired,
  introduction: PropTypes.string.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}

export default OrderStatusList
