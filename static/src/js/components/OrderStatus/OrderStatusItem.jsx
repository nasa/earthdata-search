import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Col from 'react-bootstrap/Col'
import Tab from 'react-bootstrap/Tab'
import { upperFirst } from 'lodash-es'
import {
  ArrowChevronUp,
  ArrowChevronDown
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaQuestionCircle } from 'react-icons/fa'
import moment from 'moment'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import {
  getStateFromOrderStatus,
  aggregatedOrderStatus,
  formatOrderStatus
} from '../../../../../sharedUtils/orderStatus'
import { pluralize } from '../../util/pluralize'
import { commafy } from '../../util/commafy'

import Button from '../Button/Button'
import EDSCTabs from '../EDSCTabs/EDSCTabs'
import OrderProgressList from '../OrderProgressList/OrderProgressList'
import STACJsonPanel from './OrderStatusItem/STACJsonPanel'
import DownloadFilesPanel from './OrderStatusItem/DownloadFilesPanel'
import S3LinksPanel from './OrderStatusItem/S3LinksPanel'
import DownloadScriptPanel from './OrderStatusItem/DownloadScriptPanel'
import BrowseLinksPanel from './OrderStatusItem/BrowseLinksPanel'
import getOrderInfoAndProgress from './getOrderInfoAndProgress'
import buildEddLink from './buildEddLink'

import ProgressRing from '../ProgressRing/ProgressRing'

import './OrderStatusItem.scss'

const { orderStatusRefreshTime, orderStatusRefreshTimeCreating } = getApplicationConfig()

let intervalId = null

