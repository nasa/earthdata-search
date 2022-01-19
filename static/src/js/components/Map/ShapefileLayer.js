import L from 'leaflet'
import {
  withLeaflet,
  MapLayer
} from 'react-leaflet'
import forge from 'node-forge'
import { isEqual } from 'lodash'

import { eventEmitter } from '../../events/events'
import { colorOptions } from '../SpatialSelection/SpatialSelection'

import './ShapefileLayer.scss'

const MAX_POLYGON_SIZE = 50

const defaultOptions = {
  selection: L.Draw.Polygon.prototype.options.shapeOptions
}

class ShapefileLayerExtended extends L.Layer {
  initialize(props) {
    this.props = props
    this.onAdd = this.onAdd.bind(this)
    this.onRemovedFile = this.onRemovedFile.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickLayer = this.clickLayer.bind(this)
    this.authToken = props.authToken
    this.onMetricsMap = props.onMetricsMap
    this.isProjectPage = props.isProjectPage
    this.onToggleTooManyPointsModal = props.onToggleTooManyPointsModal

    this.options = {
      selection: L.extend({}, defaultOptions.selection, colorOptions)
    }

    this.selectedLayers = []

    eventEmitter.on('shapefile.success', (file, resp) => {
      this.onSuccess(file, resp)
    })

    eventEmitter.on('shapefile.removedfile', () => {
      this.onRemovedFile()
    })

    const { shapefile, onFetchShapefile } = props
    const {
      file,
      shapefileId
    } = shapefile

    if (shapefileId && !file) {
      onFetchShapefile(shapefileId)
    }
  }

  drawNewShapefile(shapefile, selectedFeatures = []) {
    this.onSuccess({}, shapefile, false, selectedFeatures)
  }

  onAdd(map) {
    this.map = map

    const { shapefile } = this.props
    const {
      file,
      selectedFeatures
    } = shapefile

    if (file) {
      this.onSuccess({}, file, false, selectedFeatures)
    }
  }

  onRemove() {
    this.map = null
    this.jsonLayer = null
  }

  onRemovedFile() {
    if (this.jsonLayer != null) { this.map.removeLayer(this.jsonLayer) }
  }

