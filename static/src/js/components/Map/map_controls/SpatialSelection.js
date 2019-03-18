/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query'

import { FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'


import 'leaflet-draw/dist/leaflet.draw.css'
import icon from 'leaflet-draw/dist/images/marker-icon.png'
import iconShadow from 'leaflet-draw/dist/images/marker-shadow.png'
import actions from '../../../actions'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: iconShadow
})


// import { FeatureGroup } from 'leaflet'
// import { drawLocal } from 'leaflet-draw'
// import { withLeaflet, MapControl } from 'react-leaflet'

L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'Release to finish drawing'
L.drawLocal.draw.toolbar.buttons.polygon = 'Search by spatial polygon'
L.drawLocal.draw.toolbar.buttons.rectangle = 'Search by spatial rectangle'
L.drawLocal.draw.toolbar.buttons.marker = 'Search by spatial coordinate'

// const normalColor = '#00ffff'
// const errorColor = '#990000'

// class SpatialSelectionControl {
//   constructor(query, isMinimap = false) {
//     this._onToolChange = this._onToolChange.bind(this)
//     this._onDrawStart = this._onDrawStart.bind(this)
//     this._onDrawStop = this._onDrawStop.bind(this)
//     this._onEditStart = this._onEditStart.bind(this)
//     this._onEditEnd = this._onEditEnd.bind(this)
//     this._onDrawCreated = this._onDrawCreated.bind(this)
//     this._onDrawEdited = this._onDrawEdited.bind(this)
//     this._onDrawDeleted = this._onDrawDeleted.bind(this)
//     this._onSpatialChange = this._onSpatialChange.bind(this)
//     this._onSpatialErrorChange = this._onSpatialErrorChange.bind(this)

//     this.query = query
//     this.isMinimap = isMinimap
//   }

//   addTo(map) {
//     let el
//     this.map = map
//     this._drawnItems = new FeatureGroup()
//     const drawnItems = this._drawnItems
//     drawnItems.addTo(map)

//     const colorOptions = {
//       color: normalColor,
//       dashArray: null,
//       pointerEvents: 'stroke',
//       fillOpacity: 0
//     }
//     this._colorOptions = colorOptions

//     const errorOptions = {
//       color: errorColor,
//       dashArray: null
//     }
//     this._errorOptions = errorOptions

//     // const selectedOptions = {
//     //   dashArray: '10, 10'
//     // }

//     const drawControl = new Draw({
//       draw: {
//         polygon: {
//           drawError: errorOptions,
//           shapeOptions: colorOptions
//         },
//         rectangle: {
//           drawError: errorOptions,
//           shapeOptions: colorOptions
//         },
//         polyline: false,
//         circlemarker: false,
//         circle: false
//       },
//       edit: {
//         selectedPathOptions: {
//           opacity: 0.6,
//           dashArray: '10, 10'
//         },

//         featureGroup: drawnItems
//       },
//       position: 'bottomright'
//     })
//     this._drawControl = drawControl

//     if (!this.isMinimap) {
//       drawControl.addTo(map)
//     }

//     // const spatialModel = currentPage.query.spatial
//     const spatialModel = this.query.spatial

//     this._querySubscription = spatialModel.subscribe(this._onSpatialChange)
//     this._spatialErrorSubscription = currentPage.spatialError.subscribe(this._onSpatialErrorChange)
//     this._onSpatialChange(spatialModel())
//     this._onSpatialErrorChange(currentPage.spatialError())

//     map.on('draw:drawstart', this._onDrawStart)
//     map.on('draw:drawstop', this._onDrawStop)
//     map.on('draw:editstart', this._onEditStart)
//     map.on('draw:editstop', this._onEditEnd)
//     map.on('draw:created', this._onDrawCreated)
//     map.on('draw:edited', this._onDrawEdited)
//     map.on('draw:deleted', this._onDrawDeleted)

//     const {
//       spatialType
//     } = currentPage.ui
//     for (el of Array.from(this._getToolLinksForName('Rectangle'))) {
//       el.addEventListener('click', spatialType.selectRectangle)
//     }
//     for (el of Array.from(this._getToolLinksForName('Polygon'))) {
//       el.addEventListener('click', spatialType.selectPolygon)
//     }
//     for (el of Array.from(this._getToolLinksForName('Point'))) {
//       el.addEventListener('click', spatialType.selectPoint)
//     }
//     for (el of Array.from(this._getToolLinksForName('Cancel'))) {
//       el.addEventListener('click', spatialType.selectNone)
//     }

