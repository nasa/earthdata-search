import React from 'react'
import PropTypes from 'prop-types'

const TemporalDisplayEntry = (props) => {
  const { value } = props

  return (
    <React.Fragment>
      {value}
    </React.Fragment>
  )
}

TemporalDisplayEntry.propTypes = {
  value: PropTypes.string.isRequired
}

export default TemporalDisplayEntry
