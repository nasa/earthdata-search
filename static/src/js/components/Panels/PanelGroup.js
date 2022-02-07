import React, { Children } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PanelGroupHeader from './PanelGroupHeader'
import PanelItem from './PanelItem'

import './PanelGroup.scss'

/**
 * Renders PanelGroup.
 * @param {Object} props - The props passed into the component
 * @param {String} props.activePanelId - The active panel id
 * @param {String} props.activeSort - The active sort option
 * @param {String} props.activeView - The active view option
 * @param {Array} props.breadcrumbs - An array of objects used to configure the breadcrumbs
 * @param {Node} props.children - The panel group children, should consist only of PanelItem components
 * @param {String} props.dataTestId - Test ID to add to the dom element
 * @param {Node} props.footer - The element to be used as the footer
 * @param {Array} props.handoffLinks - An array of objects used to configure the handoff links
 * @param {Boolean} props.headerLoading - A flag designating the header loading state
 * @param {Node} props.headerMessage - The element to be used as the header message
 * @param {Boolean} props.headerMetaPrimaryLoading - A flag designating the header primary loading state
 * @param {String} props.headerMetaPrimaryText - A string designating the header primary loading text
 * @param {Boolean} props.isActive -  A flag to designate the PanelGroup as active. Active PanelGroups are lifted to the highest index
 * @param {Boolean} props.isOpen - A flag to desingate the PanelGroup as open
 * @param {Array} props.moreActionsDropdownItems - An array of objects used to configure the more actions dropdown items
 * @param {Function} props.onChangePanel - The action to change the panel
 * @param {String} props.panelGroupId - The element to be used as the header
 * @param {String} props.primaryHeading - The text to be used as the primary heading
 * @param {String} props.secondaryHeading - The text to be used as the secondary heading
 * @param {Array} props.sortsArray - The configuration for the sorts
 * @param {Array} props.viewsArray - The configuration for the views
*/
export const PanelGroup = ({
  activePanelId,
  activeSort,
  activeView,
  breadcrumbs,
  children,
  dataTestId,
  exportsArray,
  footer,
  handoffLinks,
  headerLoading,
  headerMessage,
  headerMetaPrimaryLoading,
  headerMetaPrimaryText,
  isActive,
  isExportRunning,
  isOpen,
  moreActionsDropdownItems,
  onChangePanel,
  panelGroupId,
  primaryHeading,
  secondaryHeading,
  sortsArray,
  viewsArray
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
      'panel-group--is-active': isActive,
      'panel-group--is-open': isOpen
    }
  ])

  return (
    <div
      className={className}
      data-test-id={dataTestId}
    >
      <PanelGroupHeader
        activePanelId={activePanelId}
        activeSort={activeSort}
        activeView={activeView}
        breadcrumbs={breadcrumbs}
        exportsArray={exportsArray}
        handoffLinks={handoffLinks}
        headerLoading={headerLoading}
        headerMessage={headerMessage}
        headerMetaPrimaryLoading={headerMetaPrimaryLoading}
        headerMetaPrimaryText={headerMetaPrimaryText}
        isExportRunning={isExportRunning}
        moreActionsDropdownItems={moreActionsDropdownItems}
        panelGroupId={panelGroupId}
        panelGroupIsActive={isActive}
        primaryHeading={primaryHeading}
        secondaryHeading={secondaryHeading}
        sortsArray={sortsArray}
        viewsArray={viewsArray}
      />
      {panels}
    </div>
  )
}

PanelGroup.defaultProps = {
  activeSort: '',
  activeView: '',
  activePanelId: '0',
  breadcrumbs: [],
  dataTestId: undefined,
  exportsArray: [],
  footer: null,
  handoffLinks: [],
  headerMessage: null,
  headingLink: null,
  headerMetaPrimaryLoading: false,
  headerMetaPrimaryText: null,
  isActive: false,
  isExportRunning: false,
  isOpen: false,
  moreActionsDropdownItems: [],
  onChangePanel: null,
  panelGroupId: '',
  primaryHeading: null,
  headerLoading: false,
  secondaryHeading: null,
  sortsArray: [],
  viewsArray: []
}

PanelGroup.propTypes = {
  activeSort: PropTypes.string,
  activeView: PropTypes.string,
  activePanelId: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({})),
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  dataTestId: PropTypes.string,
  exportsArray: PropTypes.arrayOf(PropTypes.shape({})),
  footer: PropTypes.node,
  handoffLinks: PropTypes.arrayOf(PropTypes.shape({})),
  headerMessage: PropTypes.node,
  headingLink: PropTypes.shape({}),
  headerMetaPrimaryLoading: PropTypes.bool,
  headerMetaPrimaryText: PropTypes.string,
  isActive: PropTypes.bool,
  isExportRunning: PropTypes.bool,
  isOpen: PropTypes.bool,
  onChangePanel: PropTypes.func,
  moreActionsDropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.func.isRequired,
      link: PropTypes.shape({
        pathname: PropTypes.string,
        search: PropTypes.string,
        icon: PropTypes.string,
        text: PropTypes.string
      })
    })
  ),
  panelGroupId: PropTypes.string,
  primaryHeading: PropTypes.string,
  headerLoading: PropTypes.bool,
  secondaryHeading: PropTypes.node,
  sortsArray: PropTypes.arrayOf(PropTypes.shape({})),
  viewsArray: PropTypes.arrayOf(PropTypes.shape({}))
}

export default PanelGroup
