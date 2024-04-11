import React from 'react'
import PropTypes from 'prop-types'

import './EDSCTableCell.scss'

/**
 * Renders EDSCTableCell.
 * @param {Object} props - The props passed into the component from react-table.
 */
const EDSCTableCell = ({ cell }) => {
  const { value } = cell

  return (
    <div className="edsc-table-cell" title={value}>
      <span className="edsc-table-cell__content">
        {value}
      </span>
    </div>
  )
}

EDSCTableCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.string
  }).isRequired
}

export default EDSCTableCell
