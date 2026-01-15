import React from 'react'
import PropTypes from 'prop-types'

import Dots from './Dots'

import './Spinner.scss'

export const Spinner = ({
  className = null,
  color = '',
  dataTestId = null,
  inline = false,
  size = '',
  type,
  label = 'Loading...'
}) => {
  if (type === 'dots') {
    return (
      <Dots
        className={className}
        dataTestId={dataTestId}
        color={color}
        size={size}
        inline={inline}
        label={label}
      />
    )
  }

  return null
}

Spinner.propTypes = {
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  color: PropTypes.string,
  inline: PropTypes.bool,
  size: PropTypes.string,
  type: PropTypes.string.isRequired,
  label: PropTypes.string
}

export default Spinner
