import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// import OrderRequest from '../../util/request/orderRequest'

import OrderStatusList from './OrderStatusList'
import Well from '../Well/Well'

import './OrderStatus.scss'

export class OrderStatus extends Component {
  componentDidMount() {
    const { fetchOrder, match, authToken } = this.props
    if (authToken !== '') {
      const { params } = match
      const { id: orderId } = params
      fetchOrder(orderId, authToken)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fetchOrder, match, authToken } = this.props
    if (authToken !== nextProps.authToken && nextProps.authToken !== '') {
      const { params } = match
      const { id: orderId } = params
      fetchOrder(orderId, nextProps.authToken)
    }
  }

  render() {
    const { order = {}, onChangePath } = this.props
    const { jsondata = {}, links = [] } = order
    const { source } = jsondata

    const { id, collections } = order
    const {
      download: downloads = [],
      order: orders = [],
      serviceOrder: serviceOrders = []
    } = collections

    const introduction = (
      <p>
        {'This page will automatically update as your orders are processed. The Order Status page can be accessed later by visiting '}
        <a href={`https://search.earthdata.nasa.gov/data/retrieve/${id}`}>{`https://search.earthdata.nasa.gov/data/retrieve/${id}`}</a>
        {' or the '}
        <a href="/data/status/">Download Status and History</a>
        {' page.'}
      </p>
    )

    return (
      <Well className="order-status">
        <Well.Main>
          <Well.Heading>Order Status</Well.Heading>
          <Well.Introduction>{introduction}</Well.Introduction>
          <Well.Section>
            {
              downloads.length > 0 && (
                <OrderStatusList
                  heading="Direct Download"
                  introduction={'Click the "View/Download Data Links" button to view or download a file containing links to your data.'}
                  collections={downloads}
                  type="download"
                  onChangePath={onChangePath}
                />
              )
            }
            {
              orders.length > 0 && (
                <OrderStatusList
                  heading="Stage For Delivery"
                  introduction={"When the data for the following orders becomes available, an email containing download links will be sent to the address you've provided."}
                  collections={orders}
                  type="order"
                  onChangePath={onChangePath}
                />
              )
            }
            {
              serviceOrders.length > 0 && (
                <OrderStatusList
                  heading="Customize Product"
                  introduction={"When the data for the following orders become available, links will be displayed below and sent to the email address you've provided."}
                  collections={serviceOrders}
                  type="service-order"
                  onChangePath={onChangePath}
                />
              )
            }
          </Well.Section>
          <Well.Heading>Additional Resources and Documentation</Well.Heading>
          <Well.Section>
            <ul className="order-status__links">
              {
                links.map((link) => {
                  const { datasetId, links } = link
                  return (
                    <li
                      key={datasetId}
                      className="order-status__links-item"
                    >
                      <h3 className="order-status__links-title">{datasetId}</h3>
                      <ul className="order-status__collection-links">
                        {
                          links.map((link) => {
                            const { href } = link
                            return (
                              <li
                                key={href}
                                className="order-status__collection-links-item"
                              >
                                <a
                                  href={href}
                                  className="order-status__collection-link"
                                >
                                  {href}
                                </a>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </li>
                  )
                })
              }
            </ul>
          </Well.Section>
        </Well.Main>
        <Well.Footer>
          <Well.Heading>Next Steps</Well.Heading>
          <ul className="order-status__footer-link-list">
            <li className="order-status__footer-link-item">
              <i className="fa fa-chevron-circle-right order-status__footer-link-icon" />
              <Link
                className="order-status__footer-link"
                to={{
                  pathname: '/search',
                  search: source
                }}
                onClick={() => { onChangePath(`/search/${source}`) }}
              >
                Back to Earthdata Search Results
              </Link>
            </li>
            <li className="order-status__footer-link-item">
              <i className="fa fa-chevron-circle-right order-status__footer-link-icon" />
              <Link
                className="order-status__footer-link"
                to="/search"
              >
                Start a New Earthdata Search Session
              </Link>
            </li>
            <li className="order-status__footer-link-item">
              <i className="fa fa-chevron-circle-right order-status__footer-link-icon" />
              <a className="order-status__footer-link" href="/data/status">View Your Download Status & History</a>
            </li>
          </ul>
        </Well.Footer>
      </Well>
    )
  }
}

OrderStatus.propTypes = {
  authToken: PropTypes.string.isRequired,
  fetchOrder: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  order: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired
}

export default OrderStatus
