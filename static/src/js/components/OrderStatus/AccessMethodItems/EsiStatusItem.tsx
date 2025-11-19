import React, { useState } from 'react'
import classNames from 'classnames'
import Tab from 'react-bootstrap/Tab'

// @ts-expect-error: Types do not exist for this file
import DownloadFilesPanel from '../OrderStatusItem/DownloadFilesPanel'
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

import type { RetrievalCollection, EsiOrderInformation } from '../../../types/sharedTypes'

interface EsiStatusItemProps {
  /** Whether the item is expanded/opened by default */
  defaultOpen?: boolean
  /** Handler to toggle the CSDA modal */
  onToggleAboutCSDAModal: (state: boolean) => void
  /** The retrieval collection */
  retrievalCollection: RetrievalCollection
  /** The retrieval ID */
  retrievalId: string
}

const EsiStatusItem: React.FC<EsiStatusItemProps> = ({
  defaultOpen = false,
  onToggleAboutCSDAModal,
  retrievalCollection,
  retrievalId
}) => {
  const accessMethodType = 'ESI'

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

  let totalOrders = 0
  let totalCompleteOrders = 0

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

  let totalNumber = 0
  let totalProcessed = 0
  let contactName = ''
  let contactEmail = ''

  if (retrievalOrders.length) {
    const { orderInformation } = retrievalOrders[0]
    const { contactInformation = {} } = orderInformation as EsiOrderInformation;

    ({ contactName, contactEmail } = contactInformation as EsiOrderInformation['contactInformation'])
  }

  retrievalOrders.forEach((retrievalOrder) => {
    const {
      error,
      orderInformation = {}
    } = retrievalOrder

    if (error) messages.push(error)

    const {
      downloadUrls: currentDownloadUrlsObject = {},
      processInfo = {},
      requestStatus = {}
    } = orderInformation as EsiOrderInformation

    // Display the message field from processInfo if it exists
    const { message } = processInfo as EsiOrderInformation['processInfo']

    // Wrap the message in an array, then flatten the array to ensure both string and array messages are the same
    // Only display the first message provided
    if (message) messages.push([message].flat()[0])

    const { downloadUrl: currentDownloadUrls = [] } = currentDownloadUrlsObject as EsiOrderInformation['downloadUrls']

    const {
      status: currentStatus,
      numberProcessed: currentNumberProcessed = 0,
      totalNumber: currentTotalNumber = 0
    } = requestStatus as EsiOrderInformation['requestStatus']

    if (currentStatus === 'complete' || currentStatus === 'failed') {
      totalCompleteOrders += 1
    }

    // The XML Parser seems to add an extra, empty string to the end of download urls -- filter falsey data
    downloadUrls.push(...currentDownloadUrls.filter(Boolean))
    totalNumber += currentTotalNumber
    totalProcessed += currentNumberProcessed
    totalOrders += 1
  })

  const currentPercentProcessed = Math.floor((totalProcessed / totalNumber) * 100)

  if (currentPercentProcessed) {
    progressPercentage = Math.floor((totalProcessed / totalNumber) * 100)
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
        contactName={contactName}
        contactEmail={contactEmail}
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
      totalCompleteOrders={totalCompleteOrders}
      totalOrders={totalOrders}
      updatedAt={updatedAt}
    />
  )
}

export default EsiStatusItem
