import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PanelGroupFooter from './PanelGroupFooter'
import PanelGroupHeader from './PanelGroupHeader'
import PanelItem from './PanelItem'

import './PanelGroup.scss'

// eslint-disable-next-line react/prefer-stateless-function
export class PanelGroup extends Component {
  renderPanels(child, index) {
    if (!child) return null
    const { activePanelId } = this.props
    const childProps = { ...child.props }
    if (!childProps.panelId) childProps.panelId = `${index}`
    childProps.isActive = !!(childProps.panelId === activePanelId)
    return <PanelItem {...childProps} />
  }

  render() {
    const {
      children,
      primaryHeading,
      secondaryHeading,
      isOpen,
      isActive,
      onPanelsClose,
      footer
    } = this.props

    const panels = Children.map(children, (child, index) => this.renderPanels(child, index))

    const className = classNames([
      'panel-group',
      {
        'panel-group--is-open': isOpen,
        'panel-group--is-active': isActive
      }
    ])

    return (
      <div className={className}>
        <PanelGroupHeader
          primaryHeading={primaryHeading}
          secondaryHeading={secondaryHeading}
          onPanelsClose={onPanelsClose}
        />
        {panels}
        {footer && (
          <PanelGroupFooter
            footer={footer}
          />
        )}
      </div>
    )
  }
}

PanelGroup.defaultProps = {
  activePanelId: '0',
  isActive: false,
  isOpen: false,
  secondaryHeading: null,
  footer: null,
  onPanelsClose: null,
  onChangePanel: null
}

PanelGroup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  isOpen: PropTypes.bool,
  isActive: PropTypes.bool,
  primaryHeading: PropTypes.string.isRequired,
  activePanelId: PropTypes.string,
  secondaryHeading: PropTypes.string,
  onPanelsClose: PropTypes.func,
  onChangePanel: PropTypes.func,
  footer: PropTypes.node
}

export default PanelGroup
