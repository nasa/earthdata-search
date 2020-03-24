import React from 'react'
import PropTypes from 'prop-types'

const Cell = ({ cell }) => {
  const { value } = cell

  return (
    <div className="collection-results-table__data-cell" title={value}>
      {value}
    </div>
  )
}

Cell.propTypes = {
  cell: PropTypes.shape({}).isRequired
}

export default Cell
