import L from 'leaflet'
import {
  withLeaflet,
  MapLayer
} from 'react-leaflet'

import { eventEmitter } from '../../events/events'

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

    this.options = {
      selection: L.extend({}, defaultOptions.selection)
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
    this.isAdded = true
  }

  onRemove() {
    this.map = null
    this.jsonLayer = null
    this.isAdded = false
  }

  onRemovedFile() {
    if (this.jsonLayer != null) { this.map.removeLayer(this.jsonLayer) }
  }

  show() {
    if ((this.jsonLayer != null) && !this.isAdded) {
      this.map.addLayer(this.jsonLayer)
    }

    if (this.jsonLayer != null) {
      this.isAdded = true
    }
  }

  activate() {
    this.isActive = true
    this.show()
  }

  deactivate() {
    this.isActive = false
    this.hide()
  }

  // Leaflet 1.0+ changed the way that MultiPolygons are handled.
  // Instead of creating a new layer for each polgon in a MultiPolygon
  // feature (v0.7) it creates a single layer with multiple polygons.
  // This means when you hover over one island in Hawaii it highlights
  // all the islands, and passes all the polygons to _setConstraint.
  // This method takes all the MultiPolygon geometries and separates them
  // into individual polygons, to mimick the 0.7 functionality.
  separateMultiPolygons(geojson) {
    let index
    const featureIndexesToRemove = []
    for (let featureIndex = 0; featureIndex < geojson.features.length; featureIndex += 1) {
      let geometry
      const feature = geojson.features[featureIndex]
      const { type } = feature.geometry

      // KML type file
      if (type === 'GeometryCollection') {
        const { geometries } = feature.geometry

        for (index = 0; index < geometries.length; index += 1) {
          geometry = geometries[index]
          if (geometry.type === 'MultiPolygon') {
            // If we see a MultiPolygon, separate into Polygons
            geometry.coordinates.forEach((polygon) => {
              const newPolygon = { type: 'Polygon', coordinates: polygon }
              geometries.push(newPolygon)
            })

            // remove the MultiPolygon from the list of geometries
            geometries.splice(index, 1)
          }
        }
      }

      // geojson type file
      if (type === 'MultiPolygon') {
        featureIndexesToRemove.push(featureIndex)
        feature.geometry.coordinates.forEach((coordinate) => {
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
    }

    // remove MultiPolygon features from geojson files
    return (() => {
      const result = []
      featureIndexesToRemove.reverse().forEach((index) => {
        result.push(geojson.features.splice(index, 1))
      })

      return result
    })()
  }

  onSuccess(file, response) {
    if (!this.isActive) { this.activate() }

    // look through response and separate all MultiPolygon types into their own polygon
    this.separateMultiPolygons(response)

    const icon = new L.Icon.Default()
    icon.options.className = 'geojson-icon'
    // eslint-disable-next-line new-cap
    const jsonLayer = new L.geoJson(response, {
      className: 'geojson-svg',
      onEachFeature(feature, featureLayer) {
        const addIconClasses = function nameHere(layer) {
          if ((layer.options != null ? layer.options.icon : undefined) != null) {
            // eslint-disable-next-line no-param-reassign
            if (layer.options != null) layer.options.icon = icon
          }
        }

        addIconClasses(featureLayer)
        if (featureLayer.getLayers != null) {
          (() => {
            const result = []
            featureLayer.getLayers().forEach((layer) => {
              result.push(addIconClasses(layer))
            })

            return result
          })()
        }
      }
    })

    jsonLayer.on('click', this.clickLayer)
    this.jsonLayer = jsonLayer
    this.map.addLayer(jsonLayer)
    this.map.fitBounds(jsonLayer.getBounds())

    const children = jsonLayer.getLayers()

    if (children.length === 1) {
      this.setConstraint(children[0])
    }
  }

  clickLayer(e) {
    this.setConstraint(e.layer)
  }

  setConstraint(sourceLayer) {
    let layer
    let layerType

    if (sourceLayer.getLatLngs != null) {
      // Polygon
      const originalLatLngs = sourceLayer.getLatLngs()
      const latlngs = this.simplifyPoints(originalLatLngs)

      if ((originalLatLngs[0].length > MAX_POLYGON_SIZE)
        && (latlngs.length !== originalLatLngs.length)) {
        // TODO: Add notification about shapefile reduction @critical
        // help.add('shapefile_reduction', { element: '.leaflet-draw-edit-edit' })
      }

      layer = L.sphericalPolygon(latlngs, this.options.selection)
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
