/* eslint-disable no-underscore-dangle */
import React from 'react'
import { renderToString } from 'react-dom/server'
import { createControlComponent } from '@react-leaflet/core'
import { Control } from 'leaflet'
import { FaPlus, FaMinus, FaHome } from 'react-icons/fa'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import projections from '../../util/map/projections'

/*
 * Prevents the default events.
*/
const preventDefault = (e) => {
  e.preventDefault()
}

/*
 * Prevent click events on the disabled zoom buttons. This needs to be done
 * because Leaflet uses <a> tags rather than buttons, and disabled is not supported.
*/
const disableClickEvent = (el, disabled) => {
  if (!el) return

  if (disabled) {
    el.addEventListener('click', preventDefault)
  } else {
    el.removeEventListener('click', preventDefault)
  }
}

class ZoomExtended extends Control.Zoom {
  constructor(props) {
    super()
    this.props = props
  }

  options = {
    position: 'bottomright',
    zoomInText: renderToString(<EDSCIcon size="0.75rem" icon={FaPlus} />),
    zoomInTitle: 'Zoom in',
    zoomOutText: renderToString(<EDSCIcon size="0.75rem" icon={FaMinus} />),
    zoomOutTitle: 'Zoom out',
    zoomHomeText: renderToString(<EDSCIcon size="0.75rem" icon={FaHome} />),
    zoomHomeTitle: 'Zoom home'
  }

  onAdd(map) {
    const { options } = this

    // Assign the zoom end handler to add custom zoom button titles and styling
    map.on('zoomend', this.onZoomEnd)

    // Trigger a zoom to the current map zoom level so zoomend fires and calls onZoomEnd on load
    map.fire('zoom', { zoom: map._zoom })

    const container = Control.Zoom.prototype.onAdd.call(this, map)

    const home = this._createButton(
      options.zoomHomeText,
      options.zoomHomeTitle,
      'leaflet-control-zoom-home',
      container,
      ((_this) => (e) => _this.zoomHome(e))(this)
    )

    container.insertBefore(home, this._zoomOutButton)
    return container
  }

  onRemove(map) {
    map.off('zoomend', this.onZoomEnd)
  }

  onZoomEnd(e) {
    const { target: map } = e
    const { _controlContainer: controlContainer } = map
    const zoomInButton = controlContainer.querySelector('.leaflet-control-zoom-in')
    const zoomOutButton = controlContainer.querySelector('.leaflet-control-zoom-out')
    const {
      options: mapOptions,
      _zoom: currentZoom
    } = map
    const {
      maxZoom = 7,
      minZoom = 0
    } = mapOptions

    // Check if the current zoom is equal to the min or the max zoom levels.
    const maxZoomReached = currentZoom === maxZoom
    const minZoomReached = currentZoom === minZoom

    // Store the default labels.
    const zoomInTitle = zoomInButton.ariaLabel
    const zoomOutTitle = zoomOutButton.ariaLabel

    // Set the title of the zoom buttons.
    zoomInButton.title = maxZoomReached ? 'Maximum zoom level reached' : zoomInTitle
    zoomOutButton.title = minZoomReached ? 'Minimum zoom level reached' : zoomOutTitle

    // Disable click events on the the zoom buttons if neccesary.
    disableClickEvent(zoomInButton, currentZoom === maxZoom)
    disableClickEvent(zoomOutButton, currentZoom === minZoom)
  }

  zoomHome() {
    const { projection } = this.props

    // Zoom to the 'home' view based on the current map projection
    if (projection === projections.geographic) {
      return this._map.setView([0, 0], 2)
    }

    if (projection === projections.arctic) {
      return this._map.setView([90, 0], 0)
    }

    // Antarctic home view
    return this._map.setView([-90, 0], 0)
  }
}

const ZoomHome = (props) => new ZoomExtended(props)

export default createControlComponent(ZoomHome)
