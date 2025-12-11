import React from 'react'

import OrderStatusCollection from './OrderStatusCollection'

import type { RetrievalCollection } from '../../types/sharedTypes'

import './OrderStatusList.scss'

interface OrderStatusListProps {
  /** The list of retrieval collections to display */
  retrievalCollections?: RetrievalCollection[]
  /** The retrieval ID */
  retrievalId: string
}

const OrderStatusList: React.FC<OrderStatusListProps> = ({
  retrievalCollections = [],
  retrievalId
}) => (
  <div className="order-status-list">
    <ul className="order-status-list__list">
      {
        retrievalCollections && retrievalCollections.map((collection) => {
          const {
            collectionId,
            obfuscatedId
          } = collection

          return (
            <OrderStatusCollection
              collection={collection}
              defaultOpen={retrievalCollections.length === 1}
              key={obfuscatedId + collectionId}
              retrievalId={retrievalId}
            />
          )
        })
      }
    </ul>
  </div>
)

export default OrderStatusList
