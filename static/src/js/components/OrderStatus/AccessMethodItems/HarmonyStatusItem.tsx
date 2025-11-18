import React, { useState } from 'react'
import classNames from 'classnames'
import Tab from 'react-bootstrap/Tab'

// @ts-expect-error: Types do not exist for this file
import DownloadFilesPanel from '../OrderStatusItem/DownloadFilesPanel'
// @ts-expect-error: Types do not exist for this file
import STACJsonPanel from '../OrderStatusItem/STACJsonPanel'
// @ts-expect-error: Types do not exist for this file
import BrowseLinksPanel from '../OrderStatusItem/BrowseLinksPanel'
import OrderStatusPanel from '../OrderStatusItem/OrderStatusPanel'
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

import type { RetrievalCollection, HarmonyOrderInformation } from '../../../types/sharedTypes'

interface HarmonyStatusItemProps {
  /** Whether the item is expanded/opened by default */
  defaultOpen?: boolean
  /** Handler to toggle the CSDA modal */
  onToggleAboutCSDAModal: (state: boolean) => void
  /** The retrieval collection */
  retrievalCollection: RetrievalCollection
  /** The retrieval ID */
  retrievalId: string
}

const HarmonyStatusItem: React.FC<HarmonyStatusItemProps> = ({
  defaultOpen = false,
  onToggleAboutCSDAModal,
  retrievalCollection,
  retrievalId
}) => {
  const accessMethodType = 'Harmony'

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
  let messageIsError = false
  let progressPercentage = 0
  let orderInfo = null

  let totalOrders = 0
  let totalCompleteOrders = 0

  let stacLinksIsLoading = false
  let stacLinks: string[] = []

  const browseUrls = granuleLinks.browse
  const downloadUrls: string[] = []

  if (stateFromOrderStatus === 'creating') {
    progressPercentage = 0

    orderInfo = STATUS_MESSAGES.ESI.CREATING
  }

  if (stateFromOrderStatus === 'in_progress') {
    orderInfo = STATUS_MESSAGES.ESI.IN_PROGRESS
  }

  if (stateFromOrderStatus === 'complete') {
    orderInfo = STATUS_MESSAGES.ESI.COMPLETE
  }

  if (stateFromOrderStatus === 'failed') {
    progressPercentage = 0
    orderInfo = STATUS_MESSAGES.ESI.FAILED
  }

  if (stateFromOrderStatus === 'canceled') {
    progressPercentage = 0
    orderInfo = STATUS_MESSAGES.ESI.CANCELED
  }

  let totalProgress = 0

  const harmonyCompletedSuccessfullyStates = ['successful', 'complete_with_errors']

  retrievalOrders.forEach((retrievalOrder) => {
    const { orderInformation } = retrievalOrder

    const {
      progress = 0,
      links = [],
      status,
      message: harmonyMessage,
      jobId = false
    } = orderInformation

    if (harmonyCompletedSuccessfullyStates.includes(status) || status === 'failed' || status === 'canceled') {
      totalCompleteOrders += 1
    }

    if (harmonyCompletedSuccessfullyStates.includes(status) && !jobId) {
      messages.push(harmonyMessage)
    }

    if (status === 'failed' && harmonyMessage) {
      messages.push(harmonyMessage)
      messageIsError = messageIsError || true
    }

    if (status === 'canceled' && harmonyMessage) {
      messages.push(harmonyMessage)
    }

    downloadUrls.push(...links
      .filter(({ rel }: { rel: string }) => rel === 'data')
      .map(({ href }: { href: string }) => href))

    if (status === 'failed') {
      // If the order failed, Harmony will tell us its something less
      // than 100% complete, overwrite that here to consider this order complete
      totalProgress += 100
    } else {
      totalProgress += progress
    }

    totalOrders += 1
  })

  const currentPercentProcessed = Math.floor((totalProgress / totalOrders) * 100)

  if (currentPercentProcessed) {
    progressPercentage = Math.floor((totalProgress / (totalOrders * 100)) * 100)
  }

  // Look at each order and pull the STAC catalog link
  if (retrievalOrders.length) {
    stacLinks = retrievalOrders.map((retrievalOrder) => {
      const { orderInformation = {} } = retrievalOrder
      const { links = [] } = orderInformation as HarmonyOrderInformation

      const stacLink = links.find(({ rel }) => rel === 'stac-catalog-json')

      if (stacLink) {
        const { href = '' } = stacLink

        return href
      }

      return false
    }).filter(Boolean) as string[]
  }

  // If all orders are complete, all STAC links have finished loading
  stacLinksIsLoading = retrievalOrders.length !== totalCompleteOrders

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
            linkType: 'data'
          })
        }
        granuleCount={granuleCount}
        granuleLinksIsLoading={granuleLinksIsLoading}
        // RetrievalCollectionId={retrievalCollectionId}
        retrievalId={retrievalId}
        showTextWindowActions={false}
      />
    </Tab>
  )

  // STAC Links tab
  tabs.push(
    <Tab
      className={stacLinks.length > 0 ? '' : 'order-status-item__tab-status'}
      title="STAC Links"
      eventKey="stac-links"
      key={`${obfuscatedId}-stac-links`}
    >
      <STACJsonPanel
        accessMethodType={accessMethodType}
        stacLinks={stacLinks}
        retrievalId={retrievalId}
        granuleCount={granuleCount}
        stacLinksIsLoading={stacLinksIsLoading}
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
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      orderInfo={orderInfo!}
      orderStatus={orderStatus}
      progressPercentage={progressPercentage}
      setOpened={setOpened}
      tabs={tabs}
      title={title}
      totalCompleteOrders={totalCompleteOrders}
      totalOrders={retrievalOrders.length}
      updatedAt={updatedAt}
    />
  )
}

export default HarmonyStatusItem
