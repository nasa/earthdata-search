import React, { useState } from 'react'
import classNames from 'classnames'
import Tab from 'react-bootstrap/Tab'

// @ts-expect-error: Types do not exist for this file
import DownloadFilesPanel from '../OrderStatusItem/DownloadFilesPanel'
// @ts-expect-error: Types do not exist for this file
import S3LinksPanel from '../OrderStatusItem/S3LinksPanel'
// @ts-expect-error: Types do not exist for this file
import DownloadScriptPanel from '../OrderStatusItem/DownloadScriptPanel'
// @ts-expect-error: Types do not exist for this file
import BrowseLinksPanel from '../OrderStatusItem/BrowseLinksPanel'

import OrderStatusItem from '../OrderStatusItem'

import { GRANULE_LINK_TYPES } from '../../../constants/granuleLinkTypes'
import { STATUS_MESSAGES } from '../../../constants/orderStatusMessages'
// @ts-expect-error: Types do not exist for this file
import { ACCESS_METHOD_TYPES } from '../../../../../../sharedConstants/accessMethodTypes'
// @ts-expect-error: Types do not exist for this file
import { aggregatedOrderStatus } from '../../../../../../sharedUtils/orderStatus'
// @ts-expect-error: Types do not exist for this file
import buildEddLink from '../buildEddLink'

import useEdscStore from '../../../zustand/useEdscStore'
import { getEdlToken } from '../../../zustand/selectors/user'
import { getEarthdataEnvironment } from '../../../zustand/selectors/earthdataEnvironment'

import { useGetRetrievalGranuleLinks } from '../../../hooks/useGetRetrievalGranuleLinks'

import type { RetrievalCollection } from '../../../types/sharedTypes'

interface OpendapStatusItemProps {
  /** Whether the item is expanded/opened by default */
  defaultOpen?: boolean
  /** Handler to toggle the CSDA modal */
  onToggleAboutCSDAModal: (state: boolean) => void
  /** The retrieval collection */
  retrievalCollection: RetrievalCollection
  /** The retrieval ID */
  retrievalId: string
}

const OpendapStatusItem: React.FC<OpendapStatusItemProps> = ({
  defaultOpen = false,
  onToggleAboutCSDAModal,
  retrievalCollection,
  retrievalId
}) => {
  const accessMethodType = ACCESS_METHOD_TYPES.OPENDAP

  const {
    collectionMetadata,
    granuleCount,
    obfuscatedId,
    retrievalOrders,
    updatedAt
  } = retrievalCollection

  const edlToken = useEdscStore(getEdlToken)
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)

  const [opened, setOpened] = useState(defaultOpen)

  const {
    granuleLinks,
    loading: granuleLinksLoading
  } = useGetRetrievalGranuleLinks({
    collectionMetadata,
    granuleCount,
    linkTypes: [GRANULE_LINK_TYPES.BROWSE, GRANULE_LINK_TYPES.DATA, GRANULE_LINK_TYPES.S3],
    obfuscatedId
  })

  const {
    directDistributionInformation = {},
    title,
    isCSDA: collectionIsCSDA
  } = collectionMetadata
  const orderStatus = aggregatedOrderStatus(retrievalOrders)

  const className = classNames(
    'order-status-item',
    'order-status-item--complete',
    {
      'order-status-item--is-opened': opened
    }
  )

  const tabs = []
  const downloadUrls = granuleLinks.data
  const browseUrls = granuleLinks.browse
  const s3Urls = granuleLinks.s3

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
        disableEddInProgress={false}
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
        granuleLinksIsLoading={granuleLinksLoading}
        percentDoneDownloadLinks="0"
        retrievalId={retrievalId}
        showTextWindowActions={false}
      />
    </Tab>
  )

  // AWS S3 Access tab
  if (s3Urls.length > 0) {
    tabs.push(
      <Tab
        className={s3Urls.length > 0 ? '' : 'order-status-item__tab-status'}
        title="AWS S3 Access"
        eventKey="aws-s3-access"
        key={`${obfuscatedId}-aws-s3-access`}
      >
        <S3LinksPanel
          accessMethodType={accessMethodType}
          s3Links={s3Urls}
          directDistributionInformation={directDistributionInformation}
          retrievalId={retrievalId}
          granuleCount={granuleCount}
          granuleLinksIsLoading={granuleLinksLoading}
          showTextWindowActions={false}
        />
      </Tab>
    )
  }

  // Download Script tab
  tabs.push(
    <Tab
      className={downloadUrls.length > 0 ? '' : 'order-status-item__tab-status'}
      title="Download Script"
      eventKey="download-script"
      key={`${obfuscatedId}-download-script`}
    >
      <DownloadScriptPanel
        accessMethodType={accessMethodType}
        downloadLinks={downloadUrls}
        retrievalCollection={retrievalCollection}
        retrievalId={retrievalId}
        granuleCount={granuleCount}
        granuleLinksIsLoading={granuleLinksLoading}
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
              downloadUrls,
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

  return (
    <OrderStatusItem
      accessMethodType={accessMethodType}
      className={className}
      collectionIsCSDA={collectionIsCSDA}
      granuleCount={granuleCount}
      hasStatus={false}
      messageIsError={false}
      messages={[]}
      opened={opened}
      onToggleAboutCSDAModal={onToggleAboutCSDAModal}
      orderInfo={STATUS_MESSAGES.DOWNLOAD.COMPLETE}
      orderStatus={orderStatus}
      progressPercentage={100}
      setOpened={setOpened}
      tabs={tabs}
      title={title}
      totalCompleteOrders={0}
      totalOrders={0}
      updatedAt={updatedAt}
    />
  )
}

export default OpendapStatusItem
