/* eslint-disable react/jsx-key */
// Disabled because react-table adds the key prop

import React from 'react'
import PropTypes from 'prop-types'
import { useTable, useBlockLayout } from 'react-table'
import classNames from 'classnames'
import { Waypoint } from 'react-waypoint'

import Skeleton from '../Skeleton/Skeleton'
import { rowContentLarge } from './skeleton'

import './EDSCTable.scss'

const EDSCTable = ({
  columns,
  data,
  id,
  infiniteScrollTotal,
  infiniteScrollTrigger,
  infiniteScrollScrollableAncestor
}) => {
  const tableClassName = classNames([
    'edsc-table',
    'edsc-table__table--sticky'
  ])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useBlockLayout
  )

  const buildWaypoint = () => {
    const waypointProps = {
      onEnter: infiniteScrollTrigger
    }

    if (infiniteScrollScrollableAncestor) {
      waypointProps.scrollableAncestor = infiniteScrollScrollableAncestor
    }

    const skeletonRow = () => (
      <>
        <div
          className="edsc-table__tr"
          role="row"
          style={{
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

    return (
      <>
        {skeletonRow()}
        {skeletonRow()}
        <Waypoint
          key={`${id}-infinite-scroll-trigger`}
          onEnter={infiniteScrollTrigger}
          scrollableAncestor={infiniteScrollScrollableAncestor}
        />
      </>
    )
  }

  return (
    <div {...getTableProps()} id={id} className={tableClassName} style={{ width: '100%', height: '100%' }}>
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
      <div {...getTableBodyProps()} className="edsc-table__tbody">
        {rows.map((row) => {
          prepareRow(row)
          const { key, ...rowProps } = row.getRowProps()
          const { original } = row
          const { isLast } = original

          const insertWaypoint = isLast
            && infiniteScrollTrigger
            && infiniteScrollTotal
            && rows.length !== infiniteScrollTotal

          return (
            <React.Fragment key={key}>
              <div {...rowProps} className="edsc-table__tr">
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
              {
                insertWaypoint && buildWaypoint()
              }
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

EDSCTable.defaultProps = {
  infiniteScrollTotal: null,
  infiniteScrollTrigger: null,
  infiniteScrollScrollableAncestor: null
}

EDSCTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({})
  ).isRequired,
  id: PropTypes.string.isRequired,
  infiniteScrollTotal: PropTypes.number,
  infiniteScrollTrigger: PropTypes.func,
  infiniteScrollScrollableAncestor: PropTypes.instanceOf(Element)
}

export default EDSCTable