//     this._toolSubscription = spatialType.name.subscribe(this._onToolChange)
//     this._onToolChange(spatialType.name())

//     if (!this.isMinimap) {
//       this._shapefileLayer = new ShapefileLayer({
//         selection: this._colorOptions,
//         query: this.query
//       })
//       return map.addLayer(this._shapefileLayer)
//     }
//     return null
//   }

//   onRemove(map) {
//     let el
//     this.map = null

//     this._shapefileLayer.removeFrom(map)
//     this._drawnItems.removeFrom(map)
//     this._drawControl.removeFrom(map)
//     this._querySubscription.dispose()
//     this._toolSubscription.dispose()
//     this._spatialErrorSubscription.dispose()
//     map.off('draw:drawstart', this._onDrawStart)
//     map.off('draw:drawstop', this._onDrawStop)
//     map.off('draw:editstart', this._onEditStart)
//     map.off('draw:editstop', this._onEditEnd)
//     map.off('draw:created', this._onDrawCreated)
//     map.off('draw:edited', this._onDrawEdited)
//     map.off('draw:deleted', this._onDrawDeleted)

//     const {
//       spatialType
//     } = currentPage.ui
//     for (el of Array.from(this._getToolLinksForName('Rectangle'))) {
//       el.removeEventListener('click', spatialType.selectRectangle)
//     }
//     for (el of Array.from(this._getToolLinksForName('Polygon'))) {
//       el.removeEventListener('click', spatialType.selectPolygon)
//     }
//     for (el of Array.from(this._getToolLinksForName('Point'))) {
//       el.removeEventListener('click', spatialType.selectPoint)
//     }
//     return (() => {
//       const result = []
//       for (el of Array.from(this._getToolLinksForName('Cancel'))) {
//         result.push(el.removeEventListener('click', spatialType.selectNone))
//       }
//       return result
//     })()
//   }

//   _getToolLinksForName(name) {
//     const container = this.map != null ? this.map.getContainer() : undefined
//     if (container == null) {
//       return []
//     }
//     switch (name) {
//       case 'Rectangle':
//         return container.getElementsByClassName('leaflet-draw-draw-rectangle')
//       case 'Polygon':
//         return container.getElementsByClassName('leaflet-draw-draw-polygon')
//       case 'Point':
//         return container.getElementsByClassName('leaflet-draw-draw-marker')
//       default:
//         return container.querySelectorAll('.leaflet-draw-section a[title="Cancel drawing"]')
//     }
//   }

//   _onToolChange(name) {
//     // Avoid sending events for already-selected tools (infinite loop in firefox)
//     if (this._currentTool === name) {
//       return
//     }

//     this._currentTool = name

//     if (name === 'Shape File') {
//       this._shapefileLayer.activate()
//     } else if (this._shapefileLayer != null ? this._shapefileLayer.isActive() : undefined) {
//       if (name === 'Spatial') {
//         this._shapefileLayer.hideHelp()
//       } else {
//         this._shapefileLayer.deactivate()
//       }
//     }

//     const link = $(this._getToolLinksForName(name)).filter(':visible')[0]
//     const event = document.createEvent("MouseEvents")
//     event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
//     if (link != null) {
//       link.dispatchEvent(event)
//     }

//     if (name !== 'Spatial') {
//       this.map.fire('spatialtoolchange', {
//         name
//       })
//     }
//     return currentPage.ui.spatialType.name(name)
//   }

//   _onDrawStart(e) {
//     // Remove the old layer
//     this._oldLayer = this._layer
//     this._oldLayerIsShapefile = this._shapefileLayer.isActive()
//     return this._removeSpatial()
//   }

//   _onDrawStop(e) {
//     currentPage.ui.spatialType.selectNone()
//     // The user cancelled without committing.  Restore the old layer
//     if (this._oldLayerIsShapefile) {
//       this._shapefileLayer.activate(false)
//     }
//     if (this._oldLayer != null) {
//       this._layer = this._oldLayer
//       this._oldLayer = null
//       return this._drawnItems.addLayer(this._layer)
//     }
//   }

//   _onEditStart(e) {
//     this._preEditBounds = this._boundsToPoints(this._layer)

//     return __guardMethod__(this._layer != null ? this._layer._path : undefined, 'setAttribute', o => o.setAttribute('pointer-events', 'all'))
//   }

//   _onEditEnd(e) {
//     return __guardMethod__(this._layer != null ? this._layer._path : undefined, 'setAttribute', o => o.setAttribute('pointer-events', 'stroke'))
//   }

