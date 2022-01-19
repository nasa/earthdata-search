/* eslint-disable react/jsx-props-no-spreading */
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import { useTable, useBlockLayout, useRowState } from 'react-table'
import { isEmpty } from 'lodash'
import classNames from 'classnames'
import AutoSizer from 'react-virtualized-auto-sizer'
import InfiniteLoader from 'react-window-infinite-loader'

import { FixedSizeList as List } from 'react-window'

import Skeleton from '../Skeleton/Skeleton'
import { rowContentLarge } from './skeleton'

import './EDSCTable.scss'

const EDSCTableContext = createContext()

/**
 * Renders innerElementType to override the default react window behavior so sticky columns can be used.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.children - The react-window children.
 * @param {Array} props.style - The style settings from react-window.
 */
const innerElementType = forwardRef(({ children, ...rest }, ref) => {
  const { style } = rest
  return (
    <EDSCTableContext.Consumer>
      {
        ({
          getTableBodyProps,
          headerGroups,
          totalColumnsWidth,
          width
        }) => {
          const actualWidth = Math.max(width, totalColumnsWidth)
          const { style: originalTableBodyStyle, ...tableBodyRest } = getTableBodyProps()

          const tableBodyStyle = {
            ...style,
            ...originalTableBodyStyle,
            width: actualWidth
          }

          return (
            <>
              <div className="edsc-table__thead">
                {headerGroups.map((headerGroup) => {
                  const {
                    key,
                    style,
                    ...rest
                  } = headerGroup.getHeaderGroupProps()

                  const trStyle = {
                    ...style,
                    width: actualWidth
                  }

                  return (
                    <div key={key} {...rest} style={trStyle} className="edsc-table__tr">
                      {headerGroup.headers.map((column) => {
                        const { key, ...rest } = column.getHeaderProps()
                        const { customProps = {} } = column
                        const thClassNames = classNames([
                          'edsc-table__th',
                          {
                            [`${customProps.headerClassName}`]: customProps.headerClassName
                          }
                        ])
                        return (
                          <div key={key} {...rest} className={thClassNames}>
                            {column.render('Header')}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
              <div ref={ref} {...tableBodyRest} style={tableBodyStyle} className="edsc-table__tbody">
                {children}
              </div>
            </>
          )
        }
      }
    </EDSCTableContext.Consumer>
  )
})

innerElementType.propTypes = {
  children: PropTypes.node.isRequired
}

innerElementType.displayName = 'EDSCTableInnerElement'

/**
 * Renders EDSCTable.
 * @param {Object} props - The props passed into the component.
 * @param {Array} props.columns - The column settings.
 * @param {Array} props.data - The collection data.
 * @param {String} props.id - A unique id to pass the table.
 * @param {Function} props.isItemLoaded - Callback to see if an item has loaded.
 * @param {Object} props.initialTableState - The initial state to be passed to react-table.
 * @param {Boolean} props.itemCount - The current count of rows to show.
 * @param {Function} props.loadMoreItems - Callback to load the next page of results.
 * @param {Function} props.initialRowStateAccessor - initialRowStateAccessor to be passed to react-table.
 * @param {Function} props.rowClassNamesFromRowState - Callback to determine the classnames of a row based on its state.
 * @param {Function} props.rowTitleFromRowState - Callback to determine the title attribute of a row based on its state.
 * @param {Function} props.onRowClick - Callback for onRowClick.
 * @param {Function} props.onRowMouseEnter - Callback for onRowMouseEnter.
 * @param {Function} props.onRowMouseLeave - Callback for onRowMouseLeave.
 * @param {Function} props.onRowMouseUp - Callback for onRowMouseUp.
 * @param {Function} props.onRowFocus - Callback for onRowFocus.
 * @param {Function} props.onRowBlur - Callback for onRowBlur.
 * @param {Function} props.setVisibleMiddleIndex - Callback to set the state with the current middle item.
 * @param {String} props.visibleMiddleIndex - The current middle item.
 */
const EDSCTable = ({
  columns,
  data,
  id,
  isItemLoaded,
  itemCount,
  loadMoreItems,
  rowTestId,
  setVisibleMiddleIndex,
  striped,
  visibleMiddleIndex,
  initialRowStateAccessor,
  initialTableState,
  rowClassNamesFromRowState,
  rowTitleFromRowState,
  onRowClick,
  onRowMouseEnter,
  onRowMouseLeave,
  onRowMouseUp,
  onRowFocus,
  onRowBlur
}) => {
  const tableClassName = classNames([
    'edsc-table',
    'edsc-table__table--sticky',
    {
      'edsc-table__table--striped': striped
    }
  ])

  const listRef = useRef(null)
  const infiniteLoaderRef = useRef(null)

  // If visibleMiddleIndex is set, that means we want to scroll to a particular item. react-window
  // will immediatly render the items at the default index, which calls setVisibleIndex and resets
  // the values. visibleMiddleIndexRef will hold on to this value so it can be used once the listRef
  // is defined and we can call scrollToItem.
  const visibleMiddleIndexRef = useRef(visibleMiddleIndex)

  useEffect(() => {
    const scrollToItem = visibleMiddleIndexRef.current
    // When the view is changed, scroll the visibleMiddleIndex item to the center of the list.
    if (scrollToItem && listRef.current) listRef.current.scrollToItem(scrollToItem, 'center')
  }, [listRef.current])

  useEffect(() => {
  }, [visibleMiddleIndex])

  const options = {}

  if (initialRowStateAccessor) options.initialRowStateAccessor = initialRowStateAccessor
  if (!isEmpty(initialTableState)) options.initialState = initialTableState

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    prepareRow,
    rows,
    totalColumnsWidth
  } = useTable(
    {
      columns,
      data,
      ...options
    },
    useBlockLayout,
    useRowState
  )

  // Grab the style property off of the last row to be used when
  // building a skeleton row. We do this because we cant call getRowProps
  // on a the skeleton row to get the width.
  let lastRowStyle = {}

  if (rows && rows.length) {
    const lastRow = rows[rows.length - 1]
    prepareRow(lastRow)
    const lastRowProps = lastRow.getRowProps() || {}
    lastRowStyle = lastRowProps.style
  }

  const buildSkeletonRow = (style) => (
    <>
      <div
        className="edsc-table__tr"
        role="row"
        style={{
          ...style,
          display: 'flex'
        }}
      >
        {
          columns.map((column, i) => {
            const tdClasses = classNames([
              'edsc-table__td',
              'edsc-table__td--skeleton'
            ])

            const key = `edsc-table-${id}-${i}`

            return (
              <div
                key={key}
                className={tdClasses}
                role="cell"
                style={{
                  width: `${column.width}px`
                }}
              >
                <Skeleton
                  containerStyle={{ height: '18px', width: `${column.width * 0.8}px` }}
                  shapes={rowContentLarge}
                />
              </div>
            )
          })
        }
      </div>
    </>
  )

  const Row = useCallback(
    ({ data, index, style }) => {
      const {
        isItemLoaded
      } = data

      const row = rows[index]

      if (!isItemLoaded(index)) {
        return buildSkeletonRow({
          ...style,
          width: lastRowStyle.width
        })
      }

      prepareRow(row)
      const { key, ...rowProps } = row.getRowProps({
        style
      })

      let rowClassesFromState = []
      const rowTitleFromState = {
        title: undefined
      }

      if (rowClassNamesFromRowState) rowClassesFromState = rowClassNamesFromRowState(row.state)
      if (rowTitleFromRowState) rowTitleFromState.title = rowTitleFromRowState(row.state)

      const { style: rowStyle, ...rowRest } = rowProps

      const rowClasses = classNames([
        'edsc-table__tr',
        `edsc-table__tr--${(index + 1) % 2 === 0 ? 'even' : 'odd'}`,
        ...rowClassesFromState
      ])

      // If a user selects text in a cell, we want to prevent an onclick from firing.
      // This flag keeps track if a user has selected any text at the time mouseup is firing.
      // Because this event fires before the click event, we can check to see if any
      // text is currently selected and bail out if that's the case.
      let textSelectionFlag = false

      const enhancedOnRowMouseUp = (e, row) => {
        textSelectionFlag = false

        // Check the window to see if any text is currently selected.
        if (window.getSelection().toString().length > 0) {
          textSelectionFlag = true
        }

        if (onRowMouseUp) onRowMouseUp(e, row)
      }

      const enhancedOnRowClick = (e, row) => {
        // Only fire the click event on the row if no text is currently selected
        if (textSelectionFlag) return
        onRowClick(e, row)
      }

      // These events will be spread on to the row div element, ommiting the events
      // where callbacks have not been defined.
      const rowEvents = {
        onClick: (onRowClick ? (e) => enhancedOnRowClick(e, row) : undefined),
        onMouseLeave: (onRowMouseLeave ? (e) => onRowMouseLeave(e, row) : undefined),
        onMouseEnter: (onRowMouseEnter ? (e) => onRowMouseEnter(e, row) : undefined),
        onMouseUp: (onRowMouseUp || onRowClick ? (e) => enhancedOnRowMouseUp(e, row) : undefined),
        onFocus: (onRowFocus ? (e) => onRowFocus(e, row) : undefined),
        onBlur: (onRowBlur ? (e) => onRowBlur(e, row) : undefined)
      }

      const focusableProps = onRowClick
        ? {
          tabIndex: 0,
          onKeyPress: (e) => onRowClick(e, row)
        } : {}

      return (
        <React.Fragment key={key}>
          <div
            {...rowRest}
            style={{ ...rowStyle, width: '100%' }}
            className={rowClasses}
            data-test-id={rowTestId}
            {...rowEvents}
            {...focusableProps}
            {...rowTitleFromState}
          >
            {row.cells.map((cell) => {
              const { key, ...rest } = cell.getCellProps()
              const { column } = cell
              const { customProps = {} } = column

              const tdClassNames = classNames([
                'edsc-table__td',
                {
                  [`${customProps.cellClassName}`]: customProps.cellClassName,
                  'edsc-table__td--centered': customProps.centerContent
                }
              ])

              return (
                <div key={key} {...rest} className={tdClassNames}>
                  {cell.render('Cell')}
                </div>
              )
            })}
          </div>
        </React.Fragment>
      )
    },
    [prepareRow, rows]
  )

  const tableProps = getTableProps()

  return (
    <div {...tableProps} id={id} className={tableClassName}>
      <AutoSizer style={{ position: 'relative', height: '100%', width: '100%' }}>
        {
          ({ height, width }) => (
            <EDSCTableContext.Provider value={{
              headerGroups,
              height,
              width,
              totalColumnsWidth,
              getTableBodyProps
            }}
            >
              <InfiniteLoader
                ref={infiniteLoaderRef}
                isItemLoaded={isItemLoaded}
                itemCount={itemCount}
                loadMoreItems={loadMoreItems}
                threshold={5}
              >
                {
                  ({ onItemsRendered, ref }) => (
                    <List
                      ref={(list) => {
                        ref(list)
                        listRef.current = list
                      }}
                      style={{
                        overflow: 'scroll'
                      }}
                      height={height}
                      innerElementType={innerElementType}
                      itemCount={itemCount}
                      itemSize={60}
                      width={width}
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
                      itemData={{
                        isItemLoaded
                      }}
                    >
                      {Row}
                    </List>
                  )
                }
              </InfiniteLoader>
            </EDSCTableContext.Provider>
          )
        }
      </AutoSizer>
    </div>
  )
}

EDSCTable.defaultProps = {
  initialRowStateAccessor: null,
  initialTableState: {},
  isItemLoaded: null,
  isLoading: null,
  itemCount: null,
  loadMoreItems: null,
  onRowBlur: null,
  onRowClick: null,
  onRowFocus: null,
  onRowMouseEnter: null,
  onRowMouseLeave: null,
  onRowMouseUp: null,
  rowClassNamesFromRowState: null,
  rowTitleFromRowState: null,
  rowTestId: null,
  setVisibleMiddleIndex: null,
  striped: false,
  visibleMiddleIndex: null
}

EDSCTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  id: PropTypes.string.isRequired,
  initialRowStateAccessor: PropTypes.func,
  initialTableState: PropTypes.shape({}),
  isItemLoaded: PropTypes.func,
  isLoading: PropTypes.bool,
  itemCount: PropTypes.number,
  loadMoreItems: PropTypes.func,
  onRowBlur: PropTypes.func,
  onRowClick: PropTypes.func,
  onRowFocus: PropTypes.func,
  onRowMouseEnter: PropTypes.func,
  onRowMouseLeave: PropTypes.func,
  onRowMouseUp: PropTypes.func,
  rowClassNamesFromRowState: PropTypes.func,
  rowTitleFromRowState: PropTypes.func,
  rowTestId: PropTypes.string,
  setVisibleMiddleIndex: PropTypes.func,
  striped: PropTypes.bool,
  visibleMiddleIndex: PropTypes.number
}

export default EDSCTable
