import React, { PureComponent, Children } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import PanelSection from './PanelSection'
import PanelGroup from './PanelGroup'

import history from '../../util/history'

import './Panels.scss'

export class Panels extends PureComponent {
  constructor(props) {
    super(props)

    this.panelWidth = 600

    this.maxWidth = undefined
    this.minWidth = undefined
    this.clickStartWidth = undefined
    this.clickStartX = undefined
    this.dragging = false
    this.width = this.panelWidth
    this.previousWidth = 0


    this.onChangePanel = this.onChangePanel.bind(this)
    this.onPanelsClose = this.onPanelsClose.bind(this)
    this.onPanelsWidthChange = this.onPanelsWidthChange.bind(this)
    this.onPanelDragStart = this.onPanelDragStart.bind(this)
    this.onPanelDragEnd = this.onPanelDragEnd.bind(this)
    // this.onPanelToggle = this.onPanelToggle.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
    this.browserHistoryUnlisten = history.listen(this.onWindowResize)

    const maxWidth = this.calculateMaxWidth()

    this.maxWidth = maxWidth
  }

  componentWillUnmount() {
    this.onPanelToggle()
    if (this.browserHistoryUnlisten) this.browserHistoryUnlisten()
    window.addEventListener('resize', this.onWindowResize)
  }

  onWindowResize() {
    setTimeout(() => {
      const maxWidth = this.calculateMaxWidth()
      this.maxWidth = maxWidth

      if (this.width > maxWidth) this.onPanelsWidthChange(maxWidth)
    }, 0)
  }

  onPanelsClose() {
    const { onPanelClose } = this.props
    onPanelClose()
  }

  onChangePanel(panelId) {
    const { onChangePanel } = this.props
    onChangePanel(panelId)
  }

  onMouseDown(e) {
    e.stopPropagation()
    e.preventDefault()

    if (e.button !== 0) return

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)

    this.onPanelDragStart(this.width, e.pageX)
  }

  onMouseUp(e) {
    e.stopPropagation()
    e.preventDefault()

    document.removeEventListener('mousemove', this.throttledMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    this.onPanelDragEnd()
  }

  onMouseMove(e) {
    this.pageX = e.pageX

    e.stopPropagation()
    e.preventDefault()

    if (!this.dragging) return

    window.requestAnimationFrame(this.onUpdate)
  }

  onUpdate() {
    const {
      pageX,
      clickStartX,
      maxWidth,
      minWidth,
      clickStartWidth
    } = this

    const distanceScrolled = pageX - clickStartX
    const newWidth = distanceScrolled + clickStartWidth

    if (newWidth > maxWidth) {
      this.onPanelsWidthChange(maxWidth)
      return
    }
    if (newWidth < minWidth) {
      this.onPanelsWidthChange(minWidth)
      return
    }

    this.onPanelsWidthChange(newWidth)
  }

  onPanelsWidthChange(newWidth) {
    this.container.style.width = `${newWidth}px`

    this.width = newWidth
    this.previousWidth = newWidth
  }

  onPanelDragStart(clickStartWidth, clickStartX) {
    this.container.classList.add('panels--is-dragging')
    document.body.classList.add('is-panels-dragging')

    this.clickStartWidth = clickStartWidth
    this.clickStartX = clickStartX
    this.dragging = true
  }

  onPanelDragEnd() {
    this.container.classList.remove('panels--is-dragging')
    document.body.classList.remove('is-panels-dragging')

    this.clickStartWidth = undefined
    this.clickStartX = undefined
    this.dragging = false
  }

  calculateMaxWidth() {
    // const headerHeight = $('.route-wrapper__header').outerHeight()
    // const tabHeight = $('.master-overlay-panel__tab').width()
    // const routeWrapperHeight = $('.route-wrapper').width()
    // const maxWidth = routeWrapperHeight - (headerHeight + tabHeight)
    return 1000
    // return maxWidth
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
    const {
      children,
      draggable,
      show
    } = this.props

    const panelGroups = Children.map(children,
      (child, index) => this.renderPanelGroup(child, index))

    const className = classNames([
      'panels',
      {
        'panels--is-active': show
      }
    ])
    return (
      <section
        className={className}
        style={{ width: '600px' }}
        ref={(node) => {
          this.container = node
        }}
      >
        {
          draggable && (
            <div
              className="panels__handle"
              role="button"
              tabIndex="0"
              ref={(node) => {
                this.node = node
              }}
              onMouseDown={this.onMouseDown}
            />
          )
        }
        {panelGroups}
      </section>
    )
  }
}

Panels.defaultProps = {
  activePanel: '0.0.0',
  draggable: false,
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
  draggable: PropTypes.bool,
  show: PropTypes.bool,
  onPanelClose: PropTypes.func,
  onChangePanel: PropTypes.func
}

export default Panels
