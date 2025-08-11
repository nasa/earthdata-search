import React from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'
import abbreviate from 'number-abbreviate'
import { Settings, XCircled } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import {
  AlertInformation,
  AlertMediumPriority
} from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import {
  FaEye,
  FaEyeSlash,
  FaMap
} from 'react-icons/fa'

import { projectCollectionItemHeader, projectCollectionItemFooter } from './skeleton'

import { collectionMetadataPropType } from '../../util/propTypes/collectionMetadata'
import { convertSize } from '../../util/project'
import { isAccessMethodValid } from '../../util/accessMethods'
import { pluralize } from '../../util/pluralize'
import { getHandoffLinks } from '../../util/handoffs/getHandoffLinks'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import MoreActionsDropdownItem from '../MoreActionsDropdown/MoreActionsDropdownItem'
import Skeleton from '../Skeleton/Skeleton'

import useEdscStore from '../../zustand/useEdscStore'

import './ProjectCollectionItem.scss'
import { getCollectionsQuery } from '../../zustand/selectors/query'

/**
 * Renders ProjectCollectionItem.
 * @param {Object} props.collectionId - CMR Concept ID of the collection
 * @param {Object} props.collection - CMR metadata of the collection.
 * @param {Object} props.color - Color assigned to the collection based on its location in the project list.
 * @param {Object} props.isPanelActive - Whether or not the panel for the collection is active.
 * @param {Function} props.onSetActivePanel - Function called when an active panel is set.
 * @param {Function} props.onSetActivePanelSection - Callback to set the active panel.
 * @param {Function} props.onUpdateFocusedCollection - Callback to set the focused collection ID.
 * @param {Object} props.projectCollection - Collection from project.byId
 */
const ProjectCollectionItem = ({
  activePanelSection,
  collectionCount,
  collectionId,
  collectionMetadata,
  color,
  index,
  isPanelActive,
  onSetActivePanel,
  onSetActivePanelSection,
  onTogglePanels,
  onUpdateFocusedCollection,
  onViewCollectionDetails,
  onViewCollectionGranules,
  projectCollection
}) => {
  const {
    mapView,
    removeProjectCollection,
    toggleCollectionVisibility
  } = useEdscStore((state) => ({
    mapView: state.map.mapView,
    removeProjectCollection: state.project.removeProjectCollection,
    toggleCollectionVisibility: state.project.toggleCollectionVisibility
  }))
  const collectionsQuery = useEdscStore(getCollectionsQuery)

  const handleToggleCollectionVisibility = (event) => {
    toggleCollectionVisibility(collectionId)
    event.preventDefault()
  }

  const {
    granules,
    isVisible
  } = projectCollection

  const {
    isOpenSearch,
    title
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

  const handoffLinks = getHandoffLinks({
    collectionMetadata,
    collectionQuery: collectionsQuery,
    map: mapView
  })

  return (
    <li style={{ borderLeftColor: color }} className={className}>
      <div className="project-collections-item__header">
        {
          !title ? (
            <Skeleton
              containerStyle={
                {
                  height: '40px',
                  width: '100%'
                }
              }
              shapes={projectCollectionItemHeader}
            />
          ) : (
            <>
              <Button
                className="project-collections-item__title-button"
                variant="naked"
                bootstrapVariant="link"
                label={`${title} Collection Details`}
                onClick={
                  () => {
                    // If the panel is closed open it when user selects a collection in project
                    onTogglePanels(true)
                    onUpdateFocusedCollection(collectionId)
                    onSetActivePanelSection('1')
                  }
                }
              >
                <h3 className="project-collections-item__title">
                  {title}
                </h3>
              </Button>
              <MoreActionsDropdown
                handoffLinks={handoffLinks}
                align="end"
              >
                <MoreActionsDropdownItem
                  className="project-collections-item__more-actions-item project-collections-item__more-actions-remove"
                  icon={XCircled}
                  title="Remove"
                  onClick={
                    () => {
                      removeProjectCollection(collectionId)

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
                    }
                  }
                />
                <MoreActionsDropdownItem
                  className="project-collections-item__more-actions-item project-collections-item__more-actions-collection-details"
                  icon={AlertInformation}
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
            </ul>
            <div className="project-collections-item__footer">
              {
                !isValid && (
                  <EDSCIcon className="project-collections-item__status project-collections-item__status--invalid" icon={AlertMediumPriority} />
                )
              }
              <Button
                className="project-collections-item__more-options-button"
                variant="link"
                bootstrapVariant="link"
                icon={Settings}
                label="Edit options"
                onClick={
                  () => {
                    onUpdateFocusedCollection(collectionId)
                    onSetActivePanelSection('0')
                    // If the panel is closed open it when user selects edit options for a collection
                    onTogglePanels(true)
                  }
                }
              >
                Edit Options
              </Button>
            </div>
          </>
        ) : (
          <Skeleton
            containerStyle={
              {
                height: '40px',
                width: '100%'
              }
            }
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
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isPanelActive: PropTypes.bool.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
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
