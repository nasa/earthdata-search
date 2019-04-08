import React from 'react'
import PropTypes from 'prop-types'

const SpatialDisplayEntry = (props) => {
  const { value } = props

  return (
    <React.Fragment>
      {value}
    </React.Fragment>
  )
}

SpatialDisplayEntry.propTypes = {
  value: PropTypes.string.isRequired
}

export default SpatialDisplayEntry
