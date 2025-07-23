import React from 'react'
import PropTypes from 'prop-types'
import { Plus, Minus } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'

import Button from '../Button/Button'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'
import useEdscStore from '../../zustand/useEdscStore'

/**
 * Renders CollectionResultsTableHeaderCell.
 * @param {Object} props - The props passed into the component from react-table.
 */
const CollectionResultsTableHeaderCell = (props) => {
  const {
    addProjectCollection,
    removeProjectCollection
  } = useEdscStore((state) => ({
    addProjectCollection: state.project.addProjectCollection,
    removeProjectCollection: state.project.removeProjectCollection
  }))

  const { column, cell, row } = props
  const { customProps } = column
  const { original: rowProps } = row
  const { collectionId, isCollectionInProject } = rowProps

  const {
    onViewCollectionGranules,
    onMetricsAddCollectionProject,
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
        onClick={
          (event) => {
            onViewCollectionGranules(collectionId)
            event.stopPropagation()
          }
        }
      >
        <h4 className="collection-results-table__collection-name">
          {value}
        </h4>
      </Button>
      <div className="collection-results-table__collection-actions">
        <Button
          className="collection-results-table__collection-action collection-results-table__collection-action--info"
          icon={AlertInformation}
          iconSize="48"
          variant="naked"
          label="View collection details"
          title="View collection details"
          onClick={
            (event) => {
              onViewCollectionDetails(collectionId)
              event.stopPropagation()
            }
          }
        />
        <PortalFeatureContainer authentication>
          {
            !isCollectionInProject
              ? (
                <Button
                  className="collection-results-table__collection-action collection-results-table__collection-action--add"
                  icon={Plus}
                  variant="naked"
                  label="Add collection to the current project"
                  title="Add collection to the current project"
                  onClick={
                    (event) => {
                      addProjectCollection(collectionId)
                      onMetricsAddCollectionProject({
                        collectionConceptId: collectionId,
                        view: 'table',
                        page: 'collections'
                      })

                      event.stopPropagation()
                    }
                  }
                />
              ) : (
                <Button
                  className="collection-results-table__collection-action collection-results-table__collection-action--remove"
                  icon={Minus}
                  variant="naked"
                  label="Remove collection from the current project"
                  title="Remove collection from the current project"
                  onClick={
                    (event) => {
                      removeProjectCollection(collectionId)

                      event.stopPropagation()
                    }
                  }
                />
              )
          }
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
      onMetricsAddCollectionProject: PropTypes.func,
      onViewCollectionDetails: PropTypes.func
    })
  }).isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({
      collectionId: PropTypes.string,
      isCollectionInProject: PropTypes.bool
    })
  }).isRequired
}

export default CollectionResultsTableHeaderCell
