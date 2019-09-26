import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'

// Need to use a Class component here so this works with the refs passed from
// the parent react-bootstrap component
// eslint-disable-next-line react/prefer-stateless-function
export class ButtonToggle extends Component {
  render() {
    const {
      children,
      className,
      label,
      onClick,
      disabled
    } = this.props
    return (
      <Button
        bootstrapVariant="primary"
        bootstrapSize="sm"
        className={className}
        onClick={onClick}
        label={label}
        disabled={disabled}
      >
        {children}
      </Button>
    )
  }
}

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
