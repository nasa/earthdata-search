import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Button extends Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    const {
      onClick
    } = this.props
    onClick(event)
  }

  render() {
    const {
      text
    } = this.props

    return (
      <button
        type="button"
        onClick={this.handleClick}
      >
        {text}
      </button>
    )
  }
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Button
