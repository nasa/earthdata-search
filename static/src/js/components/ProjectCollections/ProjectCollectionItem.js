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
  onRemoveCollectionFromProject
}) => {
  const { granules, metadata } = collection
  const {
    dataset_id: title,
    granule_count: granuleCount
  } = metadata
  const { totalSize = {} } = granules
  const { size = '', unit = '' } = totalSize

  return (
    <li className="granule-results-item">
      <div className="granule-results-item__header">
        <h3 className="granule-results-item__title">{collectionId}</h3>
      </div>
      <div className="granule-results-item__body">
        <p className="collection-title">{title}</p>
        <p className="granule-count">{`${granuleCount} Granules`}</p>
        <p className="total-size">{`${size} ${unit}`}</p>
        <p>
          <Button
            className="remove-collection"
            onClick={() => onRemoveCollectionFromProject(collectionId)}
            variant="danger"
          >
            <i className="fa fa-times-circle" />
            Remove from project
          </Button>
        </p>
      </div>
    </li>
  )
}

ProjectCollectionItem.propTypes = {
  collectionId: PropTypes.string.isRequired,
  collection: PropTypes.shape({}).isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default ProjectCollectionItem
