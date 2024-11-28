/* eslint-disable no-underscore-dangle */

import React, {
  useEffect,
  useMemo,
  useRef
} from 'react'
import PropTypes from 'prop-types'
import {
  difference,
  isEqual,
  startCase,
  uniq
} from 'lodash-es'
import { FeatureGroup, useMap } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import L from 'leaflet'
import 'leaflet-draw'
import {
  makeCounterClockwise,
  getShape,
  splitListOfPoints,
  mbr
} from '@edsc/geo-utils'

import 'leaflet-draw/dist/leaflet.draw.css'
import icon from 'leaflet-draw/dist/images/marker-icon.png'
import iconShadow from 'leaflet-draw/dist/images/marker-shadow.png'

import { eventEmitter } from '../../events/events'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { limitLatLngDecimalPoints } from '../../util/limitDecimalPoints'
import { panFeatureGroupToCenter } from '../../util/map/actions/panFeatureGroupToCenter'

const { defaultSpatialDecimalSize } = getApplicationConfig()

const normalColor = '#00ffff'
const errorColor = '#990000'
export const colorOptions = {
  color: normalColor,
  dashArray: null,
  fill: true,
  fillOpacity: 0,
  opacity: 0.5,
  pointerEvents: 'stroke',
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

// https://stackoverflow.com/questions/76893010/error-while-trying-to-draw-a-rectangle-using-react-leaflet-draw-with-vite-uncau#comment136939532_76893010
window.type = true

const SpatialSelection = (props) => {
  const map = useMap()
  const layers = useRef([])
  const drawnLayers = useRef([])
  const drawControl = useRef(null)
  const featureGroupRef = useRef(null)
  const preEditBounds = useRef()

  const {
    advancedSearch: propsAdvancedSearch = {},
    boundingBoxSearch: propsBoundingBoxSearch = [],
    circleSearch: propsCircleSearch = [],
    isOpenSearch,
    isProjectPage,
    lineSearch: propsLineSearch = [],
    pointSearch: propsPointSearch = [],
    polygonSearch: propsPolygonSearch = [],
    projectCollections,
    shapefile
  } = props

  const { shapefileId } = shapefile

  const advancedSearch = useRef(propsAdvancedSearch)
  useEffect(() => {
    advancedSearch.current = propsAdvancedSearch
  }, [propsAdvancedSearch])

  const boundingBoxSearch = useRef(propsBoundingBoxSearch)
  useEffect(() => {
    boundingBoxSearch.current = propsBoundingBoxSearch
  }, [propsBoundingBoxSearch])

  const circleSearch = useRef(propsCircleSearch)
  useEffect(() => {
    circleSearch.current = propsCircleSearch
  }, [propsCircleSearch])

  const lineSearch = useRef(propsLineSearch)
  useEffect(() => {
    lineSearch.current = propsLineSearch
  }, [propsLineSearch])

  const pointSearch = useRef(propsPointSearch)
  useEffect(() => {
    pointSearch.current = propsPointSearch
  }, [propsPointSearch])

  const polygonSearch = useRef(propsPolygonSearch)
  useEffect(() => {
    polygonSearch.current = propsPolygonSearch
  }, [propsPolygonSearch])

  const setLayer = (layer, shouldCenter, isShapefile) => {
    if (isShapefile) {
      layers.current = [...layers.current, layer]
    } else {
      layers.current = [layer]
    }

    if (shouldCenter && featureGroupRef.current) {
      panFeatureGroupToCenter(map, featureGroupRef.current)
    }
  }

  const boundsToPoints = (layer) => {
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

  // Return the matching spatial search for the given type
  const getExistingSearch = (type) => {
    let existingSearch

    switch (type) {
      case 'boundingBox':
        existingSearch = boundingBoxSearch.current
        break
      case 'circle':
        existingSearch = circleSearch.current
        break
      case 'line':
        existingSearch = lineSearch.current
        break
      case 'point':
        existingSearch = pointSearch.current
        break
      case 'polygon':
        existingSearch = polygonSearch.current
        break
      default:
        break
    }

    return existingSearch
  }

  // Return the latLngs from the given layer
  const getLayerLatLngs = (layer, type) => {
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

  // Returns the search param if at least 1 set of points exist. If it is an empty array return undefined
  const spatialSearchOrUndefined = (search) => {
    if (search.length > 0) return search

    return undefined
  }

  // Generate a MBR layer from the given spatial. This MBR gets attached to every drawnLayers object
  const generateMbrLayer = (spatial) => {
    const {
      swLat,
      swLng,
      neLat,
      neLng
    } = mbr(spatial, { precision: defaultSpatialDecimalSize })

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

    const mbrLayer = new L.Rectangle([bounds], options)

    return mbrLayer
  }

  // Determine the latLngs from the layer and type, then update the component state and the query
  const updateStateAndQuery = (layer, type, isShapefile) => {
    const {
      onChangeQuery
    } = props

    const points = getLayerLatLngs(layer, type)

    // If no points exist (invalid shape type), return without updating state or query
    if (!points) return

    const layerMbr = generateMbrLayer({ [type]: points })

    const newDrawnLayer = {
      layer,
      layerType: type,
      layerPoints: points,
      layerMbr
    }
    if (isShapefile) {
      drawnLayers.current = [...drawnLayers.current, newDrawnLayer]

      // Add new selected shape to any existing spatial, keep existing spatial of different types as well
      const existingSearch = getExistingSearch(type)

      const typeSpatial = spatialSearchOrUndefined(uniq([...existingSearch, points]))

      // Only call onChangeQuery if the search has actually changed
      if (!isEqual(existingSearch, typeSpatial)) {
        // Save existing spatial params for all types, while adding the currently selected points from layerType
        // Set types to undefined if no spatial search exists, to remove that value from the redux store
        onChangeQuery({
          collection: {
            spatial: {
              boundingBox: spatialSearchOrUndefined(boundingBoxSearch.current),
              circle: spatialSearchOrUndefined(circleSearch.current),
              line: spatialSearchOrUndefined(lineSearch.current),
              point: spatialSearchOrUndefined(pointSearch.current),
              polygon: spatialSearchOrUndefined(polygonSearch.current),
              [type]: typeSpatial
            }
          }
        })
      }
    } else {
      drawnLayers.current = [newDrawnLayer]

      onChangeQuery({
        collection: {
          spatial: {
            [type]: [points]
          }
        }
      })
    }
  }

  // Callback from EditControl, contains the layer that was just drawn
  const onCreated = (event) => {
    const {
      isShapefile,
      layer,
      layerType
    } = event

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

    updateStateAndQuery(layer, type, isShapefile)

    // Assign the type to the layer, and then the layer so that it's available when editing
    layer.type = layerType
    if (isShapefile) {
      layers.current = [...layers.current, layer]
    } else {
      layers.current = [layer]
    }
  }

  // Callback from EditControl, called when the layer is deleted
  const onDeleted = (event) => {
    const { isShapefile, layerId } = event
    const {
      onChangeQuery
    } = props

    // Only remove selected spatial
    if (isShapefile) {
      // Find the layer that needs to be removed
      const layerIndex = drawnLayers.current.findIndex(
        (layer) => layer.layer.feature.edscId === layerId
      )

      const drawnLayer = drawnLayers.current[layerIndex]
      const {
        layer,
        layerType,
        layerMbr
      } = drawnLayer

      const points = getLayerLatLngs(layer, layerType)
      featureGroupRef.current.removeLayer(layer)
      if (layerMbr) featureGroupRef.current.removeLayer(layerMbr)

      drawnLayers.current = [
        ...drawnLayers.current.slice(0, layerIndex),
        ...drawnLayers.current.slice(layerIndex + 1)
      ]

      const existingSearch = getExistingSearch(layerType)

      // Save existing spatial params for all types, while removing only the currently deselected points from layerType
      // Set types to undefined if no spatial search exists, to remove that value from the redux store
      onChangeQuery({
        collection: {
          spatial: {
            boundingBox: spatialSearchOrUndefined(boundingBoxSearch.current),
            circle: spatialSearchOrUndefined(circleSearch.current),
            line: spatialSearchOrUndefined(lineSearch.current),
            point: spatialSearchOrUndefined(pointSearch.current),
            polygon: spatialSearchOrUndefined(polygonSearch.current),
            [layerType]: spatialSearchOrUndefined(difference(existingSearch, [points]))
          }
        }
      })
    } else {
      onChangeQuery({
        collection: {
          spatial: {}
        }
      })

      drawnLayers.current = []
    }
  }

  // Triggered from eventEmitter.emit('map.drawCancel')
  // Cancels Leaflet Draw
  const onDrawCancel = () => {
    if (drawControl.current) {
      drawControl.current._toolbars.draw._modes.marker.handler.disable()
      drawControl.current._toolbars.draw._modes.rectangle.handler.disable()
      drawControl.current._toolbars.draw._modes.circle.handler.disable()
      drawControl.current._toolbars.draw._modes.polygon.handler.disable()
    }
  }

  // Callback from EditControl, called when clicking the draw shape button
  const onDrawStart = (event) => {
    let { layerType } = event
    const {
      onToggleDrawingNewLayer,
      onMetricsMap,
      onRemoveSpatialFilter
    } = props

    if (layerType !== 'shapefile') {
      drawnLayers.current.forEach((drawnLayer) => {
        const { layer, layerMbr } = drawnLayer
        featureGroupRef.current.removeLayer(layer)
        if (layerMbr) featureGroupRef.current.removeLayer(layerMbr)
      })

      // Remove existing spatial from the store
      onRemoveSpatialFilter()

      drawnLayers.current = []
    }

    if (layerType === 'shapefile') {
      layerType = 'Shape File'

      // Clear any drawnLayers that aren't shapefiles
      drawnLayers.current = drawnLayers.current.filter((drawnLayer) => {
        const { layer = {} } = drawnLayer
        const { feature = {} } = layer
        const { edscId } = feature

        return edscId !== undefined
      })
    }

    onMetricsMap(`Spatial: ${startCase(layerType)}`)
    onToggleDrawingNewLayer(layerType)
  }

  // Callback from EditControl, called when the drawing is stopped from
  // cancelling or completing
  const onDrawStop = () => {
    const { onToggleDrawingNewLayer } = props
    onToggleDrawingNewLayer(false)
  }

  // Callback from EditControl, called when the layer is edited
  const onEdited = () => {
    // Editing is disabled for shapefiles, only edit the first drawnLayer
    const [firstLayer = {}] = drawnLayers.current
    const {
      layer: drawnLayer,
      layerType: drawnLayerType
    } = firstLayer

    updateStateAndQuery(drawnLayer, drawnLayerType)
  }

  // Callback from EditControl, called when clicking the edit button
  const onEditStart = () => {
    preEditBounds.current = layers.current.map((layer) => boundsToPoints(layer))
  }

  // Callback from EditControl, called when clicking the save button
  const onEditStop = () => {
    const { onMetricsSpatialEdit } = props
    const postEditBounds = layers.current.map((layer) => boundsToPoints(layer))

    // Iterate over the `stateRefPreEditBounds` and get the difference between that and the `postEditBounds`
    preEditBounds.current.forEach((bounds, index) => {
      const { type: layerType } = layers.current[index]
      let distanceSum = 0

      bounds.forEach((initialPoint, i) => {
        const updatedPoint = postEditBounds[index][i]
        distanceSum += initialPoint.distanceTo(updatedPoint)
      })

      onMetricsSpatialEdit({
        type: layerType,
        distanceSum
      })
    })
  }

  // Callback from EditControl, called when the controls are mounted
  const onMounted = (newDrawControl) => {
    drawControl.current = newDrawControl
  }

  // Trigger a leaflet drawing from the spatial dropdown
  const onSpatialDropdownClick = (event) => {
    const { type } = event

    if (drawControl.current) {
      drawControl.current._toolbars.draw._modes[type].handler.enable()
    }
  }

  // Draws a leaflet Marker
  const renderPoint = ({
    point,
    featureGroup,
    layerPoints,
    shouldCenter
  }) => {
    if (featureGroup) {
      const marker = new L.Marker(point[0], {
        icon: L.Draw.Marker.prototype.options.icon
      })

      marker.type = 'marker'
      marker.addTo(featureGroup)

      const layerMbr = generateMbrLayer({ point: layerPoints })

      drawnLayers.current = [{
        layer: marker,
        layerPoints,
        layerType: 'point',
        layerMbr
      }]

      setLayer(marker, shouldCenter)
    }
  }

  // Draws a leaflet Rectangle
  const renderBoundingBox = ({
    rectangle,
    featureGroup,
    layerPoints,
    shouldCenter
  }) => {
    if (featureGroup) {
      const shape = rectangle
      // Southwest longitude should not be greater than northeast
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

      const layerMbr = generateMbrLayer({ boundingBox: layerPoints })

      drawnLayers.current = [{
        layer: rect,
        layerPoints,
        layerType: 'boundingBox',
        layerMbr
      }]

      setLayer(rect, shouldCenter)
    }
  }

  // Draws a leaflet Polygon
  const renderPolygon = ({
    polygon,
    featureGroup,
    layerPoints,
    shouldCenter
  }) => {
    if (featureGroup) {
      const options = L.extend(
        {},
        L.Draw.Polygon.prototype.options.shapeOptions,
        colorOptions
      )
      const poly = new L.Polygon(polygon, options)
      poly.type = 'polygon'
      poly.addTo(featureGroup)

      const layerMbr = generateMbrLayer({ polygon: layerPoints })

      drawnLayers.current = [{
        layer: poly,
        layerPoints,
        layerType: 'polygon',
        layerMbr
      }]

      setLayer(poly, shouldCenter)
    }
  }

  const renderLine = ({
    points,
    featureGroup,
    layerPoints,
    shouldCenter
  }) => {
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

      const layerMbr = generateMbrLayer({ line: layerPoints })

      drawnLayers.current = [{
        layer: line,
        layerPoints,
        layerType: 'line',
        layerMbr
      }]

      setLayer(line, shouldCenter)
    }
  }

  const renderCircle = ({
    points,
    featureGroup,
    layerPoints,
    shouldCenter
  }) => {
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

      const layerMbr = generateMbrLayer({ circle: layerPoints })

      drawnLayers.current = [{
        layer: circle,
        layerPoints,
        layerType: 'circle',
        layerMbr
      }]

      setLayer(circle, shouldCenter)
    }
  }

  // Draws a leaflet shape based on provided props
  const renderShape = (shouldCenter = false) => {
    if (featureGroupRef.current === null) return

    const {
      shapefile: propsShapefile
    } = props

    // Don't draw a shape if a shapefile is present. ShapefileLayer.js will draw it
    const { shapefileId: propsShapefileId } = propsShapefile
    if (propsShapefileId) return

    const {
      regionSearch = {}
    } = advancedSearch.current

    const {
      selectedRegion = {}
    } = regionSearch

    const { type } = selectedRegion

    if (selectedRegion && selectedRegion.spatial) {
      if (type === 'reach') {
        const points = splitListOfPoints(selectedRegion.spatial)

        renderLine({
          points,
          featureGroup: featureGroupRef.current,
          layerPoints: points,
          shouldCenter
        })
      } else {
        const points = splitListOfPoints(selectedRegion.spatial)

        renderPolygon({
          polygon: getShape(points),
          featureGroup: featureGroupRef.current,
          layerPoints: selectedRegion.spatial,
          shouldCenter
        })
      }
    } else if (pointSearch.current[0]) {
      renderPoint({
        point: getShape([pointSearch.current[0]]),
        featureGroup: featureGroupRef.current,
        layerPoints: pointSearch.current[0],
        shouldCenter
      })
    } else if (boundingBoxSearch.current[0]) {
      const points = splitListOfPoints(boundingBoxSearch.current[0])

      renderBoundingBox({
        rectangle: getShape(points),
        featureGroup: featureGroupRef.current,
        layerPoints: boundingBoxSearch.current[0],
        shouldCenter
      })
    } else if (polygonSearch.current[0]) {
      const points = splitListOfPoints(polygonSearch.current[0])

      renderPolygon({
        polygon: getShape(points),
        featureGroup: featureGroupRef.current,
        layerPoints: polygonSearch.current[0],
        shouldCenter
      })
    } else if (lineSearch.current[0]) {
      const points = splitListOfPoints(lineSearch.current[0])

      renderLine({
        points,
        featureGroup: featureGroupRef.current,
        layerPoints: lineSearch.current[0],
        shouldCenter
      })
    } else if (circleSearch.current[0]) {
      const points = circleSearch.current[0].split(',')

      renderCircle({
        points,
        featureGroup: featureGroupRef.current,
        layerPoints: circleSearch.current[0],
        shouldCenter
      })
    }
  }

  // Add the layerMbr matching the given points to the featureGroupRef.current
  const showLayerMbr = (points) => {
    drawnLayers.current.forEach((drawnLayer) => {
      const { layerMbr, layerPoints } = drawnLayer

      // Check if the drawn layer is the correct layer for the spatial
      const correctLayer = points === layerPoints

      // If we have the correct layer and the layerMbr isn't already on the map, add it
      if (correctLayer && layerMbr && !layerMbr._map) {
        layerMbr.addTo(featureGroupRef.current)
      }
    })
  }

  // Remove the layerMbr matching the given points from the featureGroupRef.current
  const hideLayerMbr = (points) => {
    if (featureGroupRef.current.removeLayer) {
      drawnLayers.current.forEach((layer) => {
        const { layerMbr, layerPoints } = layer

        // Check if the drawn layer is the correct layer for the spatial
        const correctLayer = points ? points === layerPoints : true

        if (correctLayer) {
          featureGroupRef.current.removeLayer(layerMbr)
        }
      })
    }
  }

  useEffect(() => {
    const shouldCenter = false
    renderShape(shouldCenter)

    eventEmitter.on('map.drawStart', onSpatialDropdownClick)
    eventEmitter.on('map.drawCancel', onDrawCancel)

    return () => {
      eventEmitter.off('map.drawStart', onSpatialDropdownClick)
      eventEmitter.off('map.drawCancel', onDrawCancel)
    }
  }, [])

  useEffect(() => {
    const { regionSearch = {} } = propsAdvancedSearch
    const { selectedRegion = {} } = regionSearch
    const { spatial: regionSpatial } = selectedRegion

    const newDrawing = propsPointSearch[0]
      || propsBoundingBoxSearch[0]
      || propsPolygonSearch[0]
      || propsLineSearch[0]
      || propsCircleSearch[0]
      || regionSpatial

    const newDrawingFound = drawnLayers.current.some((layer) => layer.layerPoints === newDrawing)

    // If no drawing is found, remove all drawn layers and draw the new shape
    if (!newDrawingFound) {
      if (drawnLayers.current.length > 0 && featureGroupRef.current.removeLayer) {
        // Remove all drawn layers
        drawnLayers.current.forEach((drawnLayer) => {
          const { layer, layerMbr } = drawnLayer

          if (layer) featureGroupRef.current.removeLayer(layer)
          if (layerMbr) featureGroupRef.current.removeLayer(layerMbr)
        })
      }

      // Draw the new shape
      renderShape(true)
    }

    // If a polygon is drawn for a OpenSearch collection, render the MBR to show the user what is being sent
    // to OpenSearch as their spatial
    if (!isProjectPage) {
      if (
        (propsPolygonSearch[0] && propsPolygonSearch[0] !== '')
        && isOpenSearch
      ) {
        showLayerMbr(propsPolygonSearch[0])
      } else if (!isOpenSearch) {
        hideLayerMbr()
      }
    } else {
      // If on the project page, and the selectedAccessMethod is harmony and supportsBoundingBoxSubsetting is true and supportsShapefileSubsetting is false and the user has non-bounding box spatial applied, show the MBR
      Object.keys(projectCollections).forEach((collectionId) => {
        const { selectedAccessMethod, accessMethods } = projectCollections[collectionId]

        if (selectedAccessMethod && selectedAccessMethod.startsWith('harmony')) {
          const accessMethod = accessMethods[selectedAccessMethod]

          // Does the selected access method accept bounding box spatial and not shapefile spatial
          const {
            supportsBoundingBoxSubsetting,
            supportsShapefileSubsetting,
            enableSpatialSubsetting
          } = accessMethod

          const nonBoundingBoxSpatial = propsCircleSearch[0]
            || propsLineSearch[0]
            || propsPointSearch[0]
            || propsPolygonSearch[0]

          if (
            enableSpatialSubsetting
            && supportsBoundingBoxSubsetting
            && !supportsShapefileSubsetting
            && !!nonBoundingBoxSpatial
          ) {
            showLayerMbr(nonBoundingBoxSpatial)
          } else {
            hideLayerMbr(nonBoundingBoxSpatial)
          }
        } else {
          hideLayerMbr()
        }
      })
    }
  }, [
    drawnLayers.current,
    isOpenSearch,
    projectCollections,
    propsAdvancedSearch,
    propsBoundingBoxSearch,
    propsCircleSearch,
    propsLineSearch,
    propsPointSearch,
    propsPolygonSearch
  ])

  const draw = useMemo(() => {
    let drawOptions = {
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
    if (isProjectPage) {
      drawOptions = {
        circle: false,
        circlemarker: false,
        marker: false,
        polygon: false,
        polyline: false,
        rectangle: false
      }
    }

    return drawOptions
  }, [isProjectPage])

  const edit = useMemo(() => {
    let editOptions = {
      selectedPathOptions: {
        opacity: 0.6,
        dashArray: '10, 10',
        maintainColor: true
      }
    }

    if (isProjectPage || shapefileId) {
      editOptions = {
        edit: false,
        remove: false
      }
    }

    return editOptions
  }, [isProjectPage, shapefileId])

  const controls = useMemo(() => (
    <EditControl
      position="bottomright"
      onDeleted={onDeleted}
      onDrawStart={onDrawStart}
      onDrawStop={onDrawStop}
      onCreated={onCreated}
      onMounted={onMounted}
      onEdited={onEdited}
      onEditStart={onEditStart}
      onEditStop={onEditStop}
      draw={draw}
      edit={edit}
    />
  ), [drawnLayers.current])

  return (
    <FeatureGroup ref={(ref) => { featureGroupRef.current = ref }}>
      {controls}
    </FeatureGroup>
  )
}

SpatialSelection.defaultProps = {
  boundingBoxSearch: [],
  circleSearch: [],
  lineSearch: [],
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
  onChangeQuery: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string),
  polygonSearch: PropTypes.arrayOf(PropTypes.string),
  projectCollections: PropTypes.shape({
    selectedAccessMethod: PropTypes.string,
    accessMethods: PropTypes.shape({
      supportsBoundingBoxSubsetting: PropTypes.bool,
      supportsShapefileSubsetting: PropTypes.bool
    })
  }).isRequired,
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
