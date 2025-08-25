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
import { getGranuleId } from '../../zustand/selectors/granule'

import './CollectionDetails.scss'

/**
 * Renders CollectionDetails.
 * @param {String} collectionId - The current collection ID.
 * @param {Object} location - The location from the store.
 * @param {Object} projectCollection - The project collection.
 */
export const CollectionDetails = ({
  collectionId,
  location,
  projectCollection
}) => {
  const focusedGranuleId = useEdscStore(getGranuleId)
  const {
    setGranuleId,
    removeGranuleFromProjectCollection,
    updateProjectGranuleParams
  } = useEdscStore((state) => ({
    setGranuleId: state.granule.setGranuleId,
    removeGranuleFromProjectCollection: state.project.removeGranuleFromProjectCollection,
    updateProjectGranuleParams: state.project.updateProjectGranuleParams
  }))

  const {
    granules: projectCollectionGranules = {}
  } = projectCollection

  const {
    addedGranuleIds = [],
    allIds: granulesAllIds = [],
    byId: granulesById = {},
    count: granuleCount,
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
              const { [id]: granuleMetadata = {} } = granulesById

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
                        setGranuleId(id)
                      }
                    }
                    onKeyDown={
                      () => {
                        eventEmitter.emit(`map.layer.${collectionId}.focusGranule`, { granule: granuleMetadata })
                        setGranuleId(granuleMetadata.id)
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
                            setGranuleId(id)
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
  location: locationPropType.isRequired,
  projectCollection: PropTypes.shape({
    granules: PropTypes.shape({})
  }).isRequired
}

export default CollectionDetails
