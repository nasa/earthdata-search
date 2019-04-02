import React from 'react'
import PropTypes from 'prop-types'

const TemporalSelection = (props) => {
  const { type, value } = props
  // TODO: Consider using lodash capitalize method
  const label = type.charAt(0).toUpperCase() + type.slice(1)

  return (
    <React.Fragment>
      <strong>
        {label}
        {': '}
      </strong>
      {value}
    </React.Fragment>
  )
}

TemporalSelection.propTypes = {
  type: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
}

export default TemporalSelection
