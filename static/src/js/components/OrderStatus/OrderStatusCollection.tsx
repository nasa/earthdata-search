import React, { useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'

// @ts-expect-error This file does not have types
import { getApplicationConfig } from '../../../../../sharedUtils/config'
// @ts-expect-error This file does not have types
import { aggregatedOrderStatus } from '../../../../../sharedUtils/orderStatus'

import GET_RETRIEVAL_COLLECTION from '../../operations/queries/getRetrievalCollection'

import DownloadStatusItem from './AccessMethodItems/DownloadStatusItem'
import EchoOrderStatusItem from './AccessMethodItems/EchoOrderStatusItem'
import EsiStatusItem from './AccessMethodItems/EsiStatusItem'
import HarmonyStatusItem from './AccessMethodItems/HarmonyStatusItem'
import OpendapStatusItem from './AccessMethodItems/OpendapStatusItem'
import SwodlrStatusItem from './AccessMethodItems/SwodlrStatusItem'

// @ts-expect-error This file does not have types
import Skeleton from '../Skeleton/Skeleton'
// @ts-expect-error This file does not have types
import { orderStatusSkeleton } from './skeleton'

import './OrderStatusItem.scss'

const { orderStatusRefreshTime, orderStatusRefreshTimeCreating } = getApplicationConfig()

interface OrderStatusCollectionProps {
  /** The collection state */
  collection: {
    /** The obfuscated ID of the collection */
    obfuscatedId: string
  }
  /** Sets the item open on initial render */
  defaultOpen?: boolean
  /** Callback to toggle the About CSDA modal */
  onToggleAboutCSDAModal: () => void
  /** The retrieval ID */
  retrievalId: string
}

/**
 * Renders OrderStatusItem.
 * @param {Object} params - The props passed into the component.
 * @param {Object} params.collection - The collection state.
 * @param {Boolean} params.defaultOpen - Sets the item open on initial render.
 * @param {Function} params.onToggleAboutCSDAModal - Callback to toggle the About CSDA modal.
 * @param {String} params.retrievalId - The retrieval ID.
*/
const OrderStatusCollection: React.FC<OrderStatusCollectionProps> = ({
  collection,
  defaultOpen = false,
  onToggleAboutCSDAModal,
  retrievalId
}) => {
  const { obfuscatedId } = collection

  const [refreshInterval, setRefreshInterval] = useState(orderStatusRefreshTimeCreating)

  const {
    data: retrievalCollectionData = {},
    loading
  } = useQuery(GET_RETRIEVAL_COLLECTION, {
    pollInterval: refreshInterval,
    variables: { obfuscatedId }
  })
  const { retrievalCollection = {} } = retrievalCollectionData

  useEffect(() => {
    const { retrievalOrders = [] } = retrievalCollection
    if (retrievalOrders.length > 0) {
      const orderStatus = aggregatedOrderStatus(retrievalOrders)

      // If the order is in a terminal state stop asking for order status
      if (['complete', 'failed', 'canceled'].includes(orderStatus)) {
        setRefreshInterval(0)
      } else if (orderStatus === 'creating') {
        setRefreshInterval(orderStatusRefreshTimeCreating)
      } else {
        setRefreshInterval(orderStatusRefreshTime)
      }
    } else {
      setRefreshInterval(0)
    }
  }, [retrievalCollection])

  const {
    accessMethod = {}
  } = retrievalCollection

  if (loading) {
    return (
      <Skeleton
        className="order-status__collection-skeleton"
        containerStyle={
          {
            display: 'inline-block',
            height: '175px',
            width: '100%'
          }
        }
        shapes={orderStatusSkeleton}
      />
    )
  }

  const { type: accessMethodType = '' } = accessMethod

  let OrderStatusComponent = null

  switch (accessMethodType.toLowerCase()) {
    case 'echo orders':
      OrderStatusComponent = EchoOrderStatusItem
      break
    case 'esi':
      OrderStatusComponent = EsiStatusItem
      break
    case 'harmony':
      OrderStatusComponent = HarmonyStatusItem
      break
    case 'opendap':
      OrderStatusComponent = OpendapStatusItem
      break
    case 'swodlr':
      OrderStatusComponent = SwodlrStatusItem
      break
    default:
      OrderStatusComponent = DownloadStatusItem
      break
  }

  return (
    <OrderStatusComponent
      defaultOpen={defaultOpen}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      retrievalCollection={retrievalCollection}
      retrievalId={retrievalId}
    />
  )
}

export default OrderStatusCollection
