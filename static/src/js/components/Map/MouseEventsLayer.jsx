/* eslint-disable no-underscore-dangle */
import L from 'leaflet'
import { createLayerComponent } from '@react-leaflet/core'

import { eventEmitter } from '../../events/events'

// The manhattan distance the mouse can move from the initial hover point
// without canceling the hover
const HOVER_SENSITIVITY_PX = 10

const hoverTimeoutMs = 500

class MouseEventsLayerExtended extends L.Layer {
  initialize() {
    this.enable = this.enable.bind(this)
    this.disable = this.disable.bind(this)
    this._onMouseMove = this._onMouseMove.bind(this)
    this._onMouseOut = this._onMouseOut.bind(this)
    this._hoverTimer = null
    this._hoverPoint = null
    this._disabled = 0
  }

  onAdd(map) {
    this._map = map
    map.on('mousemove', this._onMouseMove)
    map.on('mouseout', this._onMouseOut)
    map.on('click', this._onMouseClick)
    map.on('draw:drawstart draw:editstart draw:deletestart shapefile:start', this.disable)

    return map.on('draw:drawstop draw:editstop draw:deletestop shapefile:stop', this.enable)
  }

  onRemove(map) {
    this._clearHoverTimeout()
    this._map = null
    map.off('mousemove', this._onMouseMove)
    map.off('mouseout', this._onMouseOut)
    map.off('draw:drawstart draw:editstart draw:deletestart shapefile:start', this.disable)

    return map.off('draw:drawstop draw:editstop draw:deletestop shapefile:stop', this.enable)
  }

  enable() {
    this._disabled -= 1

    return this._disabled
  }

  disable(event) {
    this._disabled += 1

    return this._onMouseOut(event)
  }

  _onMouseMove(event) {
    if (this._disabled !== 0) { return }

    const point = event.containerPoint
    const hoverPoint = this._hoverPoint
    const { abs } = Math

    eventEmitter.emit('map.mousemove', event)

    if ((hoverPoint == null)
      || ((abs(point.x - hoverPoint.x) + abs(point.y - hoverPoint.y)) > HOVER_SENSITIVITY_PX)) {
      // Allow the mouse to move slightly without triggering another hover event
      this._hoverPoint = point
      this._setHoverTimeout(event)
    }
  }

  _onMouseOut(event) {
    eventEmitter.emit('map.mouseout', event)
    this._hoverPoint = null

    return this._clearHoverTimeout()
  }

  _onMouseClick(event) {
    eventEmitter.emit('map.click', event)
  }

  _clearHoverTimeout() {
    return clearTimeout(this._hoverTimer)
  }

  _setHoverTimeout(event) {
    this._clearHoverTimeout()
    if (this._isHovering) { eventEmitter.emit('map.hoverout', event) }

    this._isHovering = false
    const onHover = () => {
      this._isHovering = true

      return eventEmitter.emit('map.hover', event)
    }

    this._hoverTimer = setTimeout(onHover, hoverTimeoutMs)

    return this._hoverTimer
  }
}

const MouseEventsLayer = (props, context) => {
  const layer = new MouseEventsLayerExtended(props)

  return {
    instance: layer,
    context
  }
}

export default createLayerComponent(MouseEventsLayer, MouseEventsLayer)