//   _onDrawCreated(e) {
//     return this._addLayer(e.target, e.layer, e.layerType)
//   }

//   _onDrawEdited(e) {
//     const {
//       map
//     } = this
//     const postEditBounds = this._boundsToPoints(this._layer)
//     map.fire('spatialedit', {
//       preBounds: this._preEditBounds,
//       postBounds: postEditBounds,
//       spatial: this._layer.type
//     })

//     currentPage.ui.spatialType.selectNone()
//     return this._addLayer(e.target)
//   }

//   _boundsToPoints(layer) {
//     let bounds, points
//     if (layer.type === 'marker') {
//       bounds = [layer.getLatLng()]
//     } else {
//       bounds = layer.getLatLngs()
//     }
//     return points = (Array.from(bounds).map((latLng) => this.map.latLngToLayerPoint(latLng)))
//   }

//   _addLayer(map, layer, type) {
//     if (layer == null) {
//       layer = this._layer
//     }
//     if (type == null) {
//       ({
//         type
//       } = this._layer)
//     }
//     this._oldLayer = null
//     this._oldLayerIsShapefile = false
//     this._layer = layer
//     this._layer.type = type

//     this._drawnItems.addLayer(layer)
//     return this._saveSpatialParams(layer, type)
//   }

//   _onDrawDeleted(e) {
//     currentPage.ui.spatialType.selectNone()
//     this._removeSpatial()
//     return currentPage.query.spatial("")
//   }

//   _onSpatialChange(newValue) {
//     if ((newValue == null) || (newValue.length === 0)) {
//       if (this.isMinimap) {
//         this.map.fitBounds([{
//           lat: -180,
//           lng: -90
//         }, {
//           lat: 180,
//           lng: 90
//         }])
//       }
//       return this._removeSpatial()
//     } else {
//       return this._loadSpatialParams(newValue)
//     }
//   }

//   _onSpatialErrorChange(newValue) {
//     if (newValue != null) {
//       if (this._layer != null) {
//         toastr.options = {
//           'timeOut': 10000
//         }
//         toastr.error(newValue, "Spatial Query Error")
//         return (typeof this._layer.setStyle === 'function' ? this._layer.setStyle(this._errorOptions) : undefined)
//       }
//     } else {
//       if (this._layer != null) {
//         return (typeof this._layer.setStyle === 'function' ? this._layer.setStyle(this._colorOptions) : undefined)
//       }
//     }
//   }


//   _renderSpatial(type, shape) {}

//   _removeSpatial() {
//     this._spatial = null
//     if (this._layer) {
//       if (this._layer) {
//         this._drawnItems.removeLayer(this._layer)
//       }
//       return this._layer = null
//     }
//   }

//   _renderMarker(shape) {
//     const marker = (this._layer = new L.Marker(shape[0], {
//       icon: L.Draw.Marker.prototype.options.icon
//     }))
//     marker.type = 'marker'
//     this._drawnItems.addLayer(marker)

//     if (!this.isMinimap) {
//       // pan to empty area
//       const masterOverlay = __guard__(document.getElementsByClassName('master-overlay-main'), x => x[0])
//       const facetOverlay = document.getElementById('master-overlay-parent')
//       const offsetWidth = 0 - ((util.isElementInViewPort(facetOverlay) ? facetOverlay.offsetWidth : 0) / 2)
//       const offsetHeight = (masterOverlay != null ? masterOverlay.offsetHeight : undefined) / 4
//       return this.map.panTo(marker.getLatLng()).panBy([offsetWidth, offsetHeight])
//     }
//   }

//   _renderRectangle(shape) {
//     // southwest longitude should not be greater than northeast
//     if (shape[0].lng > shape[1].lng) {
//       shape[1].lng += 360
//     }

//     const bounds = new L.LatLngBounds(...Array.from(shape || []))
//     const options = L.extend({}, L.Draw.Rectangle.prototype.options.shapeOptions, this._colorOptions)
//     const rect = (this._layer = new L.Rectangle(bounds, options))
//     rect.type = 'rectangle'
//     this._drawnItems.addLayer(rect)

//     if (!this.isMinimap) {
//       // pan to empty area
//       const masterOverlay = __guard__(document.getElementsByClassName('master-overlay-main'), x => x[0])
//       const facetOverlay = document.getElementById('master-overlay-parent')
//       const offsetWidth = 0 - ((util.isElementInViewPort(facetOverlay) ? facetOverlay.offsetWidth : 0) / 2)
//       const offsetHeight = (masterOverlay != null ? masterOverlay.offsetHeight : undefined) / 4
//       return this.map.panTo(L.latLngBounds(rect.getLatLngs()).getCenter()).panBy([offsetWidth, offsetHeight])
//     }
//   }

