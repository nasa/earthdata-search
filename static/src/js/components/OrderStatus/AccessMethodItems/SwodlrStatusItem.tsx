import React, { useState } from 'react'
import classNames from 'classnames'
import Tab from 'react-bootstrap/Tab'

// @ts-expect-error: Types do not exist for this file
import DownloadFilesPanel from '../OrderStatusItem/DownloadFilesPanel'
// @ts-expect-error: Types do not exist for this file
import BrowseLinksPanel from '../OrderStatusItem/BrowseLinksPanel'
import OrderStatusPanel from '../OrderStatusItem/OrderStatusPanel'
import OrderStatusItem from '../OrderStatusItem'

import { GRANULE_LINK_TYPES } from '../../../constants/granuleLinkTypes'
import { STATUS_MESSAGES } from '../../../constants/orderStatusMessages'
// @ts-expect-error: Types do not exist for this file
import { ACCESS_METHOD_TYPES } from '../../../../../../sharedConstants/accessMethodTypes'
// @ts-expect-error: Types do not exist for this file
import { ORDER_STATES } from '../../../../../../sharedConstants/orderStates'
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

import type { RetrievalCollection, SwodlrOrderInformation } from '../../../types/sharedTypes'

interface SwodlrStatusItemProps {
  /** Whether the item is expanded/opened by default */
  defaultOpen?: boolean
  /** The retrieval collection */
  retrievalCollection: RetrievalCollection
  /** The retrieval ID */
  retrievalId: string
}

const SwodlrStatusItem: React.FC<SwodlrStatusItemProps> = ({
  defaultOpen = false,
  retrievalCollection,
  retrievalId
}) => {
  const accessMethodType = ACCESS_METHOD_TYPES.SWODLR

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
    linkTypes: [GRANULE_LINK_TYPES.BROWSE],
    obfuscatedId
  })

  const {
    title,
    isCSDA: collectionIsCSDA
  } = collectionMetadata

  const orderStatus = aggregatedOrderStatus(retrievalOrders)
  const stateFromOrderStatus = getStateFromOrderStatus(orderStatus)

  const messages: string[] = []
  let messageIsError = false
  let progressPercentage = 0
  let orderInfo = null

  let totalOrders = 0
  let totalCompleteOrders = 0

  const browseUrls = granuleLinks.browse
  const downloadUrls: string[] = []

  if (stateFromOrderStatus === ORDER_STATES.CREATING) {
    progressPercentage = 0

    orderInfo = STATUS_MESSAGES.SWODLR.CREATING
  }

  if (stateFromOrderStatus === ORDER_STATES.IN_PROGRESS) {
    orderInfo = STATUS_MESSAGES.SWODLR.IN_PROGRESS
  }

  if (stateFromOrderStatus === ORDER_STATES.COMPLETE) {
    orderInfo = STATUS_MESSAGES.SWODLR.COMPLETE
  }

  if (stateFromOrderStatus === ORDER_STATES.FAILED) {
    progressPercentage = 0
    orderInfo = STATUS_MESSAGES.SWODLR.FAILED
  }

  let totalNumber = 0
  let totalProcessed = 0

  retrievalOrders.forEach((retrievalOrder) => {
    const {
      error,
      state,
      orderInformation = {}
    } = retrievalOrder

    const { reason, granules = [] } = orderInformation as SwodlrOrderInformation

    totalNumber += 1
    totalOrders += 1

    if (state === ORDER_STATES.COMPLETE) {
      granules.forEach((granule) => {
        const { uri } = granule
        downloadUrls.push(uri)
        totalCompleteOrders += 1
      })

      totalProcessed += 1
    } else if (state === ORDER_STATES.FAILED) {
      progressPercentage = 100
      if (error) {
        messages.push(error)
      } else if (reason) {
        messages.push(reason)
      }

      messageIsError = messageIsError || true
    }
  })

  progressPercentage = Math.floor((totalProcessed / totalNumber) * 100)

  const className = classNames(
    'order-status-item',
    {
      'order-status-item--is-opened': opened,
      'order-status-item--complete': stateFromOrderStatus === ORDER_STATES.COMPLETE,
      'order-status-item--in_progress': stateFromOrderStatus === ORDER_STATES.IN_PROGRESS,
      'order-status-item--failed': stateFromOrderStatus === ORDER_STATES.FAILED,
      'order-status-item--canceled': stateFromOrderStatus === ORDER_STATES.CANCELED
    }
  )

  const tabs = []
  const granuleLinksIsLoading = false

  // Download Files tab
  tabs.push(
    <Tab
      className={downloadUrls.length > 0 ? '' : 'order-status-item__tab-status'}
      title="Download Files"
      eventKey="download-files"
      key={`${obfuscatedId}-download-files`}
    >
      <DownloadFilesPanel
        accessMethodType={accessMethodType}
        collectionIsCSDA={collectionIsCSDA}
        disableEddInProgress={progressPercentage < 100}
        downloadLinks={downloadUrls}
        eddLink={
          buildEddLink({
            collectionMetadata,
            retrievalOrders,
            edlToken,
            retrievalCollectionId: obfuscatedId,
            downloadUrls,
            earthdataEnvironment,
            linkType: GRANULE_LINK_TYPES.DATA
          })
        }
        granuleCount={granuleCount}
        granuleLinksIsLoading={granuleLinksIsLoading}
        retrievalId={retrievalId}
        showTextWindowActions={false}
      />
    </Tab>
  )

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
              linkType: GRANULE_LINK_TYPES.BROWSE
            })
          }
          retrievalId={retrievalId}
          granuleCount={granuleCount}
          granuleLinksIsLoading={granuleLinksLoading}
        />
      </Tab>
    )
  }

  // Order Status tab
  tabs.push(
    <Tab
      title="Order Status"
      eventKey="order-status"
      key={`${obfuscatedId}-order-status`}
    >
      <OrderStatusPanel
        retrievalOrders={retrievalOrders}
      />
    </Tab>
  )

  return (
    <OrderStatusItem
      accessMethodType={accessMethodType}
      className={className}
      collectionIsCSDA={collectionIsCSDA}
      granuleCount={granuleCount}
      hasStatus
      messageIsError={messageIsError}
      messages={messages}
      opened={opened}
      orderInfo={orderInfo!}
      orderStatus={orderStatus}
      progressPercentage={progressPercentage}
      setOpened={setOpened}
      tabs={tabs}
      title={title}
      totalCompleteOrders={totalCompleteOrders}
      totalOrders={totalOrders}
      updatedAt={updatedAt}
    />
  )
}

export default SwodlrStatusItem
