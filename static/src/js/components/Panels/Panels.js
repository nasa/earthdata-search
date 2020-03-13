/* eslint-disable react/no-unused-state */
import React, { PureComponent, Children } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import { Overlay, Tooltip } from 'react-bootstrap'

import PanelSection from './PanelSection'
import PanelGroup from './PanelGroup'

import history from '../../util/history'

import './Panels.scss'

export class Panels extends PureComponent {
  constructor(props) {
    super(props)
    this.panelWidth = 600 // The default width the panel is displayed when open
    this.minimizedWidth = 20 // The width the panel is displayed when closed
    this.minimizeThreshold = 200 // The threshold which prevents a panel from being closed when dragged passed the min width
    this.unminimizeWidth = 200 // Distance the user needs to drag to drag open the closed panel
    this.handleClickIsValid = true // Flag to check if a click on the handle should be treated as a click
    this.handleClickDelay = 500 // Time in ms to delay a click event on the handle
    this.handleClickCancelTimeout = undefined // Tracks the click event setTimeout id
    this.handleTooltipCancelTimeout = undefined // Tracks the tooltip hover event setTimeout id
    this.keyboardShortcuts = {
      togglePanel: ']'
    }

    this.state = {
      maxWidth: undefined,
      minWidth: 400,
      clickStartWidth: undefined,
      clickStartX: undefined,
      dragging: false,
      width: this.panelWidth,
      show: true,
      handleToolipVisible: false,
      handleTooltipState: 'Collapse'
    }

    this.onChangePanel = this.onChangePanel.bind(this)
    this.onPanelDragStart = this.onPanelDragStart.bind(this)
    this.onPanelDragEnd = this.onPanelDragEnd.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.onWindowKeyDown = this.onWindowKeyDown.bind(this)
    this.onPanelHandleClick = this.onPanelHandleClick.bind(this)
    this.onPanelHandleMouseOver = this.onPanelHandleMouseOver.bind(this)
    this.onPanelHandleMouseOut = this.onPanelHandleMouseOut.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.disableHandleClickEvent = this.disableHandleClickEvent.bind(this)
    this.enableHandleClickEvent = this.enableHandleClickEvent.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('keydown', this.onWindowKeyDown)
    window.addEventListener('resize', this.onWindowResize)
    this.browserHistoryUnlisten = history.listen(this.onWindowResize)

    const maxWidth = this.calculateMaxWidth()

    this.setState({
      maxWidth
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      show: prevShow,
      willMinimize: prevWillMinimize,
      dragging: prevDragging
    } = prevState

    const {
      show,
      willMinimize,
      dragging
    } = this.state

    // Apply or remove the body is-panels-will-minimize class
    if ((show !== prevShow) || (prevWillMinimize !== willMinimize)) {
      // Only add the class if willMinimize is set AND the panel is showing
      if (show && willMinimize) {
        document.body.classList.add('is-panels-will-minimize')
      } else {
        document.body.classList.remove('is-panels-will-minimize')
      }
    }

    // Apply or remove the body is-panels-dragging class
    if (prevDragging !== dragging) {
      if (dragging) {
        document.body.classList.add('is-panels-dragging')
      } else {
        document.body.classList.remove('is-panels-dragging')
      }
    }
  }

  componentWillUnmount() {
    if (this.rafId) window.cancelAnimationFrame(this.rafId)
    window.removeEventListener('resize', this.onWindowResize)
    window.removeEventListener('keydown', this.onWindowKeyDown)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
    if (this.browserHistoryUnlisten) this.browserHistoryUnlisten()
  }

  onWindowResize() {
    console.log('calling on resize')
    const { width, minWidth } = this.state
    const maxWidth = this.calculateMaxWidth()

    // Set the new max width
    this.setState({
      maxWidth
    })

    // If the panels width is larger than the max and min,
    // set the width to the new max
    if (width > maxWidth && width > minWidth) {
      this.setState({
        width: maxWidth
      })
    }

    // If the width is smaller than the min somehow, set the width
    // to the min
    if (width < minWidth) {
      this.setState({
        width: minWidth
      })
    }

    setTimeout(() => {
      const leafletControlContainer = document.querySelector('.leaflet-control-container')
      const routeWrapper = document.querySelector('.route-wrapper')

      if (leafletControlContainer) {
        if (routeWrapper) leafletControlContainer.style.height = `${routeWrapper.clientHeight}px`
      }
    })
  }

  onWindowKeyDown(e) {
    const { show } = this.state
    const { key } = e
    const { keyboardShortcuts } = this

    // Toggle the panel when the closing bracket character is pressed
    if (key === keyboardShortcuts.togglePanel) {
      this.setState({
        show: !show,
        willMinimize: show
      })

      e.preventDefault()
      e.stopPropagation()
    }
  }

  onChangePanel(panelId) {
    const { onChangePanel } = this.props
    onChangePanel(panelId)
  }

  onPanelHandleMouseOver() {
    const { show } = this.state

    const nextHandleTooltipState = show ? 'Collapse' : 'Expand'

    this.handleTooltipCancelTimeout = setTimeout(() => {
      this.setState({
        handleToolipVisible: true,
        handleTooltipState: nextHandleTooltipState
      })
    }, 750)
  }

  onPanelHandleMouseOut() {
    // Clear the timeout in case the tooltip state has not yet been updated.
    clearTimeout(this.handleTooltipCancelTimeout)

    this.setState({
      handleToolipVisible: false
    })
  }

  onPanelHandleClick(e) {
    const { show } = this.state
    const {
      type,
      key
    } = e

    // Any keypress other than the enter or spacebar keys is not considered a click.
    if (type === 'keydown') {
      if ((key !== 'Enter') && (key !== ' ')) {
        return
      }
    }

    // Make sure this is actually a click, and not a drag of the handle.
    if (this.handleClickIsValid) {
      this.setState({
        show: !show,
        willMinimize: show,
        dragging: false,
        transitioning: true,
        handleToolipVisible: false
      }, () => setTimeout(() => {
        this.setState({
          transitioning: false
        })
      }, 500))
    } else {
      this.setState({
        handleToolipVisible: false
      })
    }

    this.resetHandleMouseMovedDuringClick()
    this.enableHandleClickEvent()

    e.preventDefault()
    e.stopPropagation()
  }

  onMouseDown(e) {
    if (e.button !== 0) return

    this.handleClickCancelTimeout = setTimeout(this.disableHandleClickEvent, this.handleClickDelay)

    const { width } = this.state

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)

    this.onPanelDragStart(width, e.pageX)
  }

