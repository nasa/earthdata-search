import React, { useState } from 'react'
import classNames from 'classnames'
import Tab from 'react-bootstrap/Tab'

// @ts-expect-error: Types do not exist for this file
import BrowseLinksPanel from '../OrderStatusItem/BrowseLinksPanel'

import OrderStatusItem from '../OrderStatusItem'

import { STATUS_MESSAGES } from '../../../constants/orderStatusMessages'
import {
  aggregatedOrderStatus,
  getStateFromOrderStatus
  // @ts-expect-error: Types do not exist for this file
} from '../../../../../../sharedUtils/orderStatus'
// @ts-expect-error: Types do not exist for this file
import buildEddLink from '../buildEddLink'

import useEdscStore from '../../../zustand/useEdscStore'
import { getEdlToken } from '../../../zustand/selectors/user'
import { getEarthdataEnvironment } from '../../../zustand/selectors/earthdataEnvironment'

import { useGetRetrievalGranuleLinks } from '../../../hooks/useGetRetrievalGranuleLinks'

import type { RetrievalCollection } from '../../../types/sharedTypes'

interface EchoOrderStatusItemProps {
  /** Whether the item is expanded/opened by default */
  defaultOpen?: boolean
  /** Handler to toggle the CSDA modal */
  onToggleAboutCSDAModal: (state: boolean) => void
  /** The retrieval collection */
  retrievalCollection: RetrievalCollection
  /** The retrieval ID */
  retrievalId: string
}

const EchoOrderStatusItem: React.FC<EchoOrderStatusItemProps> = ({
  defaultOpen = false,
  onToggleAboutCSDAModal,
  retrievalCollection,
  retrievalId
}) => {
  const accessMethodType = 'ECHO ORDERS'

  const edlToken = useEdscStore(getEdlToken)
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)

  const [opened, setOpened] = useState(defaultOpen)

  const {
    collectionMetadata,
    granuleCount,
    obfuscatedId,
    retrievalOrders,
    updatedAt
  } = retrievalCollection

  const {
    granuleLinks,
    loading: granuleLinksLoading
  } = useGetRetrievalGranuleLinks({
    collectionMetadata,
    granuleCount,
    linkTypes: ['browse'],
    obfuscatedId
  })

  const {
    title,
    isCSDA: collectionIsCSDA
  } = collectionMetadata

  const orderStatus = aggregatedOrderStatus(retrievalOrders)
  const stateFromOrderStatus = getStateFromOrderStatus(orderStatus)

  const messages: string[] = []
  let progressPercentage = 0
  let orderInfo = null

  const browseUrls = granuleLinks.browse

  if (stateFromOrderStatus === 'creating' || stateFromOrderStatus === 'in_progress') {
    progressPercentage = 0
    orderInfo = STATUS_MESSAGES.ECHO_ORDERS.IN_PROGRESS
  }

  if (stateFromOrderStatus === 'complete') {
    progressPercentage = 100
    orderInfo = STATUS_MESSAGES.ECHO_ORDERS.COMPLETE
  }

  if (stateFromOrderStatus === 'failed') {
    progressPercentage = 100
    orderInfo = STATUS_MESSAGES.ECHO_ORDERS.FAILED
  }

  const className = classNames(
    'order-status-item',
    {
      'order-status-item--is-opened': opened,
      'order-status-item--complete': stateFromOrderStatus === 'complete',
      'order-status-item--in_progress': stateFromOrderStatus === 'in_progress',
      'order-status-item--failed': stateFromOrderStatus === 'failed',
      'order-status-item--canceled': stateFromOrderStatus === 'canceled'
    }
  )

  const tabs = []

  // Browse Imagery tab
  if (browseUrls.length > 0) {
    tabs.push(
      <Tab
        title="Browse Imagery"
        eventKey="browse-imagery"
        key={`${obfuscatedId}-browse-imagery`}
      >
        <BrowseLinksPanel
          accessMethodType={accessMethodType}
          earthdataEnvironment={earthdataEnvironment}
          browseUrls={browseUrls}
          retrievalCollection={retrievalCollection}
          eddLink={
            buildEddLink({
              collectionMetadata,
              retrievalOrders,
              edlToken,
              retrievalCollectionId: obfuscatedId,
              downloadUrls: browseUrls,
              earthdataEnvironment,
              linkType: 'browse'
            })
          }
          retrievalId={retrievalId}
          granuleCount={granuleCount}
          granuleLinksIsLoading={granuleLinksLoading}
        />
      </Tab>
    )
  }

  return (
    <OrderStatusItem
      accessMethodType={accessMethodType}
      className={className}
      collectionIsCSDA={collectionIsCSDA}
      granuleCount={granuleCount}
      hasStatus
      messageIsError={false}
      messages={messages}
      opened={opened}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      orderInfo={orderInfo!}
      orderStatus={orderStatus}
      progressPercentage={progressPercentage}
      setOpened={setOpened}
      tabs={tabs}
      title={title}
      totalCompleteOrders={0}
      totalOrders={0}
      updatedAt={updatedAt}
    />
  )
}

export default EchoOrderStatusItem
