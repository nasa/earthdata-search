import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-bootstrap'
import {
  ArrowChevronUp,
  ArrowChevronDown
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './CollapsePanel.scss'

export class CollapsePanel extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      open: false
    }

    this.onToggleClick = this.onToggleClick.bind(this)
  }

  onToggleClick() {
    const { open } = this.state
    this.setState({ open: !open })
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
      ? <EDSCIcon title="ArrowChevronUp" className="collapse-panel__button-secondary-icon" icon={ArrowChevronUp} />
      : <EDSCIcon title="ArrowChevronDown" className="collapse-panel__button-secondary-icon" icon={ArrowChevronDown} />

    const openCloseLabel = open ? 'Close Panel' : 'Open Panel'

    return (
      <div className={classNames} data-testid="collapse-panel">
        <button
          className={buttonClassNames}
          type="button"
          aria-label={openCloseLabel}
          onClick={(event) => this.onToggleClick(event)}
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
        <Collapse in={open}>
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
  panelClassName: ''
}

CollapsePanel.propTypes = {
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]).isRequired,
  panelClassName: PropTypes.string
}

export default CollapsePanel
