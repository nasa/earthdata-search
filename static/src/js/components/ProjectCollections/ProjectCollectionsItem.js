/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { PropTypes } from 'prop-types'
import { Dropdown } from 'react-bootstrap'
import abbreviate from 'number-abbreviate'
import TruncateText from 'react-truncate-text'

import ToggleMoreActions from '../CustomToggle/MoreActionsToggle'
import Button from '../Button/Button'

import './ProjectCollectionsItem.scss'

/**
 * Renders ProjectCollectionItem.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collectionId - Collection ID
 * @param {object} props.collection - Collection passed from redux store.
 * @param {function} props.onRemoveCollectionFromProject - Fired when the remove button is clicked
 */
const ProjectCollectionItem = ({
  collectionId,
  collection,
  color,
  onRemoveCollectionFromProject,
  onToggleCollectionVisibility
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

  return (
    <li style={{ borderLeftColor: color }} className="project-collections-item">
      <div className="project-collections-item__header">
        <TruncateText as="h3" lines={3} className="project-collections-item__title">
          {title}
        </TruncateText>
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
        <Button
          className="project-collections-item__more-options-button"
          variant="link"
          bootstrapVariant="link"
          icon="cog"
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
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onToggleCollectionVisibility: PropTypes.func.isRequired
}

export default ProjectCollectionItem
