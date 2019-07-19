import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { Badge, ProgressBar } from 'react-bootstrap'
import { kebabCase } from 'lodash'

import { getStateFromOrderStatus, formatOrderStatus } from '../../util/orderStatus'

import Button from '../Button/Button'
import ButtonDropdown from '../ButtonDropdown/ButtonDropdown'

import './OrderStatusItemBody.scss'

export class OrderStatusItemBody extends React.Component {
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
      onChangePath,
      type
    } = this.props

    const {
      collection_id: collectionId,
      collection_metadata: collectionMetadata,
      id: retrievalId,
      access_method: accessMethod
    } = collection

    const { order = {} } = accessMethod

    const {
      browse_flag: browseFlag
    } = collectionMetadata

    let {
      order_status: orderStatus
    } = order

    if (type === 'download') orderStatus = 'complete'

    const className = classNames([
      'order-status-item-body__state-display',
      {
        'order-status-item-body__state-display--success': getStateFromOrderStatus(orderStatus) === 'success',
        'order-status-item-body__state-display--errored': getStateFromOrderStatus(orderStatus) === 'errored'
      }
    ])

    if (type === 'download') {
      return (
        <div className="order-status-item-body">
          <div className="order-status-item-body__state">
            <span className={className}>
              {formatOrderStatus(orderStatus)}
            </span>
          </div>
          <div className="order-status-item-body__details">
            <Link
              className="order-status-item-body__button order-status-item-body__button--links"
              to={{
                pathname: '/granules/download',
                search: `?rid=${retrievalId}&cid=${collectionId}`
              }}
              onClick={() => onChangePath(`/granules/download/?rid=${retrievalId}&cid=${collectionId}`)}
            >
              <Button
                bootstrapVariant="primary"
                bootstrapSize="sm"
                label="View/Download Data Links"
                tooltip={(<>View or download data URLs</>)}
                tooltipPlacement="bottom"
                tooltipId="tooltip__download-links"
              >
                View/Download Data Links
              </Button>
            </Link>
          </div>
        </div>
      )
    }

    if (type === 'echo_order') {
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
                <Link
                  className="order-status-item-body__button order-status-item-body__button--browse-links"
                  to={{
                    pathname: '/granules/download',
                    search: `?browse=true&rid=${retrievalId}&cid=${collectionId}`
                  }}
                  onClick={() => onChangePath(`/granules/download/?browse=true&rid=${retrievalId}&cid=${collectionId}`)}
                >
                  <Button
                    bootstrapVariant="primary"
                    bootstrapSize="sm"
                    label="View Browse Image Links"
                    tooltip={(<>View clickable browse image links in the browser</>)}
                    tooltipPlacement="bottom"
                    tooltipId="tooltip__download-links"
                  >
                    View Browse Image Links
                  </Button>
                </Link>
              )
            }
          </div>
        </div>
      )
    }

    if (type === 'esi_order') {
      const { service_options: serviceOptions = {} } = order
      const {
        orders,
        total_complete: totalComplete,
        total_number: totalNumber,
        total_orders: totalOrders,
        total_processed: totalProcessed,
        download_urls: downloadUrls
      } = serviceOptions

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

      const totalPercentProcessed = Math.floor(totalProcessed / totalNumber * 100)

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
              label="View Browse Image Links"
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
                    <ul className="order-status-item-body__links">
                      {
                        orders.map((order, i) => {
                          const {
                            order_id: orderId,
                            download_urls: orderDownloadUrls
                          } = order

                          return (
                            <li
                              key={orderId}
                              className="order-status-item-body__links-item"
                            >
                              <h4 className="order-status-item-body__links-title">
                                {`Order ${i + 1}/${totalOrders} `}
                                <span>{`Order ID: ${orderId}`}</span>
                              </h4>
                              <ul className="order-status-item-body__links-list">
                                {
                                  orderDownloadUrls.map(href => (
                                    <li
                                      key={href}
                                      className="order-status-item-body__links-list-item"
                                    >
                                      <a className="order-status-item-body__links-link" href={href}>{href}</a>
                                    </li>
                                  ))
                                }
                              </ul>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </ButtonDropdown>
                </>
              )
            }
            {
              browseFlag && (
                <Link
                  className="order-status-item-body__button"
                  to={{
                    pathname: '/granules/download',
                    search: `?browse=true&rid=${retrievalId}&cid=${collectionId}`
                  }}
                  onClick={() => onChangePath(`/granules/download/?browse=true&rid=${retrievalId}&cid=${collectionId}`)}
                >
                  <Button
                    className="order-status-item-body__button order-status-item-body__button--browse-links"
                    bootstrapVariant="primary"
                    bootstrapSize="sm"
                    label="View Browse Image Links"
                    tooltip={(<>View clickable browse image links in the browser</>)}
                    tooltipPlacement="bottom"
                    tooltipId="tooltip__download-links"
                  >
                    View Browse Image Links
                  </Button>
                </Link>
              )
            }
          </div>
          {
            detailsOpen && (
              <>
                <ul className="order-status-item-body__progress-list">
                  {
                    orders.map((order) => {
                      const {
                        order_id: orderId,
                        order_status: orderStatus,
                        total_number: totalNumber,
                        total_processed: totalProcessed
                      } = order

                      const percentProcessed = Math.floor(totalProcessed / totalNumber * 100)

                      const badgeClass = classNames(
                        'order-status-item-body__badge',
                        {
                          [`order-status-item-body__badge--${kebabCase(getStateFromOrderStatus(orderStatus))}`]: getStateFromOrderStatus(orderStatus)
                        }
                      )
                      return (
                        <li
                          key={orderId}
                          className="order-status-item-body__progress-item"
                        >
                          <header className="order-status-item-body__progress-item-header">
                            <h5 className="order-status-item-body__progress-item-title">
                              {'Order ID: '}
                              <span>{orderId}</span>
                            </h5>
                            <div className="order-status-item-body__progress-item-info">
                              <span className="order-status-item-body__progress-item-processed">
                                {`${totalProcessed} of ${totalNumber} granules processed (${percentProcessed}%)`}
                              </span>
                              <Badge
                                className={badgeClass}
                              >
                                {formatOrderStatus(orderStatus)}
                              </Badge>
                            </div>
                          </header>
                          <ProgressBar
                            className="order-status-item-body__progress-item-bar"
                            now={percentProcessed}
                          />
                        </li>
                      )
                    })
                  }
                </ul>
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
  onChangePath: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
}

export default OrderStatusItemBody
