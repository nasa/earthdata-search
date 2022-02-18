import React from 'react'
import PropTypes from 'prop-types'
import { uniq } from 'lodash'
import { parse } from 'qs'

import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import SimpleBar from 'simplebar-react'
import { FaQuestionCircle, FaArrowRight } from 'react-icons/fa'

import ArrowTags from '../ArrowTags/ArrowTags'
import Button from '../Button/Button'
import CollapsePanel from '../CollapsePanel/CollapsePanel'
import CollectionDetailsDataCenter from './CollectionDetailsDataCenter'
import CollectionDetailsMinimap from './CollectionDetailsMinimap'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import Skeleton from '../Skeleton/Skeleton'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import { collectionDetailsSkeleton } from './skeleton'
import SplitBadge from '../SplitBadge/SplitBadge'

import { collectionMetadataPropType } from '../../util/propTypes/collectionMetadata'
import { pluralize } from '../../util/pluralize'
import { stringify } from '../../util/url/url'

import './CollectionDetailsBody.scss'

const buildRelatedUrlsList = (relatedUrls) => {
  if (!relatedUrls.length) return null

  const relatedUrlsList = []
  if (relatedUrls[4] && relatedUrls[4].urls.length) {
    relatedUrls[4].urls.forEach((url, i) => {
      const key = `highlighted_url_${i}`
      relatedUrlsList.push(
        <a
          key={key}
          className="link link--separated collection-details-body__link"
          href={url.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.highlightedType}
        </a>
      )
    })
  }

  return relatedUrlsList
}

const buildScienceKeywordList = (scienceKeywords) => {
  if (!scienceKeywords.length) return null

  const scienceKeywordList = (
    <ul className="collection-details-body__keywords">
      {
        scienceKeywords.map((keywordGroup, i) => {
          const key = `science_keyword_${i}`
          return (
            <li key={key}>
              <ArrowTags tags={keywordGroup} />
            </li>
          )
        })
      }
    </ul>
  )

  return scienceKeywordList
}

const buildNativeFormatList = (nativeFormats) => {
  if (!nativeFormats.length) return null

  return (
    <span className="collection-details-body__native-formats">
      {nativeFormats.join(', ')}
    </span>
  )
}

const buildDoiLink = (doiLink, doiText) => {
  const DoiBadge = (
    <SplitBadge
      primary="DOI"
      secondary={doiText}
    />
  )

  if (doiLink) {
    return (
      <a className="collection-details-body__doi" href={doiLink} target="_blank" rel="noopener noreferrer">
        {DoiBadge}
      </a>
    )
  }
  return DoiBadge
}

const buildForDeveloperLink = (linkData, token) => {
  const link = linkData
  if (token) link.href = `link.href&${token}`
  return (
    <li>
      <a href={link.href}>{link.title}</a>
    </li>
  )
}

/**
 * Renders CollectionDetailsBody.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props  collectionMetadata - Focused collection passed from redux store.
 * @param {Function} props.onToggleRelatedUrlsModal - Toggles the state of the Related URLs modal
 */