  // Leaflet 1.0+ changed the way that MultiPolygons are handled.
  // Instead of creating a new layer for each polgon in a MultiPolygon
  // feature (v0.7) it creates a single layer with multiple polygons.
  // This means when you hover over one island in Hawaii it highlights
  // all the islands, and passes all the polygons to _setConstraint.
  // This method takes all the MultiPolygon geometries and separates them
  // into individual polygons, to mimick the 0.7 functionality.
  separateMultiPolygons(geojson) {
    const featureIndexesToRemove = []
    const { features } = geojson
    const newFeaturesToAdd = []

    features.forEach((feature, featureIndex) => {
      const { geometry } = feature
      const { type } = geometry

      // KML type file
      if (type === 'GeometryCollection') {
        // Remove the entire GeometryCollection
        featureIndexesToRemove.push(featureIndex)
        const { geometries } = geometry

        geometries.forEach((nestedGeometry) => {
          if (nestedGeometry.type === 'MultiPolygon') {
            // If we see a MultiPolygon, separate into Polygons
            nestedGeometry.coordinates.forEach((polygon) => {
              const newPolygon = {
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: polygon
                }
              }

              // Add the polygon into the new features to pull up to the top level features array
              newFeaturesToAdd.push(newPolygon)
            })
          } else {
            // Add all over shapes to the top level features array
            newFeaturesToAdd.push({
              type: 'Feature',
              geometry: nestedGeometry
            })
          }
        })
      }

      // geojson type file
      if (type === 'MultiPolygon') {
        featureIndexesToRemove.push(featureIndex)
        geometry.coordinates.forEach((coordinate) => {
          const newFeature = {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: coordinate
            }
          }
          geojson.features.push(newFeature)
        })
      }
    })

    // remove MultiPolygon features from geojson files
    featureIndexesToRemove.reverse().forEach((index) => {
      geojson.features.splice(index, 1)
    })

    // eslint-disable-next-line no-param-reassign
    geojson.features = [
      ...geojson.features,
      ...newFeaturesToAdd
    ]
  }

  onSuccess(file, response, panMap = true, selectedFeatures = []) {
    if (!this.map) return

    const newHash = forge.md.md5.create()
    newHash.update(JSON.stringify(response))
    if (this.fileHash === newHash.digest().toHex()) return

    this.selectedLayers = selectedFeatures
    // look through response and separate all MultiPolygon types into their own polygon
    this.separateMultiPolygons(response)

    // Add an id field to each feature unless it already has one
    response.features.map((feature, featureIndex) => {
      const newFeature = feature
      const { edscId } = newFeature

      if (!edscId) {
        newFeature.edscId = featureIndex.toString()
      }

      return newFeature
    })

    const newIcon = new L.Icon.Default()
    newIcon.options.className = 'geojson-icon'

    const layersToSelect = []
    // eslint-disable-next-line new-cap
    const jsonLayer = new L.geoJson(response, {
      className: 'geojson-svg',
      pointToLayer: (feature, latlng) => {
        // If the feature is a point with a radius property, drawn a circle layer
        const { properties = {} } = feature
        const { radius } = properties
        if (radius) {
          return new L.Circle(latlng, {
            radius,
            className: 'geojson-svg'
          })
        }

        return new L.Marker(latlng)
      },
      onEachFeature(feature, featureLayer) {
        const addIconClasses = (layer) => {
          const { options = {} } = layer
          const { icon = null } = options
          // eslint-disable-next-line no-param-reassign
          if (icon !== null) layer.options.icon = newIcon
        }

        addIconClasses(featureLayer)
        if (featureLayer.getLayers != null) {
          featureLayer.getLayers().forEach((layer) => {
            addIconClasses(layer)
          })
        }

        const { edscId } = feature

        if (selectedFeatures.includes(edscId)) {
          layersToSelect.push(featureLayer)
        }
      }
    })

    if (!this.isProjectPage) jsonLayer.on('click', this.clickLayer)
    this.jsonLayer = jsonLayer
    this.jsonLayer.addTo(this.map)
    if (panMap) this.map.flyToBounds(jsonLayer.getBounds())
    this.onMetricsMap('Added Shapefile')

    const children = jsonLayer.getLayers()

    if (children.length === 1) {
      const { feature } = children[0]
      const { edscId } = feature
      this.selectedLayers = [edscId]
      const { onUpdateShapefile } = this.props
      onUpdateShapefile({ selectedFeatures: [edscId] })

      this.setConstraint(children[0])
    }

    layersToSelect.forEach((layer) => this.setConstraint(layer))

    const fileHash = forge.md.md5.create()
    fileHash.update(JSON.stringify(response))
    this.fileHash = fileHash.digest().toHex()
  }

  // Fired when a shapefile layer, or selected shape layer is clicked
  clickLayer(event) {
    if (this.isProjectPage) return

    const { onUpdateShapefile } = this.props

    let { layer } = event
    if (!layer) {
      layer = event.target
    }
    const { feature } = layer
    const { edscId: layerId } = feature

    const layerIndex = this.selectedLayers.indexOf(layerId)
    // If the layerId is currently a selectedLayer
    if (layerIndex > -1) {
      // Remove the layerId from this.selectedLayers
      this.selectedLayers.splice(layerIndex, 1)

      // Remove the drawing from the map (also removes the spatial search)
      const { map } = this
      map.fire('draw:deleted', { isShapefile: true, layerId })
    } else {
      // Add the layerId to this.selectedLayers
      this.selectedLayers.push(layerId)

      // Add the new constraint to the map
      this.setConstraint(layer)
    }

    // Update selectedFeatures in the store
    onUpdateShapefile({ selectedFeatures: this.selectedLayers })
  }

  setConstraint(sourceLayer) {
    const { feature = {} } = sourceLayer
    const { geometry = {}, properties = {} } = feature
    const { type = '' } = geometry
    const { radius } = properties

    let layer
    let layerType

    if (type === 'LineString') {
      // Line
      const latlngs = sourceLayer.getLatLngs()

      layer = new L.Polyline(latlngs, this.options.selection)
      layerType = 'line'
    } else if (sourceLayer.getLatLngs != null) {
      // Polygon
      const originalLatLngs = sourceLayer.getLatLngs()
      const latlngs = this.simplifyPoints(originalLatLngs)

      if ((originalLatLngs[0].length > MAX_POLYGON_SIZE)
        && (latlngs.length !== originalLatLngs.length)) {
        this.onToggleTooManyPointsModal(true)
      }

      layer = L.polygon(latlngs, this.options.selection)
      layerType = 'polygon'
    } else if (type === 'Point' && radius) {
      // Circle
      layer = new L.Circle(sourceLayer.getLatLng(), {
        radius,
        ...this.options.selection
      })
      layerType = 'circle'
    } else if (sourceLayer.getLatLng != null) {
      // Point
      layer = L.marker(sourceLayer.getLatLng())
      layerType = 'marker'
    }

    if (layer != null) {
      layer.feature = feature
      if (!this.isProjectPage) layer.on('click', this.clickLayer)

      const { map } = this
      map.fire('draw:drawstart', { layerType: 'shapefile' })
      map.fire('draw:created', {
        isShapefile: true,
        target: map,
        layer,
        layerType
      })
      map.fire('draw:drawstop')
    }
  }

  simplifyPoints(latlngs) {
    let result
    let newLatLngs = latlngs
    if (!L.LineUtil.isFlat(newLatLngs)) { [newLatLngs] = newLatLngs }

    // Remove redundancies
    result = []
    let prev = newLatLngs[newLatLngs.length - 1]
    newLatLngs.forEach((latlng) => {
      if (!isEqual(latlng, prev)) { result.push(latlng) }
      prev = latlng
    })

    newLatLngs = result

    if (newLatLngs.length > MAX_POLYGON_SIZE) {
      const points = ((() => {
        const result1 = []
        newLatLngs.forEach((latlng) => result1.push({ x: latlng.lng, y: latlng.lat }))

        return result1
      })())

      let tolerance = 0
      result = points
      while (result.length > MAX_POLYGON_SIZE) {
        result = L.LineUtil.simplify(points, tolerance += 0.01)
      }

      newLatLngs = (result.map((point) => ({ lat: point.y, lng: point.x })))
    }

    // Remove redundancies
    result = []
    prev = newLatLngs[newLatLngs.length - 1]
    newLatLngs.forEach((latlng) => {
      if (!isEqual(latlng, prev)) { result.push(latlng) }
      prev = latlng
    })

    return result
  }
}

class ShapefileLayer extends MapLayer {
  createLeafletElement(props) {
    return new ShapefileLayerExtended(props)
  }

  updateLeafletElement(fromProps, toProps) {
    const element = this.leafletElement

    const {
      isProjectPage: toIsProjectPage,
      leaflet: toLeaflet,
      shapefile: toShapefile
    } = toProps

    const { map } = toLeaflet

    element.map = map
    element.isProjectPage = toIsProjectPage

    const {
      file: toFile,
      shapefileId: toShapefileId,
      shapefileName,
      selectedFeatures
    } = toShapefile

    if (toFile) {
      element.drawNewShapefile(toFile, selectedFeatures)
    }

    if (!toShapefileId && !shapefileName) {
      element.onRemovedFile()
    }
  }
}

export default withLeaflet(ShapefileLayer)
