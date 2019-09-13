import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { throttle } from 'lodash'

import history from '../../util/history'

import Button from '../Button/Button'

import './MasterOverlayPanel.scss'

/**
 * Renders MasterOverlayPanel.
 * @param {object} props - The props passed into the component.
 * @param {ReactElement} header - The content for the header section.
 * @param {ReactElement} body - The content for the body section.
 * @param {ReactElement} tabHandle - The content for the tab handle.
 * @param {number} panelHeight - The height of the component from the redux store.
 * @param {function} masterOverlayPanel - An object representing the state of the component.
 * @param {function} onMasterOverlayHeightChange - Fired when the collection height changes.
 * @param {function} onMasterOverlayPanelDragStart - Fired when a user drags the panel.
 * @param {function} onMasterOverlayPanelDragEnd - Fired when a user is finished dragging.
 */
class MasterOverlayPanel extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      maxHeight: null,
      minHeight: 0
    }

    this.browserHistoryUnlisten = null

    this.onMasterOverlayHeightChange = props.onMasterOverlayHeightChange.bind(this)
    this.onMasterOverlayPanelDragStart = props.onMasterOverlayPanelDragStart.bind(this)
    this.onMasterOverlayPanelDragEnd = props.onMasterOverlayPanelDragEnd.bind(this)
    this.onMasterOverlayPanelToggle = props.onMasterOverlayPanelToggle.bind(this)
    this.onMouseMove = throttle(this.onMouseMove.bind(this), 16)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onWindowResize = this.onWindowResize.bind(this)
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize)
    this.browserHistoryUnlisten = history.listen(this.onWindowResize)

    const maxHeight = this.calculateMaxHeight()

    this.setState({
      maxHeight
    })
  }

  componentWillUnmount() {
    this.onMasterOverlayPanelToggle()
    if (this.browserHistoryUnlisten) this.browserHistoryUnlisten()
    window.addEventListener('resize', this.onWindowResize)
  }

  onWindowResize() {
    setTimeout(() => {
      const { onMasterOverlayHeightChange, panelHeight } = this.props
      const maxHeight = this.calculateMaxHeight()
      this.setState({
        maxHeight
      })

      if (panelHeight > maxHeight) onMasterOverlayHeightChange(maxHeight)
    }, 0)
  }

  onMouseDown(e) {
    const {
      masterOverlayPanel,
      onMasterOverlayPanelDragStart
    } = this.props

    if (e.button !== 0) return

    document.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseup', this.onMouseUp)

    onMasterOverlayPanelDragStart({
      clickStartY: e.pageY,
      clickStartHeight: masterOverlayPanel.height
    })

    e.stopPropagation()
    e.preventDefault()
  }

  onMouseUp(e) {
    const { onMasterOverlayPanelDragEnd } = this.props

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    onMasterOverlayPanelDragEnd()
    e.stopPropagation()
    e.preventDefault()
  }

  onMouseMove(e) {
    const {
      masterOverlayPanel,
      onMasterOverlayHeightChange
    } = this.props

    requestAnimationFrame(() => {
      if (!masterOverlayPanel.dragging) return

      const { maxHeight, minHeight } = this.state
      const distanceScrolled = masterOverlayPanel.clickStartY - e.pageY
      const newHeight = (distanceScrolled + masterOverlayPanel.clickStartHeight)

      if (newHeight > maxHeight) {
        onMasterOverlayHeightChange(maxHeight)
        return
      }
      if (newHeight < minHeight) {
        onMasterOverlayHeightChange(minHeight)
        return
      }

      onMasterOverlayHeightChange(newHeight)
    })

    e.stopPropagation()
    e.preventDefault()
  }

  calculateMaxHeight() {
    const headerHeight = $('.route-wrapper__header').outerHeight()
    const tabHeight = $('.master-overlay-panel__tab').height()
    const routeWrapperHeight = $('.route-wrapper').height()
    const maxHeight = routeWrapperHeight - (headerHeight + tabHeight)
    return maxHeight
  }

  render() {
    const {
      actions,
      body,
      header,
      masterOverlayPanel,
      panelHeight,
      tabHandle
    } = this.props

    const { isOpen } = masterOverlayPanel

    return (
      <div
        className="master-overlay-panel"
        style={{ height: `${panelHeight}px` }}
      >
        <section className="master-overlay-panel__inner inner-panel">
          <header className="master-overlay-panel__header">
            <div className="master-overlay-panel__tab">
              <span
                className="master-overlay-panel__tab-handle"
                role="button"
                tabIndex="0"
                ref={(node) => {
                  this.node = node
                }}
                onMouseDown={this.onMouseDown}
              />
              <div className="master-overlay-panel__tab-content">
                <h2 className="master-overlay-panel__tab-heading">
                  {tabHandle}
                </h2>
                <Button
                  className="master-overlay-panel__tab-toggle"
                  label="Toggle panel"
                  onClick={() => this.onMasterOverlayPanelToggle()}
                >
                  <i className={`fa fa-chevron-circle-${isOpen ? 'down' : 'up'}`} />
                </Button>
              </div>
            </div>
            <div className="master-overlay-panel__header-content">
              {header}
            </div>
            {
              actions && (
                <div className="master-overlay-panel__header-actions">
                  {actions}
                </div>
              )
            }
          </header>
          <section className="master-overlay-panel__body">
            {body}
          </section>
        </section>
      </div>
    )
  }
}

MasterOverlayPanel.defaultProps = {
  actions: null
}

MasterOverlayPanel.propTypes = {
  actions: PropTypes.node,
  body: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
  panelHeight: PropTypes.number.isRequired,
  masterOverlayPanel: PropTypes.shape({}).isRequired,
  onMasterOverlayHeightChange: PropTypes.func.isRequired,
  onMasterOverlayPanelDragStart: PropTypes.func.isRequired,
  onMasterOverlayPanelDragEnd: PropTypes.func.isRequired,
  onMasterOverlayPanelToggle: PropTypes.func.isRequired,
  tabHandle: PropTypes.node.isRequired
}

export default MasterOverlayPanel
