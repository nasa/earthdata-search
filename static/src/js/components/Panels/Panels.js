import React, { Component, Children } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import PanelSection from './PanelSection'
import PanelGroup from './PanelGroup'

import './Panels.scss'

export class Panels extends Component {
  constructor(props) {
    super(props)
    this.onChangePanel = this.onChangePanel.bind(this)
    this.onPanelsClose = this.onPanelsClose.bind(this)
  }

  onPanelsClose() {
    const { onPanelClose } = this.props
    onPanelClose()
  }

  onChangePanel(panelId) {
    const { onChangePanel } = this.props
    onChangePanel(panelId)
  }

  renderPanelGroup(child, index) {
    if (!child) return null

    const { activePanel } = this.props
    const [activePanelSectionId = 0, activePanelGroupId = 0, activePanelId = 0] = activePanel.split('.')
    const panelSectionProps = { ...child.props }
    const { children } = panelSectionProps
    if (!panelSectionProps.panelSectionId) panelSectionProps.panelSectionId = `${index}`
    panelSectionProps.isOpen = !!(panelSectionProps.panelSectionId === activePanelSectionId)
    panelSectionProps.isActive = !!(panelSectionProps.panelSectionId === activePanelSectionId)

    const panelGroups = Children.map(children, (child, index) => {
      const panelGroupProps = { ...child.props }
      if (!panelGroupProps.panelGroupId) panelGroupProps.panelGroupId = `${index}`

      const isActivePanelGroup = !!(
        panelSectionProps.panelSectionId === activePanelSectionId
        && panelGroupProps.panelGroupId === activePanelGroupId
      )

      panelGroupProps.isOpen = isActivePanelGroup
      panelGroupProps.isActive = isActivePanelGroup
      panelGroupProps.activePanelId = activePanelId
      panelGroupProps.onPanelsClose = this.onPanelsClose
      panelGroupProps.onChangePanel = this.onChangePanel

      return <PanelGroup {...panelGroupProps} />
    })


    return (
      <PanelSection {...panelSectionProps}>
        {panelGroups}
      </PanelSection>
    )
  }

  render() {
    const { children, show } = this.props

    const panelGroups = Children.map(children,
      (child, index) => this.renderPanelGroup(child, index))

    const className = classNames([
      'panels',
      {
        'panels--is-active': show
      }
    ])
    return (
      <section className={className}>
        {panelGroups}
      </section>
    )
  }
}

Panels.defaultProps = {
  activePanel: '0.0.0',
  show: false,
  onPanelClose: null,
  onChangePanel: null
}

Panels.propTypes = {
  activePanel: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  show: PropTypes.bool,
  onPanelClose: PropTypes.func,
  onChangePanel: PropTypes.func
}

export default Panels
