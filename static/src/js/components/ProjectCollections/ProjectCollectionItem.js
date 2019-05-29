/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { PropTypes } from 'prop-types'
import { Button } from 'react-bootstrap'


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
    <li style={{ borderWidth: '5x', borderColor: color }} className="granule-results-item">
      <div className="granule-results-item__header">
        <h3 className="granule-results-item__title">{collectionId}</h3>
      </div>
      <div className="">
        <div className="collection-title">{title}</div>
        <div className="granule-count">{`${granuleCount} Granules`}</div>
        <div className="total-size">{`${size} ${unit}`}</div>
        <div>
          <Button
            className="remove-collection"
            onClick={() => onRemoveCollectionFromProject(collectionId)}
            variant="danger"
          >
            <i className="fa fa-times-circle" />
            Remove from project
          </Button>
        </div>
        <div>
          <Button
            className="toggle-visibility"
            onClick={() => onToggleCollectionVisibility(collectionId)}
            variant="info"
          >
            { isVisible && (<i className="fa fa-eye-slash" />)}
            { !isVisible && (<i className="fa fa-eye" />)}
            Toggle Visibility
          </Button>
        </div>
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
