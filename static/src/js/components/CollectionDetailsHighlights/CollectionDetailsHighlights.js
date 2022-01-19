import React from 'react'
import PropTypes from 'prop-types'

import { collectionDetailsParagraph, collectionDetailsRow } from './skeleton'

import Button from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Skeleton from '../Skeleton/Skeleton'

import { collectionMetadataPropType } from '../../util/propTypes/collectionMetadata'
import { locationPropType } from '../../util/propTypes/location'

import './CollectionDetailsHighlights.scss'

const granuleListTotalStyle = {
  height: '18px',
  width: '225px'
}

export const CollectionDetailsHighlights = ({
  collectionMetadata,
  collectionsSearch,
  location,
  onToggleRelatedUrlsModal
}) => {
  const {
    abstract,
    doi = {},
    hasAllMetadata,
    temporal,
    versionId
  } = collectionMetadata

  const {
    isLoaded,
    isLoading
  } = collectionsSearch

  const { doiText } = doi

  let truncatedAbstract = abstract
  if (abstract && abstract.length > 300) {
    truncatedAbstract = `${abstract.substr(0, 300)}...`
  }

  return (
    <div className="collection-details-highlights">
      <div className="collection-details-highlights__body">
        <header className="collection-details-highlights__item-header">
          <h4 className="collection-details-highlights__item-title">
            Version
          </h4>
        </header>
        <div className="collection-details-highlights__item-body">
          <div
            className="collection-details-highlights__item-value"
            data-test-id="collection-details-highlights__version-id"
          >
            {
              (isLoading && !isLoaded) ? (
                <Skeleton
                  shapes={collectionDetailsRow}
                  containerStyle={granuleListTotalStyle}
                  variant="dark"
                />
              ) : (
                versionId
              )
            }
          </div>
        </div>

        <header className="collection-details-highlights__item-header">
          <h4 className="collection-details-highlights__item-title">
            DOI
          </h4>
        </header>
        <div className="collection-details-highlights__item-body">
          <div className="collection-details-highlights__item-value collection-details-highlights__item-value--doi">
            {
              ((isLoading && !isLoaded) || !hasAllMetadata) ? (
                <Skeleton
                  shapes={collectionDetailsRow}
                  containerStyle={granuleListTotalStyle}
                  variant="dark"
                />
              ) : (
                doiText
              )
            }
          </div>
        </div>

        <header className="collection-details-highlights__item-header">
          <h4 className="collection-details-highlights__item-title">
            Related URLs
          </h4>
        </header>
        <div className="collection-details-highlights__item-body">
          <div className="collection-details-highlights__item-value">
            <Button
              className="link collection-details-highlights__related-link"
              type="button"
              variant="link"
              bootstrapVariant="link"
              label="View All Related URLs"
              onClick={() => onToggleRelatedUrlsModal(true)}
            >
              View All Related URLs
            </Button>
          </div>
        </div>

        <header className="collection-details-highlights__item-header">
          <h4 className="collection-details-highlights__item-title">
            Temporal Extent
          </h4>
        </header>
        <div className="collection-details-highlights__item-body">
          <div
            className="collection-details-highlights__item-value"
            data-test-id="collection-details-highlights__temporal"
          >
            {
              (isLoading && !isLoaded) ? (
                <Skeleton
                  shapes={collectionDetailsRow}
                  containerStyle={granuleListTotalStyle}
                  variant="dark"
                />
              ) : (
                temporal && temporal.map((entry, i) => {
                  const key = `temporal_entry_${i}`
                  return <span key={key}>{entry}</span>
                })
              )
            }
          </div>
        </div>

        {
          abstract && (
            <>
              <header className="collection-details-highlights__item-header">
                <h4 className="collection-details-highlights__item-title">
                  Description
                </h4>
              </header>
              <div className="collection-details-highlights__item-body">
                <div
                  className="collection-details-highlights__item-value collection-details-highlights__item-value--desc"
                  data-test-id="collection-details-highlights__description"
                >
                  {
                    (isLoading && !isLoaded) ? (
                      <Skeleton
                        shapes={collectionDetailsParagraph}
                        containerStyle={{ height: '4.125rem', width: '100%' }}
                        variant="dark"
                      />
                    ) : (
                      truncatedAbstract
                    )
                  }
                </div>
              </div>
            </>
          )
        }
      </div>

      <div className="collection-details-highlights__footer">
        <PortalLinkContainer
          className="collection-details-header__title-link collection-details-header__title-link-icon"
          to={{
            pathname: '/search/granules/collection-details',
            search: location.search
          }}
        >
          View More Collection Details
        </PortalLinkContainer>
      </div>
    </div>
  )
}

CollectionDetailsHighlights.propTypes = {
  collectionMetadata: collectionMetadataPropType.isRequired,
  collectionsSearch: PropTypes.shape({
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool
  }).isRequired,
  location: locationPropType.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default CollectionDetailsHighlights
