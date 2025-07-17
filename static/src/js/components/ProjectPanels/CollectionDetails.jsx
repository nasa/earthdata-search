import React from 'react'
import PropTypes from 'prop-types'
import { difference } from 'lodash-es'
import classNames from 'classnames'
import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'

import { Minus } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { eventEmitter } from '../../events/events'
import { locationPropType } from '../../util/propTypes/location'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'

import useEdscStore from '../../zustand/useEdscStore'

import './CollectionDetails.scss'

/**
 * Renders CollectionDetails.
 * @param {String} collectionId - The current collection ID.
 * @param {String} focusedGranuleId - The focused granule ID.
 * @param {Object} granulesMetadata - The metadata in the store for granules.
 * @param {Object} location - The location from the store.
 * @param {Function} onFocusedGranuleChange - The callback to change the focused granule.
 * @param {Object} projectCollection - The project collection.
 */
export const CollectionDetails = ({
  collectionId,
  focusedGranuleId,
  granulesMetadata,
  location,
  onFocusedGranuleChange,
  projectCollection
}) => {
  const {
    removeGranuleFromProjectCollection,
    updateProjectGranuleParams
  } = useEdscStore((state) => ({
    removeGranuleFromProjectCollection: state.project.removeGranuleFromProjectCollection,
    updateProjectGranuleParams: state.project.updateProjectGranuleParams
  }))

  const {
    granules: projectCollectionGranules = {}
  } = projectCollection

  const {
    addedGranuleIds = [],
    allIds: granulesAllIds = [],
    hits: granuleCount,
    removedGranuleIds = []
  } = projectCollectionGranules

  const { params: projectCollectionGranulesParams = {} } = projectCollectionGranules

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
                    onMouseEnter={
                      () => {
                        eventEmitter.emit(`map.layer.${collectionId}.hoverGranule`, { granule: granuleMetadata })
                      }
                    }
                    onMouseLeave={
                      () => {
                        eventEmitter.emit(`map.layer.${collectionId}.hoverGranule`, { granule: null })
                      }
                    }
                    onClick={
                      () => {
                        const newGranule = id === focusedGranuleId
                          ? { granule: null }
                          : { granule: granuleMetadata }
                        eventEmitter.emit(`map.layer.${collectionId}.focusGranule`, newGranule)
                        onFocusedGranuleChange(id)
                      }
                    }
                    onKeyDown={
                      () => {
                        eventEmitter.emit(`map.layer.${collectionId}.focusGranule`, { granule: granuleMetadata })
                        onFocusedGranuleChange(granuleMetadata.id)
                      }
                    }
                  >
                    <span className="collection-details__item-title">
                      {title}
                    </span>
                    <span className="collection-details__item-actions">
                      <PortalLinkContainer
                        className="collection-details__item-action"
                        type="button"
                        bootstrapSize="sm"
                        onClick={
                          (event) => {
                            onFocusedGranuleChange(id)
                            event.stopPropagation()
                          }
                        }
                        label="View granule details"
                        icon={AlertInformation}
                        iconSize="14"
                        to={
                          {
                            pathname: '/search/granules/granule-details',
                            search: location.search
                          }
                        }
                      />
                      <Button
                        className="collection-details__item-action collection-details__item-action--remove"
                        bootstrapSize="sm"
                        type="button"
                        label="Remove granule"
                        icon={Minus}
                        iconSize="14"
                        onClick={
                          (event) => {
                            removeGranuleFromProjectCollection({
                              collectionId,
                              granuleId: id
                            })

                            event.stopPropagation()
                          }
                        }
                      />
                    </span>
                  </div>
                </li>
              )
            })
          }
        </ul>
        {
          granulesToDisplay.length > 0 && granulesToDisplay.length < granuleCount && (
            <div className="collection-details__more-granules">
              <Button
                className="collection-details__more-granules-button"
                label="Load more"
                bootstrapVariant="link"
                onClick={
                  () => {
                    const { pageNum = 1 } = projectCollectionGranulesParams

                    updateProjectGranuleParams({
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
  onFocusedGranuleChange: PropTypes.func.isRequired,
  projectCollection: PropTypes.shape({
    granules: PropTypes.shape({})
  }).isRequired
}

export default CollectionDetails
