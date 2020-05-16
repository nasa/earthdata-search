import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import Cell from '../EDSCTable/EDSCTableCell'
import GranuleResultsTableHeaderCell from './GranuleResultsTableHeaderCell'
import GranuleResultsBrowseImageCell from './GranuleResultsBrowseImageCell'
import EDSCTable from '../EDSCTable/EDSCTable'

import './GranuleResultsTable.scss'

/**
 * Renders GranuleResultsTable.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.collections - Collections passed from redux store.
 * @param {Function} props.isItemLoaded - Callback to see if an item has loaded.
 * @param {Boolean} props.itemCount - The current count of rows to show.
 * @param {Function} props.loadMoreItems - Callback to load the next page of results.
 * @param {Function} props.onAddProjectCollection - Callback to add a collection to a project.
 * @param {Function} props.onRemoveCollectionFromProject - Callback to remove a collection to a project.
 * @param {Function} props.onViewCollectionDetails - Callback to show collection details route.
 * @param {Function} props.onViewCollectionGranules - Callback to show collection granules route.
 * @param {Object} props.portal - Portal object passed from the store.
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the state with the current middle item.
 * @param {String} props.visibleMiddleIndex - The current middle item.
 */
export const GranuleResultsTable = ({
  collectionId,
  focusedGranule,
  granules,
  hasBrowseImagery,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  location,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  portal,
  setVisibleMiddleIndex,
  visibleMiddleIndex
}) => {
  const columns = useMemo(() => [
    {
      Header: 'Granule',
      Cell: GranuleResultsTableHeaderCell,
      accessor: 'title',
      sticky: 'left',
      width: '325',
      customProps: {
        cellClassName: 'granule-results-table__cell--granule',
        location,
        collectionId,
        onExcludeGranule,
        onFocusedGranuleChange,
        onMetricsDataAccess,
        portal
      }
    },
    {
      Header: 'Image',
      Cell: GranuleResultsBrowseImageCell,
      accessor: 'granuleThumbnail',
      width: '60',
      customProps: {}
    },
    {
      Header: 'Start',
      Cell,
      accessor: 'timeStart',
      width: '175',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'End',
      Cell,
      accessor: 'timeEnd',
      width: '175',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Orig. Format',
      Cell,
      accessor: 'originalFormat',
      width: '100',
      customProps: {
        centerContent: true
      }
    },
    {
      Header: 'Day/Night',
      Cell,
      accessor: 'dayNightFlag',
      width: '100',
      customProps: {
        centerContent: true
      }
    }
  ])

  const initialRowStateAccessor = useMemo(() => ({
    isFocusedGranule
  }) => ({
    isFocusedGranule
  }), [focusedGranule])

  const rowClassNamesFromRowState = useMemo(() => ({ isFocusedGranule }) => {
    const classNames = ['granule-results-table__tr']
    if (isFocusedGranule) classNames.push('granule-results-table__tr--selected')
    return classNames
  })

  const rowTitleFromRowState = useMemo(() => ({ isFocusedGranule }) => {
    let rowTitle = 'Focus granule in map'

    if (isFocusedGranule) rowTitle = 'Unfocus granule in map'
    return rowTitle
  })

  const onRowClick = useCallback((e, row) => {
    const { original: rowOriginal } = row
    const { handleClick } = rowOriginal
    if (handleClick) handleClick(e, row)
  }, [])

  const onRowMouseEnter = useCallback((e, row) => {
    const { original: rowOriginal } = row
    const { handleMouseEnter } = rowOriginal
    if (handleMouseEnter) handleMouseEnter(e, row)
  }, [])

  const onRowMouseLeave = useCallback((e, row) => {
    const { original: rowOriginal } = row
    const { handleMouseLeave } = rowOriginal
    if (handleMouseLeave) handleMouseLeave(e, row)
  }, [])

  const hiddenColumns = []

  if (!hasBrowseImagery) hiddenColumns.push('granuleThumbnail')

  const initialTableState = {
    hiddenColumns
  }

  return (
    <div
      className="granule-results-table"
      data-test-id="granule-results-table"
    >
      <EDSCTable
        id="granule-results-table"
        rowTestId="granule-results-table__item"
        visibleMiddleIndex={visibleMiddleIndex}
        columns={columns}
        initialTableState={initialTableState}
        data={granules}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
        isItemLoaded={isItemLoaded}
        setVisibleMiddleIndex={setVisibleMiddleIndex}
        striped
        initialRowStateAccessor={initialRowStateAccessor}
        rowClassNamesFromRowState={rowClassNamesFromRowState}
        rowTitleFromRowState={rowTitleFromRowState}
        onRowMouseEnter={onRowMouseEnter}
        onRowMouseLeave={onRowMouseLeave}
        onRowClick={onRowClick}
      />
    </div>
  )
}

GranuleResultsTable.defaultProps = {
  setVisibleMiddleIndex: null,
  visibleMiddleIndex: null
}

GranuleResultsTable.propTypes = {
  collectionId: PropTypes.string.isRequired,
  granules: PropTypes.arrayOf(PropTypes.shape).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  hasBrowseImagery: PropTypes.bool.isRequired,
  isItemLoaded: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number
}

export default GranuleResultsTable
