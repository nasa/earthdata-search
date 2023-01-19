import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { FaCheck, FaInfoCircle } from 'react-icons/fa'
import { commafy } from '../../util/commafy'

import { collectionMetadataPropType } from '../../util/propTypes/collectionMetadata'

import Cell from '../EDSCTable/EDSCTableCell'
import CollectionResultsTableHeaderCell from './CollectionResultsTableHeaderCell'
import EDSCTable from '../EDSCTable/EDSCTable'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './CollectionResultsTable.scss'
/**
 * Renders CollectionResultsTable.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.collections - Collections passed from redux store.
 * @param {Function} props.isItemLoaded - Callback to see if an item has loaded.
 * @param {Boolean} props.itemCount - The current count of rows to show.
 * @param {Function} props.loadMoreItems - Callback to load the next page of results.
 * @param {Function} props.onAddProjectCollection - Callback to add a collection to a project.
 * @param {Function} props.onRemoveCollectionFromProject - Callback to remove a collection to a project.
 * @param {Function} props.onViewCollectionDetails - Callback to show collection details route.
 * @param {Function} props.onViewCollectionGranules - Callback to show collection granules route.
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the state with the current middle item.
 * @param {String} props.visibleMiddleIndex - The current middle item.
 */
export const CollectionResultsTable = ({
  collectionsMetadata,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  onAddProjectCollection,
  onRemoveCollectionFromProject,
  onViewCollectionDetails,
  onViewCollectionGranules,
  setVisibleMiddleIndex,
  visibleMiddleIndex
}) => {
  const columns = useMemo(() => [
    {
      Header: 'Collection',
      Cell: CollectionResultsTableHeaderCell,
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
      Cell: ({ cell }) => (
        <div className="edsc-table-cell" title={commafy(cell.value)}>
          {commafy(cell.value)}
        </div>
      ),
      accessor: 'granuleCount',
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
    },
    {
      Header: () => (
        <OverlayTrigger
          id="collection-results-table-header--map-imagery"
          placement="top"
          overlay={(
            <Tooltip id="collection-results-table-header-tooltip--earthdata-cloud">
              Available in the Earthdata Cloud
            </Tooltip>
            )}
        >
          <span>
            <span className="mr-1">Earthdata Cloud</span>
            <EDSCIcon icon={FaInfoCircle} size="0.625rem" />
          </span>
        </OverlayTrigger>
      ),
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={FaCheck} /> : '-'}
        </div>
      ),
      accessor: 'cloudHosted',
      width: '130',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: () => (
        <OverlayTrigger
          id="collection-results-table-header--map-imagery"
          placement="top"
          overlay={(
            <Tooltip id="collection-results-table-header-tooltip--map-imagery">
              Supports advanced map visualizations using the GIBS tile service
            </Tooltip>
            )}
        >
          <span>
            <span className="mr-1">Map Imagery</span>
            <EDSCIcon icon={FaInfoCircle} size="0.625rem" />
          </span>
        </OverlayTrigger>
      ),
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={FaCheck} /> : '-'}
        </div>
      ),
      accessor: 'hasMapImagery',
      width: '110',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: () => (
        <OverlayTrigger
          id="collection-results-table-header--map-imagery"
          placement="top"
          overlay={(
            <Tooltip id="collection-results-table-header-tooltip--map-imagery">
              Data is available soon after being
              {' '}
              acquired by the instrument on the satellite
            </Tooltip>
            )}
        >
          <span>
            <span className="mr-1">Near Real Time</span>
            <EDSCIcon icon={FaInfoCircle} size="0.625rem" />
          </span>
        </OverlayTrigger>
      ),
      Cell: ({ value, row }) => {
        const { original = {} } = row
        const { nrt = {} } = original
        const { label: nrtLabel } = nrt

        return (
          <div className="edsc-table-cell">
            {
              value
                ? (
                  <Badge variant="light">{nrtLabel}</Badge>
                )
                : '-'
            }
          </div>
        )
      },
      accessor: 'isNrt',
      width: '120',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Spatial Subsetting',
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={FaCheck} /> : '-'}
        </div>
      ),
      accessor: 'hasSpatialSubsetting',
      width: '130',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Temporal Subsetting',
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={FaCheck} /> : '-'}
        </div>
      ),
      accessor: 'hasTemporalSubsetting',
      width: '140',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Variable Subsetting',
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={FaCheck} /> : '-'}
        </div>
      ),
      accessor: 'hasVariables',
      width: '130',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Transformation',
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={FaCheck} /> : '-'}
        </div>
      ),
      accessor: 'hasTransforms',
      width: '120',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Reformatting',
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={FaCheck} /> : '-'}
        </div>
      ),
      accessor: 'hasFormats',
      width: '120',
      customProps: {
        centerContent: true
      }
    }
  ])

  return (
    <div
      className="collection-results-table"
      data-testid="collection-results-table"
    >
      <EDSCTable
        id="collection-results-table"
        rowTestId="collection-results-table__item"
        visibleMiddleIndex={visibleMiddleIndex}
        columns={columns}
        data={collectionsMetadata}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
        isItemLoaded={isItemLoaded}
        setVisibleMiddleIndex={setVisibleMiddleIndex}
        striped
      />
    </div>
  )
}

CollectionResultsTable.defaultProps = {
  setVisibleMiddleIndex: null,
  visibleMiddleIndex: null
}

CollectionResultsTable.propTypes = {
  collectionsMetadata: PropTypes.arrayOf(
    collectionMetadataPropType
  ).isRequired,
  isItemLoaded: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onViewCollectionDetails: PropTypes.func.isRequired,
  onViewCollectionGranules: PropTypes.func.isRequired,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number
}

export default CollectionResultsTable
