/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  difference,
  startCase,
  uniq
} from 'lodash'
import { FeatureGroup } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'

import 'leaflet-draw/dist/leaflet.draw.css'
import icon from 'leaflet-draw/dist/images/marker-icon.png'
import iconShadow from 'leaflet-draw/dist/images/marker-shadow.png'

import { eventEmitter } from '../../events/events'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { limitLatLngDecimalPoints } from '../../util/limitDecimalPoints'
import { makeCounterClockwise, getShape, splitListOfPoints } from '../../util/map/geo'
import { mbr } from '../../util/map/mbr'
import { panFeatureGroupToCenter } from '../../util/map/actions/panFeatureGroupToCenter'

const { defaultSpatialDecimalSize } = getApplicationConfig()

const normalColor = '#00ffff'
const errorColor = '#990000'
export const colorOptions = {
  color: normalColor,
  dashArray: null,
  pointerEvents: 'stroke',
  fillOpacity: 0,
  weight: 3,
  fill: true
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
L.drawLocal.draw.toolbar.buttons.circle = 'Search by spatial circle'
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
  this._point = `(${latlng.lat.toFixed(defaultSpatialDecimalSize)}, ${latlng.lng.toFixed(defaultSpatialDecimalSize)})`
  if (this._content != null) {
    this.updateContent(this._content)
  }

  return originalUpdatePosition.call(this, latlng)
}

