import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import { locationPropType } from '../../util/propTypes/location'

import Cell from '../EDSCTable/EDSCTableCell'
import GranuleResultsTableHeaderCell from './GranuleResultsTableHeaderCell'
import GranuleResultsBrowseImageCell from './GranuleResultsBrowseImageCell'
import EDSCTable from '../EDSCTable/EDSCTable'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuerySpatial } from '../../zustand/selectors/query'
import { getFocusedGranuleId } from '../../zustand/selectors/focusedGranule'

import './GranuleResultsTable.scss'

/**
 * Renders GranuleResultsTable.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - The collection ID.
 * @param {String} props.collectionId - The focused collection ID.
 * @param {Object} props.directDistributionInformation - The direct distribution information.
 * @param {Object} props.generateNotebook - The generateNotebook state from the redux store.
 * @param {Array} props.granules - List of formatted granule.
 * @param {Boolean} props.hasBrowseImagery - Designates if the collection has browse imagery.
 * @param {Function} props.isGranuleInProject - Function to determine if the granule is in the project.
 * @param {Function} props.isItemLoaded - Callback to see if an item has loaded.
 * @param {Boolean} props.itemCount - The current count of rows to show.
 * @param {Function} props.loadMoreItems - Callback to load the next page of results.
 * @param {Object} props.location - Location passed from react router.
 * @param {Function} props.onGenerateNotebook - Callback to generate a notebook.
 * @param {Function} props.onMetricsAddGranuleProject - Metrics callback for adding granule to project event.
 * @param {Function} props.onMetricsDataAccess - Callback to record data access metrics.
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the state with the current middle item.
 * @param {String} props.visibleMiddleIndex - The current middle item.
 */

export const GranuleResultsTable = ({
  collectionId,
  collectionTags,
  directDistributionInformation,
  generateNotebook,
  granules,
  isGranuleInProject,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  location,
  onGenerateNotebook,
  onMetricsAddGranuleProject,
  onMetricsDataAccess,
  setVisibleMiddleIndex,
  visibleMiddleIndex
}) => {
  const collectionQuerySpatial = useEdscStore(getCollectionsQuerySpatial)
  const focusedGranuleId = useEdscStore(getFocusedGranuleId)
  const {
    excludeGranule,
    addGranuleToProjectCollection,
    removeGranuleFromProjectCollection
  } = useEdscStore((state) => ({
    excludeGranule: state.query.excludeGranule,
    addGranuleToProjectCollection: state.project.addGranuleToProjectCollection,
    removeGranuleFromProjectCollection: state.project.removeGranuleFromProjectCollection
  }))

  const columns = useMemo(() => [
    {
      Header: 'Granule',
      Cell: GranuleResultsTableHeaderCell,
      accessor: 'title',
      sticky: 'left',
      width: '325',
      customProps: {
        addGranuleToProjectCollection,
        cellClassName: 'granule-results-table__cell--granule',
        collectionId,
        collectionQuerySpatial,
        collectionTags,
        directDistributionInformation,
        generateNotebook,
        GranuleResultsTableHeaderCell,
        isGranuleInProject,
        location,
        onExcludeGranule: excludeGranule,
        onGenerateNotebook,
        onMetricsAddGranuleProject,
        onMetricsDataAccess,
        removeGranuleFromProjectCollection
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
      Header: 'Day/Night',
      Cell,
      accessor: 'dayNightFlag',
      width: '100',
      customProps: {
        centerContent: true
      }
    }
  ])

  const initialRowStateAccessor = useCallback((row) => {
    const { original = {} } = row
    const {
      isFocusedGranule,
      isHoveredGranule,
      isInProject,
      isCollectionInProject
    } = original

    return {
      isFocusedGranule,
      isHoveredGranule,
      isInProject,
      isCollectionInProject
    }
  }, [focusedGranuleId])

  const rowClassNamesFromRowState = useCallback(({
    isFocusedGranule,
    isHoveredGranule,
    isCollectionInProject,
    isInProject
  }) => {
    const classNames = ['granule-results-table__tr']
    if (isFocusedGranule || isHoveredGranule) classNames.push('granule-results-table__tr--active')
    if (isCollectionInProject && isInProject) classNames.push('granule-results-table__tr--emphisized')
    if (isCollectionInProject && !isInProject) classNames.push('granule-results-table__tr--deemphisized')

    return classNames
  })

  const rowLabelFromRowState = useCallback(({ isFocusedGranule }) => {
    let rowLabel = 'Focus granule on map'

    if (isFocusedGranule) rowLabel = 'Unfocus granule on map'

    return rowLabel
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

  // If (!hasBrowseImagery) hiding column from table
  // TODO: table rerenders which is rerendering all columns/cells causing image to be refetched
  // After table update EDSC-4094 retry to `unhide` image
  hiddenColumns.push('granuleThumbnail')

  const initialTableState = {
    hiddenColumns
  }

  return (
    <div
      className="granule-results-table"
      data-testid="granule-results-table"
    >
      <EDSCTable
        id="granule-results-table"
        rowTestId="granule-results-table__item"
        visibleMiddleIndex={visibleMiddleIndex}
        columns={columns}
        initialTableState={initialTableState}
        data={granules}
        focusedItem={focusedGranuleId}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
        isItemLoaded={isItemLoaded}
        setVisibleMiddleIndex={setVisibleMiddleIndex}
        striped
        initialRowStateAccessor={initialRowStateAccessor}
        rowClassNamesFromRowState={rowClassNamesFromRowState}
        rowLabelFromRowState={rowLabelFromRowState}
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
  collectionTags: PropTypes.shape({}).isRequired,
  directDistributionInformation: PropTypes.shape({}).isRequired,
  generateNotebook: PropTypes.shape({}).isRequired,
  granules: PropTypes.arrayOf(PropTypes.shape).isRequired,
  isGranuleInProject: PropTypes.func.isRequired,
  isItemLoaded: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
  location: locationPropType.isRequired,
  onGenerateNotebook: PropTypes.func.isRequired,
  onMetricsAddGranuleProject: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number
}

export default GranuleResultsTable
