/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {
  PureComponent,
  useState,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Tab } from 'react-bootstrap'
import { upperFirst } from 'lodash'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { getStateFromOrderStatus, aggregatedOrderStatus, formatOrderStatus } from '../../../../../sharedUtils/orderStatus'
import { pluralize } from '../../util/pluralize'
import { commafy } from '../../util/commafy'
import { generateDownloadScript } from '../../util/files/generateDownloadScript'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'
import EDSCTabs from '../EDSCTabs/EDSCTabs'
import TextWindowActions from '../TextWindowActions/TextWindowActions'

import ProgressRing from '../ProgressRing/ProgressRing'
import OrderStatusItemBody from './OrderStatusItemBody'

import './OrderStatusItem.scss'

const DownloadLinksPanel = ({
  accessMethodType,
  granuleLinks,
  isDownload,
  isEsi,
  isHarmony,
  isOpendap,
  onFetchRetrieval,
  onFetchRetrievalCollectionGranuleLinks,
  retrievalId,
  totalLinks
}) => {
  if (granuleLinks.length > 1) {
    const downloadFileName = `${retrievalId}-${accessMethodType}.txt`

    return (
      <>
        <p className="order-status-item__tab-intro">
          {
            (isDownload || isOpendap) && 'When the links are retrieved, they will be displayed below.'
          }
          {
            isEsi && 'Once the order is finished processing, links to the data will be retrieved and displayed below.'
          }
          {
            isHarmony && 'Once the order is finished processing, links to the data will be retrieved and displayed below.'
          }
          <span className="order-status-item__status-text">
            {` (${granuleLinks.length} of ${totalLinks} links retrieved)`}
          </span>
        </p>
        <TextWindowActions
          id={`links-${retrievalId}`}
          fileContents={granuleLinks.join('\n')}
          fileName={downloadFileName}
          clipboardContents={granuleLinks.join('\n')}
          modalTitle="Download Links"
        >
          <ul className="download-links-panel__list">
            {
              granuleLinks.map((link, i) => {
                const key = `link_${i}`
                return (
                  <li key={key}>
                    <a href={link}>{link}</a>
                  </li>
                )
              })
            }
          </ul>
        </TextWindowActions>
      </>
    )
  }

  return null
}

