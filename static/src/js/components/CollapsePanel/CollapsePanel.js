import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-bootstrap'
import $ from 'jquery'
import { FaChevronUp, FaChevronDown } from 'react-icons/fa'

import scrollParent from '../../util/scrollParent'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './CollapsePanel.scss'

window.$ = $

export class CollapsePanel extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false
    }

    this.onToggleClick = this.onToggleClick.bind(this)
    this.onEntering = this.onEntering.bind(this)
  }

  onToggleClick() {
    const { open } = this.state
    this.setState({ open: !open })
  }

  onEntering(el) {
    const { scrollToBottom } = this.props
    if (!scrollToBottom) return
    const firstScrollableParent = $(scrollParent(el))
    const parent = $(el).parents()[0]
    $(firstScrollableParent).animate({ scrollTop: $(parent).offset().top }, 200)
  }

  render() {
    const {
      buttonClassName,
      className,
      children,
      header,
      panelClassName
    } = this.props
    const { open } = this.state

    const classNames = `collapse-panel ${className}`
    const buttonClassNames = `collapse-panel__button ${buttonClassName}`
    const panelClassNames = `collapse-panel__panel ${panelClassName}`

    const icon = open
      ? <EDSCIcon className="collapse-panel__button-secondary-icon" icon={FaChevronUp} />
      : <EDSCIcon className="collapse-panel__button-secondary-icon" icon={FaChevronDown} />

    return (
      <div className={classNames}>
        <button
          className={buttonClassNames}
          type="button"
          onClick={(e) => this.onToggleClick(e)}
          aria-controls="collapse-text"
          aria-expanded={open}
        >
          <span className="collapse-panel__button-primary">
            {header}
          </span>
          <span className="collapse-panel__button-secondary">
            {icon}
          </span>
        </button>
        <Collapse in={open} onEntering={this.onEntering}>
          <div id="collapse-text" className={panelClassNames}>
            {children}
          </div>
        </Collapse>
      </div>
    )
  }
}

CollapsePanel.defaultProps = {
  buttonClassName: '',
  className: '',
  panelClassName: '',
  scrollToBottom: false
}

CollapsePanel.propTypes = {
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  panelClassName: PropTypes.string,
  scrollToBottom: PropTypes.bool
}

export default CollapsePanel
