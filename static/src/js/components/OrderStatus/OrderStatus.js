import React, { Component } from 'react'
import PropTypes from 'prop-types'

import OrderStatusList from './OrderStatusList'
import Well from '../Well/Well'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Skeleton from '../Skeleton/Skeleton'

import { orderStatusSkeleton, orderStatusLinksSkeleton } from './skeleton'
import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { portalPath } from '../../../../../sharedUtils/portalPath'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { stringify } from '../../util/url/url'

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
      earthdataEnvironment,
      granuleDownload,
      match,
      portal,
      retrieval = {},
      onChangePath,
      onFetchRetrieval,
      onFetchRetrievalCollection,
      onFetchRetrievalCollectionGranuleLinks
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
    const { [id]: retrievalCollection = {} } = byId

    let {
      download: downloads = [],
      opendap: opendapOrders = [],
      echo_orders: echoOrders = [],
      esi: esiOrders = [],
      harmony: harmonyOrders = []
    } = collections

    const collectionsById = Object.values(byId)

    downloads = collectionsById.filter(collection => downloads.includes(collection.id))
    opendapOrders = collectionsById.filter(collection => opendapOrders.includes(collection.id))
    echoOrders = collectionsById.filter(collection => echoOrders.includes(collection.id))
    esiOrders = collectionsById.filter(collection => esiOrders.includes(collection.id))
    harmonyOrders = collectionsById.filter(collection => harmonyOrders.includes(collection.id))

    const { edscHost } = getEnvironmentConfig()

    const eeLink = earthdataEnvironment === deployedEnvironment() ? '' : `?ee=${earthdataEnvironment}`

    const introduction = (
      <p>
        {'This page will automatically update as your orders are processed. The Download Status page can be accessed later by visiting '}
        <a href={`${edscHost}${portalPath(portal)}/downloads/${id}${eeLink}`}>
          {`${edscHost}${portalPath(portal)}/downloads/${id}${eeLink}`}
        </a>
        {' or the '}
        <PortalLinkContainer
          to={{
            pathname: '/downloads',
            search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
          }}
        >
          Download Status and History
        </PortalLinkContainer>
        {' page.'}
      </p>
    )

    const allCollections = [
      ...downloads,
      ...opendapOrders,
      ...echoOrders,
      ...esiOrders,
      ...harmonyOrders
    ]

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
                <OrderStatusList
                  collections={allCollections}
                  earthdataEnvironment={earthdataEnvironment}
                  granuleDownload={granuleDownload}
                  match={match}
                  onChangePath={onChangePath}
                  onFetchRetrieval={onFetchRetrieval}
                  onFetchRetrievalCollection={onFetchRetrievalCollection}
                  onFetchRetrievalCollectionGranuleLinks={onFetchRetrievalCollectionGranuleLinks}
                  retrievalCollection={retrievalCollection}
                />
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
                    pathname: '/search',
                    search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
                  }}
                  onClick={() => { onChangePath('/search') }}
                >
                  Start a New Earthdata Search Session
                </PortalLinkContainer>
              </li>
              <li className="order-status__footer-link-item">
                <i className="fa fa-chevron-circle-right order-status__footer-link-icon" />
                <PortalLinkContainer
                  className="order-status__footer-link"
                  to={{
                    pathname: '/downloads',
                    search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
                  }}
                >
                  View Your Download Status & History
                </PortalLinkContainer>
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
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  retrieval: PropTypes.shape({}).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired
}

export default OrderStatus
