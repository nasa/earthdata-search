import React from 'react'
import PropTypes from 'prop-types'
import {
  FaMinus,
  FaPlus,
  FaInfoCircle
} from 'react-icons/fa'

import Button from '../Button/Button'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

/**
 * Renders CollectionResultsTableHeaderCell.
 * @param {Object} props - The props passed into the component from react-table.
 */
const CollectionResultsTableHeaderCell = (props) => {
  const { column, cell, row } = props
  const { customProps } = column
  const { original: rowProps } = row
  const { collectionId, isCollectionInProject } = rowProps

  const {
    onViewCollectionGranules,
    onAddProjectCollection,
    onRemoveCollectionFromProject,
    onViewCollectionDetails
  } = customProps

  const { value } = cell
  return (
    <>
      <Button
        className="collection-results-table__title-button"
        variant="naked"
        label={value}
        title={value}
        onClick={(e) => {
          onViewCollectionGranules(collectionId)
          e.stopPropagation()
        }}
      >
        <h4 className="collection-results-table__collection-name">
          {value}
        </h4>
      </Button>
      <div className="collection-results-table__collection-actions">
        <Button
          className="collection-results-table__collection-action collection-results-table__collection-action--info"
          icon={FaInfoCircle}
          variant="naked"
          label="View collection details"
          title="View collection details"
          onClick={(e) => {
            onViewCollectionDetails(collectionId)
            e.stopPropagation()
          }}
        />
        <PortalFeatureContainer authentication>
          <>
            {
              !isCollectionInProject
                ? (
                  <Button
                    className="collection-results-table__collection-action collection-results-table__collection-action--add"
                    icon={FaPlus}
                    variant="naked"
                    label="Add collection to the current project"
                    title="Add collection to the current project"
                    onClick={(e) => {
                      onAddProjectCollection(collectionId)
                      e.stopPropagation()
                    }}
                  />
                ) : (
                  <Button
                    className="collection-results-table__collection-action collection-results-table__collection-action--remove"
                    icon={FaMinus}
                    variant="naked"
                    label="Remove collection from the current project"
                    title="Remove collection from the current project"
                    onClick={(e) => {
                      onRemoveCollectionFromProject(collectionId)
                      e.stopPropagation()
                    }}
                  />
                )
            }
          </>
        </PortalFeatureContainer>
      </div>
    </>
  )
}

CollectionResultsTableHeaderCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.string
  }).isRequired,
  column: PropTypes.shape({
    customProps: PropTypes.shape({
      onViewCollectionGranules: PropTypes.func,
      onAddProjectCollection: PropTypes.func,
      onRemoveCollectionFromProject: PropTypes.func,
      onViewCollectionDetails: PropTypes.func
    })
  }).isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({})
  }).isRequired
}

export default CollectionResultsTableHeaderCell
