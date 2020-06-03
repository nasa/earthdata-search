import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Button } from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Skeleton from '../Skeleton/Skeleton'

import { collectionDetailsParagraph, collectionDetailsRow } from './skeleton'

import './CollectionDetailsHighlights.scss'

const granuleListTotalStyle = {
  height: '18px',
  width: '225px'
}

export const CollectionDetailsHighlights = ({
  collection,
  isLoaded,
  isLoading,
  location,
  onToggleRelatedUrlsModal
}) => {
  const {
    metadata = {}
  } = collection

  // Don't attempt to render if the metadata isnt available
  if (isEmpty(metadata)) return null

  const {
    doi = {},
    summary,
    temporal,
    version_id: collectionVersion
  } = metadata

  const { doiText } = doi

  let truncatedAbstract = summary
  if (summary.length > 300) {
    truncatedAbstract = `${summary.substr(0, 300)}...`
  }

  return (
    <div className="collection-details-highlights">
      <div className="collection-details-highlights__header">
        Collection Details
      </div>

      <div className="collection-details-highlights__body">
        <header className="collection-details-highlights__item-header">
          <h4 className="collection-details-highlights__item-title">
            Version
          </h4>
        </header>
        <div className="collection-details-highlights__item-body">
          <div className="collection-details-highlights__item-value">
            {
              (isLoading && !isLoaded) ? (
                <Skeleton
                  shapes={collectionDetailsRow}
                  containerStyle={granuleListTotalStyle}
                  variant="dark"
                />
              ) : (
                collectionVersion
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
              (isLoading && !isLoaded) ? (
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
          <div className="collection-details-highlights__item-value">
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
          summary && (
            <>
              <header className="collection-details-highlights__item-header">
                <h4 className="collection-details-highlights__item-title">
                  Description
                </h4>
              </header>
              <div className="collection-details-highlights__item-body">
                <div className="collection-details-highlights__item-value collection-details-highlights__item-value--desc">
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
          className="collection-details-header__title-link"
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
  collection: PropTypes.shape({}).isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default CollectionDetailsHighlights
