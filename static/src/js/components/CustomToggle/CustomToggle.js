import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './CustomToggle.scss'

export class CustomToggle extends Component {
  constructor(props, context) {
    super(props, context)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    const { onClick } = this.props
    onClick(e)
  }

  render() {
    const {
      children,
      className,
      icon,
      title
    } = this.props

    const buttonClasses = classNames(
      'custom-toggle',
      {
        'custom-toggle--icon': icon
      },
      className
    )

    let iconClasses

    if (icon) {
      iconClasses = classNames(
        'custom-toggle__icon',
        icon ? `fa fa-${icon}` : null
      )
    }

    return (
      <button
        className={buttonClasses}
        type="button"
        title={title}
        onClick={this.handleClick}
      >
        {icon && <i className={iconClasses} />}
        {children}
      </button>
    )
  }
}

CustomToggle.defaultProps = {
  children: null,
  className: null,
  icon: null
}

CustomToggle.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default CustomToggle
