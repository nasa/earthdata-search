import React, { Component } from 'react'
import PropTypes from 'prop-types'

import OrderStatusList from './OrderStatusList'
import Well from '../Well/Well'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Skeleton from '../Skeleton/Skeleton'

import { orderStatusSkeleton, orderStatusLinksSkeleton } from './skeleton'
import { portalPath } from '../../../../../sharedUtils/portalPath'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

import './OrderStatus.scss'

export class OrderStatus extends Component {
  componentDidMount() {
    const { onFetchRetrieval, match, authToken } = this.props
    if (authToken !== '') {
      const { params } = match
      const { id: retrievalId } = params
      // TODO: There is probably a better way to kick off this call in a container
      onFetchRetrieval(retrievalId, authToken)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { onFetchRetrieval, match, authToken } = this.props
    if (authToken !== nextProps.authToken && nextProps.authToken !== '') {
      const { params } = match
      const { id: retrievalId } = params
      onFetchRetrieval(retrievalId, nextProps.authToken)
    }
  }

  render() {
    const {
      match,
      portal,
      retrieval = {},
      onChangePath,
      onFetchRetrievalCollection
    } = this.props
    const { jsondata = {}, links = [] } = retrieval
    const { source } = jsondata

    const {
      id,
      collections,
      isLoading,
      isLoaded
    } = retrieval
    const { byId = {} } = collections

    let {
      download: downloads = [],
      opendap: opendapOrders = [],
      echo_orders: echoOrders = [],
      esi: esiOrders = []
    } = collections

    const collectionsById = Object.values(byId)

    downloads = collectionsById.filter(collection => downloads.includes(collection.id))
    opendapOrders = collectionsById.filter(collection => opendapOrders.includes(collection.id))
    echoOrders = collectionsById.filter(collection => echoOrders.includes(collection.id))
    esiOrders = collectionsById.filter(collection => esiOrders.includes(collection.id))

    // Combine the two types of orders that are direct download into a single heading
    const downloadableOrders = [
      ...downloads,
      ...opendapOrders
    ]

    const { edscHost } = getEnvironmentConfig()

    const introduction = (
      <p>
        {'This page will automatically update as your orders are processed. The Download Status page can be accessed later by visiting '}
        <a href={`${edscHost}${portalPath(portal)}/downloads/${id}`}>
          {`${edscHost}${portalPath(portal)}/downloads/${id}`}
        </a>
        {' or the '}
        <a href={`${edscHost}${portalPath(portal)}/downloads`}>Download Status and History</a>
        {' page.'}
      </p>
    )

    return (
      <div className="order-status">
        <Well className="order-status">
          <Well.Main>
            <Well.Heading>Download Status</Well.Heading>
            <Well.Introduction>{introduction}</Well.Introduction>
            {
              (isLoading && !isLoaded) && (
                <Skeleton
                  className="order-status__item-skeleton"
                  containerStyle={{ display: 'inline-block', height: '175px', width: '100%' }}
                  shapes={orderStatusSkeleton}
                />
              )
            }
            {
              isLoaded && (
                <Well.Section>
                  {
                    downloadableOrders.length > 0 && (
                      <OrderStatusList
                        heading="Direct Download"
                        introduction={'Click the "View/Download Data Links" button to view or download a file containing links to your data.'}
                        collections={downloadableOrders}
                        type="download"
                        match={match}
                        onChangePath={onChangePath}
                        onFetchRetrievalCollection={onFetchRetrievalCollection}
                      />
                    )
                  }
                  {
                    echoOrders.length > 0 && (
                      <OrderStatusList
                        heading="Stage For Delivery"
                        introduction={"When the data for the following orders becomes available, an email containing download links will be sent to the address you've provided."}
                        collections={echoOrders}
                        type="echo_orders"
                        match={match}
                        onChangePath={onChangePath}
                        onFetchRetrievalCollection={onFetchRetrievalCollection}
                      />
                    )
                  }
                  {
                    esiOrders.length > 0 && (
                      <OrderStatusList
                        heading="Customize Product"
                        introduction={"When the data for the following orders become available, links will be displayed below and sent to the email address you've provided."}
                        collections={esiOrders}
                        type="esi"
                        match={match}
                        onChangePath={onChangePath}
                        onFetchRetrievalCollection={onFetchRetrievalCollection}
                      />
                    )
                  }
                </Well.Section>
              )
            }
            <Well.Heading>Additional Resources and Documentation</Well.Heading>
            <Well.Section>
              {
                isLoading && (
                  <Skeleton
                    className="order-status__item-skeleton"
                    containerStyle={{ display: 'inline-block', height: '175px', width: '100%' }}
                    shapes={orderStatusLinksSkeleton}
                  />
                )
              }
              {
                isLoaded && (
                  <ul className="order-status__links">
                    {
                      (links && links.length > 0) && (
                        links.map((link, i) => {
                          const { dataset_id: datasetId, links } = link
                          return (
                            <li
                              // eslint-disable-next-line react/no-array-index-key
                              key={`${datasetId}_${i}`}
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
                      )
                    }
                    {
                      (links && links.length === 0) && (
                        <li className="order-status__links-item">
                          No additional resources provided
                        </li>
                      )
                    }
                  </ul>
                )
              }
            </Well.Section>
          </Well.Main>
          <Well.Footer>
            <Well.Heading>Next Steps</Well.Heading>
            <ul className="order-status__footer-link-list">
              <li className="order-status__footer-link-item">
                <i className="fa fa-chevron-circle-right order-status__footer-link-icon" />
                <PortalLinkContainer
                  className="order-status__footer-link"
                  to={{
                    pathname: '/search',
                    search: source
                  }}
                  onClick={() => { onChangePath(`/search${source}`) }}
                >
                  Back to Earthdata Search Results
                </PortalLinkContainer>
              </li>
              <li className="order-status__footer-link-item">
                <i className="fa fa-chevron-circle-right order-status__footer-link-icon" />
                <PortalLinkContainer
                  className="order-status__footer-link"
                  to={{
                    pathname: '/search'
                  }}
                  onClick={() => { onChangePath('/search') }}
                >
                  Start a New Earthdata Search Session
                </PortalLinkContainer>
              </li>
              <li className="order-status__footer-link-item">
                <i className="fa fa-chevron-circle-right order-status__footer-link-icon" />
                <a className="order-status__footer-link" href={`${portalPath(portal)}/downloads`}>View Your Download Status & History</a>
              </li>
            </ul>
          </Well.Footer>
        </Well>
      </div>
    )
  }
}

OrderStatus.propTypes = {
  authToken: PropTypes.string.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  match: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  retrieval: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired
}

export default OrderStatus
