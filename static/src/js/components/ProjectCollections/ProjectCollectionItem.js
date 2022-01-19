import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import abbreviate from 'number-abbreviate'
import {
  FaCog,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
  FaInfoCircle,
  FaMap,
  FaTimesCircle
} from 'react-icons/fa'

import {
  projectCollectionItemHeader,
  projectCollectionItemFooter
} from './skeleton'

import { collectionMetadataPropType } from '../../util/propTypes/collectionMetadata'
import { convertSize } from '../../util/project'
import { generateHandoffs } from '../../util/handoffs/generateHandoffs'
import { isAccessMethodValid } from '../../util/accessMethods'
import { pluralize } from '../../util/pluralize'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import Skeleton from '../Skeleton/Skeleton'

import './ProjectCollectionItem.scss'

/**
 * Renders ProjectCollectionItem.
 * @param {Object} props.collectionId - CMR Concept ID of the collection
 * @param {Object} props.collection - CMR metadata of the collection.
 * @param {Object} props.color - Color assigned to the collection based on its location in the project list.
 * @param {Object} props.isPanelActive - Whether or not the panel for the collection is active.
 * @param {Function} props.onRemoveCollectionFromProject - Function called when a collection is removed from the project.
 * @param {Function} props.onToggleCollectionVisibility - Function called when visibility of the collection is toggled.
 * @param {Function} props.onSetActivePanel - Function called when an active panel is set.
 * @param {Function} props.onSetActivePanelSection - Callback to set the active panel.
 * @param {Function} props.onUpdateFocusedCollection - Callback to set the focused collection ID.
 * @param {Object} props.projectCollection - Collection from project.byId
 * @param {Object} props.collectionsQuery - Search values from query.collection
 */
const ProjectCollectionItem = ({
  activePanelSection,
  collectionMetadata,
  collectionCount,
  collectionId,
  collectionsQuery,
  color,
  handoffs,
  index,
  isPanelActive,
  mapProjection,
  onRemoveCollectionFromProject,
  onSetActivePanel,
  onSetActivePanelSection,
  onToggleCollectionVisibility,
  onTogglePanels,
  onUpdateFocusedCollection,
  onViewCollectionDetails,
  onViewCollectionGranules,
  projectCollection
}) => {
  const handleToggleCollectionVisibility = (event) => {
    onToggleCollectionVisibility(collectionId)
    event.preventDefault()
  }

  const {
    granules,
    isVisible
  } = projectCollection

  const {
    isOpenSearch,
    title,
    id: conceptId
  } = collectionMetadata

  const { hits: granuleCount, isLoaded, singleGranuleSize } = granules

  const totalSize = convertSize(granuleCount * singleGranuleSize)

  const { size = '', unit = '' } = totalSize

  const { valid: isValid } = isAccessMethodValid(projectCollection, collectionMetadata)

  const className = classNames([
    'project-collections-item',
    {
      'project-collections-item--is-active': isPanelActive,
      'project-collections-item--is-valid': isValid
    }
  ])

  const handoffLinks = generateHandoffs({
    collectionMetadata,
    collectionQuery: collectionsQuery,
    handoffs,
    mapProjection
  })

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
                onClick={() => {
                  onTogglePanels(true)
                  onUpdateFocusedCollection(conceptId)
                  onSetActivePanelSection('1')
                }}
              >
                <h3 className="project-collections-item__title">
                  {title}
                </h3>
              </Button>
              <MoreActionsDropdown handoffLinks={handoffLinks} alignRight>
                <MoreActionsDropdownItem
                  className="project-collections-item__more-actions-item project-collections-item__more-actions-remove"
                  icon={FaTimesCircle}
                  title="Remove"
                  onClick={() => {
                    onRemoveCollectionFromProject(collectionId)

                    // If removing the first collection in the list
                    if (index === 0) {
                      let panelSectionToSelect = activePanelSection

                      // If this is the last collection in the project reset the active panel
                      if (collectionCount === 1) panelSectionToSelect = 0

                      onSetActivePanel(`${panelSectionToSelect}.0.0`)
                    } else {
                      // Select the previous collection in the list
                      onSetActivePanel(`${activePanelSection}.${index - 1}.0`)
                    }
                  }}
                />
                <MoreActionsDropdownItem
                  className="project-collections-item__more-actions-item project-collections-item__more-actions-collection-details"
                  icon={FaInfoCircle}
                  title="Collection Details"
                  onClick={() => onViewCollectionDetails(collectionId)}
                />
                <MoreActionsDropdownItem
                  className="project-collections-item__more-actions-item project-collections-item__more-actions-granules"
                  icon={FaMap}
                  title="View Granules"
                  onClick={() => onViewCollectionGranules(collectionId)}
                />
                <MoreActionsDropdownItem
                  className="project-collections-item__more-actions-item project-collections-item__more-actions-vis"
                  icon={isVisible ? FaEye : FaEyeSlash}
                  title="Toggle Visibility"
                  onClick={handleToggleCollectionVisibility}
                />
              </MoreActionsDropdown>
            </>
          )
        }
      </div>
      {
        isLoaded ? (
          <>
            <ul className="project-collections-item__stats-list">
              <>
                <li
                  className="project-collections-item__stats-item project-collections-item__stats-item--granule-count"
                >
                  {`${abbreviate(granuleCount, 1)} ${pluralize('Granule', granuleCount)}`}
                </li>
                {
                  !isOpenSearch && (granuleCount > 0 && size && unit) && (
                    <li
                      className="project-collections-item__stats-item project-collections-item__stats-item--total-size"
                    >
                      {`Est. Size ${size} ${unit}`}
                    </li>
                  )
                }
              </>
            </ul>
            <div className="project-collections-item__footer">
              {
                !isValid && (
                  <EDSCIcon className="project-collections-item__status project-collections-item__status--invalid" icon={FaExclamationCircle} />
                )
              }
              <Button
                className="project-collections-item__more-options-button"
                variant="link"
                bootstrapVariant="link"
                icon={FaCog}
                label="Edit options"
                onClick={() => {
                  onUpdateFocusedCollection(conceptId)
                  onSetActivePanelSection('0')
                  onTogglePanels(true)
                }}
              >
                Edit Options
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

ProjectCollectionItem.propTypes = {
  activePanelSection: PropTypes.string.isRequired,
  collectionCount: PropTypes.number.isRequired,
  collectionId: PropTypes.string.isRequired,
  collectionMetadata: collectionMetadataPropType.isRequired,
  collectionsQuery: PropTypes.shape({}).isRequired,
  color: PropTypes.string.isRequired,
  handoffs: PropTypes.shape({}).isRequired,
  index: PropTypes.number.isRequired,
  isPanelActive: PropTypes.bool.isRequired,
  mapProjection: PropTypes.string.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onTogglePanels: PropTypes.func.isRequired,
  onUpdateFocusedCollection: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  projectCollection: PropTypes.shape({
    granules: PropTypes.shape({
      hits: PropTypes.number,
      isLoaded: PropTypes.bool,
      singleGranuleSize: PropTypes.number
    }),
    isVisible: PropTypes.bool
  }).isRequired
}

export default ProjectCollectionItem
