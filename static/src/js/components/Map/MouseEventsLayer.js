/* eslint-disable max-classes-per-file, no-underscore-dangle */

import L from 'leaflet'
import {
  withLeaflet,
  MapLayer
} from 'react-leaflet'

import $ from 'jquery'

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

  disable(e) {
    this._disabled += 1
    return this._onMouseOut(e)
  }

  _onMouseMove(e) {
    if (this._disabled !== 0) { return }

    const point = e.containerPoint
    const hoverPoint = this._hoverPoint
    const { abs } = Math

    const $target = $(e.originalEvent.target)
    if ($target.closest('.geojson-help, .leaflet-popup-pane').length > 0) {
      this._clearHoverTimeout()
      eventEmitter.emit('map.mouseout', e)
    }
    eventEmitter.emit('map.mousemove', e)
    if ((hoverPoint == null)
      || ((abs(point.x - hoverPoint.x) + abs(point.y - hoverPoint.y)) > HOVER_SENSITIVITY_PX)) {
      // Allow the mouse to move slightly without triggering another hover event
      this._hoverPoint = point
      this._setHoverTimeout(e)
    }
  }

  _onMouseOut(e) {
    eventEmitter.emit('map.mouseout', e)
    this._hoverPoint = null
    return this._clearHoverTimeout()
  }

  _onMouseClick(e) {
    eventEmitter.emit('map.click', e)
  }

  _clearHoverTimeout() {
    return clearTimeout(this._hoverTimer)
  }

  _setHoverTimeout(e) {
    this._clearHoverTimeout()
    if (this._isHovering) { eventEmitter.emit('map.hoverout', e) }
    this._isHovering = false
    const onHover = () => {
      this._isHovering = true
      return eventEmitter.emit('map.hover', e)
    }
    this._hoverTimer = setTimeout(onHover, hoverTimeoutMs)
    return this._hoverTimer
  }
}

class MouseEventsLayer extends MapLayer {
  createLeafletElement(props) {
    return new MouseEventsLayerExtended(props)
  }
}

export default withLeaflet(MouseEventsLayer)
