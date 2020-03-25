import React from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'

import ArrowTags from '../ArrowTags/ArrowTags'
import Button from '../Button/Button'
import CollapsePanel from '../CollapsePanel/CollapsePanel'
import CollectionDetailsDataCenter from './CollectionDetailsDataCenter'
import CollectionDetailsMinimap from './CollectionDetailsMinimap'
import SplitBadge from '../SplitBadge/SplitBadge'
import { pluralize } from '../../util/pluralize'

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
          className="link link--separated collection-details-body__related-link"
          href={url.URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.HighlightedType}
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
    <strong className="collection-details-body__native-formats">
      {nativeFormats.join(', ')}
    </strong>
  )
}

const buildDoiLink = (doi) => {
  const DoiBadge = (
    <SplitBadge
      primary="DOI"
      secondary={doi.doiText}
    />
  )

  if (doi.doiLink) {
    return (
      // eslint-disable-next-line react/jsx-no-target-blank
      <a className="collection-details-body__doi" href={doi.doiLink} target="_blank">
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
 * @param {object} props - The props passed into the component.
 * @param {object} props  collectionMetadata - Focused collection passed from redux store.
 * @param {function} props.onToggleRelatedUrlsModal - Toggles the state of the Related URLs modal
 */
export const CollectionDetailsBody = ({
  collectionMetadata,
  formattedCollectionMetadata,
  isActive,
  onToggleRelatedUrlsModal
}) => {
  const { summary } = collectionMetadata
  const {
    dataCenters,
    doi,
    gibsLayers,
    nativeFormats,
    relatedUrls,
    scienceKeywords,
    spatial,
    temporal,
    urls
  } = formattedCollectionMetadata

  if (!Object.keys(collectionMetadata).length || !Object.keys(formattedCollectionMetadata).length) {
    return (
      <div className="collection-details-body">
        <div className="collection-details-body__content">
          <h4>Details Loading...</h4>
        </div>
      </div>
    )
  }

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
            <div className="col collection-details-body__summary">
              {summary}
            </div>
          </div>
          <div className="row collection-details-body__row">
            <div className="col col-12">
              {
                doi && buildDoiLink(doi)
              }
              <dl className="collection-details-body__info">
                {
                  <>
                    <dt>Related URLs:</dt>
                    <dd className="collection-details-body__related-links">
                      {
                        relatedUrls.length > 0 && (
                          <>
                            {buildRelatedUrlsList(relatedUrls)}
                            <Button
                              className="link link--separated collection-details-body__related-link"
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
                        className="link link--external collection-details-body__related-link"
                        href={urls.html.href}
                        // eslint-disable-next-line react/jsx-no-target-blank
                        target="_blank"
                      >
                        View More Info
                      </a>
                    </dd>
                  </>
                }
                {
                  temporal && (
                    <>
                      <dt>Temporal Extent:</dt>
                      <dd>
                        {temporal.map((entry, i) => {
                          const key = `temporal_entry_${i}`
                          return <span key={key}>{entry}</span>
                        })}
                      </dd>
                    </>
                  )
                }
                <dt>GIBS Imagery Projection Availability:</dt>
                <dd>
                  {gibsLayers && gibsLayers}
                </dd>
                {
                  nativeFormats.length > 0 && (
                    <>
                      <dt>{`Data ${pluralize('Format', nativeFormats.length)}:`}</dt>
                      <dd>
                        {
                          nativeFormats.length > 0 && buildNativeFormatList(nativeFormats)
                        }
                      </dd>
                    </>
                  )
                }
                <dt>Science Keywords:</dt>
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
            {
              dataCenters.length && (
                <ul className="col collection-details-body__provider-list">
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
              {
                // TODO: GIBS
                // TODO: Opendap
                // TODO: Modaps
              }
            </ul>
          </div>
        </div>
      </CollapsePanel>
    </div>
  )
}

CollectionDetailsBody.defaultProps = {
  collectionMetadata: {},
  formattedCollectionMetadata: {}
}

CollectionDetailsBody.propTypes = {
  collectionMetadata: PropTypes.shape({}),
  formattedCollectionMetadata: PropTypes.shape({}),
  isActive: PropTypes.bool.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default CollectionDetailsBody
