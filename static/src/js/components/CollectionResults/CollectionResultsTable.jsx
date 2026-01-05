import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import { Check } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { commafy } from '../../util/commafy'
import { collectionMetadataPropType } from '../../util/propTypes/collectionMetadata'
import renderTooltip from '../../util/renderTooltip'

import Cell from '../EDSCTable/EDSCTableCell'
import CollectionResultsTableHeaderCell from './CollectionResultsTableHeaderCell'
import EDSCTable from '../EDSCTable/EDSCTable'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './CollectionResultsTable.scss'

/**
 * Renders CollectionResultsTable.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.collections - Collections passed from the store.
 * @param {Function} props.isItemLoaded - Callback to see if an item has loaded.
 * @param {Boolean} props.itemCount - The current count of rows to show.
 * @param {Function} props.loadMoreItems - Callback to load the next page of results.
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the state with the current middle item.
 * @param {String} props.visibleMiddleIndex - The current middle item.
 */
export const CollectionResultsTable = ({
  collectionsMetadata,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  setVisibleMiddleIndex = null,
  visibleMiddleIndex = null
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
        collectionId: '1234'
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
      /* eslint-disable react/no-unstable-nested-components, react/prop-types */
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
          overlay={
            (tooltipProps) => renderTooltip({
              children: 'Available in the Earthdata Cloud',
              id: 'collection-results-table-header--earthdata-cloud',
              ...tooltipProps
            })
          }
        >
          <span>
            <span className="me-1">Earthdata Cloud</span>
            <EDSCIcon icon={AlertInformation} size="0.8rem" />
          </span>
        </OverlayTrigger>
      ),
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={Check} /> : '-'}
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
          overlay={
            (tooltipProps) => renderTooltip({
              children: 'Supports advanced map visualizations using the GIBS tile service',
              id: 'collection-results-table-header--map-imagery',
              ...tooltipProps
            })
          }
        >
          <span>
            <span className="me-1">Map Imagery</span>
            <EDSCIcon icon={AlertInformation} size="0.8rem" />
          </span>
        </OverlayTrigger>
      ),
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={Check} /> : '-'}
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
          id="collection-results-table-header--near-real-time"
          placement="top"
          overlay={
            (tooltipProps) => renderTooltip({
              children: 'Data is available soon after being acquired by the instrument on the satellite',
              id: 'collection-results-table-header--near-real-time',
              ...tooltipProps
            })
          }
        >
          <span>
            <span className="me-1">Near Real Time</span>
            <EDSCIcon icon={AlertInformation} size="0.8rem" />
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
                  <Badge text="bg-light">{nrtLabel}</Badge>
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
          {value ? <EDSCIcon className="text-success" icon={Check} /> : '-'}
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
          {value ? <EDSCIcon className="text-success" icon={Check} /> : '-'}
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
          {value ? <EDSCIcon className="text-success" icon={Check} /> : '-'}
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
          {value ? <EDSCIcon className="text-success" icon={Check} /> : '-'}
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
          {value ? <EDSCIcon className="text-success" icon={Check} /> : '-'}
        </div>
      ),
      accessor: 'hasFormats',
      width: '120',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Combine',
      Cell: ({ value }) => (
        <div className="edsc-table-cell">
          {value ? <EDSCIcon className="text-success" icon={Check} /> : '-'}
        </div>
      ),
      accessor: 'hasCombine',
      width: '120',
      customProps: {
        centerContent: true
      }
    }
    /* eslint-enable */
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

CollectionResultsTable.propTypes = {
  collectionsMetadata: PropTypes.arrayOf(
    collectionMetadataPropType
  ).isRequired,
  isItemLoaded: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number
}

export default CollectionResultsTable
