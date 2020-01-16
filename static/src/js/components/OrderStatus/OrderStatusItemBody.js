import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getStateFromOrderStatus, formatOrderStatus } from '../../../../../sharedUtils/orderStatus'

import Button from '../Button/Button'
import ButtonDropdown from '../ButtonDropdown/ButtonDropdown'
import OrderDropdownList from '../OrderDropdownList/OrderDropdownList'
import OrderProgressList from '../OrderProgressList/OrderProgressList'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './OrderStatusItemBody.scss'

export class OrderStatusItemBody extends Component {
  constructor() {
    super()
    this.state = {
      detailsOpen: false
    }

    this.onDetailsToggle = this.onDetailsToggle.bind(this)
  }

  onDetailsToggle() {
    const { detailsOpen } = this.state
    this.setState({
      detailsOpen: !detailsOpen
    })
  }

  render() {
    const {
      detailsOpen
    } = this.state

    const {
      collection,
      match,
      orderStatus,
      onChangePath,
      type
    } = this.props

    const { params } = match
    const { id: retrievalId } = params

    const {
      collection_metadata: collectionMetadata,
      id,
      orders = []
    } = collection

    const {
      browse_flag: browseFlag
    } = collectionMetadata

    const className = classNames([
      'order-status-item-body__state-display',
      {
        'order-status-item-body__state-display--complete': getStateFromOrderStatus(orderStatus) === 'complete',
        'order-status-item-body__state-display--failed': getStateFromOrderStatus(orderStatus) === 'failed'
      }
    ])

    if (['download', 'opendap'].includes(type)) {
      return (
        <div className="order-status-item-body">
          <div className="order-status-item-body__details">
            <PortalLinkContainer
              className="order-status-item-body__button order-status-item-body__button--links"
              to={{
                pathname: `/downloads/${retrievalId}/collections/${id}/links`
              }}
              target="_blank"
              dataTestId="download-data-links"
            >
              <Button
                bootstrapVariant="primary"
                bootstrapSize="sm"
                label="View/Download Data Links"
                tooltip="View or download data URLs"
                tooltipPlacement="bottom"
                tooltipId="tooltip__download-links"
              >
                View/Download Data Links
              </Button>
            </PortalLinkContainer>
            <PortalLinkContainer
              className="order-status-item-body__button order-status-item-body__button--links"
              to={{
                pathname: `/downloads/${retrievalId}/collections/${id}/script`
              }}
              target="_blank"
            >
              <Button
                bootstrapVariant="primary"
                bootstrapSize="sm"
                label="Download Access Script"
                tooltip="Download executable shell script (requires UNIX environment)"
                tooltipPlacement="bottom"
                tooltipId="tooltip__download-access-script"
              >
                Download Access Script
              </Button>
            </PortalLinkContainer>
          </div>
        </div>
      )
    }

    if (type === 'echo_orders') {
      return (
        <div className="order-status-item-body">
          <div className="order-status-item-body__state">
            <span className={className}>
              {formatOrderStatus(orderStatus)}
            </span>
          </div>
          <div className="order-status-item-body__details">
            {
              browseFlag && (
                <PortalLinkContainer
                  className="order-status-item-body__button order-status-item-body__button--browse-links"
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
              )
            }
          </div>
        </div>
      )
    }

    if (type === 'esi') {
      // Total orders complete
      let totalComplete = 0

      // Total number of orders
      const totalOrders = orders.length

      // Total number of granules
      let totalNumber = 0

      // Total number of granules that have been processed by the provider
      let totalProcessed = 0

      // Urls to the completed orders
      const downloadUrls = []

      // Iterate through each of the orders that were created for the provided collection
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
          totalComplete += 1
        }

        downloadUrls.push(...currentDownloadUrls)
        totalNumber += currentTotalNumber
        totalProcessed += currentNumberProcessed
      })

      let contact
      let contactName
      let contactEmail
      let stateMessage

      switch (orderStatus) {
        case 'creating':
          stateMessage = 'Your orders are pending processing. This may take some time.'
          break

        case 'in progress':
          stateMessage = 'Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.'
          break

        case 'complete':
          stateMessage = 'Your orders are done processing and are available for download.'
          break

        default:
          break
      }

      if (orders.length && orders[0].contact) {
        // eslint-disable-next-line prefer-destructuring
        contact = orders[0].contact
        contactName = contact.name
        contactEmail = contact.email
      }

      let totalPercentProcessed
      if (totalNumber === 0) {
        totalPercentProcessed = 0
      } else {
        totalPercentProcessed = Math.floor(totalProcessed / totalNumber * 100)
      }

      return (
        <div className="order-status-item-body">
          <div className="order-status-item-body__state">
            <span className={className}>
              {formatOrderStatus(orderStatus)}
            </span>
            {
              stateMessage && (
                <span>{stateMessage}</span>
              )
            }
          </div>
          <div className="order-status-item-body__details">
            <div className="order-status-item-body__status">
              <span className="order-status-item-body__processed">
                {`${totalComplete}/${totalOrders} orders complete`}
              </span>
              {` (${totalPercentProcessed}%)`}
            </div>
            <Button
              className="order-status-item-body__button order-status-item-body__button--more-details"
              bootstrapVariant="primary"
              bootstrapSize="sm"
              label="More Details"
              disabled={totalNumber === 0}
              onClick={this.onDetailsToggle}
            >
              More Details
              {' '}
              {
                !detailsOpen
                  ? <i className="fa fa-chevron-down" />
                  : <i className="fa fa-chevron-up" />
              }
            </Button>
            {
              orders.length > 0 && (
                <>
                  <ButtonDropdown
                    className="order-status-item-body__button order-status-item-body__button--links order-status-item-body__links-dropdown"
                    buttonContent="Download Links"
                    buttonLabel="Download Links"
                    disabled={downloadUrls.length === 0}
                  >
                    <OrderDropdownList
                      orders={orders}
                      totalOrders={totalOrders}
                    />
                  </ButtonDropdown>
                </>
              )
            }
            {
              browseFlag && (
                <PortalLinkContainer
                  className="order-status-item-body__button"
                  to={{
                    pathname: `/granules/download/${id}`,
                    search: '?browse=true'
                  }}
                  onClick={() => onChangePath(`/granules/download/${id}?browse=true`)}
                >
                  <Button
                    className="order-status-item-body__button order-status-item-body__button--browse-links"
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
              )
            }
          </div>
          {
            detailsOpen && (
              <>
                <OrderProgressList
                  orders={orders}
                />
                {
                  contact && (
                    <footer className="order-status-item-body__contact">
                      {`For assistance, please contact ${contactName} at `}
                      <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                    </footer>
                  )
                }
              </>
            )
          }
        </div>
      )
    }

    return null
  }
}

OrderStatusItemBody.propTypes = {
  collection: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  orderStatus: PropTypes.string.isRequired,
  onChangePath: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}

export default OrderStatusItemBody
