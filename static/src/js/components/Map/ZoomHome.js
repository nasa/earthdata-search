import { Control } from 'leaflet'

import {
  withLeaflet,
  MapControl
} from 'react-leaflet'

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
  options = {
    position: 'bottomright',
    zoomInText: '<i class="fa fa-plus"></i>',
    zoomInTitle: 'Zoom in',
    zoomOutText: '<i class="fa fa-minus"></i>',
    zoomOutTitle: 'Zoom out',
    zoomHomeText: '<i class="fa fa-home"></i>',
    zoomHomeTitle: 'Zoom home'
  }

  onAdd(map) {
    const { options } = this

    // Assign the zoom end handler to add custom zoom button titles and styling
    map.on('zoomend', this.onZoomEnd)

    // Trigger a zoom to the current map zoom level so zoomend fires and calls onZoomEnd on load
    // eslint-disable-next-line no-underscore-dangle
    map.fire('zoom', { zoom: map._zoom })

    const container = Control.Zoom.prototype.onAdd.call(this, map)
    // eslint-disable-next-line no-underscore-dangle
    const home = this._createButton(
      options.zoomHomeText,
      options.zoomHomeTitle,
      'leaflet-control-zoom-home',
      container,
      (_this => e => _this.zoomHome(e))(this)
    )
    // eslint-disable-next-line no-underscore-dangle
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
    // TODO: Need to get info like spatial and project from props

    // var bounds, i, len, point, points, spatial;
    // spatial = currentPage.query.spatial();
    // if ((spatial != null ? spatial.length : void 0) > 0) {
    //   points = spatial.split(':');
    //   points.shift();
    //   bounds = new L.LatLngBounds();
    //   for (i = 0, len = points.length; i < len; i++) {
    //     point = points[i];
    //     bounds.extend(point.split(',').reverse());
    //   }
    //   return this._map.fitBounds(bounds);
    // } else {
    // if (this._map.projection === 'geo') {
    //   return this._map.setView([0, 0], 2)
    // }

    // if (this._map.projection === 'arctic') {
    //   return this._map.setView([90, 0], 0)
    // }

    // return this._map.setView([-90, 0], 0)
    // }
    // eslint-disable-next-line no-underscore-dangle
    return this._map.setView([0, 0], 2)
  }
}

class ZoomHome extends MapControl {
  createLeafletElement() {
    return new ZoomExtended()
  }
}

export default withLeaflet(ZoomHome)
