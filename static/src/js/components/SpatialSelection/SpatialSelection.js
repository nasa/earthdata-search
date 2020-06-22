/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'

import { FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'

import 'leaflet-draw/dist/leaflet.draw.css'
import icon from 'leaflet-draw/dist/images/marker-icon.png'
import iconShadow from 'leaflet-draw/dist/images/marker-shadow.png'

import { eventEmitter } from '../../events/events'
import { makeCounterClockwise, getShape, splitListOfPoints } from '../../util/map/geo'
import { panFeatureGroupToCenter } from '../../util/map/actions/panFeatureGroupToCenter'
import { mbr } from '../../util/map/mbr'
import { limitLatLngDecimalPoints } from '../../util/limitDecimalPoints'

const normalColor = '#00ffff'
const errorColor = '#990000'
export const colorOptions = {
  color: normalColor,
  dashArray: null,
  pointerEvents: 'stroke',
  fillOpacity: 0,
  weight: 3
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
      drawnLayerType: null,
      drawnMbr: null,
      drawnPoints: null
    }

    this.onCreated = this.onCreated.bind(this)
    this.onDeleted = this.onDeleted.bind(this)
    this.onDrawStart = this.onDrawStart.bind(this)
    this.onDrawStop = this.onDrawStop.bind(this)
    this.onEdited = this.onEdited.bind(this)
    this.onEditStart = this.onEditStart.bind(this)
    this.onEditStop = this.onEditStop.bind(this)
    this.onMounted = this.onMounted.bind(this)
    this.onSpatialDropdownClick = this.onSpatialDropdownClick.bind(this)
    this.onDrawCancel = this.onDrawCancel.bind(this)
    this.updateStateAndQuery = this.updateStateAndQuery.bind(this)

    this.drawControl = null
  }

  componentDidMount() {
    const { mapRef } = this.props
    const map = mapRef.leafletElement
    if (!map) {
      return
    }

    this.renderShape(this.props)

    const { featureGroupRef = {} } = this
    const { leafletElement: featureGroup = null } = featureGroupRef

    if (featureGroup && featureGroup.getBounds) {
      const bounds = featureGroup.getBounds() || false
      panFeatureGroupToCenter(map, bounds)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      pointSearch,
      boundingBoxSearch,
      polygonSearch,
      lineSearch,
      circleSearch,
      mapRef
    } = this.props
    const {
      drawnLayer,
      drawnMbr,
      drawnPoints
    } = this.state

    const map = mapRef.leafletElement
    if (!map) {
      return
    }

    const newDrawing = nextProps.pointSearch
      || nextProps.boundingBoxSearch
      || nextProps.polygonSearch
      || nextProps.lineSearch
      || nextProps.circleSearch
    const oldDrawing = pointSearch
    || boundingBoxSearch
    || polygonSearch
    || lineSearch
    || circleSearch

    const { featureGroupRef = {} } = this
    const { leafletElement = {} } = featureGroupRef

    if (oldDrawing !== newDrawing && newDrawing !== drawnPoints) {
      if (drawnLayer) {
        if (leafletElement.removeLayer) {
          leafletElement.removeLayer(drawnLayer)
          leafletElement.removeLayer(drawnMbr)
          this.setState({
            drawnMbr: null
          })
        }
      }

      // Draw the new shape
      this.renderShape(nextProps)
    }

    // If a polygon is drawn for a CWIC collection, render the MBR to show the user what is being sent
    // to CWIC as their spatial
    if (!nextProps.isProjectPage) {
      if (
        (nextProps.polygonSearch !== '')
        && drawnMbr === null
        && nextProps.isCwic
      ) {
        this.renderMbr(nextProps.polygonSearch)
      } else if (drawnMbr !== null && !nextProps.isCwic) {
        if (leafletElement.removeLayer) {
          leafletElement.removeLayer(drawnMbr)
          this.setState({
            drawnMbr: null
          })
        }
      }
    } else if (drawnMbr !== null) {
      if (leafletElement.removeLayer) {
        leafletElement.removeLayer(drawnMbr)
        this.setState({
          drawnMbr: null
        })
      }
    }
  }

  componentWillUnmount() {
    eventEmitter.off('map.drawStart', this.onSpatialDropdownClick)
    eventEmitter.off('map.drawCancel', this.onDrawCancel)
  }

  // Callback from EditControl, called when clicking the draw shape button
  onDrawStart(e) {
    const { drawnLayer, drawnMbr } = this.state

    if (drawnLayer) {
      const { featureGroupRef } = this
      const { leafletElement } = featureGroupRef
      leafletElement.removeLayer(drawnLayer)
      leafletElement.removeLayer(drawnMbr)

      this.setState({
        drawnLayer: null,
        drawnLayerType: null,
        drawnMbr: null
      })
    }

    let { layerType } = e
    const { onToggleDrawingNewLayer, onMetricsMap } = this.props

    if (layerType === 'shapefile') layerType = 'Shape File'

    onMetricsMap(`Spatial: ${startCase(layerType)}`)
    onToggleDrawingNewLayer(layerType)
  }

  // Callback from EditControl, called when the drawing is stopped from
  // cancelling or completing
  onDrawStop() {
    const { onToggleDrawingNewLayer } = this.props
    onToggleDrawingNewLayer(false)
  }

  // Triggered from eventEmitter.emit('map.drawCancel')
  // Cancels Leaflet Draw
  onDrawCancel() {
    if (this.drawControl) {
      this.drawControl._toolbars.draw._modes.marker.handler.disable()
      this.drawControl._toolbars.draw._modes.rectangle.handler.disable()
      this.drawControl._toolbars.draw._modes.circle.handler.disable()
    }
  }

  // Callback from EditControl, called when the controls are mounted
  onMounted(drawControl) {
    this.drawControl = drawControl

    eventEmitter.on('map.drawStart', this.onSpatialDropdownClick)
    eventEmitter.on('map.drawCancel', this.onDrawCancel)
  }

  onSpatialDropdownClick(event) {
    const { type } = event
    if (this.drawControl) {
      this.drawControl._toolbars.draw._modes[type].handler.enable()
    }
  }

  onEditStart() {
    this.preEditBounds = this.boundsToPoints(this.layer)
  }

  onEditStop() {
    const { type: layerType } = this.layer
    const { onMetricsSpatialEdit } = this.props
    const postEditBounds = this.boundsToPoints(this.layer)

    let distanceSum = 0

    this.preEditBounds.forEach((p0, i) => {
      const p1 = postEditBounds[i]
      distanceSum += p0.distanceTo(p1)
    })

    onMetricsSpatialEdit({
      type: layerType,
      distanceSum
    })
  }

  // Callback from EditControl, called when the layer is edited
  onEdited() {
    const { drawnLayer, drawnLayerType } = this.state
    this.updateStateAndQuery(drawnLayer, drawnLayerType)
  }

  // Callback from EditControl, contains the layer that was just drawn
  onCreated(e) {
    const { layer, layerType } = e

    let type
    if (layerType === 'marker') {
      type = 'point'
    } else if (layerType === 'rectangle') {
      type = 'boundingBox'
    } else if (layerType === 'polyline') {
      type = 'line'
    } else {
      type = layerType
    }

    this.updateStateAndQuery(layer, type)
  }

  // Callback from EditControl, called when the layer is deleted
  onDeleted() {
    const { onChangeQuery } = this.props
    onChangeQuery({
      collection: {
        spatial: {}
      }
    })

    this.setState({
      drawnLayer: null,
      drawnLayerType: null,
      drawnPoints: null
    })
  }

  setLayer(layer) {
    this.layer = layer

    const { mapRef } = this.props
    const map = mapRef.leafletElement

    const { featureGroupRef = {} } = this
    const { leafletElement: featureGroup = null } = featureGroupRef

    if (featureGroup) {
      panFeatureGroupToCenter(map, featureGroup)
    }
  }

  // Determine the latLngs from the layer and type, then update the component state and the query
  updateStateAndQuery(layer, type) {
    const { onChangeQuery } = this.props

    let originalLatLngs
    let latLngs
    switch (type) {
      case 'point':
        latLngs = limitLatLngDecimalPoints([layer.getLatLng()].map(p => `${p.lng},${p.lat}`))
        break
      case 'boundingBox':
        latLngs = limitLatLngDecimalPoints([layer.getLatLngs()[0][0], layer.getLatLngs()[0][2]].map(p => `${p.lng},${p.lat}`))
        break
      case 'polygon':
        originalLatLngs = Array.from(layer.getLatLngs())
        latLngs = limitLatLngDecimalPoints(makeCounterClockwise(originalLatLngs).map(p => `${p.lng},${p.lat}`))
        break
      case 'line':
        latLngs = limitLatLngDecimalPoints(Array.from(layer.getLatLngs()).map(p => `${p.lng},${p.lat}`))
        break
      case 'circle': {
        const center = layer.getLatLng()
        const radius = layer.getRadius()
        latLngs = limitLatLngDecimalPoints([center].map(p => `${p.lng},${p.lat}`))
        latLngs.push(radius.toFixed(0))
        break
      }
      default:
        return
    }

    let latLngsAntiMeridian = []
    if (type === 'circle') {
      latLngsAntiMeridian = latLngs
    } else {
      // If the shape crosses the anti-meridian, adjust the points to fit in the globe
      latLngs.forEach((coord) => {
        let [lon, lat] = Array.from(coord.split(','))
        lon = parseFloat(lon)
        while (lon < -180) { lon += 360 }
        while (lon > 180) { lon -= 360 }
        lat = parseFloat(lat)
        lat = Math.min(90, lat)
        lat = Math.max(-90, lat)
        latLngsAntiMeridian.push(`${lon},${lat}`)
      })

      if (type === 'polygon') {
        // Close the polygon by duplicating the first point as the last point
        latLngsAntiMeridian.push(latLngsAntiMeridian[0])
      }
    }

    this.setState({
      drawnLayer: layer,
      drawnLayerType: type,
      drawnPoints: latLngsAntiMeridian.join()
    })
    onChangeQuery({
      collection: {
        spatial: {
          [type]: latLngsAntiMeridian.join()
        }
      }
    })
  }

  boundsToPoints(layer) {
    const { mapRef } = this.props
    const map = mapRef.leafletElement
    let bounds = []

    if (layer.type === 'marker') {
      bounds = [layer.getLatLng()]
    } else {
      bounds = layer.getLatLngs()
    }

    return bounds.map(latLng => map.latLngToLayerPoint(latLng))
  }

  // Draws a leaflet shape based on provided props
  renderShape(props) {
    const { featureGroupRef = {} } = this
    if (featureGroupRef === null) return
    const { leafletElement: featureGroup = null } = featureGroupRef

    const {
      advancedSearch = {},
      pointSearch,
      boundingBoxSearch,
      lineSearch,
      polygonSearch,
      circleSearch
    } = props

    const {
      regionSearch = {}
    } = advancedSearch

    const {
      selectedRegion = {}
    } = regionSearch

    if (selectedRegion && selectedRegion.spatial) {
      this.setState({ drawnPoints: selectedRegion.spatial })
      const points = splitListOfPoints(selectedRegion.spatial)
      this.renderPolygon(getShape(points), featureGroup)
    } else if (pointSearch) {
      this.setState({ drawnPoints: pointSearch })
      this.renderPoint(getShape([pointSearch]), featureGroup)
    } else if (boundingBoxSearch) {
      this.setState({ drawnPoints: boundingBoxSearch })
      const points = splitListOfPoints(boundingBoxSearch)
      this.renderBoundingBox(getShape(points), featureGroup)
    } else if (polygonSearch) {
      this.setState({ drawnPoints: polygonSearch })
      const points = splitListOfPoints(polygonSearch)
      this.renderPolygon(getShape(points), featureGroup)
    } else if (lineSearch) {
      this.setState({ drawnPoints: lineSearch })
      const points = splitListOfPoints(lineSearch)
      this.renderLine(points, featureGroup)
    } else if (circleSearch) {
      this.setState({ drawnPoints: circleSearch })
      const points = circleSearch.split(',')
      this.renderCircle(points, featureGroup)
    }
  }

  // Draws a leaflet Marker
  renderPoint(point, featureGroup) {
    if (featureGroup) {
      const marker = new L.Marker(point[0], {
        icon: L.Draw.Marker.prototype.options.icon
      })

      marker.type = 'marker'
      marker.addTo(featureGroup)

      this.setState({
        drawnLayer: marker,
        drawnLayerType: 'point'
      })
      this.setLayer(marker)
    }
  }

  // Draws a leaflet Rectangle
  renderBoundingBox(rectangle, featureGroup) {
    if (featureGroup) {
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

      rect.type = 'rectangle'
      rect.addTo(featureGroup)

      this.setState({
        drawnLayer: rect,
        drawnLayerType: 'boundingBox'
      })
      this.setLayer(rect)
    }
  }

  renderMbr(drawnPoints) {
    const { featureGroupRef = {} } = this
    if (featureGroupRef === null) return
    const { leafletElement: featureGroup = null } = featureGroupRef

    if (featureGroup) {
      const latLngs = mbr({ polygon: drawnPoints })

      const sw = new L.LatLng(latLngs[0], latLngs[1])
      const ne = new L.LatLng(latLngs[2], latLngs[3])
      const bounds = new L.LatLngBounds(sw, ne)

      const options = {
        color: '#c0392b',
        weight: 3,
        fill: false,
        dashArray: '2, 10',
        opacity: 0.8
      }
      const rect = new L.Rectangle([bounds], options)

      rect.addTo(featureGroup)
      this.setState({
        drawnMbr: rect
      })
    }
  }

  // Draws a leaflet Polygon
  renderPolygon(polygon, featureGroup) {
    if (featureGroup) {
      const options = L.extend(
        {},
        L.Draw.Polygon.prototype.options.shapeOptions,
        colorOptions
      )
      const poly = new L.SphericalPolygon(polygon, options)

      poly.type = 'polygon'
      poly.addTo(featureGroup)

      this.setState({
        drawnLayer: poly,
        drawnLayerType: 'polygon'
      })
      this.setLayer(poly)
    }
  }

  renderLine(points, featureGroup) {
    if (featureGroup) {
      const options = L.extend(
        {},
        L.Draw.Polygon.prototype.options.shapeOptions,
        colorOptions
      )
      const latLngs = points.map((point) => {
        const [lng, lat] = point.split(',')
        return new L.LatLng(lat, lng)
      })
      const line = new L.Polyline(latLngs, options)

      line.type = 'line'
      line.addTo(featureGroup)

      this.setState({
        drawnLayer: line,
        drawnLayerType: 'line'
      })
      this.setLayer(line)
    }
  }

  renderCircle(points, featureGroup) {
    if (featureGroup) {
      const [
        lat,
        lng,
        radius
      ] = points
      const center = new L.LatLng(lng, lat)

      const circle = new L.Circle(center, {
        radius,
        ...colorOptions
      })

      circle.type = 'circle'
      circle.addTo(featureGroup)

      this.setState({
        drawnLayer: circle,
        drawnLayerType: 'circle'
      })
      this.setLayer(circle)
    }
  }

  render() {
    const { isProjectPage } = this.props

    const controls = (
      <EditControl
        position="bottomright"
        onDeleted={this.onDeleted}
        onDrawStart={this.onDrawStart}
        onDrawStop={this.onDrawStop}
        onCreated={this.onCreated}
        onMounted={this.onMounted}
        onEdited={this.onEdited}
        onEditStart={this.onEditStart}
        onEditStop={this.onEditStop}
        draw={{
          circle: {
            drawError: errorOptions,
            shapeOptions: colorOptions
          },
          circlemarker: false,
          polygon: {
            drawError: errorOptions,
            shapeOptions: colorOptions
          },
          polyline: false,
          rectangle: {
            drawError: errorOptions,
            shapeOptions: colorOptions
          }
        }}
        edit={{
          selectedPathOptions: {
            opacity: 0.6,
            dashArray: '10, 10'
          }
        }}
      />
    )
    return (
      <FeatureGroup ref={(ref) => { this.featureGroupRef = ref }}>
        { !isProjectPage && controls }
      </FeatureGroup>
    )
  }
}

SpatialSelection.defaultProps = {
  boundingBoxSearch: '',
  circleSearch: '',
  lineSearch: '',
  mapRef: {},
  pointSearch: '',
  polygonSearch: ''
}

SpatialSelection.propTypes = {
  advancedSearch: PropTypes.shape({}).isRequired,
  boundingBoxSearch: PropTypes.string,
  circleSearch: PropTypes.string,
  isCwic: PropTypes.bool.isRequired,
  isProjectPage: PropTypes.bool.isRequired,
  mapRef: PropTypes.shape({}),
  onChangeQuery: PropTypes.func.isRequired,
  pointSearch: PropTypes.string,
  polygonSearch: PropTypes.string,
  lineSearch: PropTypes.string,
  onToggleDrawingNewLayer: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onMetricsSpatialEdit: PropTypes.func.isRequired
}

export default SpatialSelection
