import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Button extends Component {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    const { onClick } = this.props
    onClick(event)
  }

  render() {
    const {
      buttonStyle,
      iconClass,
      text
    } = this.props

    return (
      <button
        type="button"
        onClick={this.handleClick}
      >
        {
          buttonStyle === 'icon' && iconClass
            ? (
              <i className={`fa fa-${iconClass}`}>
                <span className="visually-hidden">{text}</span>
              </i>
            )
            : text
        }
      </button>
    )
  }
}

Button.defaultProps = {
  buttonStyle: 'text',
  iconClass: ''
}

Button.propTypes = {
  buttonStyle: PropTypes.string,
  iconClass: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
}

export default Button
