import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Col, Tab } from 'react-bootstrap'
import { upperFirst } from 'lodash'
import {
  FaChevronUp,
  FaChevronDown,
  FaQuestionCircle
} from 'react-icons/fa'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { getStateFromOrderStatus, aggregatedOrderStatus, formatOrderStatus } from '../../../../../sharedUtils/orderStatus'
import { pluralize } from '../../util/pluralize'
import { commafy } from '../../util/commafy'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'
import EDSCTabs from '../EDSCTabs/EDSCTabs'
import OrderProgressList from '../OrderProgressList/OrderProgressList'
import STACJsonPanel from './OrderStatusItem/STACJsonPanel'
import DownloadFilesPanel from './OrderStatusItem/DownloadFilesPanel'
import S3LinksPanel from './OrderStatusItem/S3LinksPanel'
import DownloadScriptPanel from './OrderStatusItem/DownloadScriptPanel'

import ProgressRing from '../ProgressRing/ProgressRing'

import './OrderStatusItem.scss'

/**
 * Renders OrderStatusItem.
 * @param {Object} arg0 - The props passed into the component.
 * @param {Boolean} arg0.defaultOpen - Sets the item open on intital render.
 * @param {String} arg0.earthdataEnvironment - The earthdata environment.
 * @param {Object} arg0.granuleDownload - granuleDownload state.
 * @param {Object} arg0.collection - The collection state.
 * @param {Object} arg0.match - match parameter from React Router.
 * @param {Function} arg0.onChangePath - Callback function to change the current path.
 * @param {Function} arg0.onFetchRetrievalCollection - Callback function to fetch a retrieval.
 * @param {Function} arg0.onFetchRetrievalCollectionGranuleLinks - Callback function to fetch a links for a retrieval collection.
*/
export class OrderStatusItem extends PureComponent {
  constructor(props) {
    super(props)

    const {
      defaultOpen
    } = props

    this.state = {
      opened: defaultOpen || false
    }

    this.onOpenClick = this.onOpenClick.bind(this)
  }

