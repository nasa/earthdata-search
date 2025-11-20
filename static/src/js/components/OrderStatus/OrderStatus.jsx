import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'

import { ArrowCircleRight } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import ExternalLink from '../ExternalLink/ExternalLink'
import OrderStatusList from './OrderStatusList'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import RelatedCollection from '../RelatedCollection/RelatedCollection'
import Skeleton from '../Skeleton/Skeleton'
import Well from '../Well/Well'

import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { orderStatusSkeleton, orderStatusLinksSkeleton } from './skeleton'
import { stringify } from '../../util/url/url'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

import { routes } from '../../constants/routes'

import { useGetRetrieval } from '../../hooks/useGetRetrieval'

import './OrderStatus.scss'

/**
 * Renders a RelatedCollection.
 * @param {Object} props - The props passed into the component.
 * @param {Function} props.onChangePath - Selects an access method.
 * @param {Function} props.onMetricsRelatedCollection -  Callback to capture related collection metrics.
 * @param {Function} props.onToggleAboutCSDAModal - Callback to toggle the About CSDA Modal.
 */
const OrderStatus = ({
  onChangePath,
  onMetricsRelatedCollection,
  onToggleAboutCSDAModal
}) => {
  const params = useParams()
  const { id: retrievalId } = params

  const {
    loading,
    retrieval
  } = useGetRetrieval()

  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)

  const {
    retrievalCollections = [],
    obfuscatedId: loadedId,
    jsondata = {}
  } = retrieval

  const retrievalCollectionLinks = retrievalCollections.map(
    (retrievalCollection) => retrievalCollection.links
  ).flat().filter(Boolean)

  const [filteredRelatedCollectionItems, setFilteredRelatedCollections] = useState([])

  // Add all the related collections to an array and select a
  // random three to display in the ui
  useEffect(() => {
    const relatedCollectionItems = []

    if (!loading) {
      retrievalCollections.forEach((retrievalCollection) => {
        const { collectionMetadata: metadata = {} } = retrievalCollection

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
  }, [loading])

  const { source } = jsondata

  const { edscHost } = getEnvironmentConfig()

  const eeLink = earthdataEnvironment === deployedEnvironment() ? '' : `?ee=${earthdataEnvironment}`

  const shouldShowLoading = loading

  const introduction = (
    <p>
      {'This page will automatically update as your orders are processed. The Download Status page can be accessed later by visiting '}
      <a href={`${edscHost}${routes.DOWNLOADS}/${retrievalId}${eeLink}`}>
        {`${edscHost}${routes.DOWNLOADS}/${retrievalId}${eeLink}`}
      </a>
      {' or the '}
      <PortalLinkContainer
        to={
          {
            pathname: routes.DOWNLOADS,
            search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
          }
        }
      >
        Download Status and History
      </PortalLinkContainer>
      {' page.'}
    </p>
  )

  return (
    <>
      <Helmet>
        <title>Download Status</title>
        <meta name="title" content="Download Status" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`${edscHost}${routes.DOWNLOADS}`} />
      </Helmet>
      <div className="order-status">
        <Well className="order-status">
          <Well.Main>
            <Well.Heading>Download Status</Well.Heading>
            <Well.Introduction>{introduction}</Well.Introduction>
            {
              shouldShowLoading && (
                <Skeleton
                  className="order-status__item-skeleton"
                  containerStyle={
                    {
                      display: 'inline-block',
                      height: '175px',
                      width: '100%'
                    }
                  }
                  shapes={orderStatusSkeleton}
                />
              )
            }
            {
              loadedId && (
                <OrderStatusList
                  retrievalCollections={retrievalCollections}
                  retrievalId={retrievalId}
                  onToggleAboutCSDAModal={onToggleAboutCSDAModal}
                />
              )
            }
            <Well.Heading>Additional Resources and Documentation</Well.Heading>
            <Well.Section>
              {
                shouldShowLoading && (
                  <Skeleton
                    className="order-status__item-skeleton"
                    containerStyle={
                      {
                        display: 'inline-block',
                        height: '175px',
                        width: '100%'
                      }
                    }
                    shapes={orderStatusLinksSkeleton}
                  />
                )
              }
              {
                loadedId && (
                  <ul className="order-status__links">
                    {
                      retrievalCollectionLinks && retrievalCollectionLinks.length > 0 && (
                        retrievalCollectionLinks.map((link, index) => {
                          const {
                            title,
                            links: linkLinks
                          } = link

                          if (!linkLinks) return null

                          return (
                            <li
                              // eslint-disable-next-line react/no-array-index-key
                              key={`${title}_${index}`}
                              className="order-status__links-item"
                            >
                              <h3 className="order-status__links-title">{title}</h3>
                              <ul className="order-status__collection-links">
                                {
                                  linkLinks.map((linkObject) => {
                                    const {
                                      type,
                                      url: linkUrl
                                    } = linkObject

                                    return (
                                      <li
                                        key={linkUrl}
                                        className="order-status__collection-links-item"
                                      >
                                        <ExternalLink
                                          className="link--separated"
                                          href={linkUrl}
                                        >
                                          {type}
                                        </ExternalLink>
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
                      (retrievalCollectionLinks && retrievalCollectionLinks.length === 0) && (
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
              (loadedId && (
                filteredRelatedCollectionItems && filteredRelatedCollectionItems.length > 0
              )) && (
                <>
                  <Well.Heading>You might also be interested in...</Well.Heading>
                  <Well.Section>
                    <ul className="order-status__links">
                      {
                        (
                          filteredRelatedCollectionItems.map((relatedCollection, index) => {
                            const { id: collectionId } = relatedCollection

                            return (
                              <li
                                // eslint-disable-next-line react/no-array-index-key
                                key={`${collectionId}_${index}`}
                                className="order-status__links-item"
                              >
                                <RelatedCollection
                                  key={`related-collection-${collectionId}`}
                                  className="collection-body__related-collection-link"
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
                <EDSCIcon icon={ArrowCircleRight} className="order-status__footer-link-icon" />
                <PortalLinkContainer
                  className="order-status__footer-link"
                  to={
                    {
                      pathname: '/search',
                      search: source
                    }
                  }
                  onClick={() => { onChangePath(`/search${source}`) }}
                >
                  Back to Earthdata Search Results
                </PortalLinkContainer>
              </li>
              <li className="order-status__footer-link-item">
                <EDSCIcon icon={ArrowCircleRight} className="order-status__footer-link-icon" />
                <PortalLinkContainer
                  className="order-status__footer-link"
                  to={
                    {
                      pathname: '/search',
                      search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
                    }
                  }
                  onClick={() => { onChangePath('/search') }}
                >
                  Start a New Earthdata Search Session
                </PortalLinkContainer>
              </li>
              <li className="order-status__footer-link-item">
                <EDSCIcon library="fa" icon={ArrowCircleRight} className="order-status__footer-link-icon" />
                <PortalLinkContainer
                  className="order-status__footer-link"
                  to={
                    {
                      pathname: routes.DOWNLOADS,
                      search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
                    }
                  }
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
  onChangePath: PropTypes.func.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  onToggleAboutCSDAModal: PropTypes.func.isRequired
}

export default OrderStatus
