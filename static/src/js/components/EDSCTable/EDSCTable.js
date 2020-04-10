/* eslint-disable react/jsx-key */
// Disabled because react-table adds the key prop

import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import { useTable, useBlockLayout } from 'react-table'
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
          headerGroups,
          getTableBodyProps
        }) => (
          <>
            <div className="edsc-table__thead">
              {headerGroups.map(headerGroup => (
                <div {...headerGroup.getHeaderGroupProps()} className="edsc-table__tr">
                  {headerGroup.headers.map((column) => {
                    const headerProps = column.getHeaderProps()
                    const { customProps = {} } = column
                    const thClassNames = classNames([
                      'edsc-table__th',
                      {
                        [`${customProps.headerClassName}`]: customProps.headerClassName
                      }
                    ])
                    return (
                      <div {...headerProps} className={thClassNames}>
                        {column.render('Header')}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
            <div ref={ref} {...getTableBodyProps()} className="edsc-table__tbody" style={{ ...style }}>
              {children}
            </div>
          </>
        )
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
 * @param {Boolean} props.itemCount - The current count of rows to show.
 * @param {Function} props.loadMoreItems - Callback to load the next page of results.
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
  visibleMiddleIndex
}) => {
  const tableClassName = classNames([
    'edsc-table',
    'edsc-table__table--sticky'
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth
  } = useTable(
    {
      columns,
      data
    },
    useBlockLayout
  )

  const buildSkeletonRow = style => (
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

      if (!isItemLoaded(index)) return buildSkeletonRow(style)

      prepareRow(row)
      const { key, ...rowProps } = row.getRowProps({
        style
      })

      const { style: rowStyle, ...rowRest } = rowProps

      return (
        <React.Fragment key={key}>
          <div
            {...rowRest}
            style={{ ...rowStyle, width: totalColumnsWidth }}
            className="edsc-table__tr"
            data-test-id={rowTestId}
          >
            {row.cells.map((cell) => {
              const cellProps = cell.getCellProps()
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
                <div {...cellProps} className={tdClassNames}>
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

  return (
    <div {...getTableProps()} id={id} className={tableClassName}>
      <AutoSizer style={{ position: 'relative', height: '100%', width: '100%' }}>
        {
          ({ height, width }) => (
            <EDSCTableContext.Provider value={{
              headerGroups,
              height,
              width,
              getTableBodyProps
            }}
            >
              <InfiniteLoader
                ref={infiniteLoaderRef}
                isItemLoaded={isItemLoaded}
                itemCount={itemCount}
                loadMoreItems={loadMoreItems}
              >
                {
                  ({ onItemsRendered, ref }) => (
                    <List
                      ref={(list) => {
                        ref(list)
                        listRef.current = list
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
  isItemLoaded: null,
  isLoading: null,
  itemCount: null,
  loadMoreItems: null,
  rowTestId: null,
  setVisibleMiddleIndex: null,
  visibleMiddleIndex: null
}

EDSCTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  id: PropTypes.string.isRequired,
  isItemLoaded: PropTypes.func,
  isLoading: PropTypes.bool,
  itemCount: PropTypes.number,
  loadMoreItems: PropTypes.func,
  rowTestId: PropTypes.string,
  setVisibleMiddleIndex: PropTypes.func,
  visibleMiddleIndex: PropTypes.number
}

export default EDSCTable
