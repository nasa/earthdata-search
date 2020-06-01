import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import abbreviate from 'number-abbreviate'

import {
  projectCollectionItemHeader,
  projectCollectionItemFooter
} from './skeleton'
import { isAccessMethodValid } from '../../util/accessMethods'
import { generateHandoffs } from '../../util/handoffs/generateHandoffs'
import pluralize from '../../util/pluralize'
import { getGranuleCount } from '../../util/collectionMetadata/granuleCount'
import { convertSize } from '../../util/project'

import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import Button from '../Button/Button'
import Skeleton from '../Skeleton/Skeleton'

import './ProjectCollectionsItem.scss'

/**
 * Renders ProjectCollectionItem.
 * @param {Object} props.collectionId - CMR Concept ID of the collection
 * @param {Object} props.collection - CMR metadata of the collection.
 * @param {Object} props.color - Color assigned to the collection based on its location in the project list.
 * @param {Object} props.index - Position of the collection in the project list.
 * @param {Object} props.isPanelActive - Whether or not the panel for the collection is active.
 * @param {Function} props.onRemoveCollectionFromProject - Function called when a collection is removed from the project.
 * @param {Function} props.onToggleCollectionVisibility - Function called when visibility of the collection is toggled.
 * @param {Function} props.onSetActivePanel - Function called when an active panel is set.
 * @param {Object} props.projectCollection - Collection from project.byId
 * @param {Object} props.collectionSearch - Search values from query.collection
 */
const ProjectCollectionItem = ({
  collection,
  collectionId,
  collectionSearch,
  color,
  index,
  isPanelActive,
  mapProjection,
  projectCollection,
  onRemoveCollectionFromProject,
  onSetActivePanel,
  onToggleCollectionVisibility
}) => {
  const handleToggleCollectionVisibility = (event) => {
    onToggleCollectionVisibility(collectionId)
    event.preventDefault()
  }

  if (!collection) return null

  const {
    granules,
    isVisible,
    metadata
  } = collection

  const {
    dataset_id: title
  } = metadata

  const { isLoaded, isLoading, singleGranuleSize } = granules

  const granuleCount = getGranuleCount(collection, projectCollection)

  const totalSize = convertSize(granuleCount * singleGranuleSize)

  const { size = '', unit = '' } = totalSize

  const { valid: isValid } = isAccessMethodValid(projectCollection, collection)

  const className = classNames([
    'project-collections-item',
    {
      'project-collections-item--is-active': isPanelActive,
      'project-collections-item--is-valid': isValid
    }
  ])

  const handoffLinks = generateHandoffs(metadata, collectionSearch, mapProjection)

  return (
    <li style={{ borderLeftColor: color }} className={className}>
      <div className="project-collections-item__header">
        {
          !title ? (
            <Skeleton
              containerStyle={{
                height: '40px',
                width: '100%'
              }}
              shapes={projectCollectionItemHeader}
            />
          ) : (
            <>
              <Button
                className="project-collections-item__title-button"
                variant="naked"
                bootstrapVariant="link"
                label={`${title} Collection Details`}
                onClick={() => onSetActivePanel(`1.${index}.0`)}
              >
                <h3 className="project-collections-item__title">
                  {title}
                </h3>
              </Button>
              <MoreActionsDropdown handoffLinks={handoffLinks} alignRight>
                <MoreActionsDropdownItem
                  className="project-collections-item__more-actions-item project-collections-item__more-actions-vis"
                  icon={isVisible ? 'eye-slash' : 'eye'}
                  title="Toggle Visibility"
                  onClick={handleToggleCollectionVisibility}
                />
                <MoreActionsDropdownItem
                  className="project-collections-item__more-actions-item project-collections-item__more-actions-remove"
                  icon="times-circle"
                  title="Remove"
                  onClick={() => onRemoveCollectionFromProject(collectionId)}
                />
              </MoreActionsDropdown>
            </>
          )
        }
      </div>
      {
        (!isLoading && isLoaded) ? (
          <>
            <ul className="project-collections-item__stats-list">
              {
                (typeof granuleCount !== 'undefined' && !!(size) && unit) && (
                  <>
                    <li
                      className="project-collections-item__stats-item project-collections-item__stats-item--granule-count"
                    >
                      {`${abbreviate(granuleCount, 1)} ${pluralize('Granule', granuleCount)}`}
                    </li>
                    {
                      granuleCount > 0 && size && unit && (
                        <li
                          className="project-collections-item__stats-item project-collections-item__stats-item--total-size"
                        >
                          {`Est. Size ${size} ${unit}`}
                        </li>
                      )
                    }
                  </>
                )
              }
            </ul>
            <div className="project-collections-item__footer">
              {
                !isValid && (
                  <span className="project-collections-item__status project-collections-item__status--invalid">
                    <i className="fa fa-exclamation-circle" />
                  </span>
                )
              }
              <Button
                className="project-collections-item__more-options-button"
                variant="link"
                bootstrapVariant="link"
                icon="cog"
                label="More options"
                onClick={() => onSetActivePanel(`0.${index}.0`)}
              >
                More Options
              </Button>
            </div>
          </>
        ) : (
          <Skeleton
            containerStyle={{
              height: '40px',
              width: '100%'
            }}
            shapes={projectCollectionItemFooter}
          />
        )
      }
    </li>
  )
}

ProjectCollectionItem.defaultProps = {
  collection: undefined
}

ProjectCollectionItem.propTypes = {
  collectionId: PropTypes.string.isRequired,
  collection: PropTypes.shape({}),
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isPanelActive: PropTypes.bool.isRequired,
  mapProjection: PropTypes.string.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  projectCollection: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired
}

export default ProjectCollectionItem
