/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'

import 'leaflet-draw/dist/leaflet.draw.css'
import icon from 'leaflet-draw/dist/images/marker-icon.png'
import iconShadow from 'leaflet-draw/dist/images/marker-shadow.png'
import actions from '../../actions'

import { makeCounterClockwise } from '../../util/geo'

// Fix the leaflet Marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: icon,
  iconUrl: icon,
  shadowUrl: iconShadow
})

// Add some custom text to leaflet draw things
L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'Release to finish drawing'
L.drawLocal.draw.toolbar.buttons.polygon = 'Search by spatial polygon'
L.drawLocal.draw.toolbar.buttons.rectangle = 'Search by spatial rectangle'
L.drawLocal.draw.toolbar.buttons.marker = 'Search by spatial coordinate'

// Append coordinate information to tooltips
const originalUpdateContent = L.Draw.Tooltip.prototype.updateContent
L.Draw.Tooltip.prototype.updateContent = function updateContent(content) {
  let newContent = content
  this._content = content
  if (this._point) {
    newContent = {
      text: `${content.text}<br>${this._point}`,
      subtext: content.subtext
    }
  }
  return originalUpdateContent.call(this, newContent)
}
const originalUpdatePosition = L.Draw.Tooltip.prototype.updatePosition
L.Draw.Tooltip.prototype.updatePosition = function updatePosition(latlng) {
  this._point = `(${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)})`
  if (this._content != null) {
    this.updateContent(this._content)
  }

  return originalUpdatePosition.call(this, latlng)
}

const mapDispathToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onChangeMap: query => dispatch(actions.changeMap(query))
})

const mapStateToProps = state => ({
  pointSearch: state.query.spatial.point,
  boundingBoxSearch: state.query.spatial.boundingBox,
  polygonSearch: state.query.spatial.polygon
})