  onMouseUp() {
    // Clear the timeout preventing the onUpdate funtion from running
    clearTimeout(this.handleClickCancelTimeout)

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    this.onPanelDragEnd()
  }

  onMouseMove(e) {
    const {
      dragging
    } = this.state

    this.setState({
      pageX: e.pageX,
      handleToolipVisible: false
    })

    if (!dragging) return

    // If the user is dragging, fire the onUpdate function
    this.rafId = window.requestAnimationFrame(this.onUpdate)
  }

  onUpdate() {
    const {
      pageX,
      clickStartX,
      maxWidth,
      minWidth,
      clickStartWidth,
      show
    } = this.state

    const distanceScrolled = pageX - clickStartX

    if (!show) {
      // If the panel is closed and a user drags the handle passed the threshold, reset the clickStartWidth
      // to recalulate the width of the current cursor position. This accounts for the 300 px width of the
      // closed panel position.
      if (distanceScrolled > this.unminimizeWidth) {
        this.setState({
          width: distanceScrolled,
          clickStartWidth: 0,
          show: true,
          willMinimize: false
        })
      }
    } else {
      const newWidth = distanceScrolled + clickStartWidth

      // If the panel would minimize at the current scroll position, set the state accordingly.
      if (newWidth < (minWidth - this.minimizeThreshold)) {
        this.setState({
          willMinimize: true
        })
      } else {
        this.setState({
          willMinimize: false
        })
      }

      // Prevent the width from being set lower than minWidth.
      if (newWidth < minWidth) {
        this.setState({
          width: minWidth,
          show: true
        })
        return
      }

      // Prevent the width from being set greater than the maxWidth
      if (newWidth > maxWidth) {
        this.setState({
          width: maxWidth,
          show: true
        })
        return
      }

      // If the panel is show, set the new width.
      this.setState({
        width: newWidth,
        show: true
      })
    }
  }

