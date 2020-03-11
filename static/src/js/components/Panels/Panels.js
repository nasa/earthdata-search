import React, { PureComponent, Children } from 'react'
import { PropTypes } from 'prop-types'
import classNames from 'classnames'

import PanelSection from './PanelSection'
import PanelGroup from './PanelGroup'

import './Panels.scss'

export class Panels extends PureComponent {
  constructor(props) {
    super(props)

    const { show } = props

    this.panelWidth = 600
    this.minimizedWidth = 20
    this.minimizeThreshold = 200
    this.unminimizeWidth = 200

    this.state = {
      maxWidth: undefined,
      minWidth: 400,
      clickStartWidth: undefined,
      clickStartX: undefined,
      dragging: false,
      width: this.panelWidth,
      show
    }

    this.onChangePanel = this.onChangePanel.bind(this)
    this.onPanelDragStart = this.onPanelDragStart.bind(this)
    this.onPanelDragEnd = this.onPanelDragEnd.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
    this.onUpdate = this.onUpdate.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)

    const maxWidth = this.calculateMaxWidth()

    this.setState({
      maxWidth
    })
  }

  componentWillUnmount() {
    if (this.rafId) window.cancelAnimationFrame(this.rafId)
    window.removeEventListener('resize', this.onWindowResize)
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  onWindowResize() {
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
  }

  onChangePanel(panelId) {
    const { onChangePanel } = this.props
    onChangePanel(panelId)
  }

  onMouseDown(e) {
    if (e.button !== 0) return

    const { width } = this.state

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)

    this.onPanelDragStart(width, e.pageX)

    e.stopPropagation()
    e.preventDefault()
  }

  onMouseUp(e) {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    this.onPanelDragEnd()

    e.stopPropagation()
    e.preventDefault()
  }

  onMouseMove(e) {
    const {
      dragging
    } = this.state

    this.setState({
      pageX: e.pageX
    })

    if (!dragging) return

    this.rafId = window.requestAnimationFrame(this.onUpdate)

    e.stopPropagation()
    e.preventDefault()
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
        console.log('firing')
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

    document.body.classList.add('is-panels-dragging')
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
      dragging: false
    }

    const distanceScrolled = pageX - clickStartX
    const newWidth = distanceScrolled + clickStartWidth

    if (newWidth < (minWidth - this.minimizeThreshold)) {
      if (onPanelClose) onPanelClose()
      newState.show = false
      newState.willMinimize = true
    } else {
      if (onPanelOpen) onPanelOpen()
      newState.show = true
      newState.willMinimize = false
    }

    this.setState(newState)

    document.body.classList.remove('is-panels-dragging')
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
      dragging,
      width,
      show,
      willMinimize
    } = this.state

    const panelGroups = Children.map(children,
      (child, index) => this.renderPanelGroup(child, index))

    const className = classNames([
      'panels',
      {
        'panels--is-open': show,
        'panels--is-draggable': draggable,
        'panels--is-dragging': dragging,
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