export class SpatialSelectionContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      drawnPoints: null,
      drawnLayer: null
    }

    this.onCreate = this.onCreate.bind(this)
    this.onDrawStart = this.onDrawStart.bind(this)
    this.onDrawStop = this.onDrawStop.bind(this)
  }

  componentDidMount() {
    this.renderShape(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { mapRef } = this.props
    const { drawnPoints, drawnLayer } = this.state

    const map = mapRef.leafletElement
    if (!map) {
      return
    }

    const newDrawing = nextProps.pointSearch
      || nextProps.boundingBoxSearch
      || nextProps.polygonSearch

    if (newDrawing !== drawnPoints) {
      // If the new drawing is different than the current drawing,
      // remove the current drawing
      if (drawnLayer) {
        drawnLayer.remove()
      }

      // Draw the new shape
      this.renderShape(nextProps)
    }
  }

  // Callback from EditControl, called when clicking the draw shape button
  onDrawStart(e) {
    const { drawnLayer } = this.state

    if (drawnLayer) {
      drawnLayer.remove()
      this.setState({ drawnLayer: null })
    }

    const { layerType } = e
    const { onChangeMap } = this.props
    onChangeMap({ drawingNewLayer: layerType })
  }

  // Callback from EditControl, called when the drawing is stopped from
  // cancelling or completing
  onDrawStop() {
    const { onChangeMap } = this.props
    onChangeMap({ drawingNewLayer: '' })
  }

  // Callback from EditControl, contains the layer that was just drawn
  onCreate(e) {
    const { layer, layerType } = e
    this.setState({ drawnLayer: layer })

    // Update url/query with e.layer information
    let type
    let latLngs
    if (layerType === 'marker') {
      type = 'point'
    } else if (layerType === 'rectangle') {
      type = 'boundingBox'
    } else {
      type = layerType
    }

    const { onChangeQuery } = this.props

    let originalLatLngs
    switch (type) {
      case 'point':
        latLngs = [layer.getLatLng()].map(p => `${p.lng},${p.lat}`)
        break
      case 'boundingBox':
        latLngs = [layer.getLatLngs()[0][0], layer.getLatLngs()[0][2]].map(p => `${p.lng},${p.lat}`)
        break
      case 'polygon':
        originalLatLngs = Array.from(layer.getLatLngs()[0])
        latLngs = makeCounterClockwise(originalLatLngs).map(p => `${p.lng},${p.lat}`)
        // Close the polygon by duplicating the first point as the last point
        latLngs.push(latLngs[0])
        break
      // case 'arctic-rectangle':
      //   latLngs = layer.getLatLngs()
      //   break
      // case 'antarctic-rectangle':
      //   latLngs = layer.getLatLngs()
      //   break
      default:
        return
    }

    this.setState({ drawnPoints: latLngs.join() })
    onChangeQuery({ spatial: { [type]: latLngs.join() } })
  }

  // Takes an array of lat/lon pairs and returns array of objects with lat/lon keys
  // input: ['10,0','20,10']
  // output: [{ lat: 0, lng: 10 }, { lat: 10, lng: 20 }]
  getShape(points) {
    return points.map(pointStr => L.latLng(pointStr.split(',').reverse()))
  }

  // Splits a string of points on every other comma
  // input: '10,0,20,10'
  // output: ['10,0','20,10']
  splitListOfPoints(points) {
    // split on every other `,`
    return points.match(/[^,]+,[^,]+/g)
  }

  // Draws a leaflet shape based on provided props
  renderShape(props) {
    const { mapRef } = props
    const map = mapRef.leafletElement

    const {
      pointSearch,
      boundingBoxSearch,
      polygonSearch
    } = props

    if (pointSearch) {
      this.renderPoint(this.getShape([pointSearch]), map)
    } else if (boundingBoxSearch) {
      const points = this.splitListOfPoints(boundingBoxSearch)
      this.renderBoundingBox(this.getShape(points), map)
    } else if (polygonSearch) {
      const points = this.splitListOfPoints(polygonSearch)
      this.renderPolygon(this.getShape(points), map)
    }
  }

  // Draws a leaflet Marker
  renderPoint(point, map) {
    if (map) {
      const marker = new L.Marker(point[0], {
        icon: L.Draw.Marker.prototype.options.icon
      })
      marker.addTo(map)
      map.panTo(marker.getLatLng())
      this.setState({ drawnLayer: marker })
    }
  }

  // Draws a leaflet Rectangle
  renderBoundingBox(rectangle, map) {
    if (map) {
      const shape = rectangle
      // southwest longitude should not be greater than northeast
      if (shape[0].lng > shape[1].lng) {
        shape[1].lng += 360
      }

      const bounds = new L.LatLngBounds(...Array.from(shape || []))
      const options = L.extend({}, L.Draw.Rectangle.prototype.options.shapeOptions, this._colorOptions)
      const rect = new L.Rectangle(bounds, options)

      rect.addTo(map)
      map.panTo(L.latLngBounds(rect.getLatLngs()).getCenter())
      this.setState({ drawnLayer: rect })
    }
  }

  // Draws a leaflet Polygon
  renderPolygon(polygon, map) {
    if (map) {
      const options = L.extend({}, L.Draw.Polygon.prototype.options.shapeOptions, this._colorOptions)
      // const poly = new L.sphericalPolygon(polygon, options)
      const poly = new L.Polyline(polygon, options)

      poly.addTo(map)
      map.panTo(L.latLngBounds(poly.getLatLngs()).getCenter())
      this.setState({ drawnLayer: poly })
    }
  }

  render() {
    return (
      <FeatureGroup>
        <EditControl
          position="bottomright"
          onDrawStart={this.onDrawStart}
          onDrawStop={this.onDrawStop}
          onCreated={this.onCreate}
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

SpatialSelectionContainer.defaultProps = {
  pointSearch: '',
  boundingBoxSearch: '',
  polygonSearch: '',
  mapRef: {}
}

SpatialSelectionContainer.propTypes = {
  pointSearch: PropTypes.string,
  boundingBoxSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  mapRef: PropTypes.shape({}),
  onChangeQuery: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispathToProps)(SpatialSelectionContainer)
