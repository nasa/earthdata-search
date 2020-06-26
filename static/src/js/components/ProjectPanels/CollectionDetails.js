import React from 'react'
import PropTypes from 'prop-types'
import { difference } from 'lodash'
import classNames from 'classnames'

import { eventEmitter } from '../../events/events'
import { portalPath } from '../../../../../sharedUtils/portalPath'
import { getGranuleCount } from '../../util/collectionMetadata/granuleCount'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'

import './CollectionDetails.scss'

/**
 * Renders CollectionDetails.
 * @param {Object} granules - The granules from the store.
 * @param {Object} collection - The current collection.
 * @param {String} collectionId - The current collection ID.
 * @param {Object} granuleQuery - The granule query from the store.
 * @param {String} focusedGranule - The focused granule ID.
 * @param {Object} location - The location from the store.
 * @param {Object} portal - The portal from the store.
 * @param {Object} projectCollection - The project collection.
 * @param {Function} onChangeGranulePageNum - Callback to set the page number.
 * @param {Function} onFocusedGranuleChange - The callback to change the focused granule.
 * @param {Function} onRemoveGranuleFromProjectCollection - Callback to remove a granule from the project.
 */
export const CollectionDetails = ({
  granules,
  collection,
  collectionId,
  granuleQuery,
  focusedGranule,
  location,
  portal,
  projectCollection,
  onChangeGranulePageNum,
  onFocusedGranuleChange,
  onRemoveGranuleFromProjectCollection
}) => {
  // Granule count should come from the granules hits because the collection
  // metadata granule count is only updated with temporal and spatial params
  const {
    byId: granulesById = {},
    allIds: granulesAllIds = []
  } = granules

  const {
    addedGranuleIds = [],
    removedGranuleIds = []
  } = projectCollection

  let granulesToDisplay = granulesAllIds

  if (addedGranuleIds.length) {
    granulesToDisplay = addedGranuleIds
  }

  if (removedGranuleIds.length) {
    granulesToDisplay = difference(granulesAllIds, removedGranuleIds)
  }

  const granuleCount = getGranuleCount(collection, projectCollection)

  return (
    <div className="collection-details">
      <span className="collection-details__meta">
        {`Showing ${granulesToDisplay.length} of ${granuleCount} granules in project`}
      </span>
      <div className="collection-details__list-wrapper">
        <ul className="collection-details__list">
          {
            granulesToDisplay.map((id) => {
              const granule = granulesById[id]
              if (!granule) return null

              const {
                producer_granule_id: producerGranuleId
              } = granule

              const itemClassName = classNames([
                'collection-details__item',
                {
                  'collection-details__item--focused': id === focusedGranule
                }
              ])

              return (
                <li key={`granule-info--${id}`} className={itemClassName}>
                  <div
                    className="collection-details__item-wrapper"
                    role="button"
                    tabIndex="0"
                    onMouseEnter={() => {
                      eventEmitter.emit(`map.layer.${collectionId}.focusgranule`, { granule })
                    }}
                    onMouseLeave={() => {
                      eventEmitter.emit(`map.layer.${collectionId}.focusgranule`, { granule: null })
                    }}
                    onClick={() => {
                      eventEmitter.emit(`map.layer.${collectionId}.stickygranule`, { granule })
                    }}
                    onKeyPress={() => {
                      eventEmitter.emit(`map.layer.${collectionId}.stickygranule`, { granule })
                    }}
                  >
                    <span className="collection-details__item-title">
                      {producerGranuleId}
                    </span>
                    <span className="collection-details__item-actions">
                      <PortalLinkContainer
                        className="collection-details__item-action"
                        type="button"
                        bootstrapSize="sm"
                        onClick={() => {
                          onFocusedGranuleChange(id)
                        }}
                        label="View granule details"
                        to={{
                          pathname: `${portalPath(portal)}/search/granules/granule-details`,
                          search: location.search
                        }}
                      >
                        <i className="fa fa-info-circle" />
                      </PortalLinkContainer>
                      <Button
                        className="collection-details__item-action collection-details__item-action--remove"
                        bootstrapSize="sm"
                        type="button"
                        label="Remove granule"
                        onClick={() => {
                          onRemoveGranuleFromProjectCollection({
                            collectionId,
                            granuleId: id
                          })
                        }}
                      >
                        <i className="fa fa-minus" />
                      </Button>
                    </span>
                  </div>
                </li>
              )
            })
          }
        </ul>
        {
          granulesToDisplay.length < granuleCount && (
            <div className="collection-details__more-granules">
              <Button
                className="collection-details__more-granules-button"
                label="Load more"
                bootstrapVariant="link"
                onClick={
                  () => {
                    const { pageNum } = granuleQuery
                    onChangeGranulePageNum({
                      collectionId,
                      pageNum: pageNum + 1
                    })
                  }
                }
              >
                Load more granules...
              </Button>
            </div>
          )
        }
      </div>
    </div>
  )
}

CollectionDetails.propTypes = {
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  collection: PropTypes.shape({}).isRequired,
  collectionId: PropTypes.string.isRequired,
  location: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectCollection: PropTypes.shape({}).isRequired,
  onChangeGranulePageNum: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired
}

export default CollectionDetails
