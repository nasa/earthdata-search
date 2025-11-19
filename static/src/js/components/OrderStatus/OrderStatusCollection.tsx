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

import useEdscStore from '../../zustand/useEdscStore'

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
  const handleError = useEdscStore((state) => state.errors.handleError)

  const { obfuscatedId } = collection

  const [refreshInterval, setRefreshInterval] = useState(orderStatusRefreshTimeCreating)

  const {
    data: retrievalCollectionData = {},
    error,
    loading
  } = useQuery(GET_RETRIEVAL_COLLECTION, {
    pollInterval: refreshInterval,
    variables: { obfuscatedId }
  })

  useEffect(() => {
    if (error) {
      handleError({
        error,
        action: 'getRetrievalCollection',
        resource: 'collection'
      })
    }
  }, [error])

  const { retrievalCollection = {} } = retrievalCollectionData

  // This useEffect is triggered when the `retrievalCollection` data changes
  // It updates the refresh interval based on the order status
  useEffect(() => {
    const { retrievalOrders = [] } = retrievalCollection
    if (retrievalOrders.length > 0) {
      const orderStatus = aggregatedOrderStatus(retrievalOrders)

      // If the order is in a terminal state stop asking for order status
      if (['complete', 'failed', 'canceled'].includes(orderStatus)) {
        setRefreshInterval(0)
      } else if (orderStatus === 'creating') {
        // If the order is still creating, use the shorter refresh interval
        setRefreshInterval(orderStatusRefreshTimeCreating)
      } else {
        // Default refresh interval for an in progress order
        setRefreshInterval(orderStatusRefreshTime)
      }
    } else {
      // If there are no retrieval orders, stop refreshing (download or opendap types)
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

  let OrderStatusItemComponent = null

  // Determine the appropriate OrderStatusItemComponent based on the access method type
  switch (accessMethodType.toLowerCase()) {
    case 'echo orders':
      OrderStatusItemComponent = EchoOrderStatusItem
      break
    case 'esi':
      OrderStatusItemComponent = EsiStatusItem
      break
    case 'harmony':
      OrderStatusItemComponent = HarmonyStatusItem
      break
    case 'opendap':
      OrderStatusItemComponent = OpendapStatusItem
      break
    case 'swodlr':
      OrderStatusItemComponent = SwodlrStatusItem
      break
    default:
      OrderStatusItemComponent = DownloadStatusItem
      break
  }

  return (
    <OrderStatusItemComponent
      defaultOpen={defaultOpen}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      retrievalCollection={retrievalCollection}
      retrievalId={retrievalId}
    />
  )
}

export default OrderStatusCollection
