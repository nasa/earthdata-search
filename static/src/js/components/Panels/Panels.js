import React, { PureComponent, Children } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import { Overlay, Tooltip } from 'react-bootstrap'

import PanelSection from './PanelSection'
import PanelGroup from './PanelGroup'

import history from '../../util/history'
import { getPanelSizeMap } from '../../util/getPanelSizeMap'
import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'

import './Panels.scss'

export class Panels extends PureComponent {
  constructor(props) {
    super(props)
    this.width = 600 // The default width the panel is displayed when open
    this.clickStartWidth = undefined
    this.clickStartX = undefined
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

    const {
      panelState = '',
      show: showProps
    } = props

    let show = showProps

    if (panelState === 'collapsed') show = false
    if (panelState === 'fullWidth') this.width = this.calculateMaxWidth()

    this.state = {
      maxWidth: undefined,
      minWidth: 400,
      dragging: false,
      show,
      handleToolipVisible: false,
      handleTooltipState: 'Collapse',
      willMinimize: false
    }

    this.onChangePanel = this.onChangePanel.bind(this)
    this.onPanelDragStart = this.onPanelDragStart.bind(this)
    this.onPanelDragEnd = this.onPanelDragEnd.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.onWindowKeyUp = this.onWindowKeyUp.bind(this)
    this.onPanelHandleClickOrKeypress = this.onPanelHandleClickOrKeypress.bind(this)
    this.onPanelHandleMouseOver = this.onPanelHandleMouseOver.bind(this)
    this.onPanelHandleMouseOut = this.onPanelHandleMouseOut.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
    this.disableHandleClickEvent = this.disableHandleClickEvent.bind(this)
    this.enableHandleClickEvent = this.enableHandleClickEvent.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
    window.addEventListener('keyup', this.onWindowKeyUp)
    window.addEventListener('resize', this.onWindowResize)
    this.browserHistoryUnlisten = history.listen(this.onWindowResize)

    const maxWidth = this.calculateMaxWidth()

    this.setState({
      maxWidth
    })

    this.updateResponsiveClassNames()
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

    const {
      panelState,
      show: propsShow
    } = this.props
    const {
      panelState: prevPanelState,
      show: prevPropsShow
    } = prevProps

    // If the panelState has changed, update the component
    if (panelState !== prevPanelState) {
      this.setPanelState(panelState)
    }

    // If the show prop has changed, update the state
    if (propsShow !== prevPropsShow) {
      this.updateShowState(propsShow)
    }

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
    window.removeEventListener('keyup', this.onWindowKeyUp)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
    if (this.browserHistoryUnlisten) this.browserHistoryUnlisten()
  }

  onWindowResize() {
    const { minWidth } = this.state
    const { width } = this
    const maxWidth = this.calculateMaxWidth()

    // Set the new max width
    this.setState({
      maxWidth
    })

    // If the panels width is larger than the max and min,
    // set the width to the new max
    if (width > maxWidth && width > minWidth) {
      this.updatePanelWidth(maxWidth)
    }

    // If the width is smaller than the min somehow, set the width
    // to the min
    if (width < minWidth) {
      this.updatePanelWidth(minWidth)
    }
  }

  onWindowKeyUp(e) {
    const { show } = this.state
    const { keyboardShortcuts } = this

    const togglePanels = () => {
      this.setState({
        show: !show,
        willMinimize: show
      })
    }

    triggerKeyboardShortcut({
      event: e,
      shortcutKey: keyboardShortcuts.togglePanel,
      shortcutCallback: togglePanels
    })
  }

  onChangePanel(panelId) {
    const { onChangePanel } = this.props
    onChangePanel(panelId)
  }

  onPanelHandleMouseOver() {
    const { show } = this.state

    const nextHandleTooltipState = show ? 'Collapse' : 'Expand'

    // Using a set titmeout to make sure the 'Expanded'/'Collapsed' content in the
    // tooltip does not switch while the tooltip is fading out
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

  onPanelHandleClickOrKeypress(e) {
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
        handleToolipVisible: false
      })
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