class SpatialSelection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      drawnLayers: []
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
    this.getExistingSearch = this.getExistingSearch.bind(this)

    this.drawControl = null
    this.layers = []
  }

  componentDidMount() {
    const {
      mapRef
    } = this.props
    const {
      leafletElement: map,
      props: mapProps
    } = mapRef
    if (!map) {
      return
    }

    // Draw the shape
    this.renderShape(this.props)

    const { center = [] } = mapProps

    const { featureGroupRef = {} } = this
    const { leafletElement: featureGroup = null } = featureGroupRef

    if (!center.length && featureGroup && featureGroup.getBounds) {
      const bounds = featureGroup.getBounds() || false
      panFeatureGroupToCenter(map, bounds)
    }

    eventEmitter.on('map.drawStart', this.onSpatialDropdownClick)
    eventEmitter.on('map.drawCancel', this.onDrawCancel)
  }

  componentWillReceiveProps(nextProps) {
    const {
      advancedSearch = {},
      boundingBoxSearch,
      circleSearch,
      lineSearch,
      mapRef,
      pointSearch,
      polygonSearch
    } = this.props
    const {
      drawnLayers = []
    } = this.state

    const { leafletElement: map } = mapRef
    if (!map) {
      return
    }

    const { regionSearch = {} } = advancedSearch
    const { selectedRegion = {} } = regionSearch
    const { spatial: regionSpatial } = selectedRegion

    const { regionSearch: nextRegionSearch = {} } = nextProps.advancedSearch
    const { selectedRegion: nextSelectedRegion = {} } = nextRegionSearch
    const { spatial: nextRegionSpatial } = nextSelectedRegion

    const newDrawing = nextProps.pointSearch[0]
      || nextProps.boundingBoxSearch[0]
      || nextProps.polygonSearch[0]
      || nextProps.lineSearch[0]
      || nextProps.circleSearch[0]
      || nextRegionSpatial
    const oldDrawing = pointSearch[0]
    || boundingBoxSearch[0]
    || polygonSearch[0]
    || lineSearch[0]
    || circleSearch[0]
    || regionSpatial

    const { featureGroupRef = {} } = this
    const { leafletElement = {} } = featureGroupRef

    const newDrawingFound = drawnLayers.some((layer) => layer.layerPoints === newDrawing)

    if (oldDrawing !== newDrawing && !newDrawingFound) {
      if (drawnLayers.length > 0) {
        if (leafletElement.removeLayer) {
          // remove all drawn layers
          drawnLayers.forEach((drawnLayer) => {
            const { layer, layerMbr } = drawnLayer
            leafletElement.removeLayer(layer)
            leafletElement.removeLayer(layerMbr)
          })

          // remove the layerMbr from all drawnLayers
          this.setState((prevState) => ({
            ...prevState,
            drawnLayers: prevState.drawnLayers.map((layer) => ({
              ...layer,
              layerMbr: null
            }))
          }))
        }
      }

      // Draw the new shape
      this.renderShape(nextProps, true)
    }

    const drawnMbrFound = drawnLayers.filter((layer) => layer.layerMbr != null)

    // If a polygon is drawn for a CWIC collection, render the MBR to show the user what is being sent
    // to CWIC as their spatial
    if (!nextProps.isProjectPage) {
      if (
        (nextProps.polygonSearch[0] && nextProps.polygonSearch[0] !== '')
        && drawnMbrFound.length === 0
        && nextProps.isOpenSearch
      ) {
        this.renderMbr(nextProps.polygonSearch[0])
      } else if (drawnMbrFound.length > 0 && !nextProps.isOpenSearch) {
        if (leafletElement.removeLayer) {
          drawnMbrFound.forEach((drawnMbr) => leafletElement.removeLayer(drawnMbr.layerMbr))
          if (drawnLayers.length > 0) {
            // remove the layerMbr from all drawnLayers
            this.setState((prevState) => ({
              ...prevState,
              drawnLayers: prevState.drawnLayers.map((layer) => ({
                ...layer,
                layerMbr: null
              }))
            }))
          }
        }
      }
    } else if (drawnMbrFound.length > 0) {
      if (leafletElement.removeLayer) {
        drawnMbrFound.forEach((drawnMbr) => leafletElement.removeLayer(drawnMbr.layerMbr))

        // remove the layerMbr from all drawnLayers
        this.setState((prevState) => ({
          ...prevState,
          drawnLayers: prevState.drawnLayers.map((layer) => ({
            ...layer,
            layerMbr: null
          }))
        }))
      }
    }
  }

  componentWillUnmount() {
    eventEmitter.off('map.drawStart', this.onSpatialDropdownClick)
    eventEmitter.off('map.drawCancel', this.onDrawCancel)
  }

  // Callback from EditControl, called when clicking the draw shape button
  onDrawStart(e) {
    let { layerType } = e
    const {
      onToggleDrawingNewLayer,
      onMetricsMap,
      onRemoveSpatialFilter
    } = this.props
    const { drawnLayers } = this.state

    if (layerType !== 'shapefile') {
      const { featureGroupRef } = this
      const { leafletElement } = featureGroupRef
      drawnLayers.forEach((drawnLayer) => {
        const { layer, layerMbr } = drawnLayer
        leafletElement.removeLayer(layer)
        leafletElement.removeLayer(layerMbr)
      })

      // Remove existing spatial from the store
      onRemoveSpatialFilter()

      this.setState({ drawnLayers: [] })
    }

    if (layerType === 'shapefile') {
      layerType = 'Shape File'

      // Clear any drawnLayers that aren't shapefiles
      this.setState((prevState) => ({
        ...prevState,
        drawnLayers: prevState.drawnLayers.filter((drawnLayer) => {
          const { layer } = drawnLayer
          const { feature = {} } = layer
          const { edscId } = feature

          return edscId !== undefined
        })
      }))
    }

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
  }

  onSpatialDropdownClick(event) {
    const { type } = event
    if (this.drawControl) {
      this.drawControl._toolbars.draw._modes[type].handler.enable()
    }
  }

  onEditStart() {
    this.preEditBounds = this.layers.map((layer) => this.boundsToPoints(layer))
  }

  onEditStop() {
    const { onMetricsSpatialEdit } = this.props
    const postEditBounds = this.layers.map((layer) => this.boundsToPoints(layer))

    this.preEditBounds.forEach((bounds, index) => {
      const { type: layerType } = this.layers[index]
      let distanceSum = 0

      bounds.forEach((p0, i) => {
        const p1 = postEditBounds[index][i]
        distanceSum += p0.distanceTo(p1)
      })

      onMetricsSpatialEdit({
        type: layerType,
        distanceSum
      })
    })
  }

  // Callback from EditControl, called when the layer is edited
  onEdited() {
    const { drawnLayers } = this.state

    // Editing is disabled for shapefiles, only edit the first drawnLayer
    const [firstLayer = {}] = drawnLayers
    const {
      layer: drawnLayer,
      layerType: drawnLayerType
    } = firstLayer

    this.updateStateAndQuery(drawnLayer, drawnLayerType)
  }

  // Callback from EditControl, contains the layer that was just drawn
  onCreated(e) {
    const {
      isShapefile,
      layer,
      layerType
    } = e

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

    this.updateStateAndQuery(layer, type, isShapefile)

    // Assign the type to the layer, and then the layer so that it's available when editing
    layer.type = layerType
    if (isShapefile) {
      this.layers.push(layer)
    } else {
      this.layers = [layer]
    }
  }

  // Callback from EditControl, called when the layer is deleted
  onDeleted(e) {
    const { isShapefile, layerId } = e
    const {
      boundingBoxSearch,
      circleSearch,
      lineSearch,
      pointSearch,
      polygonSearch,
      onChangeQuery
    } = this.props

    // only remove selected spatial
    if (isShapefile) {
      // Find the layer that needs to be removed
      const { drawnLayers } = this.state
      const layerIndex = drawnLayers.findIndex((layer) => layer.layer.feature.edscId === layerId)

      const drawnLayer = drawnLayers[layerIndex]
      const {
        layer,
        layerType,
        layerMbr
      } = drawnLayer

      const points = this.getLayerLatLngs(layer, layerType)
      const { featureGroupRef } = this
      const { leafletElement } = featureGroupRef
      leafletElement.removeLayer(layer)
      leafletElement.removeLayer(layerMbr)

      this.setState((prevState) => ({
        ...prevState,
        drawnLayers: [
          ...prevState.drawnLayers.slice(0, layerIndex),
          ...prevState.drawnLayers.slice(layerIndex + 1)
        ]
      }))

      const existingSearch = this.getExistingSearch(layerType)

      // Save existing spatial params for all types, while removing only the currently deselected points from layerType
      // Set types to undefined if no spatial search exists, to remove that value from the redux store
      onChangeQuery({
        collection: {
          spatial: {
            boundingBox: this.spatialSearchOrUndefined(boundingBoxSearch),
            circle: this.spatialSearchOrUndefined(circleSearch),
            line: this.spatialSearchOrUndefined(lineSearch),
            point: this.spatialSearchOrUndefined(pointSearch),
            polygon: this.spatialSearchOrUndefined(polygonSearch),
            [layerType]: this.spatialSearchOrUndefined(difference(existingSearch, [points]))
          }
        }
      })
    } else {
      onChangeQuery({
        collection: {
          spatial: {}
        }
      })

      this.setState({ drawnLayers: [] })
    }
  }

  // Return the matching spatial search for the given type
  getExistingSearch(type) {
    const {
      boundingBoxSearch,
      circleSearch,
      lineSearch,
      pointSearch,
      polygonSearch
    } = this.props

    let existingSearch

    switch (type) {
      case 'boundingBox':
        existingSearch = boundingBoxSearch
        break
      case 'circle':
        existingSearch = circleSearch
        break
      case 'line':
        existingSearch = lineSearch
        break
      case 'point':
        existingSearch = pointSearch
        break
      case 'polygon':
        existingSearch = polygonSearch
        break
      default:
        break
    }

    return existingSearch
  }

  // Return the latLngs from the given layer
  getLayerLatLngs(layer, type) {
    let originalLatLngs
    let latLngs
    switch (type) {
      case 'point':
        latLngs = limitLatLngDecimalPoints([layer.getLatLng()].map((p) => `${p.lng},${p.lat}`))
        break
      case 'boundingBox':
        latLngs = limitLatLngDecimalPoints([layer.getLatLngs()[0][0], layer.getLatLngs()[0][2]].map((p) => `${p.lng},${p.lat}`))
        break
      case 'polygon':
        ([originalLatLngs] = layer.getLatLngs())
        latLngs = limitLatLngDecimalPoints(makeCounterClockwise(originalLatLngs).map((p) => `${p.lng},${p.lat}`))
        break
      case 'line':
        latLngs = limitLatLngDecimalPoints(Array.from(layer.getLatLngs()).map((p) => `${p.lng},${p.lat}`))
        break
      case 'circle': {
        const center = layer.getLatLng()
        const radius = layer.getRadius()
        latLngs = limitLatLngDecimalPoints([center].map((p) => `${p.lng},${p.lat}`))
        latLngs.push(parseFloat(radius).toFixed(0))
        break
      }
      default:
        return null
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
    }

    return latLngsAntiMeridian.join()
  }

  setLayer(layer, shouldCenter, isShapefile) {
    if (isShapefile) {
      this.layers.push(layer)
    } else {
      this.layers = [layer]
    }

    const { mapRef } = this.props
    const map = mapRef.leafletElement

    const { featureGroupRef = {} } = this
    const { leafletElement: featureGroup = null } = featureGroupRef

    if (shouldCenter && featureGroup) {
      panFeatureGroupToCenter(map, featureGroup)
    }
  }

  // Returns the search param if at least 1 set of points exist. If it is an empty array return undefined
  spatialSearchOrUndefined(search) {
    if (search.length > 0) return search

    return undefined
  }

  // Determine the latLngs from the layer and type, then update the component state and the query
  updateStateAndQuery(layer, type, isShapefile) {
    const {
      boundingBoxSearch,
      circleSearch,
      lineSearch,
      pointSearch,
      polygonSearch,
      onChangeQuery
    } = this.props

    const points = this.getLayerLatLngs(layer, type)

    // If no points exist (invalid shape type), return without updating state or query
    if (!points) return

    const newDrawnLayer = {
      layer,
      layerType: type,
      layerPoints: points
    }
    if (isShapefile) {
      this.setState((prevState) => ({
        ...prevState,
        drawnLayers: [
          ...prevState.drawnLayers,
          newDrawnLayer
        ]
      }))

      // Add new selected shape to any existing spatial, keep existing spatial of different types as well
      const existingSearch = this.getExistingSearch(type)

      // Save existing spatial params for all types, while adding the currently selected points from layerType
      // Set types to undefined if no spatial search exists, to remove that value from the redux store
      onChangeQuery({
        collection: {
          spatial: {
            boundingBox: this.spatialSearchOrUndefined(boundingBoxSearch),
            circle: this.spatialSearchOrUndefined(circleSearch),
            line: this.spatialSearchOrUndefined(lineSearch),
            point: this.spatialSearchOrUndefined(pointSearch),
            polygon: this.spatialSearchOrUndefined(polygonSearch),
            [type]: this.spatialSearchOrUndefined(uniq([...existingSearch, points]))
          }
        }
      })
    } else {
      this.setState({
        drawnLayers: [newDrawnLayer]
      })

      onChangeQuery({
        collection: {
          spatial: {
            [type]: [points]
          }
        }
      })
    }
  }

  boundsToPoints(layer) {
    const { mapRef } = this.props
    const map = mapRef.leafletElement
    let bounds = []

    if (['circle', 'marker'].indexOf(layer.type) > -1) {
      // Circle and Marker (Point) only have a single
      // LatLng, normalize the LatLng for our response
      bounds = [layer.getLatLng()]
    } else {
      ([bounds] = layer.getLatLngs())
    }

    return bounds.map((latLng) => map.latLngToLayerPoint(latLng))
  }

  // Draws a leaflet shape based on provided props
  renderShape(props, shouldCenter = false) {
    const { featureGroupRef = {} } = this
    if (featureGroupRef === null) return
    const { leafletElement: featureGroup = null } = featureGroupRef

    const {
      advancedSearch = {},
      boundingBoxSearch,
      circleSearch,
      lineSearch,
      pointSearch,
      polygonSearch,
      shapefile
    } = props

    // Don't draw a shape if a shapefile is present. ShapefileLayer.js will draw it
    const { shapefileId } = shapefile
    if (shapefileId) return

    const {
      regionSearch = {}
    } = advancedSearch

    const {
      selectedRegion = {}
    } = regionSearch

    const { type } = selectedRegion

    if (selectedRegion && selectedRegion.spatial) {
      if (type === 'reach') {
        const points = splitListOfPoints(selectedRegion.spatial)

        this.renderLine({
          points,
          featureGroup,
          layerPoints: points,
          shouldCenter
        })
      } else {
        const points = splitListOfPoints(selectedRegion.spatial)
        this.renderPolygon({
          polygon: getShape(points),
          featureGroup,
          layerPoints: selectedRegion.spatial,
          shouldCenter
        })
      }
    } else if (pointSearch[0]) {
      this.renderPoint({
        point: getShape([pointSearch[0]]),
        featureGroup,
        layerPoints: pointSearch[0],
        shouldCenter
      })
    } else if (boundingBoxSearch[0]) {
      const points = splitListOfPoints(boundingBoxSearch[0])
      this.renderBoundingBox({
        rectangle: getShape(points),
        featureGroup,
        layerPoints: boundingBoxSearch[0],
        shouldCenter
      })
    } else if (polygonSearch[0]) {
      const points = splitListOfPoints(polygonSearch[0])
      this.renderPolygon({
        polygon: getShape(points),
        featureGroup,
        layerPoints: polygonSearch[0],
        shouldCenter
      })
    } else if (lineSearch[0]) {
      const points = splitListOfPoints(lineSearch[0])
      this.renderLine({
        points,
        featureGroup,
        layerPoints: lineSearch[0],
        shouldCenter
      })
    } else if (circleSearch[0]) {
      const points = circleSearch[0].split(',')
      this.renderCircle({
        points,
        featureGroup,
        layerPoints: circleSearch[0],
        shouldCenter
      })
    }
  }

  // Draws a leaflet Marker
  renderPoint({
    point,
    featureGroup,
    layerPoints,
    shouldCenter
  }) {
    if (featureGroup) {
      const marker = new L.Marker(point[0], {
        icon: L.Draw.Marker.prototype.options.icon
      })

      marker.type = 'marker'
      marker.addTo(featureGroup)

      this.setState({
        drawnLayers: [{
          layer: marker,
          layerPoints,
          layerType: 'point'
        }]
      })
      this.setLayer(marker, shouldCenter)
    }
  }

  // Draws a leaflet Rectangle
  renderBoundingBox({
    rectangle,
    featureGroup,
    layerPoints,
    shouldCenter
  }) {
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
        drawnLayers: [{
          layer: rect,
          layerPoints,
          layerType: 'boundingBox'
        }]
      })
      this.setLayer(rect, shouldCenter)
    }
  }

  renderMbr(drawnPoints) {
    const { drawnLayers } = this.state
    const { featureGroupRef = {} } = this
    if (featureGroupRef === null) return
    const { leafletElement: featureGroup = null } = featureGroupRef

    if (featureGroup) {
      const {
        swLat,
        swLng,
        neLat,
        neLng
      } = mbr({ polygon: drawnPoints })

      const sw = new L.LatLng(swLat, swLng)
      const ne = new L.LatLng(neLat, neLng)
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

      const foundLayerIndex = drawnLayers.findIndex((layer) => layer.layerPoints === drawnPoints)
      this.setState((prevState) => ({
        ...prevState,
        drawnLayers: [
          ...prevState.drawnLayers.slice(0, foundLayerIndex),
          { ...prevState.drawnLayers[foundLayerIndex], layerMbr: rect },
          ...prevState.drawnLayers.slice(foundLayerIndex + 1)
        ]
      }))
    }
  }

  // Draws a leaflet Polygon
  renderPolygon({
    polygon,
    featureGroup,
    layerPoints,
    shouldCenter
  }) {
    if (featureGroup) {
      const options = L.extend(
        {},
        L.Draw.Polygon.prototype.options.shapeOptions,
        colorOptions
      )
      const poly = new L.Polygon(polygon, options)
      poly.type = 'polygon'
      poly.addTo(featureGroup)

      this.setState({
        drawnLayers: [{
          layer: poly,
          layerPoints,
          layerType: 'polygon'
        }]
      })
      this.setLayer(poly, shouldCenter)
    }
  }

  renderLine({
    points,
    featureGroup,
    layerPoints,
    shouldCenter
  }) {
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
        drawnLayers: [{
          layer: line,
          layerPoints,
          layerType: 'line'
        }]
      })
      this.setLayer(line, shouldCenter)
    }
  }

  renderCircle({
    points,
    featureGroup,
    layerPoints,
    shouldCenter
  }) {
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
        drawnLayers: [{
          layer: circle,
          layerPoints,
          layerType: 'circle'
        }]
      })
      this.setLayer(circle, shouldCenter)
    }
  }

  render() {
    const { isProjectPage, shapefile } = this.props
    const { shapefileId } = shapefile

    let draw = {
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
    }
    let edit = {
      selectedPathOptions: {
        opacity: 0.6,
        dashArray: '10, 10',
        maintainColor: true
      }
    }

    if (isProjectPage) {
      draw = {
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: false,
        polyline: false,
        rectangle: false
      }
    }

    if (isProjectPage || shapefileId) {
      edit = {
        edit: false,
        remove: false
      }
    }

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
        draw={draw}
        edit={edit}
      />
    )
    return (
      <FeatureGroup ref={(ref) => { this.featureGroupRef = ref }}>
        {controls}
      </FeatureGroup>
    )
  }
}

SpatialSelection.defaultProps = {
  boundingBoxSearch: [],
  circleSearch: [],
  lineSearch: [],
  mapRef: {},
  pointSearch: [],
  polygonSearch: [],
  shapefile: {}
}

SpatialSelection.propTypes = {
  advancedSearch: PropTypes.shape({
    regionSearch: PropTypes.shape({})
  }).isRequired,
  boundingBoxSearch: PropTypes.arrayOf(PropTypes.string),
  circleSearch: PropTypes.arrayOf(PropTypes.string),
  isOpenSearch: PropTypes.bool.isRequired,
  isProjectPage: PropTypes.bool.isRequired,
  lineSearch: PropTypes.arrayOf(PropTypes.string),
  mapRef: PropTypes.shape({
    leafletElement: PropTypes.node,
    props: PropTypes.shape({})
  }),
  onChangeQuery: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string),
  polygonSearch: PropTypes.arrayOf(PropTypes.string),
  shapefile: PropTypes.shape({
    file: PropTypes.shape({}),
    shapefileId: PropTypes.string
  }),
  onToggleDrawingNewLayer: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onMetricsSpatialEdit: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired
}

export default SpatialSelection
