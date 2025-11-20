import React from 'react'

// @ts-expect-error This file does not have types
import OrderProgressList from '../../OrderProgressList/OrderProgressList'

import type { RetrievalOrder } from '../../../types/sharedTypes'

import './DownloadFilesPanel.scss'

interface OrderStatusPanelProps {
  /** The email address to contact for assistance */
  contactEmail?: string
  /** The name of the contact person for assistance */
  contactName?: string
  /** The list of retrieval orders */
  retrievalOrders: RetrievalOrder[]
}

const OrderStatusPanel: React.FC<OrderStatusPanelProps> = ({
  contactEmail,
  contactName,
  retrievalOrders
}) => (
  <>
    {
      retrievalOrders.length > 1 && (
        <div className="order-status-item__tab-intro">
          { /* eslint-disable-next-line max-len */ }
          Due to the number of granules included in the request, it has been split into multiple orders. The data for each order will become available as they are processed.
        </div>
      )
    }
    {
      (contactName && contactEmail) && (
        <p className="order-status-item-body__contact">
          {`For assistance, please contact ${contactName} at `}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </p>
      )
    }
    <OrderProgressList
      retrievalOrders={retrievalOrders}
    />
  </>
)

export default OrderStatusPanel
