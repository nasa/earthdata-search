import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Dropdown from 'react-bootstrap/Dropdown'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

import ButtonToggle from '../CustomToggle/ButtonToggle'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './ButtonDropdown.scss'

/**
 * A button that toggles a custom react-bootstrap dropdown
 * @extends PureComponent
 */
export default class ButtonDropdown extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      open: props.open
    }

    this.onDropdownToggle = this.onDropdownToggle.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { open: openState } = this.state
    if (nextProps.open !== openState) {
      this.setState({
        open: nextProps.open
      })
    }
  }

  /**
   * Called when a user
   */
  onDropdownToggle() {
    const { open } = this.state

    this.setState({
      open: !open
    })
  }

  render() {
    const {
      buttonLabel,
      buttonContent,
      children,
      className,
      disabled
    } = this.props

    const {
      open
    } = this.state

    const classnames = classNames([
      'button-dropdown',
      className
    ])

    return (
      <Dropdown show={open} className={classnames} onToggle={this.onDropdownToggle}>
        <Dropdown.Toggle
          className="button-dropdown__toggle"
          id="download-selection-dropdown"
          as={ButtonToggle}
          onClick={this.onDropdownToggle}
          label={buttonLabel}
          disabled={disabled}
        >
          {buttonContent}
          &nbsp;
          {
            open
              ? <EDSCIcon icon={FaChevronUp} />
              : <EDSCIcon icon={FaChevronDown} />
          }
        </Dropdown.Toggle>
        <Dropdown.Menu className="button-dropdown__menu">
          {children}
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

ButtonDropdown.defaultProps = {
  children: null,
  className: null,
  disabled: false,
  open: false
}

ButtonDropdown.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  buttonContent: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  open: PropTypes.bool
}
