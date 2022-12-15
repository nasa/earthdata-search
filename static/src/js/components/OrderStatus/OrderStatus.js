import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import { FaChevronCircleRight } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import OrderStatusList from './OrderStatusList'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import RelatedCollection from '../RelatedCollection/RelatedCollection'
import Skeleton from '../Skeleton/Skeleton'
import Well from '../Well/Well'

import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { locationPropType } from '../../util/propTypes/location'
import { orderStatusSkeleton, orderStatusLinksSkeleton } from './skeleton'
import { portalPath } from '../../../../../sharedUtils/portalPath'
import { stringify } from '../../util/url/url'

import './OrderStatus.scss'

/**
 * Renders a RelatedCollection.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.authToken - The accessMethods of the current collection.
 * @param {String} props.earthdataEnvironment - The accessMethods of the current collection.
 * @param {Object} props.granuleDownload - Data pertaining to the status of the granule download for a retrieval collection.
 * @param {Object} props.location - Location passed from react router.
 * @param {Object} props.match - Router match state.
 * @param {Function} props.onChangePath - Selects an access method.
 * @param {Function} props.onFetchRetrieval - Fetches a retrieval from the database.
 * @param {Function} props.onFetchRetrievalCollection - Fetches a retrieval collection from the database.
 * @param {Function} props.onFetchRetrievalCollectionGranuleLinks - Passed down to child components, method to fetch granules for a given retrieval collection.
 * @param {Function} props.onFocusedCollectionChange - Callback to change the focused collection.
 * @param {Function} props.onMetricsRelatedCollection -  Callback to capture related collection metrics.
 * @param {Function} props.onToggleAboutCSDAModal - Callback to toggle the About CSDA Modal.

 */
export const OrderStatus = ({
  authToken,
  earthdataEnvironment,
  granuleDownload,
  location,
  match,
  onChangePath,
  onFetchRetrieval,
  onFetchRetrievalCollection,
  onFetchRetrievalCollectionGranuleLinks,
  onFetchRetrievalCollectionGranuleBrowseLinks,
  onFocusedCollectionChange,
  onMetricsRelatedCollection,
  onToggleAboutCSDAModal,
  portal,
  retrieval = {}
}) => {
  useEffect(() => {
    if (authToken !== '') {
      const { params } = match
      const { id: retrievalId } = params

      onFetchRetrieval(retrievalId, authToken)
    }
  }, [authToken])

  const {
    collections,
    id,
    isLoaded,
    isLoading,
    jsondata = {},
    links = []
  } = retrieval

  const { byId = {} } = collections

  const [filteredRelatedCollectionItems, setFilteredRelatedCollections] = useState([])

  // Add all the related collections to an array and select a
  // random three to display in the ui
  useEffect(() => {
    const relatedCollectionItems = []

    if (!isLoading && isLoaded) {
      Object.values(byId).forEach((retrievalCollection) => {
        const { collection_metadata: metadata } = retrievalCollection

        const { relatedCollections } = metadata

        if (relatedCollections) {
          const { items = [] } = relatedCollections

          relatedCollectionItems.push(...items)
        }
      })

      // When using sort, the function passed is ran for every
      // element in the array. If the result of this operation is < 0,
      // the element a is put to an index lower than b, and the
      // opposite if the result is > 0.
      // https://flaviocopes.com/how-to-shuffle-array-javascript/
      setFilteredRelatedCollections(relatedCollectionItems
        .sort(() => 0.5 - Math.random()).slice(0, 3))
    }
  }, [isLoading, isLoaded])

  const { source } = jsondata

  let {
    download: downloads = [],
    opendap: opendapOrders = [],
    echo_orders: echoOrders = [],
    esi: esiOrders = [],
    harmony: harmonyOrders = []
  } = collections

  const collectionsById = Object.values(byId)

  downloads = collectionsById.filter(({ id }) => downloads.includes(id))
  opendapOrders = collectionsById.filter(({ id }) => opendapOrders.includes(id))
  echoOrders = collectionsById.filter(({ id }) => echoOrders.includes(id))
  esiOrders = collectionsById.filter(({ id }) => esiOrders.includes(id))
  harmonyOrders = collectionsById.filter(({ id }) => harmonyOrders.includes(id))

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
    <>
      <Helmet>
        <title>Download Status</title>
        <meta name="title" content="Download Status" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}/downloads`} />
      </Helmet>
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
                  onFetchRetrievalCollectionGranuleBrowseLinks={
                    onFetchRetrievalCollectionGranuleBrowseLinks
                  }
                  onToggleAboutCSDAModal={onToggleAboutCSDAModal}
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
            {
              (isLoaded && (
                filteredRelatedCollectionItems && filteredRelatedCollectionItems.length > 0
              )) && (
                <>
                  <Well.Heading>You might also be interested in...</Well.Heading>
                  <Well.Section>
                    <ul className="order-status__links">
                      {
                        (
                          filteredRelatedCollectionItems.map((relatedCollection, i) => {
                            const { id } = relatedCollection

                            return (
                              <li
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${id}_${i}`}
                                className="order-status__links-item"
                              >
                                <RelatedCollection
                                  key={`related-collection-${id}`}
                                  className="collection-body__related-collection-link"
                                  location={location}
                                  onFocusedCollectionChange={onFocusedCollectionChange}
                                  onMetricsRelatedCollection={onMetricsRelatedCollection}
                                  relatedCollection={relatedCollection}
                                />
                              </li>
                            )
                          })
                        )
                      }
                    </ul>
                  </Well.Section>
                </>
              )
          }
          </Well.Main>
          <Well.Footer>
            <Well.Heading>Next Steps</Well.Heading>
            <ul className="order-status__footer-link-list">
              <li className="order-status__footer-link-item">
                <EDSCIcon icon={FaChevronCircleRight} className="order-status__footer-link-icon" />
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
                <EDSCIcon icon={FaChevronCircleRight} className="order-status__footer-link-icon" />
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
                <EDSCIcon library="fa" icon={FaChevronCircleRight} className="order-status__footer-link-icon" />
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
    </>
  )
}

OrderStatus.propTypes = {
  authToken: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  granuleDownload: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  onChangePath: PropTypes.func.isRequired,
  onFetchRetrieval: PropTypes.func.isRequired,
  onFetchRetrievalCollection: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleLinks: PropTypes.func.isRequired,
  onFetchRetrievalCollectionGranuleBrowseLinks: PropTypes.func.isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  retrieval: PropTypes.shape({}).isRequired
}

export default OrderStatus
