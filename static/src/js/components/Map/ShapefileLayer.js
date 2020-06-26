import L from 'leaflet'
import {
  withLeaflet,
  MapLayer
} from 'react-leaflet'

import { eventEmitter } from '../../events/events'
import { colorOptions } from '../SpatialSelection/SpatialSelection'

import './ShapefileLayer.scss'

const MAX_POLYGON_SIZE = 50

const defaultOptions = {
  selection: L.Draw.Polygon.prototype.options.shapeOptions
}

class ShapefileLayerExtended extends L.Layer {
  initialize(props) {
    this.onRemovedFile = this.onRemovedFile.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickLayer = this.clickLayer.bind(this)
    this.authToken = props.authToken
    this.onMetricsMap = props.onMetricsMap
    this.onToggleTooManyPointsModal = props.onToggleTooManyPointsModal

    this.options = {
      selection: L.extend({}, defaultOptions.selection, colorOptions)
    }

    eventEmitter.on('shapefile.success', (file, resp) => {
      this.onSuccess(file, resp)
    })

    eventEmitter.on('shapefile.removedfile', () => {
      this.onRemovedFile()
    })
  }

  onAdd(map) {
    this.map = map
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

    features.forEach((feature, featureIndex) => {
      const { geometry } = feature
      const { type } = geometry

      // KML type file
      if (type === 'GeometryCollection') {
        const { geometries } = geometry

        geometries.forEach((nestedGeometry, index) => {
          if (nestedGeometry.type === 'MultiPolygon') {
            // If we see a MultiPolygon, separate into Polygons
            nestedGeometry.coordinates.forEach((polygon) => {
              const newPolygon = { type: 'Polygon', coordinates: polygon }
              geometries.push(newPolygon)
            })

            // remove the MultiPolygon from the list of geometries
            geometries.splice(index, 1)
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
  }

  onSuccess(file, response) {
    // look through response and separate all MultiPolygon types into their own polygon
    this.separateMultiPolygons(response)

    const newIcon = new L.Icon.Default()
    newIcon.options.className = 'geojson-icon'
    // eslint-disable-next-line new-cap
    const jsonLayer = new L.geoJson(response, {
      className: 'geojson-svg',
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
      }
    })

    jsonLayer.on('click', this.clickLayer)
    this.jsonLayer = jsonLayer
    this.jsonLayer.addTo(this.map)
    this.map.flyToBounds(jsonLayer.getBounds())
    this.onMetricsMap('Added Shapefile')

    const children = jsonLayer.getLayers()

    if (children.length === 1) {
      this.setConstraint(children[0])
    }
  }

  clickLayer(e) {
    this.setConstraint(e.layer)
  }

  setConstraint(sourceLayer) {
    const { feature = {} } = sourceLayer
    const { geometry = {} } = feature
    const { type = '' } = geometry

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
    } else if (sourceLayer.getLatLng != null) {
      // Point
      layer = L.marker(sourceLayer.getLatLng())
      layerType = 'marker'
    }

    if (layer != null) {
      const { map } = this
      map.fire('draw:drawstart', { layerType: 'shapefile' })
      map.fire('draw:created', {
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

    if (newLatLngs.length > MAX_POLYGON_SIZE) {
      const { map } = this
      const points = ((() => {
        const result1 = []
        newLatLngs.forEach((latlng) => {
          result1.push(map.latLngToLayerPoint(latlng))
        })

        return result1
      })())
      let tolerance = 1
      result = points
      while (result.length > MAX_POLYGON_SIZE) {
        result = L.LineUtil.simplify(points, tolerance += 1)
      }

      newLatLngs = (result.map(point => map.layerPointToLatLng(point)))
    }

    // Remove redundancies
    result = []
    let prev = newLatLngs[newLatLngs.length - 1]
    newLatLngs.forEach((latlng) => {
      if (!latlng.equals(prev)) { result.push(latlng) }
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

    const { shapefile } = toProps
    const { shapefileId, shapefileName } = shapefile
    if (!shapefileId && !shapefileName) {
      element.onRemovedFile()
    }
  }
}

export default withLeaflet(ShapefileLayer)