/**
 * Renders OrderStatusItem.
 * @param {Object} params - The props passed into the component.
 * @param {Boolean} params.defaultOpen - Sets the item open on initial render.
 * @param {String} params.earthdataEnvironment - The earthdata environment.
 * @param {Object} params.granuleDownload - granuleDownload state.
 * @param {Object} params.collection - The collection state.
 * @param {Object} params.match - match parameter from React Router.
 * @param {Function} params.onChangePath - Callback function to change the current path.
 * @param {Function} params.onFetchRetrievalCollection - Callback function to fetch a retrieval.
 * @param {Function} params.onFetchRetrievalCollectionGranuleBrowseLinks - Callback function to fetch browse links for a retrieval collection.
 * @param {Function} params.onFetchRetrievalCollectionGranuleLinks - Callback function to fetch download links for a retrieval collection.
*/
// export class OrderStatusItem extends PureComponent {
export const OrderStatusItem = ({
  authToken,
  collection,
  defaultOpen,
  earthdataEnvironment,
  granuleDownload,
  onFetchRetrievalCollection,
  onFetchRetrievalCollectionGranuleBrowseLinks,
  onFetchRetrievalCollectionGranuleLinks,
  onToggleAboutCSDAModal
}) => {
  const [opened, setOpened] = useState(defaultOpen)

  const shouldRefresh = () => {
    const {
      id,
      orders = []
    } = collection

    const orderStatus = aggregatedOrderStatus(orders)

    // If the order is in a terminal state stop asking for order status
    if (['complete', 'failed', 'canceled'].includes(orderStatus)) {
      clearInterval(intervalId)
      intervalId = null
    } else {
      onFetchRetrievalCollection(id)
    }
  }

  // Clear the intervalId when unmounting. (this is only the `return` function in the useEffect)
  useEffect(() => () => {
    clearInterval(intervalId)
  }, [])

  // Handles fetching the granule browse links
  useEffect(() => {
    const { access_method: accessMethod } = collection
    const { type: accessMethodType } = accessMethod

    // If the access method is download or opendap, fetch the granule browse links
    if (collection && !['download', 'opendap'].includes(accessMethodType.toLowerCase())) {
      // `download` & `opendap` browse links return with the granule links, every other access method needs
      // to fetch them here
      onFetchRetrievalCollectionGranuleBrowseLinks(collection)
    }
  }, [])

  // Handles fetching the granule links for download and opendap access methods
  useEffect(() => {
    const { access_method: accessMethod } = collection
    const { type: accessMethodType } = accessMethod

    // If the access method is download or opendap, fetch the granule links
    if (collection && ['download', 'opendap'].includes(accessMethodType.toLowerCase())) {
      const { id } = collection

      const {
        [id]: granuleLinks = [],
        isLoading: granuleLinksIsLoading
      } = granuleDownload

      // If the links have not been fetched and are not currently loading, fetch them
      if (granuleLinks.length === 0 && !granuleLinksIsLoading) {
        onFetchRetrievalCollectionGranuleLinks(collection)
      }
    }
  }, [granuleDownload])

  const {
    access_method: accessMethod,
    collection_metadata: collectionMetadata,
    granule_count: granuleCount,
    orders = [],
    id,
    isLoaded,
    retrieval_id: retrievalId,
    retrieval_collection_id: retrievalCollectionId,
    updated_at: updatedAt
  } = collection

  const orderStatus = aggregatedOrderStatus(orders)
  const stateFromOrderStatus = getStateFromOrderStatus(orderStatus)

  // Handles fetching the retrieval collection to get the order info
  useEffect(() => {
    const { type: accessMethodType } = accessMethod

    let refreshInterval = orderStatusRefreshTime

    // If the order is still `creating`, refresh in a faster interval
    // const orderStatus = aggregatedOrderStatus(orders)
    if (orderStatus === 'creating') {
      refreshInterval = orderStatusRefreshTimeCreating
    }

    if (id && !intervalId && !['download', 'opendap'].includes(accessMethodType.toLowerCase())) {
      // Fetch the retrieval collection before waiting for the interval
      onFetchRetrievalCollection(id)

      // Start refreshing the retrieval collection
      intervalId = setInterval(() => {
        shouldRefresh()
      }, refreshInterval)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }, [orderStatus])

  // If the collection is not loaded, return null
  if (!isLoaded) return null

  const { type: accessMethodType } = accessMethod

  const {
    [id]: granuleLinks = [],
    isLoading: granuleLinksIsLoading
  } = granuleDownload

  const {
    directDistributionInformation = {},
    title,
    isCSDA: collectionIsCSDA
  } = collectionMetadata

  // Download and Opendap do not have a status, so hasStatus will be set to false
  const hasStatus = !['download', 'opendap'].includes(accessMethodType.toLowerCase())

  const className = classNames(
    'order-status-item',
    {
      'order-status-item--is-opened': opened,
      'order-status-item--complete': !hasStatus || (hasStatus && stateFromOrderStatus === 'complete'),
      'order-status-item--in_progress': hasStatus && stateFromOrderStatus === 'in_progress',
      'order-status-item--failed': hasStatus && stateFromOrderStatus === 'failed',
      'order-status-item--canceled': hasStatus && stateFromOrderStatus === 'canceled'
    }
  )

  const typeToLower = accessMethodType.toLowerCase()
  const isDownload = typeToLower === 'download'
  const isOpendap = typeToLower === 'opendap'
  const isHarmony = typeToLower === 'harmony'
  const isEchoOrders = typeToLower === 'echo orders'
  const isEsi = typeToLower === 'esi'
  const isSwodlr = typeToLower === 'swodlr'

  const {
    browseUrls,
    contactEmail,
    contactName,
    downloadUrls,
    messageIsError,
    messages,
    orderInfo,
    percentDoneDownloadLinks,
    progressPercentage,
    s3Urls,
    stacLinks,
    stacLinksIsLoading,
    totalCompleteOrders,
    totalOrders
  } = getOrderInfoAndProgress({
    granuleLinks,
    isDownload,
    isEchoOrders,
    isEsi,
    isHarmony,
    isOpendap,
    isSwodlr,
    orders,
    stateFromOrderStatus
  })

  return (
    <li className={className}>
      <header className="order-status-item__header">
        <h4 className="order-status-item__heading" title={title}>{title}</h4>
        {
          !opened && (
            <>
              <span className="order-status-item__meta-column order-status-item__meta-column--progress">
                <ProgressRing
                  className="order-status-item__progress-ring"
                  width={22}
                  strokeWidth={3}
                  progress={progressPercentage}
                />
                <span
                  className="order-status-item__status"
                  aria-label="Order Status"
                >
                  {!hasStatus ? 'Complete' : formatOrderStatus(orderStatus)}
                </span>
                {
                  (progressPercentage != null && progressPercentage >= 0) && (
                    <span
                      className="order-status-item__percentage"
                      aria-label="Order Progress Percentage"
                    >
                      {`(${progressPercentage}%)`}
                    </span>
                  )
                }
              </span>
              <span
                className="order-status-item__meta-column order-status-item__meta-column--access-method"
                aria-label="Access Method Type"
              >
                {upperFirst(accessMethodType)}
              </span>
              <span
                className="order-status-item__meta-column order-status-item__meta-column--granules"
                aria-label="Granule Count"
              >
                {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
              </span>
            </>
          )
        }
        <Button
          className="order-status-item__button"
          type="icon"
          icon={opened ? ArrowChevronUp : ArrowChevronDown}
          label={opened ? 'Close details' : 'Show details'}
          title={opened ? 'Close details' : 'Show details'}
          onClick={() => setOpened(!opened)}
        />
      </header>
      {
        opened && (
          <div className="order-status-item__body">
            <div className="order-status-item__body-header" data-testid="order-status-item__body-header">
              <div className="order-status-item__body-header-primary">
                <div className="order-status-item__meta-row">
                  <div className="order-status-item__meta">
                    <h4 className="order-status-item__meta-heading">Status</h4>
                    <div className="order-status-item__meta-body order-status-item__meta-body--progress">
                      <ProgressRing
                        className="order-status-item__progress-ring"
                        width={22}
                        strokeWidth={3}
                        progress={progressPercentage}
                      />
                      <div className="order-status-item__progress-meta">
                        <div>
                          <span
                            className="order-status-item__status"
                            aria-label="Order Status"
                          >
                            {!hasStatus ? 'Complete' : formatOrderStatus(orderStatus)}
                          </span>
                          {
                            (progressPercentage != null && progressPercentage >= 0) && (
                              <span
                                className="order-status-item__percentage"
                                aria-label="Order Progress Percentage"
                              >
                                {`(${progressPercentage}%)`}
                              </span>
                            )
                          }
                        </div>
                        {
                          totalOrders > 0 && (
                            <span
                              className="order-status-item__orders-processed"
                              aria-label="Orders Processed Count"
                            >
                              {`${totalCompleteOrders}/${totalOrders} orders complete`}
                            </span>
                          )
                        }
                        <span
                          className="order-status-item__orders-processed"
                          aria-label="Order Last Updated Time"
                        >
                          Last Updated:
                          {' '}
                          {moment(updatedAt).format('MM-DD HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="order-status-item__meta">
                    <h4 className="order-status-item__meta-heading">Access Method</h4>
                    <div
                      className="order-status-item__meta-body order-status-item__meta-body--access-method"
                      aria-label="Access Method Type"
                    >
                      {upperFirst(accessMethodType)}
                    </div>
                  </div>
                  <div className="order-status-item__meta">
                    <h4 className="order-status-item__meta-heading">Granules</h4>
                    <div
                      className="order-status-item__meta-body order-status-item__meta-body--granules"
                      aria-label="Granule Count"
                    >
                      {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
                    </div>
                  </div>
                </div>
                {
                  orderInfo && (
                    <div className="order-status-item__meta-row">
                      <div
                        className="order-status-item__order-info"
                        aria-label="Order Information"
                      >
                        {orderInfo}
                      </div>
                    </div>
                  )
                }
              </div>
              {
                collectionIsCSDA && (
                  <Col
                    className="order-status-item__note mb-3"
                    aria-label="CSDA Note"
                  >
                    {'This collection is made available through the '}
                    <span className="order-status-item__note-emph order-status-item__note-emph--csda">NASA Commercial Smallsat Data Acquisition (CSDA) Program</span>
                    {' for NASA funded researchers. Access to the data will require additional authentication. '}
                    <Button
                      className="order-status-item__header-message-link"
                      dataTestId="order-status-item__csda-modal-button"
                      onClick={() => onToggleAboutCSDAModal(true)}
                      variant="link"
                      bootstrapVariant="link"
                      icon={FaQuestionCircle}
                      label="More details"
                    >
                      More Details
                    </Button>
                  </Col>
                )
              }
              <div className="order-status-item__additional-info">
                {
                  messages.length > 0 && (
                    <div className={`order-status-item__message${messageIsError ? ' order-status-item__message--is-error' : ''}`}>
                      <h3 className="order-status-item__message-heading">Service has responded with message:</h3>
                      <ul className="order-status-item__message-body">
                        {
                          messages.map((message, i) => {
                            const key = `message-${i}`

                            return (
                              <li key={key}>{message}</li>
                            )
                          })
                        }
                      </ul>
                    </div>
                  )
                }
              </div>
            </div>
            <EDSCTabs className="order-status-item__tabs">
              {
                (
                  isDownload
                    || isOpendap
                    || isEsi
                    || isHarmony
                    || isSwodlr
                ) && (
                  <Tab
                    className={downloadUrls.length > 0 ? '' : 'order-status-item__tab-status'}
                    title="Download Files"
                    eventKey="download-files"
                  >
                    <DownloadFilesPanel
                      accessMethodType={accessMethodType}
                      collectionIsCSDA={collectionIsCSDA}
                      disableEddInProgress={accessMethodType.toLowerCase() === 'harmony' && progressPercentage < 100}
                      downloadLinks={downloadUrls}
                      eddLink={
                        buildEddLink({
                          authToken,
                          collection,
                          downloadUrls,
                          earthdataEnvironment,
                          linkType: 'data'
                        })
                      }
                      granuleCount={granuleCount}
                      granuleLinksIsLoading={granuleLinksIsLoading}
                      percentDoneDownloadLinks={percentDoneDownloadLinks}
                      retrievalCollectionId={retrievalCollectionId}
                      retrievalId={retrievalId}
                      showTextWindowActions={!isEsi}
                    />
                  </Tab>
                )
              }
              {
                ((
                  isDownload
                    || isOpendap
                    || isEsi
                ) && s3Urls.length > 0) && (
                  <Tab
                    className={s3Urls.length > 0 ? '' : 'order-status-item__tab-status'}
                    title="AWS S3 Access"
                    eventKey="aws-s3-access"
                  >
                    <S3LinksPanel
                      accessMethodType={accessMethodType}
                      s3Links={s3Urls}
                      directDistributionInformation={directDistributionInformation}
                      retrievalId={retrievalId}
                      granuleCount={granuleCount}
                      granuleLinksIsLoading={granuleLinksIsLoading}
                      showTextWindowActions={!isEsi}
                    />
                  </Tab>
                )
              }
              {
                isHarmony && (
                  <Tab
                    className={stacLinks.length > 0 ? '' : 'order-status-item__tab-status'}
                    title="STAC Links"
                    eventKey="stac-links"
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
              }
              {
                (isDownload || isOpendap) && (
                  <Tab
                    className={downloadUrls.length > 0 ? '' : 'order-status-item__tab-status'}
                    title="Download Script"
                    eventKey="download-script"
                  >
                    <DownloadScriptPanel
                      accessMethodType={accessMethodType}
                      earthdataEnvironment={earthdataEnvironment}
                      downloadLinks={downloadUrls}
                      retrievalCollection={collection}
                      retrievalId={retrievalId}
                      granuleCount={granuleCount}
                      granuleLinksIsLoading={granuleLinksIsLoading}
                    />
                  </Tab>
                )
              }
              {
                browseUrls.length > 0 && (
                  <Tab
                    title="Browse Imagery"
                    eventKey="browse-imagery"
                  >
                    <BrowseLinksPanel
                      accessMethodType={accessMethodType}
                      earthdataEnvironment={earthdataEnvironment}
                      browseUrls={browseUrls}
                      retrievalCollection={collection}
                      eddLink={
                        buildEddLink({
                          authToken,
                          collection,
                          downloadUrls,
                          earthdataEnvironment,
                          linkType: 'browse'
                        })
                      }
                      retrievalId={retrievalId}
                      granuleCount={granuleCount}
                      granuleLinksIsLoading={granuleLinksIsLoading}
                    />
                  </Tab>
                )
              }
              {
                ((isEsi || isHarmony || isSwodlr) && orders.length > 0) && (
                  <Tab
                    title="Order Status"
                    eventKey="order-status"
                  >
                    {
                      orders.length > 1 && (
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
                      orders={orders}
                    />
                  </Tab>
                )
              }
            </EDSCTabs>
          </div>
        )
      }
    </li>
  )
}

OrderStatusItem.defaultProps = {
  defaultOpen: false
}

OrderStatusItem.propTypes = {
  authToken: PropTypes.string.isRequired,
  collection: PropTypes.shape({
    access_method: PropTypes.shape({
      type: PropTypes.string
    }),
    collection_metadata: PropTypes.shape({
      conceptId: PropTypes.string,
      directDistributionInformation: PropTypes.shape({}),
      isCSDA: PropTypes.bool,
      shortName: PropTypes.string,
      title: PropTypes.string,
      versionId: PropTypes.string
    }),
    collection: PropTypes.shape({}),
    granule_count: PropTypes.number,
    id: PropTypes.number,
    isLoaded: PropTypes.bool,
    orders: PropTypes.arrayOf(PropTypes.shape({})),
    retrieval_id: PropTypes.string,
    retrieval_collection_id: PropTypes.string,
    updated_at: PropTypes.string
  }).isRequired,
  defaultOpen: PropTypes.bool,
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleBrowseLinks: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired
}

export default OrderStatusItem