//   _renderPolygon(shape) {
//     const options = L.extend({}, L.Draw.Polygon.prototype.options.shapeOptions, this._colorOptions)
//     const poly = (this._layer = new L.sphericalPolygon(shape, options))
//     poly.type = 'polygon'
//     return this._drawnItems.addLayer(poly)
//   }

//   _renderPolarRectangle(shape, proj, type) {
//     const options = L.extend({}, L.Draw.Polygon.prototype.options.shapeOptions, this._colorOptions)
//     const poly = (this._layer = new L.polarRectangle(shape, options, proj))
//     poly.type = type
//     return this._drawnItems.addLayer(poly)
//   }

//   _saveSpatialParams(layer, type) {
//     if (type === 'marker') {
//       type = 'point'
//     }
//     if (type === 'rectangle') {
//       type = 'bounding_box'
//     }

//     const shape = (() => {
//       switch (type) {
//         case 'point':
//           return [layer.getLatLng()]
//         case 'bounding_box':
//           return [layer.getLatLngs()[0][0], layer.getLatLngs()[0][2]]
//         case 'polygon':
//           return layer.getLatLngs()
//         case 'arctic-rectangle':
//           return layer.getLatLngs()
//         case 'antarctic-rectangle':
//           return layer.getLatLngs()
//         default:
//           return console.error(`Unrecognized shape: ${type}`)
//       }
//     })()

//     const shapePoints = (Array.from(shape).map((p) => `${p.lng},${p.lat}`))
//     const shapeStr = shapePoints.join(':')

//     const serialized = `${type}:${shapeStr}`

//     this._spatial = serialized
//     return currentPage.query.spatial(serialized)
//   }

//   _loadSpatialParams(spatial) {
//     if (spatial === this._spatial) {
//       return
//     }
//     this._removeSpatial()
//     this._spatial = spatial
//     const [type, ...shapePoints] = Array.from(spatial.split(':'))
//     const shape = Array.from(shapePoints).map((pointStr) =>
//       L.latLng(pointStr.split(',').reverse()))

//     this._oldLayer = null
//     if (this.isMinimap) {
//       this.map.fitBounds(shape)
//     }

//     switch (type) {
//       case 'point':
//         return this._renderMarker(shape)
//       case 'bounding_box':
//         return this._renderRectangle(shape)
//       case 'polygon':
//         return this._renderPolygon(shape)
//       case 'arctic-rectangle':
//         return this._renderPolarRectangle(shape, Proj.epsg3413.projection, type)
//       case 'antarctic-rectangle':
//         return this._renderPolarRectangle(shape, Proj.epsg3031.projection, type)
//       default:
//         return console.error(`Cannot render spatial type ${type}`)
//     }
//   }
// }

// class SpatialSelection extends MapControl {
//   createLeafletElement() {
//     return new SpatialSelectionControl()
//   }
// }

// export default withLeaflet(SpatialSelection)

// import React from 'react'
// import { FeatureGroup, Circle } from 'react-leaflet'
// import { EditControl } from 'react-leaflet-draw'

const urlPropsQueryConfig = {
  pointSearch: { type: UrlQueryParamTypes.string, queryParam: 'sp' },
  boundingBoxSearch: { type: UrlQueryParamTypes.string, queryParam: 'sb' },
  polygonSearch: { type: UrlQueryParamTypes.string, queryParam: 'polygon' }
}

const mapDispathToProps = dispatch => ({
  onChangePointSearch: point => dispatch(actions.changePointSearch(point)),
  onChangeQuery: query => dispatch(actions.changeQuery(query))
})

