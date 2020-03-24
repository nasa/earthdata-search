import React from 'react'
import PropTypes from 'prop-types'

import EDSCTable from '../EDSCTable/EDSCTable'
import Cell from './Cell'
import CollectionCell from './CollectionCell'

import './CollectionResultsTable.scss'

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