    const { width } = this

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
      dragging,
      handleToolipVisible
    } = this.state

    if (handleToolipVisible) {
      this.setState({
        handleToolipVisible: false
      })
    }

    this.pageX = e.pageX

    if (!dragging) return

    // If the user is dragging, fire the onUpdate function
    this.rafId = window.requestAnimationFrame(this.onUpdate)
  }

  onUpdate() {
    const {
      maxWidth,
      minWidth,
      willMinimize,
      show
    } = this.state

    const {
      pageX,
      clickStartX,
      clickStartWidth
    } = this

    const distanceDragged = pageX - clickStartX

    if (!show) {
      // If the panel is closed and a user drags the handle passed the threshold, reset the clickStartWidth
      // to recalulate the width of the current cursor position. This accounts for the minimum width of the
      // closed panel position.
      if (distanceDragged > this.unminimizeWidth) {
        let widthToSet = distanceDragged

        if (widthToSet < minWidth) {
          widthToSet = minWidth
        }

        if (widthToSet > maxWidth) {
          widthToSet = maxWidth
        }

        this.width = widthToSet
        this.clickStartWidth = 0

        this.setState({
          show: true,
          willMinimize: false
        })
      }
    } else {
      const newWidth = distanceDragged + clickStartWidth
      // If the panel would minimize at the current scroll position, set the state accordingly.
      const newWillMinimize = newWidth < (minWidth - this.minimizeThreshold)

      if (willMinimize !== newWillMinimize) {
        this.setState({
          willMinimize: newWillMinimize
        })
      }

      // Prevent the width from being set lower than minWidth.
      if (newWidth < minWidth) {
        this.updatePanelWidth(minWidth)
        return
      }

      // Prevent the width from being set greater than the maxWidth
      if (newWidth > maxWidth) {
        this.updatePanelWidth(maxWidth)
        return
      }

      this.updatePanelWidth(newWidth)
    }
  }

  onPanelDragStart(clickStartWidth, clickStartX) {
    this.onWindowResize()
    this.setState({
      dragging: true
    })
    this.clickStartWidth = clickStartWidth
    this.clickStartX = clickStartX
  }

  onPanelDragEnd() {
    const {
      onPanelClose,
      onPanelOpen
    } = this.props

    const {
      minWidth
    } = this.state

    const {
      pageX,
      clickStartX,
      clickStartWidth
    } = this

    // Only change the state when the user finishes a drag. Click events
    // will fire this function, but they should not fire the dragend events.
    if (!this.handleClickIsValid) {
      const dragEndStateDefaults = {
        dragging: false,
        handleToolipVisible: false
      }

      const distanceDragged = pageX - clickStartX
      const newWidth = distanceDragged + clickStartWidth

      // Close the panel if its current with is smaller than the minWidth minus the threshold
      const panelShouldClose = (newWidth < (minWidth - this.minimizeThreshold))

      if (panelShouldClose) {
        this.setState({
          ...dragEndStateDefaults,
          show: false,
          willMinimize: true
        }, () => {
          if (onPanelClose) onPanelClose()
        })
      } else {
        this.setState({
          ...dragEndStateDefaults,
          show: true,
          willMinimize: false
        }, () => {
          if (onPanelOpen) onPanelOpen()
        })
      }
    }
  }

  setHandleMouseMovedDuringClick() {
    this.handleClickMoved = true
  }

  setPanelState(panelState) {
    switch (panelState) {
      case 'collapsed':
        this.updateShowState(false)
        break
      case 'fullWidth':
        this.updatePanelWidth(this.calculateMaxWidth())
        break
      default:
        break
    }
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

  updateShowState(show) {
    this.setState({ show })
  }

  /**
   * Update the panel with the new width.
   */
  updatePanelWidth(width) {
    this.width = width
    this.container.style.width = `${width}px`
    this.updateResponsiveClassNames()
  }

  /**
   * Calculate class names to apply to the responsive container.
   */
  updateResponsiveClassNames() {
    const { width } = this

    const sizes = getPanelSizeMap(width)

    // Apply the active class names to the responsive container. A separate container
    // is being used here because these class names need to be set outside of react
    // and might get wiped out on rerender.
    Object.keys(sizes).forEach((size) => {
      if (sizes[size]) {
        this.responsiveContainer.classList.add(`panels--${size}`)
      } else {
        this.responsiveContainer.classList.remove(`panels--${size}`)
      }
    })
  }

  /**
   * Calculate the maxwidth for the current browser window size. The size is computed
   * based on the available space for the panel. If there is more than 1000px available
   * to display the panel, the max width is set so it does not cover any of the user/account
   * navigation. If the available space is less than 1000px, we allow the user to cover the
   * account information.
   */
  calculateMaxWidth() {
    const routeWrapper = document.querySelector('.route-wrapper__content')

    if (routeWrapper) {
      const routeWrapperWidth = routeWrapper.offsetWidth

      // Set the maxWidth to the available space minus the width of the
      // map tools.
      return routeWrapperWidth - 55
    }

    // If for some reason the elements are not available in the DOM, set
    // the maxWidth to 1000px.
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
      dragging,
      show,
      willMinimize,
      handleToolipVisible,
      handleTooltipState
    } = this.state

    const { keyboardShortcuts } = this

    const { width } = this

    const panelGroups = Children.map(children,
      (child, index) => this.renderPanelGroup(child, index))

    const className = classNames([
      'panels',
      {
        'panels--is-open': show,
        'panels--is-draggable': draggable,
        'panels--is-dragging': dragging,
        'panels--is-minimized': willMinimize && !show,
        'panels--will-minimize': willMinimize
      }
    ])

    return (
      <section
        className={className}
        style={{ width: `${width}px` }}
        ref={(node) => {
          this.container = node
        }}
        data-test-id="panels-section"
      >
        {
          draggable && (
            <>
              <div
                className="panels__handle"
                aria-label={`${handleTooltipState} panel (${keyboardShortcuts.togglePanel})`}
                role="button"
                tabIndex="0"
                ref={(node) => {
                  this.node = node
                }}
                onMouseDown={this.onMouseDown}
                onClick={this.onPanelHandleClickOrKeypress}
                onKeyDown={this.onPanelHandleClickOrKeypress}
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
        <div
          className="panels__responsive-container"
          ref={(node) => {
            this.responsiveContainer = node
          }}
        >
          {panelGroups}
        </div>
      </section>
    )
  }
}

Panels.defaultProps = {
  activePanel: '0.0.0',
  draggable: false,
  panelState: 'default',
  show: false,
  onPanelClose: null,
  onPanelOpen: null,
  onChangePanel: null
}

Panels.propTypes = {
  activePanel: PropTypes.string,
  panelState: PropTypes.string,
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
