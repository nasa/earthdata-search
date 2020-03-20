/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'
import EDSCTable from '../EDSCTable/EDSCTable'

import './CollectionResultsTable.scss'

const CollectionCell = (props) => {
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
  return (
    <>
      <Button
        className="collection-results-table__title-button"
        variant="naked"
        label={cell.value}
        title={cell.value}
        onClick={(e) => {
          onViewCollectionGranules(collectionId)
          e.stopPropagation()
        }}
      >
        <h4 className="collection-results-table__collection-name">
          {cell.value}
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
      </div>
    </>
  )
}

CollectionCell.propTypes = {
  cell: PropTypes.shape({}).isRequired
}

const Cell = ({ cell }) => (
  <div className="collection-results-table__test-cell" title={cell.value}>
    {cell.value}
  </div>
)

Cell.propTypes = {
  cell: PropTypes.shape({}).isRequired
}

export const CollectionResultsTable = ({
  collections,
  collectionHits,
  onViewCollectionGranules,
  onAddProjectCollection,
  onRemoveCollectionFromProject,
  onViewCollectionDetails,
  waypointEnter
}) => {
  const columns = React.useMemo(() => [
    {
      Header: 'Collection',
      Cell: CollectionCell,
      accessor: 'datasetId',
      sticky: 'left',
      width: '300',
      customProps: {
        cellClassName: 'collection-results-table__cell--collection',
        collectionId: '1234',
        onViewCollectionGranules,
        onAddProjectCollection,
        onRemoveCollectionFromProject,
        onViewCollectionDetails
      }
    },
    {
      Header: 'Version',
      Cell,
      accessor: 'versionId',
      width: '100',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Start',
      Cell,
      accessor: 'temporalStart',
      width: '100',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'End',
      Cell,
      accessor: 'temporalEnd',
      width: '100',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Granules',
      Cell,
      accessor: 'granuleCount',
      width: '100',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Provider',
      Cell,
      accessor: 'displayOrganization',
      width: '150',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Short Name',
      Cell,
      accessor: 'shortName',
      width: '150',
      customProps: {
        centerContent: true
      }
    }
  ])

  return (
    <div className="collection-results-table">
      <EDSCTable
        id="collection-results-table"
        columns={columns}
        data={collections}
        infiniteScrollTrigger={waypointEnter}
        infiniteScrollTotal={collectionHits}
      />
    </div>
  )
}

CollectionResultsTable.propTypes = {
  collections: PropTypes.arrayOf(PropTypes.shape).isRequired,
  collectionHits: PropTypes.number.isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  waypointEnter: PropTypes.func.isRequired
}

export default CollectionResultsTable
