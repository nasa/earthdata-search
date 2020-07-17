import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'
import { authenticationEnabled } from '../../util/portals'

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
    portal,
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
          icon="info-circle"
          variant="naked"
          label="View collection details"
          title="View collection details"
          onClick={(e) => {
            onViewCollectionDetails(collectionId)
            e.stopPropagation()
          }}
        />
        {
          authenticationEnabled(portal) && (
            <>
              {
                !isCollectionInProject
                  ? (
                    <Button
                      className="collection-results-table__collection-action collection-results-table__collection-action--add"
                      icon="plus"
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
                      icon="minus"
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
          )
        }
      </div>
    </>
  )
}

CollectionResultsTableHeaderCell.propTypes = {
  column: PropTypes.shape({}).isRequired,
  cell: PropTypes.shape({}).isRequired,
  row: PropTypes.shape({}).isRequired
}

export default CollectionResultsTableHeaderCell