class SpatialSelection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pointSearch: props.pointSearch ? props.pointSearch : '',
      boundingBoxSearch: props.boundingBoxSearch ? props.boundingBoxSearch : '',
      polygonSearch: props.polygonSearch ? props.polygonSearch : ''
    }

    console.log('state', this.state)

    this.onCreate = this.onCreate.bind(this)
  }

  componentDidMount() {
    const { onChangeQuery } = this.props
    const {
      pointSearch,
      boundingBoxSearch,
      polygonSearch
    } = this.state

    if (pointSearch !== '') {
      // renderPoint(pointSearch)
      onChangeQuery({ spatial: { point: pointSearch } })
    } else if (boundingBoxSearch !== '') {
      onChangeQuery({ spatial: { boundingBox: boundingBoxSearch } })
    } else if (polygonSearch !== '') {
      onChangeQuery({ spatial: { polygon: polygonSearch } })
    }
  }

  onDrawStart(e) {
    console.log('onDrawStart', e)
    // Remove the old layer
    if (this.oldLayer !== undefined) {
      this.oldLayer.remove()
    }
    this.oldLayer = null
    // this._oldLayerIsShapefile = this._shapefileLayer.isActive()
    // return this._removeSpatial()
    Array.from(this.drawnItems).forEach(layer => layer.remove())
  }

  onDrawStop(e) {
    console.log('onDrawStop', e)
  }

  onCreate(e) {
    console.log('onCreate', e)
    const { layer, layerType } = e
    e.sourceTarget.oldLayer = layer
    this.drawnItems = [layer]

    // Update url/query with e.layer information
    let type
    let latLngs
    if (layerType === 'marker') {
      type = 'point'
    } else if (layerType === 'rectangle') {
      type = 'bounding_box'
    } else {
      type = layerType
    }

    const {
      onChangePointSearch,
      onChangeBoundingBoxSearch,
      onChangePolygonSearch,
      onChangeQuery
    } = this.props

    onChangePointSearch(null)
    onChangeBoundingBoxSearch(null)
    onChangePolygonSearch(null)

    switch (type) {
      case 'point':
        latLngs = [layer.getLatLng()].map(p => `${p.lng},${p.lat}`)
        onChangePointSearch(latLngs)
        onChangeQuery({ spatial: { point: latLngs.join() } })
        break
      case 'bounding_box':
        latLngs = [layer.getLatLngs()[0][0], layer.getLatLngs()[0][2]].map(p => `${p.lng},${p.lat}`)
        onChangeBoundingBoxSearch(latLngs)
        onChangeQuery({ spatial: { boundingBox: latLngs.join() } })
        break
      case 'polygon':
        latLngs = (Array.from(layer.getLatLngs()[0]).map(p => `${p.lng},${p.lat}`))
        // Close the polygon by duplicating the first point as the last point
        latLngs.push(latLngs[0])
        onChangePolygonSearch(latLngs)
        onChangeQuery({ spatial: { polygon: latLngs.join() } })
        break
      // case 'arctic-rectangle':
      //   latLngs = layer.getLatLngs()
      //   break
      // case 'antarctic-rectangle':
      //   latLngs = layer.getLatLngs()
      //   break
      default:
        console.error(`Unrecognized shape: ${type}`)
    }
  }

  // renderPoint(point) {
  //   const shape = point.split(',')
  //   const marker = new L.Marker(shape[0], {
  //     icon: L.Draw.Marker.prototype.options.icon
  //   })
  //   this._layer = marker
  //   marker.type = 'marker'
  //   this._drawnItems.addLayer(marker)

  //   // if (!this.isMinimap) {
  //   //   // pan to empty area
  //   //   const masterOverlay = __guard__(document.getElementsByClassName('master-overlay-main'), x => x[0])
  //   //   const facetOverlay = document.getElementById('master-overlay-parent')
  //   //   const offsetWidth = 0 - ((util.isElementInViewPort(facetOverlay) ? facetOverlay.offsetWidth : 0) / 2)
  //   //   const offsetHeight = (masterOverlay != null ? masterOverlay.offsetHeight : undefined) / 4
  //   //   return this.map.panTo(marker.getLatLng()).panBy([offsetWidth, offsetHeight])
  //   // }
  // }

  render() {
    return (
      <FeatureGroup>
        <EditControl
          position="bottomright"
          onDrawStart={this.onDrawStart}
          onDrawStop={this.onDrawStop}
          // onEdited={_onEditPath}
          onCreated={this.onCreate}
          // onDeleted={_onDeleted}
          draw={{
            polyline: false,
            circlemarker: false,
            circle: false
          }}
        />
      </FeatureGroup>
    )
  }
}

SpatialSelection.defaultProps = {
  pointSearch: '',
  boundingBoxSearch: '',
  polygonSearch: ''
}

SpatialSelection.propTypes = {
  pointSearch: PropTypes.string,
  boundingBoxSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  onChangePointSearch: PropTypes.func.isRequired,
  onChangeBoundingBoxSearch: PropTypes.func.isRequired,
  onChangePolygonSearch: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired
}

export default addUrlProps({ urlPropsQueryConfig })(
  connect(null, mapDispathToProps)(SpatialSelection)
)
