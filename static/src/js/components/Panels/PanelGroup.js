import React, { Children } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PanelGroupHeader from './PanelGroupHeader'
import PanelItem from './PanelItem'

import './PanelGroup.scss'

/**
 * Renders PanelGroup.
 * @param {object} props - The props passed into the component.
 * @param {node} props.children - The panel group children. Should consist only of PanelItem components.
 * @param {string} props.primaryHeading - The text to be used as the primary heading.
 * @param {string} props.secondaryHeading - The text to be used as the secondary heading.
 * @param {boolean} props.isOpen - A flag to desingate the PanelGroup as open.
 * @param {boolean} props.isActive -  A flag to desingate the PanelGroup as active. Active PanelGroups are lifted to the highest index.
 * @param {function} props.onPanelsClose - The action to close the panels.
 */
// eslint-disable-next-line react/prefer-stateless-function
export const PanelGroup = ({
  activePanelId,
  footer,
  children,
  primaryHeading,
  secondaryHeading,
  isOpen,
  isActive,
  onPanelsClose
}) => {
  const renderPanels = (child, index) => {
    if (!child) return null
    const childProps = { ...child.props }
    if (!childProps.panelId) childProps.panelId = `${index}`
    childProps.isActive = !!(childProps.panelId === activePanelId)
    childProps.footer = childProps.footer ? childProps.footer : footer
    return <PanelItem {...childProps} />
  }

  const panels = Children.map(children, (child, index) => renderPanels(child, index))

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
    </div>
  )
}

PanelGroup.defaultProps = {
  activePanelId: '0',
  isActive: false,
  isOpen: false,
  secondaryHeading: null,
  footer: null,
  onPanelsClose: null
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
  footer: PropTypes.node
}

export default PanelGroup
