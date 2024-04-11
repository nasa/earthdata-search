import React from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

// eslint-disable-next-line react/display-name
export const ButtonToggle = React.forwardRef(({
  children,
  className,
  label,
  onClick,
  disabled
}, ref) => (
  <Button
    ref={ref}
    bootstrapVariant="primary"
    bootstrapSize="sm"
    className={className}
    onClick={onClick}
    label={label}
    disabled={disabled}
  >
    {children}
  </Button>
))

ButtonToggle.defaultProps = {
  className: null,
  disabled: false
}

ButtonToggle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default ButtonToggle