export const CollectionDetailsBody = ({
  collectionMetadata,
  isActive,
  location,
  onFocusedCollectionChange,
  onMetricsRelatedCollection,
  onToggleRelatedUrlsModal
}) => {
  const {
    abstract,
    associatedDois,
    dataCenters,
    directDistributionInformation,
    doi = {},
    gibsLayers,
    hasAllMetadata,
    nativeDataFormats,
    relatedCollections = {},
    relatedUrls,
    scienceKeywords,
    services,
    shortName,
    spatial,
    temporal,
    urls,
    versionId
  } = collectionMetadata

  if (!hasAllMetadata) {
    return (
      <div className="collection-details-body">
        <div className="collection-details-body__content">
          <Skeleton
            shapes={collectionDetailsSkeleton}
            containerStyle={{
              height: '400px',
              width: '100%'
            }}
          />
        </div>
      </div>
    )
  }

  const reformattings = {}

  if (services) {
    const { items } = services

    if (items) {
      const supportedServiceTypes = ['esi', 'opendap', 'echo orders', 'harmony']
      items.forEach((service) => {
        const {
          supportedReformattings: supportedReformattingsList,
          type
        } = service

        // If the service type is not one that we support, don't display the reformatting options
        if (!supportedServiceTypes.includes(type.toLowerCase())) return

        if (supportedReformattingsList) {
          supportedReformattingsList.forEach((supportedReformatting) => {
            const {
              supportedInputFormat,
              supportedOutputFormats
            } = supportedReformatting

            const { [supportedInputFormat]: existingReformatting = [] } = reformattings

            // Ensure the reformatting options is a unique list
            reformattings[supportedInputFormat] = uniq([
              ...existingReformatting,
              ...supportedOutputFormats
            ])
          })
        }
      })
    }
  }

  let formattedRelatedUrls = []
  if (relatedUrls && relatedUrls.length > 0) {
    formattedRelatedUrls = buildRelatedUrlsList(relatedUrls)
  }

  const {
    region,
    s3BucketAndObjectPrefixNames = [],
    s3CredentialsApiEndpoint,
    s3CredentialsApiDocumentationUrl
  } = directDistributionInformation

  const {
    doiLink,
    doiText
  } = doi

  const {
    items: relatedCollectionsList = []
  } = relatedCollections || {}

  return (
    <div className="collection-details-body">
      <SimpleBar
        className="collection-details-body__simplebar"
        scrollableNodeProps={{
          className: 'collection-details-body__simplebar-content'
        }}
      >
        <div className="collection-details-body__content">
          <div className="row collection-details-body__row">
            <div className="col col-12">
              <div className="collection-details-body__tags">
                <Badge className="collection-details-header__short-name mr-2" variant="light" data-test-id="collection-details-header__short-name">{shortName}</Badge>
                <Badge className="collection-details-header__version-id mr-2" variant="info" data-test-id="collection-details-header__version-id">{`Version ${versionId}`}</Badge>
                {
                  doiText && buildDoiLink(doiLink, doiText)
                }
              </div>
              {
                associatedDois && associatedDois.length > 0 && (
                  <dl
                    className="collection-details-body__info"
                    data-test-id="collection-details-body__info-additional-dois"
                  >
                    <dt>Associated DOIs</dt>
                    <dd className="collection-details-body__links">
                      {
                        associatedDois.map((associatedDoi) => {
                          const {
                            authority,
                            doi,
                            title
                          } = associatedDoi

                          return (
                            <a
                              key={doi}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link collection-details-body__link"
                              title={`View ${title}`}
                              href={`${authority}${doi}`}
                            >
                              {title}
                            </a>
                          )
                        })
                      }
                    </dd>
                  </dl>
                )
              }
              <dl
                className="collection-details-body__info"
                data-test-id="collection-details-body__info-related-urls"
              >
                <>
                  <dt>Related URLs</dt>
                  <dd className="collection-details-body__links collection-details-body__links--horizontal">
                    {
                      formattedRelatedUrls.length > 0 && (
                        <>
                          {formattedRelatedUrls}
                          <Button
                            className="link link--separated collection-details-body__link"
                            type="button"
                            variant="link"
                            bootstrapVariant="link"
                            label="View All Related URLs"
                            onClick={() => onToggleRelatedUrlsModal(true)}
                          >
                            View All Related URLs
                          </Button>
                        </>
                      )
                    }
                    <a
                      className="link link--separated link--external collection-details-body__link"
                      href={urls.html.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View More Info
                    </a>
                  </dd>
                </>
              </dl>
              {
                temporal && (
                  <dl
                    className="collection-details-body__info"
                    data-test-id="collection-details-body__info-temporal"
                  >
                    <dt>Temporal Extent</dt>
                    <dd>
                      {
                        temporal.map((entry, i) => {
                          const key = `temporal_entry_${i}`
                          return <span key={key}>{entry}</span>
                        })
                      }
                    </dd>
                  </dl>
                )
              }
              {
                nativeDataFormats && nativeDataFormats.length > 0 && (
                  <dl
                    className="collection-details-body__info"
                    data-test-id="collection-details-body__info-native-data-formats"
                  >
                    <dt>{`Native ${pluralize('Format', nativeDataFormats.length)}`}</dt>
                    <dd>
                      {
                        nativeDataFormats.length > 0 && buildNativeFormatList(nativeDataFormats)
                      }
                    </dd>
                  </dl>
                )
              }
              {
                Object.keys(reformattings).length > 0 && (
                  <dl
                    className="collection-details-body__info"
                    data-test-id="collection-details-body__info-reformattings"
                  >
                    <dt>
                      Reformatting Options
                      <span className="collection-details-body__heading-tooltip">
                        <OverlayTrigger
                          placement="right"
                          overlay={(
                            <Tooltip
                              id="tooltip_supported-reformatting"
                              className="collection-details-body__tooltip tooltip--large tooltip--ta-left"
                            >
                              In addition to their native format, some data products can be
                              reformatted to additional formats. If reformatting is desired,
                              reformatting options can be set prior to downloading the data.
                            </Tooltip>
                          )}
                        >
                          <EDSCIcon icon={FaQuestionCircle} size="0.625rem" />
                        </OverlayTrigger>
                      </span>
                    </dt>
                    <dd>
                      {
                        // Using an array index in a key to prevent any duplicate keys when
                        // there are duplicate supported input formats
                        Object.keys(reformattings).map((supportedInputFormat, i) => {
                          const {
                            [supportedInputFormat]: supportedOutputFormats
                          } = reformattings

                          const key = `input-format__${supportedInputFormat}-${i}`
                          return (
                            <dl
                              key={key}
                              className="collection-details-body__reformatting-item"
                            >
                              <dt className="collection-details-body__reformatting-item-heading">
                                {supportedInputFormat}
                                <EDSCIcon icon={FaArrowRight} className="collection-details-body__reformatting-item-icon" />
                              </dt>
                              <dd className="collection-details-body__reformatting-item-body">
                                {supportedOutputFormats.join(', ')}
                              </dd>
                            </dl>
                          )
                        })
                      }
                    </dd>
                  </dl>
                )
              }

              <dl
                className="collection-details-body__info"
                data-test-id="collection-details-body__info-gibs-projections"
              >
                <dt>GIBS Imagery Projection Availability</dt>
                <dd>
                  {gibsLayers && gibsLayers}
                </dd>
              </dl>

              <dl
                className="collection-details-body__info"
                data-test-id="collection-details-body__info-science-keywords"
              >
                <dt>Science Keywords</dt>
                <dd>
                  {
                    scienceKeywords.length === 0 && <span>Not Available</span>
                  }
                  {
                    scienceKeywords.length > 0 && buildScienceKeywordList(scienceKeywords)
                  }
                </dd>
              </dl>
            </div>
          </div>
          <div className="row collection-details-body__row">
            <div className="col col-12 collection-details-body__minimap">
              {
                isActive && (
                  <CollectionDetailsMinimap metadata={collectionMetadata} />
                )
              }
              {
                spatial && (
                  <div className="collection-details-body__spatial-bounding">
                    {spatial}
                  </div>
                )
              }
            </div>
          </div>
          <div className="row collection-details-body__row">
            <div className="col collection-details-body__abstract">
              {abstract}
            </div>
          </div>
          <div className="row collection-details-body__row">
            {
              dataCenters && dataCenters.length > 0 && (
                <ul
                  className="col collection-details-body__provider-list"
                  data-test-id="collection-details-body__provider-list"
                >
                  {
                    dataCenters.map((dataCenter, i) => {
                      const key = `data_center_${i}`
                      return (
                        <CollectionDetailsDataCenter key={key} item={i} dataCenter={dataCenter} />
                      )
                    })
                  }
                </ul>
              )
            }
          </div>
          {
            region && (
              <div className="row collection-details-body__row collection-details-body__feature">
                <div className="col col-12">
                  <div className="collection-details-body__feature-heading">
                    <h4 className="collection-details-body__feature-title">Cloud Access</h4>
                    <p>Available for access in-region with AWS Cloud</p>
                  </div>
                  <dl className="collection-details-body__info">
                    <dt>Region</dt>
                    <dd
                      className="collection-details-body__cloud-access__region"
                      data-test-id="collection-details-body__cloud-access__region"
                    >
                      {region}
                    </dd>

                    <dt>Bucket/Object Prefix</dt>
                    {
                      s3BucketAndObjectPrefixNames.length && (
                        s3BucketAndObjectPrefixNames.map((name, i) => {
                          const key = `${name}-${i}`

                          return (
                            <dd
                              key={key}
                              className="collection-details-body__cloud-access__bucket-name"
                              data-test-id="collection-details-body__cloud-access__bucket-name"
                            >
                              {name}
                            </dd>
                          )
                        })
                      )
                    }

                    <dt>AWS S3 Credentials</dt>
                    <dd className="collection-details-body__links collection-details-body__links--horizontal">
                      <a
                        className="link link--external collection-details-body__link collection-details-body__cloud-access__api-link"
                        data-test-id="collection-details-body__cloud-access__api-link"
                        href={s3CredentialsApiEndpoint}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Get AWS S3 Credentials
                      </a>
                      <a
                        className="link link--separated link--external collection-details-body__link collection-details-body__cloud-access__documentation-link"
                        data-test-id="collection-details-body__cloud-access__documentation-link"
                        href={s3CredentialsApiDocumentationUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Documentation
                      </a>
                    </dd>
                  </dl>
                </div>
              </div>
            )
          }
          {
            !!(relatedCollectionsList.length && relatedCollectionsList.length > 0) && (
              <div className="row collection-details-body__row collection-details-body__feature">
                <div className="col col-12">
                  <div className="collection-details-body__feature-heading">
                    <h4 className="collection-details-body__feature-title">You might also be interested in...</h4>
                    <ul className="collection-details-body__related-collections-list">
                      {
                        relatedCollectionsList.map((relatedCollection) => {
                          const { id, title } = relatedCollection
                          const params = parse(
                            location.search,
                            {
                              ignoreQueryPrefix: true,
                              parseArrays: false
                            }
                          )
                          let { p = '' } = params
                          p = p.replace(/^[^!]*/, id)

                          return (
                            <li
                              key={`related-collection--${id}`}
                              className="collection-details-body__related-collection-item"
                            >
                              <PortalLinkContainer
                                className="collection-details-body__related-collection-link"
                                type="link"
                                onClick={() => {
                                  onMetricsRelatedCollection({
                                    collectionId: id,
                                    type: 'view'
                                  })
                                  onFocusedCollectionChange(id)
                                }}
                                to={{
                                  pathname: '/search/granules/',
                                  search: stringify({
                                    ...params,
                                    p
                                  })
                                }}
                              >
                                {title}
                              </PortalLinkContainer>
                            </li>
                          )
                        })
                      }
                    </ul>
                  </div>
                </div>
              </div>
            )
           }
        </div>
      </SimpleBar>
      <CollapsePanel
        className="collection-details-body__for-devs"
        header="For Developers"
        scrollToBottom
      >
        <div className="row">
          <div className="col-auto">
            <h4 className="collection-details-body__dev-cat">More Metadata</h4>
            <ul className="collection-details-body__dev-list">
              {urls.native && buildForDeveloperLink(urls.native)}
              {urls.atom && buildForDeveloperLink(urls.atom)}
              {urls.echo10 && buildForDeveloperLink(urls.echo10)}
              {urls.iso19115 && buildForDeveloperLink(urls.iso19115)}
              {urls.smap_iso && buildForDeveloperLink(urls.smap_iso)}
              {urls.dif && buildForDeveloperLink(urls.dif)}
            </ul>
          </div>
          <div className="col-auto">
            <h4 className="collection-details-body__dev-cat">API Endpoints</h4>
            <ul className="collection-details-body__dev-list">
              {urls.granuleDatasource && buildForDeveloperLink(urls.granuleDatasource)}
              {urls.osdd && buildForDeveloperLink(urls.osdd)}
            </ul>
          </div>
        </div>
      </CollapsePanel>
    </div>
  )
}

CollectionDetailsBody.propTypes = {
  collectionMetadata: collectionMetadataPropType.isRequired,
  isActive: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string
  }).isRequired,
  onFocusedCollectionChange: PropTypes.func.isRequired,
  onMetricsRelatedCollection: PropTypes.func.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default CollectionDetailsBody
