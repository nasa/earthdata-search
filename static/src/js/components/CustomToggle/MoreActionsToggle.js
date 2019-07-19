import React, { Component } from 'react'
import PropTypes from 'prop-types'

import CustomToggle from './CustomToggle'

// Need to use a Class component here so this works with the refs passed from
// the parent react-bootstrap component
// eslint-disable-next-line react/prefer-stateless-function
export class ToggleMoreActions extends Component {
  render() {
    const {
      className,
      onClick
    } = this.props
    return (
      <CustomToggle
        className={className}
        onClick={onClick}
        title="More actions"
        icon="ellipsis-v"
      />
    )
  }
}

ToggleMoreActions.defaultProps = {
  className: null
}

ToggleMoreActions.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default ToggleMoreActions
