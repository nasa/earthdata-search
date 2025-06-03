import React from 'react'
import PropTypes from 'prop-types'

import OrderStatusItem from './OrderStatusItem'

import './OrderStatusList.scss'

const OrderStatusList = ({
  authToken,
  collections,
  earthdataEnvironment,
  granuleDownload,
  onChangePath,
  onFetchRetrieval,
  onFetchRetrievalCollection,
  onFetchRetrievalCollectionGranuleLinks,
  onFetchRetrievalCollectionGranuleBrowseLinks,
  onToggleAboutCSDAModal
}) => (
  <div className="order-status-list">
    <ul className="order-status-list__list">
      {
        collections && collections.map((order) => {
          const {
            collection_id: collectionId,
            id
          } = order

          return (
            <OrderStatusItem
              authToken={authToken}
              collection={order}
              defaultOpen={collections.length === 1}
              earthdataEnvironment={earthdataEnvironment}
              granuleDownload={granuleDownload}
              key={id + collectionId}
              onChangePath={onChangePath}
              onFetchRetrieval={onFetchRetrieval}
              onFetchRetrievalCollection={onFetchRetrievalCollection}
              onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
              // eslint-disable-next-line max-len
              onFetchRetrievalCollectionGranuleBrowseLinks={onFetchRetrievalCollectionGranuleBrowseLinks}
              onToggleAboutCSDAModal={onToggleAboutCSDAModal}
            />
          )
        })
      }
    </ul>
  </div>
)

OrderStatusList.defaultProps = {
  collections: []
}

OrderStatusList.propTypes = {
  authToken: PropTypes.string.isRequired,
  collections: PropTypes.arrayOf(PropTypes.shape({})),
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleBrowseLinks: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired
}

export default OrderStatusList