  componentDidMount() {
    const {
      granuleDownload,
      onFetchRetrievalCollection,
      onFetchRetrievalCollectionGranuleLinks,
      collection
    } = this.props

    const { access_method: accessMethod } = collection
    const { type: accessMethodType } = accessMethod

    // TODO: Add a second value and refresh at different intervals for the different types of orders
    const { orderStatusRefreshTime } = getApplicationConfig()

    if (collection && !['download', 'opendap'].includes(accessMethodType.toLowerCase())) {
      const { id } = collection

      if (id) {
        // Fetch the retrieval collection before waiting for the interval
        onFetchRetrievalCollection(id)

        // Start refreshing the retrieval collection
        this.intervalId = setInterval(() => {
          this.shouldRefresh()
        }, orderStatusRefreshTime)
      }
    }

    if (collection && ['download', 'opendap'].includes(accessMethodType.toLowerCase())) {
      const { id } = collection

      const {
        [id]: granuleLinks = [],
        isLoading: granuleLinksIsLoading
      } = granuleDownload

      if (granuleLinks.length === 0 && !granuleLinksIsLoading) {
        onFetchRetrievalCollectionGranuleLinks(collection)
      }
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  onOpenClick() {
    const { opened } = this.state
    this.setState({
      opened: !opened
    })
  }

  shouldRefresh() {
    const {
      collection,
      onFetchRetrievalCollection
    } = this.props

    const {
      id,
      orders = []
    } = collection

    const orderStatus = aggregatedOrderStatus(orders)

    // If the order is in a terminal state stop asking for order status
    if (['complete', 'failed', 'canceled'].includes(orderStatus)) {
      clearInterval(this.intervalId)
    } else {
      onFetchRetrievalCollection(id)
    }
  }

  render() {
    const {
      opened
    } = this.state

    const {
      collection,
      earthdataEnvironment,
      granuleDownload,
      onChangePath,
      onToggleAboutCSDAModal
    } = this.props

    const {
      access_method: accessMethod,
      collection_metadata: collectionMetadata,
      granule_count: granuleCount,
      orders = [],
      id,
      isLoaded,
      retrieval_id: retrievalId
    } = collection

    const { type: accessMethodType } = accessMethod

    const {
      [id]: granuleLinks = [],
      isLoading: granuleLinksIsLoading
    } = granuleDownload

    if (isLoaded) {
      const {
        browseFlag,
        directDistributionInformation = {},
        title,
        isCSDA: collectionIsCSDA
      } = collectionMetadata

      const orderStatus = aggregatedOrderStatus(orders)
      const stateFromOrderStatus = getStateFromOrderStatus(orderStatus)

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

      const messages = []
      let messageIsError = false
      let orderInfo = null

      let downloadUrls = []
      let s3Urls = []
      let totalOrders = 0
      let totalCompleteOrders = 0
      let percentDoneDownloadLinks
      let progressPercentage = 0
      let contactName = null
      let contactEmail = null
      let stacLinksIsLoading = false
      let stacLinks = []

      if (isDownload) {
        progressPercentage = 100
        orderInfo = 'Download your data directly from the links below, or use the provided download script.'
        const { links: granuleDownloadLinks = {} } = granuleLinks
        const {
          download: downloadLinks = [],
          s3: s3Links = []
        } = granuleDownloadLinks;
        ({ percentDone: percentDoneDownloadLinks } = granuleLinks)
        if (downloadLinks.length > 0) downloadUrls = [...downloadLinks]
        if (s3Links.length > 0) s3Urls = [...s3Links]
      }

      if (isOpendap) {
        progressPercentage = 100
        orderInfo = 'Download your data directly from the links below, or use the provided download script.'
        const { links: granuleDownloadLinks = {} } = granuleLinks
        const {
          download: downloadLinks = [],
          s3: s3Links = []
        } = granuleDownloadLinks
        if (downloadLinks.length > 0) downloadUrls = [...downloadLinks]
        if (s3Links.length > 0) s3Urls = [...s3Links]
      }

      if (isEchoOrders) {
        if (stateFromOrderStatus === 'creating' || stateFromOrderStatus === 'in_progress') {
          progressPercentage = 0
          orderInfo = 'Your order has been created and sent to the data provider. You will receive an email when your order is processed and ready to download.'
        }

        if (stateFromOrderStatus === 'complete') {
          progressPercentage = 100
          orderInfo = 'The data provider has completed processing your order. You should have received an email with information regarding how to access your data from the data provider.'
        }

        if (stateFromOrderStatus === 'failed') {
          progressPercentage = 100
          orderInfo = 'The data provider is reporting the order has failed processing.'
        }
      }

      if (isEsi || isHarmony) {
        if (stateFromOrderStatus === 'creating') {
          progressPercentage = 0

          orderInfo = 'Your orders are pending processing. This may take some time.'
        }

        if (stateFromOrderStatus === 'in_progress') {
          orderInfo = 'Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.'
        }

        if (stateFromOrderStatus === 'complete') {
          orderInfo = 'Your orders are done processing and are available for download.'
        }

        if (stateFromOrderStatus === 'failed') {
          progressPercentage = 0
          orderInfo = 'The order has failed processing.'
        }

        if (stateFromOrderStatus === 'canceled') {
          progressPercentage = 0
          orderInfo = 'The order has been canceled.'
        }

        if (isEsi) {
          let totalNumber = 0
          let totalProcessed = 0

          if (orders.length) {
            const { order_information: orderInformation } = orders[0]
            const { contactInformation = {} } = orderInformation;
            ({ contactName, contactEmail } = contactInformation)
          }

          orders.forEach((order) => {
            const {
              error,
              order_information: orderInformation = {}
            } = order

            if (error) messages.push(error)

            const {
              downloadUrls: currentDownloadUrlsObject = {},
              processInfo = {},
              requestStatus = {}
            } = orderInformation

            // Display the message field from processInfo if it exists
            const { message } = processInfo

            // Wrap the message in an array, then flatten the array to ensure both string and array messages are the same
            // Only display the first message provided
            if (message) messages.push([message].flat()[0])

            const { downloadUrl: currentDownloadUrls = [] } = currentDownloadUrlsObject

            const {
              status: currentStatus,
              numberProcessed: currentNumberProcessed = 0,
              totalNumber: currentTotalNumber = 0
            } = requestStatus

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
        }

        if (isHarmony) {
          let totalProgress = 0

          orders.forEach((order) => {
            const { order_information: orderInformation } = order

            const {
              progress = 0,
              links = [],
              status,
              message: harmonyMessage,
              jobId = false
            } = orderInformation

            if (status === 'successful' || status === 'failed' || status === 'canceled') {
              totalCompleteOrders += 1
            }

            if (status === 'successful' && !jobId) {
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
              .filter(({ rel }) => rel === 'data')
              .map(({ href }) => href))

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
          if (orders.length) {
            stacLinks = orders.map((order) => {
              const { order_information: orderInformation = {} } = order
              const { links = [] } = orderInformation

              const stacLink = links.find(({ rel }) => rel === 'stac-catalog-json')

              if (stacLink) {
                const { href = '' } = stacLink
                return href
              }
              return false
            }).filter(Boolean)
          }

          // If all orders are complete, all STAC links have finished loading
          stacLinksIsLoading = orders.length !== totalCompleteOrders
        }
      }

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
                    <span className="order-status-item__status">
                      {
                        !hasStatus ? 'Complete' : formatOrderStatus(orderStatus)
                      }
                    </span>
                    {
                      (progressPercentage != null && progressPercentage >= 0) && (
                        <span className="order-status-item__percentage">
                          {
                            `(${progressPercentage}%)`
                          }
                        </span>
                      )
                    }
                  </span>
                  <span className="order-status-item__meta-column order-status-item__meta-column--access-method">
                    {upperFirst(accessMethodType)}
                  </span>
                  <span className="order-status-item__meta-column order-status-item__meta-column--granules">
                    {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
                  </span>
                </>
              )
            }
            <Button
              className="order-status-item__button"
              type="icon"
              icon={opened ? FaChevronUp : FaChevronDown}
              label={opened ? 'Close details' : 'Show details'}
              title={opened ? 'Close details' : 'Show details'}
              onClick={this.onOpenClick}
            />
          </header>
          {
            opened && (
              <div className="order-status-item__body">
                <div className="order-status-item__body-header">
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
                              <span className="order-status-item__status">
                                {
                                  !hasStatus ? 'Complete' : formatOrderStatus(orderStatus)
                                }
                              </span>
                              {
                                (progressPercentage != null && progressPercentage >= 0) && (
                                  <span className="order-status-item__percentage">
                                    {
                                      `(${progressPercentage}%)`
                                    }
                                  </span>
                                )
                              }
                            </div>
                            {
                              totalOrders > 0 && (
                                <>
                                  <span className="order-status-item__orders-processed">
                                    {`${totalCompleteOrders}/${totalOrders} orders complete`}
                                  </span>
                                </>
                              )
                            }
                          </div>
                        </div>
                      </div>
                      <div className="order-status-item__meta">
                        <h4 className="order-status-item__meta-heading">Access Method</h4>
                        <div className="order-status-item__meta-body order-status-item__meta-body--access-method">
                          {upperFirst(accessMethodType)}
                        </div>
                      </div>
                      <div className="order-status-item__meta">
                        <h4 className="order-status-item__meta-heading">Granules</h4>
                        <div className="order-status-item__meta-body order-status-item__meta-body--granules">
                          {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
                        </div>
                      </div>
                    </div>
                    {
                      orderInfo && (
                        <div className="order-status-item__meta-row">
                          <div className="order-status-item__order-info">
                            {orderInfo}
                          </div>
                        </div>
                      )
                    }
                  </div>
                  {
                    collectionIsCSDA && (
                      <Col className="order-status-item__note mb-3">
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
                    ) && (
                      <Tab
                        className={downloadUrls.length > 0 ? '' : 'order-status-item__tab-status'}
                        title="Download Files"
                        eventKey="download-files"
                      >
                        <DownloadFilesPanel
                          accessMethodType={accessMethodType}
                          downloadLinks={downloadUrls}
                          granuleCount={granuleCount}
                          granuleLinksIsLoading={granuleLinksIsLoading}
                          percentDoneDownloadLinks={percentDoneDownloadLinks}
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
                    (
                      (isEchoOrders && browseFlag)
                      || (isEsi && browseFlag)
                    ) && (
                      <Tab
                        title="Imagery"
                        eventKey="browse-imagery"
                      >
                        <PortalLinkContainer
                          className="order-status-item__button order-status-item__button--browse-links"
                          to={{
                            pathname: `/granules/download/${id}`,
                            search: '?browse=true'
                          }}
                          onClick={() => onChangePath(`/granules/download/${id}?browse=true`)}
                        >
                          <Button
                            bootstrapVariant="primary"
                            bootstrapSize="sm"
                            label="View Browse Image Links"
                            tooltip="View clickable browse image links in the browser"
                            tooltipPlacement="bottom"
                            tooltipId="tooltip__download-links"
                          >
                            View Browse Image Links
                          </Button>
                        </PortalLinkContainer>
                      </Tab>
                    )
                  }
                  {
                    ((isEsi || isHarmony) && orders.length > 0) && (
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

    // TODO: Render a loading state
    return null
  }
}

OrderStatusItem.defaultProps = {
  defaultOpen: false
}

OrderStatusItem.propTypes = {
  collection: PropTypes.shape({
    access_method: PropTypes.shape({}),
    collection_metadata: PropTypes.shape({}),
    collection: PropTypes.shape({}),
    granule_count: PropTypes.number,
    id: PropTypes.number,
    isLoaded: PropTypes.bool,
    orders: PropTypes.arrayOf(PropTypes.shape({})),
    retrieval_id: PropTypes.string
  }).isRequired,
  defaultOpen: PropTypes.bool,
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired
}

export default OrderStatusItem
