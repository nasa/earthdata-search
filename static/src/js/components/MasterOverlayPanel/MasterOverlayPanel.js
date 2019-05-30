import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import $ from 'jquery'
import { throttle } from 'lodash'

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
    this.onMasterOverlayHeightChange = props.onMasterOverlayHeightChange.bind(this)
    this.onMasterOverlayPanelDragStart = props.onMasterOverlayPanelDragStart.bind(this)
    this.onMasterOverlayPanelDragEnd = props.onMasterOverlayPanelDragEnd.bind(this)
    this.onMouseMove = throttle(this.onMouseMove.bind(this), 16)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
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
    const {
      masterOverlayPanel,
      onMasterOverlayPanelDragEnd,
      onMasterOverlayHeightChange
    } = this.props

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    if ($(this.node).offset().top < 105) {
      onMasterOverlayHeightChange(masterOverlayPanel.height - 50)
    }

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

      // This can be improved but will work for now. It currently will let the user scroll past the max height,
      // but we can just reset it when the onMouseUp fires.
      if ($(this.node).offset().top < 105) return

      const distanceScrolled = masterOverlayPanel.clickStartY - e.pageY

      onMasterOverlayHeightChange(distanceScrolled + masterOverlayPanel.clickStartHeight)
    })

    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    const {
      body,
      header,
      panelHeight,
      tabHandle
    } = this.props

    return (
      <div
        className="master-overlay-panel"
        style={{ height: `${panelHeight}px` }}
      >
        <section className="master-overlay-panel__inner inner-panel">
          <header className="container-fluid p-3 master-overlay-panel__header">
            <span className="master-overlay-panel__tab">
              <span
                className="master-overlay-panel__tab-handle"
                role="button"
                tabIndex="0"
                ref={(node) => {
                  this.node = node
                }}
                onMouseDown={this.onMouseDown}
              />
              <h2 className="master-overlay-panel__tab-heading">
                {tabHandle}
              </h2>
            </span>
            {header}
          </header>
          <section className="master-overlay-panel__body">
            {body}
          </section>
        </section>
      </div>
    )
  }
}

MasterOverlayPanel.propTypes = {
  body: PropTypes.node.isRequired,
  header: PropTypes.node.isRequired,
  panelHeight: PropTypes.number.isRequired,
  masterOverlayPanel: PropTypes.shape({}).isRequired,
  onMasterOverlayHeightChange: PropTypes.func.isRequired,
  onMasterOverlayPanelDragStart: PropTypes.func.isRequired,
  onMasterOverlayPanelDragEnd: PropTypes.func.isRequired,
  tabHandle: PropTypes.node.isRequired
}

export default MasterOverlayPanel
