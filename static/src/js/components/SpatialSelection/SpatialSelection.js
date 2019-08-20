/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'

import 'leaflet-draw/dist/leaflet.draw.css'
import icon from 'leaflet-draw/dist/images/marker-icon.png'
import iconShadow from 'leaflet-draw/dist/images/marker-shadow.png'

import { eventEmitter } from '../../events/events'
import { makeCounterClockwise, getShape, splitListOfPoints } from '../../util/map/geo'

const normalColor = '#00ffff'
const errorColor = '#990000'
export const colorOptions = {
  color: normalColor,
  dashArray: null,
  pointerEvents: 'stroke',
  fillOpacity: 0
}
export const errorOptions = {
  color: errorColor,
  dashArray: null
}

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

class SpatialSelection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      drawnLayer: null,
      drawnPoints: null
    }

    this.onCreate = this.onCreate.bind(this)
    this.onDrawStart = this.onDrawStart.bind(this)
    this.onDrawStop = this.onDrawStop.bind(this)
  }

  componentDidMount() {
    const { mapRef } = this.props
    const map = mapRef.leafletElement
    if (!map) {
      return
    }

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

    if ((drawnLayer && drawnLayer._map === null) || newDrawing !== drawnPoints) {
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
    const { onToggleDrawingNewLayer } = this.props
    onToggleDrawingNewLayer(layerType)
  }

  // Callback from EditControl, called when the drawing is stopped from
  // cancelling or completing
  onDrawStop() {
    const { onToggleDrawingNewLayer } = this.props
    onToggleDrawingNewLayer(false)
  }

  // Callback from EditControl, called when the controls are mounted
  onMounted(drawControl) {
    eventEmitter.on('map.drawStart', (e) => {
      const { type } = e
      drawControl._toolbars.draw._modes[type].handler.enable()
    })
  }

  // Callback from EditControl, contains the layer that was just drawn
  onCreate(e) {
    const { layer, layerType } = e
    e.layer.remove()

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
        originalLatLngs = Array.from(layer.getLatLngs())
        latLngs = makeCounterClockwise(originalLatLngs).map(p => `${p.lng},${p.lat}`)
        // Close the polygon by duplicating the first point as the last point
        latLngs.push(latLngs[0])
        break
      default:
        return
    }

    this.setState({
      drawnLayer: layer,
      drawnPoints: latLngs.join()
    })
    onChangeQuery({
      collection: {
        spatial: {
          [type]: latLngs.join()
        }
      }
    })
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
      this.setState({ drawnPoints: pointSearch })
      this.renderPoint(getShape([pointSearch]), map)
    } else if (boundingBoxSearch) {
      this.setState({ drawnPoints: boundingBoxSearch })
      const points = splitListOfPoints(boundingBoxSearch)
      this.renderBoundingBox(getShape(points), map)
    } else if (polygonSearch) {
      this.setState({ drawnPoints: polygonSearch })
      const points = splitListOfPoints(polygonSearch)
      this.renderPolygon(getShape(points), map)
    }
  }

  // Draws a leaflet Marker
  renderPoint(point, map) {
    if (map) {
      const marker = new L.Marker(point[0], {
        icon: L.Draw.Marker.prototype.options.icon
      })

      marker.addTo(map)
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
      const options = L.extend(
        {},
        L.Draw.Rectangle.prototype.options.shapeOptions,
        colorOptions
      )
      const rect = new L.Rectangle(bounds, options)

      rect.addTo(map)
      this.setState({ drawnLayer: rect })
    }
  }

  // Draws a leaflet Polygon
  renderPolygon(polygon, map) {
    if (map) {
      const options = L.extend(
        {},
        L.Draw.Polygon.prototype.options.shapeOptions,
        colorOptions
      )
      const poly = new L.SphericalPolygon(polygon, options)

      poly.addTo(map)
      this.setState({ drawnLayer: poly })
    }
  }

  render() {
    const { isProjectPage } = this.props

    const controls = (
      <FeatureGroup>
        <EditControl
          position="bottomright"
          onDrawStart={this.onDrawStart}
          onDrawStop={this.onDrawStop}
          onCreated={this.onCreate}
          onMounted={this.onMounted}
          draw={{
            polygon: {
              drawError: errorOptions,
              shapeOptions: colorOptions
            },
            rectangle: {
              drawError: errorOptions,
              shapeOptions: colorOptions
            },
            polyline: false,
            circlemarker: false,
            circle: false
          }}
          edit={{
            selectedPathOptions: {
              opacity: 0.6,
              dashArray: '10, 10'
            }
          }}
        />
      </FeatureGroup>
    )
    return (
      <>
        { !isProjectPage && controls }
      </>
    )
  }
}

SpatialSelection.defaultProps = {
  boundingBoxSearch: '',
  mapRef: {},
  pointSearch: '',
  polygonSearch: ''
}

SpatialSelection.propTypes = {
  boundingBoxSearch: PropTypes.string,
  isProjectPage: PropTypes.bool.isRequired,
  mapRef: PropTypes.shape({}),
  onChangeQuery: PropTypes.func.isRequired,
  pointSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  onToggleDrawingNewLayer: PropTypes.func.isRequired
}

export default SpatialSelection
