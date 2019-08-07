/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { PropTypes } from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import classNames from 'classnames'
import abbreviate from 'number-abbreviate'
import TruncateText from 'react-truncate-text'

import ToggleMoreActions from '../CustomToggle/MoreActionsToggle'
import Button from '../Button/Button'

import './ProjectCollectionsItem.scss'
import { isAccessMethodValid } from '../../util/accessMethods'
import { generateHandoffs } from '../../util/handoffs/generateHandoffs'

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
  collectionId,
  collection,
  color,
  index,
  isPanelActive,
  onRemoveCollectionFromProject,
  onToggleCollectionVisibility,
  onSetActivePanel,
  projectCollection,
  collectionSearch
}) => {
  const {
    granules,
    isVisible,
    metadata
  } = collection
  const {
    dataset_id: title,
    granule_count: granuleCount
  } = metadata
  const { totalSize = {} } = granules
  const { size = '', unit = '' } = totalSize
  const isValid = isAccessMethodValid(projectCollection)

  const className = classNames([
    'project-collections-item',
    {
      'project-collections-item--is-active': isPanelActive,
      'project-collections-item--is-valid': isValid
    }
  ])

  const handoffLinks = generateHandoffs(metadata, collectionSearch)

  return (
    <li style={{ borderLeftColor: color }} className={className}>
      <div className="project-collections-item__header">
        <Button
          className="project-collections-item__title-button"
          variant="naked"
          bootstrapVariant="link"
          label={`${title} Collection Details`}
          onClick={() => onSetActivePanel(`1.${index}.0`)}
        >
          <TruncateText as="h3" lines={3} className="project-collections-item__title">
            {title}
          </TruncateText>
        </Button>
        <Dropdown className="project-collections-item__more-actions">
          <Dropdown.Toggle
            className="project-collections-item__more-actions-toggle"
            as={ToggleMoreActions}
          />
          <Dropdown.Menu
            className="project-collections-item__more-actions-menu"
            alignRight
          >
            <Dropdown.Item
              className="project-collections-item__more-actions-item project-collections-item__more-actions-vis"
              onClick={() => onToggleCollectionVisibility(collectionId)}
            >
              <i className={`project-collections-item__more-actions-icon fa fa-${isVisible ? 'eye-slash' : 'eye'}`} />
              Toggle Visibility
            </Dropdown.Item>
            <Dropdown.Item
              className="project-collections-item__more-actions-item project-collections-item__more-actions-remove"
              onClick={() => onRemoveCollectionFromProject(collectionId)}
            >
              <i className="project-collections-item__more-actions-icon fa fa-times-circle" />
              Remove
            </Dropdown.Item>
            {
              handoffLinks.length > 0 && (
                <Dropdown.Header>Open collection in:</Dropdown.Header>
              )
            }
            {
              handoffLinks.length > 0 && handoffLinks.map(link => (
                <Dropdown.Item
                  key={link.title}
                  className="collection-details-header__more-actions-item collection-details-header__more-actions-vis"
                  href={link.href}
                >
                  {link.title}
                </Dropdown.Item>
              ))
            }
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <ul className="project-collections-item__stats-list">
        <li
          className="project-collections-item__stats-item project-collections-item__stats-item--granule-count"
        >
          {`${abbreviate(granuleCount, 1)} Granules`}
        </li>
        <li
          className="project-collections-item__stats-item project-collections-item__stats-item--total-size"
        >
          {`Est. Size ${size} ${unit}`}
        </li>
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
    </li>
  )
}

ProjectCollectionItem.propTypes = {
  collectionId: PropTypes.string.isRequired,
  collection: PropTypes.shape({}).isRequired,
  color: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  isPanelActive: PropTypes.bool.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired,
  onSetActivePanel: PropTypes.func.isRequired,
  projectCollection: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired
}

export default ProjectCollectionItem
