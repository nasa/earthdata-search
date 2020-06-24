import React, { Children } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PanelGroupHeader from './PanelGroupHeader'
import PanelItem from './PanelItem'

import './PanelGroup.scss'

/**
 * Renders PanelGroup.
 * @param {Object} props - The props passed into the component.
 * @param {Boolean} props.isActive -  A flag to desingate the PanelGroup as active. Active PanelGroups are lifted to the highest index.
 * @param {Boolean} props.isOpen - A flag to desingate the PanelGroup as open.
 * @param {Function} props.onChangePanel - The action to change the panel.
 * @param {Node} props.children - The panel group children. Should consist only of PanelItem components.
 * @param {String} props.primaryHeading - The text to be used as the primary heading.
 * @param {String} props.secondaryHeading - The text to be used as the secondary heading.
 * @param {Node} props.header - The element to be used as the header.
 * @param {Node} props.secondaryHeader - The element to be used as the secondaryHeader.
 */
export const PanelGroup = ({
  activePanelId,
  children,
  footer,
  header,
  headingLink,
  isActive,
  isOpen,
  onChangePanel,
  primaryHeading,
  secondaryHeader,
  secondaryHeading
}) => {
  const renderPanels = (child, index) => {
    if (!child) return null
    const childProps = { ...child.props }
    if (!childProps.panelId) childProps.panelId = `${index}`
    const isPanelActive = !!(isActive && childProps.panelId === activePanelId)
    childProps.onChangePanel = onChangePanel
    childProps.isActive = isPanelActive
    childProps.footer = childProps.footer ? childProps.footer : footer
    return <PanelItem {...childProps} />
  }

  const panels = Children.map(children, (child, index) => renderPanels(child, index))

  const className = classNames([
    'panel-group',
    {
      'panel-group--custom-header': header,
      'panel-group--is-active': isActive,
      'panel-group--is-open': isOpen
    }
  ])

  return (
    <div className={className}>
      <PanelGroupHeader
        primaryHeading={primaryHeading}
        secondaryHeading={secondaryHeading}
        headingLink={headingLink}
        header={header}
        secondaryHeader={secondaryHeader}
      />
      {panels}
    </div>
  )
}

PanelGroup.defaultProps = {
  activePanelId: '0',
  footer: null,
  header: null,
  headingLink: null,
  isActive: false,
  isOpen: false,
  onChangePanel: null,
  primaryHeading: null,
  secondaryHeader: null,
  secondaryHeading: null
}

PanelGroup.propTypes = {
  activePanelId: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  footer: PropTypes.node,
  header: PropTypes.node,
  headingLink: PropTypes.shape({}),
  isActive: PropTypes.bool,
  isOpen: PropTypes.bool,
  onChangePanel: PropTypes.func,
  primaryHeading: PropTypes.string,
  secondaryHeader: PropTypes.node,
  secondaryHeading: PropTypes.string
}

export default PanelGroup
