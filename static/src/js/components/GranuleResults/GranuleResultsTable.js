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
 * @param {String} props.collectionId - The collection ID.
 * @param {String} props.focusedGranule - The focused granule ID.
 * @param {Array} props.granules - List of formatted granule.
 * @param {Boolean} props.hasBrowseImagery - Designates if the collection has browse imagery.
 * @param {Function} props.isGranuleInProject - Function to detirmine if the granule is in the project.
 * @param {Function} props.isItemLoaded - Callback to see if an item has loaded.
 * @param {Boolean} props.itemCount - The current count of rows to show.
 * @param {Function} props.loadMoreItems - Callback to load the next page of results.
 * @param {Object} props.location - The location provided by react-router.
 * @param {Function} props.onAddGranuleToProjectCollection - Callback to add a granule to the project.
 * @param {Function} props.onExcludeGranule - Callback to exclude a granule.
 * @param {Function} props.onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} props.onMetricsDataAccess - Callback to record data access metrics.
 * @param {Function} props.onRemoveGranuleFromProjectCollection - Callback to remove a granule to the project.
 * @param {Object} props.portal - Portal object passed from the store.
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the state with the current middle item.
 * @param {String} props.visibleMiddleIndex - The current middle item.
 */

export const GranuleResultsTable = ({
  collectionId,
  focusedGranule,
  granules,
  hasBrowseImagery,
  isGranuleInProject,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  location,
  onAddGranuleToProjectCollection,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  onRemoveGranuleFromProjectCollection,
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
        collectionId,
        isGranuleInProject,
        location,
        onAddGranuleToProjectCollection,
        onExcludeGranule,
        onFocusedGranuleChange,
        onMetricsDataAccess,
        onRemoveGranuleFromProjectCollection,
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
    isFocusedGranule,
    isInProject,
    isCollectionInProject
  }) => ({
    isFocusedGranule,
    isInProject,
    isCollectionInProject
  }), [focusedGranule])

  const rowClassNamesFromRowState = useMemo(() => ({
    isFocusedGranule,
    isCollectionInProject,
    isInProject
  }) => {
    const classNames = ['granule-results-table__tr']
    if (isFocusedGranule) classNames.push('granule-results-table__tr--selected')
    if (isCollectionInProject && isInProject) classNames.push('granule-results-table__tr--emphisized')
    if (isCollectionInProject && !isInProject) classNames.push('granule-results-table__tr--deemphisized')
    return classNames
  })

  const rowTitleFromRowState = useMemo(() => ({ isFocusedGranule }) => {
    let rowTitle = 'Focus granule on map'

    if (isFocusedGranule) rowTitle = 'Unfocus granule on map'
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
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.arrayOf(PropTypes.shape).isRequired,
  hasBrowseImagery: PropTypes.bool.isRequired,
  isGranuleInProject: PropTypes.func.isRequired,
  isItemLoaded: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddGranuleToProjectCollection: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  onRemoveGranuleFromProjectCollection: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number
}

export default GranuleResultsTable
