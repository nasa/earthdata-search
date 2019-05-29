/* eslint-disable no-underscore-dangle */

import { Control } from 'leaflet'

import {
  withLeaflet,
  MapControl
} from 'react-leaflet'

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
    const container = Control.Zoom.prototype.onAdd.call(this, map)
    const home = this._createButton(
      options.zoomHomeText,
      options.zoomHomeTitle,
      'leaflet-control-zoom-home',
      container,
      (_this => e => _this.zoomHome(e))(this)
    )
    container.insertBefore(home, this._zoomOutButton)
    return container
  }

  zoomHome() {
    // TODO need to get info like spatial and project from props

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
    return this._map.setView([0, 0], 2)
  }
}

class ZoomHome extends MapControl {
  createLeafletElement() {
    return new ZoomExtended()
  }
}

export default withLeaflet(ZoomHome)
