import React from 'react'
import PropTypes from 'prop-types'
import { difference } from 'lodash'
import classNames from 'classnames'
import { FaInfoCircle, FaMinus } from 'react-icons/fa'

import { eventEmitter } from '../../events/events'
import { portalPath } from '../../../../../sharedUtils/portalPath'
import { locationPropType } from '../../util/propTypes/location'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'

import './CollectionDetails.scss'

/**
 * Renders CollectionDetails.
 * @param {String} collectionId - The current collection ID.
 * @param {String} focusedGranuleId - The focused granule ID.
 * @param {Object} granulesMetadata - The metadata in the store for granules.
 * @param {Object} location - The location from the store.
 * @param {Function} onChangeProjectGranulePageNum - Callback to set the page number.
 * @param {Function} onFocusedGranuleChange - The callback to change the focused granule.
 * @param {Function} onRemoveGranuleFromProjectCollection - Callback to remove a granule from the project.
 * @param {Object} portal - The portal from the store.
 * @param {Object} projectCollection - The project collection.
 */
export const CollectionDetails = ({
  collectionId,
  focusedGranuleId,
  granulesMetadata,
  location,
  onChangeProjectGranulePageNum,
  onFocusedGranuleChange,
  onRemoveGranuleFromProjectCollection,
  portal,
  projectCollection
}) => {
  const {
    granules: projectCollectionGranules = {}
  } = projectCollection

  const {
    addedGranuleIds = [],
    allIds: granulesAllIds = [],
    hits: granuleCount,
    removedGranuleIds = []
  } = projectCollectionGranules

  const { params: projectCollectionGranulesParams } = projectCollectionGranules

  // TODO: Should be able to remove the checks here and just show allIds
  let granulesToDisplay = granulesAllIds

  if (addedGranuleIds.length) {
    granulesToDisplay = addedGranuleIds
  }

  if (removedGranuleIds.length) {
    granulesToDisplay = difference(granulesAllIds, removedGranuleIds)
  }

  return (
    <div className="collection-details">
      <div className="collection-details__list-wrapper">
        <ul className="collection-details__list">
          {
            granulesToDisplay.map((id) => {
              const { [id]: granuleMetadata = {} } = granulesMetadata

              const { title } = granuleMetadata

              const itemClassName = classNames([
                'collection-details__item',
                {
                  'collection-details__item--focused': id === focusedGranuleId
                }
              ])

              return (
                <li key={`granule-info--${id}`} className={itemClassName}>
                  <div
                    className="collection-details__item-wrapper"
                    role="button"
                    tabIndex="0"
                    onMouseEnter={() => {
                      eventEmitter.emit(`map.layer.${collectionId}.focusgranule`, { granule: granuleMetadata })
                    }}
                    onMouseLeave={() => {
                      eventEmitter.emit(`map.layer.${collectionId}.focusgranule`, { granule: null })
                    }}
                    onClick={() => {
                      const newGranule = id === focusedGranuleId
                        ? { granule: null }
                        : { granule: granuleMetadata }
                      eventEmitter.emit(`map.layer.${collectionId}.stickygranule`, newGranule)
                    }}
                    onKeyPress={() => {
                      eventEmitter.emit(`map.layer.${collectionId}.stickygranule`, { granule: granuleMetadata })
                    }}
                  >
                    <span className="collection-details__item-title">
                      {title}
                    </span>
                    <span className="collection-details__item-actions">
                      <PortalLinkContainer
                        className="collection-details__item-action"
                        type="button"
                        bootstrapSize="sm"
                        onClick={(e) => {
                          onFocusedGranuleChange(id)
                          e.stopPropagation()
                        }}
                        label="View granule details"
                        icon={FaInfoCircle}
                        iconSize="0.875rem"
                        to={{
                          pathname: `${portalPath(portal)}/search/granules/granule-details`,
                          search: location.search
                        }}
                      />
                      <Button
                        className="collection-details__item-action collection-details__item-action--remove"
                        bootstrapSize="sm"
                        type="button"
                        label="Remove granule"
                        icon={FaMinus}
                        iconSize="0.875rem"
                        onClick={(e) => {
                          onRemoveGranuleFromProjectCollection({
                            collectionId,
                            granuleId: id
                          })
                          e.stopPropagation()
                        }}
                      />
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
                    const { pageNum } = projectCollectionGranulesParams

                    onChangeProjectGranulePageNum({
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
  collectionId: PropTypes.string.isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  granulesMetadata: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onChangeProjectGranulePageNum: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectCollection: PropTypes.shape({
    granules: PropTypes.shape({})
  }).isRequired
}

export default CollectionDetails