const DownloadScriptPanel = ({
  accessMethodType,
  granuleLinks,
  onFetchRetrieval,
  onFetchRetrievalCollectionGranuleLinks,
  retrievalCollection,
  retrievalId,
  totalLinks
}) => {
  if (granuleLinks.length > 0) {
    // TODO: Should this account for duplicate accessmethods on a retrieval
    const downloadFileName = `${retrievalId}-${accessMethodType}.sh`

    return (
      <>
        <div className="order-status-item__tab-intro">
          When the links are retrieved, they will be displayed below.
          <span className="order-status-item__status-text">
            {` (${granuleLinks.length} of ${totalLinks} links retrieved)`}
          </span>
          <h5 className="mt-2">How to use this script</h5>
          <p className="collection-download-display__intro">
            <strong>Linux: </strong>
            { 'You must first make the script an executable by running the line \'chmod 777 download.sh\' from the command line. After that is complete, the file can be executed by typing \'./download.sh\'. ' }
            { 'For a detailed walk through of this process, please reference this ' }
            <a href="https://wiki.earthdata.nasa.gov/display/EDSC/How+To%3A+Use+the+Download+Access+Script">How To guide</a>
            { '.' }
          </p>
          <p>
            <strong>Windows: </strong>
            {
              'The file can be executed within Windows by first installing a Unix-like command line utility such as '
            }
            <a href="https://www.cygwin.com/">Cygwin</a>
            {
              '. After installing Cygwin (or a similar utility), run the line \'chmod 777 download.sh\' from the utility\'s command line, and then execute by typing \'./download.sh\'.'
            }
          </p>
        </div>
        <TextWindowActions
          id={`script-${retrievalId}`}
          fileContents={generateDownloadScript(granuleLinks, retrievalCollection)}
          fileName={downloadFileName}
          clipboardContents={generateDownloadScript(granuleLinks, retrievalCollection)}
          modalTitle="Download Script"
        >
          <pre className="download-links-panel__pre">
            {
              generateDownloadScript(granuleLinks, retrievalCollection)
            }
          </pre>
        </TextWindowActions>
      </>
    )
  }

  return null
}

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
      defaultOpen,
      granuleDownload,
      onFetchRetrievalCollection,
      onFetchRetrievalCollectionGranuleLinks,
      order
    } = this.props

    const { access_method: accessMethod } = order
    const { type: accessMethodType } = accessMethod

    // TODO: Add a second value and refresh at different intervals for the different types of orders
    const { orderStatusRefreshTime } = getApplicationConfig()

    if (order && !['download', 'opendap'].includes(accessMethodType.toLowerCase())) {
      const { id } = order

      if (id) {
        // Fetch the retrieval collection before waiting for the interval
        onFetchRetrievalCollection(id)

        // Start refreshing the retrieval collection
        this.intervalId = setInterval(() => {
          try {
            this.shouldRefresh()
          } catch (e) {
            console.log(e)
          }
        }, orderStatusRefreshTime)
      }
    }

    if (order && ['download', 'opendap'].includes(accessMethodType.toLowerCase())) {
      const { id } = order
      const {
        [id]: granuleLinks = [],
        isLoaded: granuleLinksIsLoaded,
        isLoading: granuleLinksIsLoading
      } = granuleDownload

      if (granuleLinks.length === 0 && !granuleLinksIsLoading) onFetchRetrievalCollectionGranuleLinks(order)
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
      order,
      onFetchRetrievalCollection
    } = this.props

    const {
      id,
      orders = []
    } = order

    const orderStatus = aggregatedOrderStatus(orders)

    // If the order is in a terminal state stop asking for order status
    if (['complete', 'failed'].includes(orderStatus)) {
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
      collectionId,
      granuleDownload,
      match,
      onChangePath,
      onFetchRetrieval,
      onFetchRetrievalCollection,
      onFetchRetrievalCollectionGranuleLinks,
      order,
      retrievalCollection
    } = this.props

    let collectionMetadata

    const {
      access_method: accessMethod,
      collection_metadata: collectionsMetadata,
      granule_count: granuleCount,
      orders = [],
      id,
      isLoaded,
      retrieval_id: retrievalId
    } = order

    const { type: accessMethodType } = accessMethod

    const {
      [id]: granuleLinks = [],
      isLoaded: granuleLinksIsLoaded,
      isLoading: granuleLinksIsLoading
    } = granuleDownload

    // Downloadable orders dont maintain a status
    const hasStatus = !['download', 'opendap'].includes(accessMethodType.toLowerCase())

    if (isLoaded) {
      let browseFlag
      let title

      if (collectionsMetadata && collectionsMetadata.title) {
        collectionMetadata = collectionsMetadata;

        ({
          browseFlag,
          title
        } = collectionMetadata)
      } else if (collectionsMetadata && collectionsMetadata[collectionId] && collectionsMetadata[collectionId].title) {
        collectionMetadata = collectionsMetadata[collectionId];

        ({
          browseFlag,
          title
        } = collectionMetadata)
      }

      const orderStatus = aggregatedOrderStatus(orders)
      const stateFromOrderStatus = getStateFromOrderStatus(orderStatus)

      const className = classNames(
        'order-status-item',
        {
          'order-status-item--is-opened': opened,
          'order-status-item--complete': !hasStatus || (hasStatus && stateFromOrderStatus === 'complete'),
          'order-status-item--in_progress': hasStatus && stateFromOrderStatus === 'in_progress',
          'order-status-item--failed': hasStatus && stateFromOrderStatus === 'failed'
        }
      )

      const typeToLower = accessMethodType.toLowerCase()
      const isDownloadableOrder = ['download', 'opendap'].includes(typeToLower)
      const isDownload = typeToLower === 'download'
      const isOpendap = typeToLower === 'opendap'
      const isHarmony = typeToLower === 'harmony'
      const isEchoOrders = typeToLower === 'echo orders'
      const isEsi = typeToLower === 'esi'

      let errorInfo = null
      let orderInfo = null

      let downloadUrls = []
      let totalOrders = 0
      let totalCompleteOrders = 0
      let actualPercentage = 0
      let progressPercentage = 0

      if (isDownload) {
        actualPercentage = 100
        progressPercentage = 100
        orderInfo = 'Download your data directly from the links below, or use the provided download script. '
        if (granuleLinks.length > 1) downloadUrls = [...granuleLinks]
      }

      if (isOpendap) {
        actualPercentage = 100
        progressPercentage = 100
        orderInfo = 'Download your data directly from the links below, or use the provided download script. '
        if (granuleLinks.length > 1) downloadUrls = [...granuleLinks]
      }

      if (isEchoOrders) {
        if (stateFromOrderStatus === 'creating') {
          actualPercentage = null
          progressPercentage = 10
          orderInfo = 'Your order has been created and sent to the data provider. You will recieve an email when your order is processed and ready to download.'
        }

        if (stateFromOrderStatus === 'complete') {
          actualPercentage = 100
          progressPercentage = 100
          orderInfo = 'The data provider has completed processing your order. You should have recieved an email with information regarding how to access your data.'
        }

        if (stateFromOrderStatus === 'failed') {
          actualPercentage = null
          progressPercentage = 100
          // TODO: fix me
          orderInfo = 'The data provider is reporting the order has failed processing.'
          errorInfo = 'This has an error.'
        }
      }

      if (isEsi || isHarmony) {
        if (stateFromOrderStatus === 'creating') {
          actualPercentage = null
          progressPercentage = 10

          orderInfo = 'Your orders are pending processing. This may take some time.'
        }

        if (stateFromOrderStatus === 'in_progress') {
          orderInfo = 'Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.'
        }

        if (stateFromOrderStatus === 'complete') {
          orderInfo = 'Your orders are done processing and are available for download.'
        }

        if (stateFromOrderStatus === 'failed') {
          // Calculate the percentage here
          actualPercentage = null
          progressPercentage = 100

          orderInfo = 'The order has failed processing.'
          errorInfo = 'This has an error.'
        }

        if (isEsi) {
          let totalNumber = 0
          let totalProcessed = 0

          orders.forEach((order) => {
            const { order_information: orderInformation } = order

            const {
              downloadUrls: currentDownloadUrlsObject = {},
              requestStatus = {}
            } = orderInformation

            const { downloadUrl: currentDownloadUrls = [] } = currentDownloadUrlsObject

            const {
              status: currentStatus,
              numberProcessed: currentNumberProcessed = 0,
              totalNumber: currentTotalNumber = 0
            } = requestStatus

            if (currentStatus === 'complete') {
              totalCompleteOrders += 1
            }

            downloadUrls.push(...currentDownloadUrls)
            totalNumber += currentTotalNumber
            totalProcessed += currentNumberProcessed
            totalOrders += 1
          })

          const currentPercentProcessed = Math.floor(totalProcessed / totalNumber * 100)

          if (currentPercentProcessed) {
            actualPercentage = Math.floor(totalProcessed / totalNumber * 100)
            progressPercentage = Math.floor(totalProcessed / totalNumber * 100)
          }
        }

        if (isHarmony) {
          let totalProgress = 0

          orders.forEach((order) => {
            const { order_information: orderInformation } = order

            const {
              progress,
              links,
              status
            } = orderInformation

            if (status === 'successful') {
              totalCompleteOrders += 1
            }

            downloadUrls.push(...links
              .filter(({ rel }) => rel === 'data')
              .map(({ href }) => href))

            totalProgress += progress
            totalOrders += 1
          })

          const currentPercentProcessed = Math.floor(totalProgress / totalOrders * 100)

          if (currentPercentProcessed) {
            actualPercentage = Math.floor(totalProgress / (totalOrders * 100) * 100)
            progressPercentage = Math.floor(totalProgress / (totalOrders * 100) * 100)
          }
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
                      width={20}
                      strokeWidth={3}
                      progress={progressPercentage}
                    />
                    <span className="order-status-item__status">
                      {
                        !hasStatus ? 'Complete' : formatOrderStatus(orderStatus)
                      }
                    </span>
                    {
                      actualPercentage >= 0 && (
                        <span className="order-status-item__percentage">
                          {
                            `(${actualPercentage}%)`
                          }
                        </span>
                      )
                    }
                  </span>
                  <span className="order-status-item__meta-column">
                    {upperFirst(accessMethodType)}
                  </span>
                  <span className="order-status-item__meta-column">
                    {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
                  </span>
                </>
              )
            }
            <Button
              className="order-status-item__button"
              type="icon"
              icon={opened ? 'chevron-up' : 'chevron-down'}
              label={opened ? 'Close details' : 'Show details'}
              title={opened ? 'Close details' : 'Show details'}
              onClick={this.onOpenClick}
            />
          </header>
          <div className="order-status-item__body">
            {
              opened && (
                <div className="order-status-item__body-header">
                  <span className="order-status-item__meta">
                    <ProgressRing
                      className="order-status-item__progress-ring"
                      width={20}
                      strokeWidth={3}
                      progress={progressPercentage}
                    />
                    <span className="order-status-item__status">
                      {
                        !hasStatus ? 'Complete' : formatOrderStatus(orderStatus)
                      }
                    </span>
                    {
                      actualPercentage >= 0 && (
                        <span className="order-status-item__percentage">
                          {
                            `(${actualPercentage}%)`
                          }
                        </span>
                      )
                    }
                    {
                      totalOrders > 0 && (
                        <span className="order-status-item__orders-processed">
                          {`${totalCompleteOrders}/${totalOrders} orders complete`}
                        </span>
                      )
                    }
                  </span>
                  <span className="order-status-item__meta">
                    {upperFirst(accessMethodType)}
                  </span>
                  <span className="order-status-item__meta">
                    {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
                  </span>
                </div>
              )
            }
            {
              orderInfo && (
                <div className="order-status-item__order-info">
                  {orderInfo}
                </div>
              )
            }
            <EDSCTabs className="order-status-item__tabs">
              {
                (
                  isDownload
                  || isOpendap
                  || isEsi
                  || isHarmony
                ) && (
                  <Tab
                    title="Download Links"
                    eventKey="download-links"
                  >
                    <DownloadLinksPanel
                      accessMethodType={accessMethodType}
                      totalLinks={granuleCount}
                      granuleLinks={downloadUrls}
                      isEsi={isEsi}
                      isDownload={isDownload}
                      isOpendap={isOpendap}
                      isHarmony={isHarmony}
                      onFetchRetrieval={onFetchRetrieval}
                      onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
                      retrievalId={retrievalId}
                      retrievalCollection={order}
                    />
                  </Tab>
                )
              }
              {
                (isDownload || isOpendap) && (
                  <Tab
                    title="Download Script"
                    eventKey="download-script"
                  >
                    <DownloadScriptPanel
                      accessMethodType={accessMethodType}
                      granuleLinks={granuleLinks}
                      isEsi={isEsi}
                      isDownload={isDownload}
                      isOpendap={isOpendap}
                      onFetchRetrieval={onFetchRetrieval}
                      onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
                      retrievalId={retrievalId}
                      retrievalCollection={order}
                      totalLinks={granuleCount}
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
              {/* <Tab
                title="Additional Resources &amp; Documentation"
                eventKey="additional-resources-and-documentation"
              >
                No additional resources or documentation available for this collection
              </Tab> */}
            </EDSCTabs>
            {/* <OrderStatusItemBody
              type={type}
              collection={order}
              match={match}
              orderStatus={orderStatus}
              onChangePath={onChangePath}
              onFetchRetrievalCollection={onFetchRetrievalCollection}
            /> */}
          </div>
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
  defaultOpen: PropTypes.bool,
  granuleDownload: PropTypes.shape({}).isRequired,
  order: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired
}

export default OrderStatusItem