  onPanelDragStart(clickStartWidth, clickStartX) {
    this.setState({
      clickStartWidth,
      clickStartX,
      dragging: true
    })
  }

  onPanelDragEnd() {
    const {
      onPanelClose,
      onPanelOpen
    } = this.props
    const {
      pageX,
      clickStartX,
      clickStartWidth,
      minWidth
    } = this.state

    const newState = {
      dragging: false,
      handleToolipVisible: false
    }

    const distanceScrolled = pageX - clickStartX
    const newWidth = distanceScrolled + clickStartWidth

    // Close the panel if its current with is smaller than the minWidth minus the threshold
    const panelShouldClose = (newWidth < (minWidth - this.minimizeThreshold))

    if (panelShouldClose) {
      if (onPanelClose) onPanelClose()
      newState.show = false
      newState.willMinimize = true
    } else {
      if (onPanelOpen) onPanelOpen()
      newState.show = true
      newState.willMinimize = false
    }

    if (!this.handleClickIsValid) {
      this.setState(newState)
    }
  }

  setHandleMouseMovedDuringClick() {
    this.handleClickMoved = true
  }

  resetHandleMouseMovedDuringClick() {
    this.handleClickMoved = false
  }

  disableHandleClickEvent() {
    this.handleClickIsValid = false
  }

  enableHandleClickEvent() {
    this.handleClickIsValid = true
  }

  calculateMaxWidth() {
    // Set the max width of the panel to the width of the login button
    const routeWrapper = document.querySelector('.route-wrapper__content')
    const loginButton = document.querySelector('.secondary-toolbar')

    if (routeWrapper && loginButton) {
      const routeWrapperWidth = routeWrapper.offsetWidth
      const loginButtonWidth = loginButton.offsetWidth

      let maxWidth = routeWrapperWidth - loginButtonWidth - 30

      if (routeWrapperWidth < 1000) {
        maxWidth = routeWrapperWidth - 55
      }

      return maxWidth
    }
    return 1000
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
      draggable
    } = this.props

    const {
      // transitioning,
      dragging,
      width,
      show,
      willMinimize,
      handleToolipVisible,
      handleTooltipState
    } = this.state

    const { keyboardShortcuts } = this

    const panelGroups = Children.map(children,
      (child, index) => this.renderPanelGroup(child, index))

    const className = classNames([
      'panels',
      {
        'panels--is-open': show,
        'panels--is-draggable': draggable,
        'panels--is-dragging': dragging,
        'panels--is-minimized': willMinimize && !show,
        'panels--will-minimize': willMinimize,
        'panels--xs': true,
        'panels--sm': width >= 500,
        'panels--md': width >= 700,
        'panels--lg': width >= 900,
        'panels--xl': width >= 1100
      }
    ])

    return (
      <section
        className={className}
        style={{ width: `${width}px` }}
        ref={(node) => {
          this.container = node
        }}
      >
        {
          draggable && (
            <>
              <div
                className="panels__handle"
                role="button"
                tabIndex="0"
                ref={(node) => {
                  this.node = node
                }}
                onMouseDown={this.onMouseDown}
                onClick={this.onPanelHandleClick}
                onKeyDown={this.onPanelHandleClick}
                onMouseOver={this.onPanelHandleMouseOver}
                onFocus={this.onPanelHandleMouseOver}
                onMouseOut={this.onPanelHandleMouseOut}
                onBlur={this.onPanelHandleMouseOut}
              />
              <Overlay
                target={this.node}
                show={handleToolipVisible}
                placement="right"
              >
                {
                  (props) => {
                    const tooltipProps = props
                    delete tooltipProps.show
                    return (
                      <Tooltip
                        {...tooltipProps}
                        id="panel-handle-tooltip"
                        className="panels__handle-tooltip panels__handle-tooltip--collapse"
                      >
                        {`${handleTooltipState} panel (${keyboardShortcuts.togglePanel})`}
                      </Tooltip>
                    )
                  }
                }
              </Overlay>
            </>
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
  onPanelOpen: null,
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
  onPanelOpen: PropTypes.func,
  onChangePanel: PropTypes.func
}

export default Panels
