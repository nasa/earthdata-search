import React from 'react'
import PropTypes from 'prop-types'

const SpatialDisplayEntry = (props) => {
  const { value } = props

  return (
    <>
      {value}
    </>
  )
}

SpatialDisplayEntry.defaultProps = {
  value: ''
}

SpatialDisplayEntry.propTypes = {
  value: PropTypes.string
}

export default SpatialDisplayEntry
