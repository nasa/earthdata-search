import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { PropTypes } from 'prop-types'
import { VariableSizeGrid as Grid } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { isEmpty } from 'lodash'

import { useRemsToPixels } from '../../hooks/useRemsToPixels'
import { getActivePanelSize } from '../../util/getActivePanelSize'
import { itemToRowColumnIndicies } from '../../util/itemToRowColumnIndicies'

import GranuleResultsListItem from './GranuleResultsListItem'

import './GranuleResultsList.scss'

/**
 * Renders innerElementType to override the default react window behavior so sticky columns can be used.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.children - The react-window children.
 * @param {Array} props.style - The style settings from react-window.
 */
const innerElementType = forwardRef(({ children, ...rest }, ref) => {
  const { style } = rest

  const { remInPixels } = useRemsToPixels()

  return (
    <ul
      className="granule-results-list__list"
      data-test-id="granule-results-list"
      ref={ref}
      style={{
        ...style,
        height: style.height + remInPixels
      }}
    >
      {children}
    </ul>
  )
})

innerElementType.displayName = 'CollectionResultsListInnerElement'

innerElementType.propTypes = {
  children: PropTypes.node.isRequired
}

/**
 * Renders GranuleResultsListBody.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - The collection ID.
 * @param {Array} props.excludedGranuleIds - List of excluded granule IDs.
 * @param {String} props.focusedGranule - The focused granule ID.
 * @param {Array} props.granules - List of formatted granule.
 * @param {Number} props.height - The height of the container provided by AutoSizer.
 * @param {Boolean} props.isCwic - Flag designating CWIC collections.
 * @param {Function} props.isItemLoaded - Callback to detirmine if a granule has been loaded.
 * @param {Number} props.itemCount - Number of total granule list itmes.
 * @param {Function} props.loadMoreItems - Callback to load more granules.
 * @param {Object} props.location - The location provided by react-router.
 * @param {Function} props.onExcludeGranule - Callback to exclude a granule.
 * @param {Function} props.onFocusedGranuleChange - Callback to change the focused granule.
 * @param {Function} props.onMetricsDataAccess - Callback to record data access metrics.
 * @param {Object} props.portal - Portal object passed from the store.
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the visible middle index.
 * @param {Number} props.visibleMiddleIndex - The current visible middle index.
 * @param {Number} props.width - The width of the container provided by AutoSizer.
 */
export const GranuleResultsListBody = ({
  collectionId,
  excludedGranuleIds,
  focusedGranule,
  granules,
  height,
  isCwic,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  location,
  onExcludeGranule,
  onFocusedGranuleChange,
  onMetricsDataAccess,
  portal,
  setVisibleMiddleIndex,
  visibleMiddleIndex,
  width
}) => {
  const infiniteLoaderRef = useRef(null)
  const listRef = useRef(null)
  const sizeMap = React.useRef({})

  // If visibleMiddleIndex is set, that means we want to scroll to a particular item. react-window
  // will immediatly render the items at the default index, which calls setVisibleIndex and resets
  // the values. visibleMiddleIndexRef will hold on to this value so it can be used once the listRef
  // is defined and we can call scrollToItem.
  const visibleMiddleIndexRef = useRef(visibleMiddleIndex)

  const { remInPixels } = useRemsToPixels()

  const [numColumns, setNumColumns] = useState(2)

  useEffect(() => {
    let numColumn = 2
    const panelSize = getActivePanelSize(width)
    if (panelSize === 'lg') numColumn = 3
    if (panelSize === 'xl') numColumn = 3
    if (numColumn !== numColumns) {
      setNumColumns(numColumn)
    }
  }, [width])

  const rowCount = Math.ceil(itemCount / numColumns)

  useEffect(() => {
    const scrollToItem = visibleMiddleIndexRef.current
    // When the view is changed, scroll the visibleMiddleIndex item to the center of the list
    if (scrollToItem && listRef.current) {
      const {
        rowIndex,
        columnIndex
      } = itemToRowColumnIndicies(scrollToItem, numColumns)

      listRef.current.scrollToItem({
        rowIndex,
        columnIndex
      }, 'center')
    }
  }, [listRef.current])

  // setRowHeight sets the size in the sizeMap to the height passed from the item.
  const setRowHeight = useCallback((rowIndex, columnIndex, size) => {
    if (!sizeMap.current[rowIndex]) sizeMap.current[rowIndex] = []

    sizeMap.current[rowIndex] = [
      ...sizeMap.current[rowIndex]
    ]

    sizeMap.current[rowIndex][columnIndex] = size

    // Reset the items after the index of the item.
    listRef.current.resetAfterIndices({ rowIndex, columnIndex: 0 }, true)
  }, [])

  // At the default size, granule result items will render at 127px tall, so
  // that value is used as a default here.
  const getRowHeight = useCallback((rowIndex) => {
    if (isEmpty(sizeMap.current) || !sizeMap.current[rowIndex]) return 127
    const height = Math.max(...sizeMap.current[rowIndex])

    if (rowIndex === itemCount - 1) {
      return height + (remInPixels * 4)
    }
    return height + remInPixels
  }, [itemCount])

  return (
    <InfiniteLoader
      ref={infiniteLoaderRef}
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {
        ({ onItemsRendered, ref }) => (
          <Grid
            ref={(list) => {
              ref(list)
              listRef.current = list
            }}
            columnCount={numColumns}
            columnWidth={() => (width / numColumns) - (remInPixels / numColumns)}
            height={height}
            rowCount={rowCount}
            rowHeight={getRowHeight}
            width={width}
            innerElementType={innerElementType}
            itemData={{
              collectionId,
              excludedGranuleIds,
              focusedGranule,
              getRowHeight,
              granules,
              isCwic,
              isItemLoaded,
              location,
              numColumns,
              onExcludeGranule,
              onFocusedGranuleChange,
              onMetricsDataAccess,
              portal,
              setRowHeight,
              windowHeight: height,
              windowWidth: width
            }}
            onItemsRendered={(gridProps) => {
              // onItemsRendered needs to know which items are visible in the list
              const overscanStartIndex = gridProps.overscanRowStartIndex * numColumns
              const overscanStopIndex = gridProps.overscanRowStopIndex * numColumns
              const visibleStartIndex = gridProps.visibleRowStartIndex * numColumns
              const visibleStopIndex = gridProps.visibleRowStopIndex * numColumns

              const middleIndex = Math.round((visibleStartIndex + visibleStopIndex) / 2)

              if (middleIndex) setVisibleMiddleIndex(middleIndex)

              onItemsRendered({
                overscanStartIndex,
                overscanStopIndex,
                visibleStartIndex,
                visibleStopIndex
              })
            }}
          >
            {GranuleResultsListItem}
          </Grid>
        )
      }
    </InfiniteLoader>
  )
}

GranuleResultsListBody.defaultProps = {
  setVisibleMiddleIndex: null,
  visibleMiddleIndex: null
}

GranuleResultsListBody.propTypes = {
  collectionId: PropTypes.string.isRequired,
  excludedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  granules: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  height: PropTypes.number.isRequired,
  isCwic: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onFocusedGranuleChange: PropTypes.func.isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  isItemLoaded: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  loadMoreItems: PropTypes.func.isRequired,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number,
  width: PropTypes.number.isRequired
}

export default GranuleResultsListBody
