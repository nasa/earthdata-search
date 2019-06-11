import React from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-bootstrap'
import $ from 'jquery'

import scrollParent from '../../util/scrollParent'

window.$ = $

export class CollapsePanel extends React.Component {
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
      headerText,
      panelClassName
    } = this.props
    const { open } = this.state

    const classNames = `collapse-panel ${className}`
    const buttonClassNames = `collapse-panel__button ${buttonClassName}`
    const panelClassNames = `collapse-panel__panel ${panelClassName}`

    const icon = <i className={`fa fa-chevron-${open ? 'up' : 'down'}`} />

    return (
      <div className={classNames}>
        <button
          className={buttonClassNames}
          type="button"
          onClick={e => this.onToggleClick(e)}
          aria-controls="collapse-text"
          aria-expanded={open}
        >
          {`${headerText} `}
          {icon}
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
  headerText: PropTypes.string.isRequired,
  panelClassName: PropTypes.string,
  scrollToBottom: PropTypes.bool
}

export default CollapsePanel
