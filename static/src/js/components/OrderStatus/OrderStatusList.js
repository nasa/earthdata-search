import React from 'react'
import PropTypes from 'prop-types'

import OrderStatusItem from './OrderStatusItem'

import './OrderStatusList.scss'

export const OrderStatusList = ({
  granuleDownload,
  match,
  onChangePath,
  onFetchRetrieval,
  onFetchRetrievalCollection,
  onFetchRetrievalCollectionGranuleLinks,
  orders
}) => (
  <div className="order-status-list">
    <ul className="order-status-list__list">
      {
        orders && orders.map((order) => {
          const {
            collection_id: collectionId,
            id
          } = order

          return (
            <OrderStatusItem
              key={id + collectionId}
              collectionId={collectionId}
              order={order}
              defaultOpen={orders.length === 1}
              match={match}
              granuleDownload={granuleDownload}
              onChangePath={onChangePath}
              onFetchRetrieval={onFetchRetrieval}
              onFetchRetrievalCollection={onFetchRetrievalCollection}
              onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
            />
          )
        })
      }
    </ul>
  </div>
)

OrderStatusList.defaultProps = {
  orders: []
}

OrderStatusList.propTypes = {
  granuleDownload: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.shape({}))
}

export default OrderStatusList
