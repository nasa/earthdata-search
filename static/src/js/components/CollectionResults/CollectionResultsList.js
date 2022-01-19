import React, {
  useRef,
  useEffect,
  useCallback,
  forwardRef
} from 'react'
import PropTypes from 'prop-types'
import { VariableSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'

import CollectionResultsListItem from './CollectionResultsListItem'

import './CollectionResultsList.scss'

/**
 * Renders innerElementType to override the default react window behavior so sticky columns can be used.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.children - The react-window children.
 * @param {Array} props.style - The style settings from react-window.
 */
const innerElementType = forwardRef(({ children, ...rest }, ref) => {
  const { style } = rest
  return (
    <ul
      className="collection-results-list__list"
      data-test-id="collection-results-list"
      ref={ref}
      style={{ ...style }}
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
 * Renders CollectionResultsList.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.collectionsMetadata - Collections passed from redux store.
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
export const CollectionResultsList = ({
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
  const infiniteLoaderRef = useRef(null)
  const listRef = useRef(null)
  const sizeMap = React.useRef({})

  // If visibleMiddleIndex is set, that means we want to scroll to a particular item. react-window
  // will immediatly render the items at the default index, which calls setVisibleIndex and resets
  // the values. visibleMiddleIndexRef will hold on to this value so it can be used once the listRef
  // is defined and we can call scrollToItem.
  const visibleMiddleIndexRef = useRef(visibleMiddleIndex)

  useEffect(() => {
    const scrollToItem = visibleMiddleIndexRef.current
    // When the view is changed, scroll the visibleMiddleIndex item to the center of the list
    if (scrollToItem && listRef.current) {
      listRef.current.scrollToItem(scrollToItem, 'center')
    }
  }, [listRef.current])

  // setSize sets the size in the sizeMap to the height passed from the item.
  const setSize = useCallback((index, size) => {
    sizeMap.current = { ...sizeMap.current, [index]: size }
    // Reset the items after the index of the item.
    listRef.current.resetAfterIndex(index, true)
  }, [])

  // At the default size, collection result items will render at 162px tall, so
  // that value is used as a default here.
  const getSize = useCallback((index) => sizeMap.current[index] || 162, [])

  return (
    <div className="collection-results-list">
      <AutoSizer style={{ position: 'relative', height: '100%', width: '100%' }}>
        {
          ({ height, width }) => (
            <InfiniteLoader
              ref={infiniteLoaderRef}
              isItemLoaded={isItemLoaded}
              itemCount={itemCount}
              loadMoreItems={loadMoreItems}
              threshold={4}
            >
              {
                ({ onItemsRendered, ref }) => (
                  <List
                    ref={(list) => {
                      ref(list)
                      listRef.current = list
                    }}
                    height={height}
                    width={width}
                    innerElementType={innerElementType}
                    itemCount={itemCount}
                    itemSize={getSize}
                    itemData={{
                      windowHeight: height,
                      windowWidth: width,
                      collectionsMetadata,
                      onAddProjectCollection,
                      onRemoveCollectionFromProject,
                      onViewCollectionGranules,
                      onViewCollectionDetails,
                      isItemLoaded,
                      setSize
                    }}
                    onItemsRendered={
                      (data) => {
                        const {
                          visibleStartIndex,
                          visibleStopIndex
                        } = data

                        const middleIndex = Math.round((visibleStartIndex + visibleStopIndex) / 2)

                        if (middleIndex) setVisibleMiddleIndex(middleIndex)
                        onItemsRendered(data)
                      }
                    }
                  >
                    {CollectionResultsListItem}
                  </List>
                )
              }
            </InfiniteLoader>
          )
        }
      </AutoSizer>
    </div>
  )
}

CollectionResultsList.defaultProps = {
  setVisibleMiddleIndex: null,
  visibleMiddleIndex: null
}

CollectionResultsList.propTypes = {
  collectionsMetadata: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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

export default CollectionResultsList
