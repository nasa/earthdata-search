import L from 'leaflet'
import {
  withLeaflet,
  MapLayer
} from 'react-leaflet'
import Dropzone from 'dropzone'
import $ from 'jquery'

import 'dropzone/dist/dropzone.css'
import './ShapefileLayer.scss'

const MAX_POLYGON_SIZE = 50

Dropzone.autoDiscover = false

const dropzoneOptions = {
  // Official Ogre web service
  // We likely want to use this, once they fix OPTIONS requests
  // See: https://github.com/wavded/ogre/pull/22
  url: 'http://ogre.adc4gis.com/convert',
  headers: {
    'Cache-Control': undefined
  },

  // Test fallback behavior
  // forceFallback: true

  // Common options
  paramName: 'upload',
  // TODO reenable the clickable link from the modal
  // clickable: '.geojson-dropzone-link',
  createImageThumbnails: false,
  acceptedFiles: '.zip,.kml,.kmz,.json,.geojson,.rss,.georss,.xml',
  fallback() { // If the browser can't support the necessary features
    return $('.select-shapefile').parent().hide()
  },
  parallelUploads: 1,
  uploadMultiple: false,
  previewTemplate: '<div>' // remove the dropzone preview
}

const defaultOptions = {
  selection: L.Draw.Polygon.prototype.options.shapeOptions
}

class ShapefileLayerExtended extends L.Layer {
  initialize(props) {
    this.removeFile = this.removeFile.bind(this)
    this.onSuccess = this.onSuccess.bind(this)
    this.clickLayer = this.clickLayer.bind(this)

    this.onSaveShapefile = props.onSaveShapefile
    this.authToken = props.authToken

    this.options = {
      selection: L.extend({}, defaultOptions.selection)
    }
  }

  onAdd(map) {
    this.map = map
    const container = map.getContainer()
    const dropzone = new Dropzone(container, dropzoneOptions)
    dropzone.on('success', this.onSuccess)
    dropzone.on('removedfile', this.removeFile)
    dropzone.on('error', this.displayError)
    this.dropzone = dropzone
    L.DomUtil.addClass(container, 'dropzone')
    this.isAdded = true
  }

  onRemove() {
    this.remove()
    this.map = null
    this.jsonLayer = null
    this.isAdded = false
  }

  activate(showHelp = true) {
    this.isActive = true
    this.show()
    if (showHelp) { this.showHelp() }
  }

  deactivate() {
    this.isActive = false
    this.hide()
    this.hideHelp()
  }

  showHelp() {
    L.DomUtil.addClass(this.map.getContainer(), 'is-geojson-help-visible')
  }

  hideHelp() {
    L.DomUtil.removeClass(this.map.getContainer(), 'is-geojson-help-visible')
  }

  hide() {
    $('.dz-preview').hide()
    if ((this.jsonLayer != null) && this.isAdded) {
      this.map.removeLayer(this.jsonLayer)
    }

    this.isAdded = false
  }

  show() {
    $('.dz-preview').show()
    if ((this.jsonLayer != null) && !this.isAdded) {
      this.map.addLayer(this.jsonLayer)
    }

    if (this.jsonLayer != null) {
      this.isAdded = true
    }
  }

  remove() {
    if (this.file != null) {
      this.dropzone.removeFile(this.file)
    }
  }

  removeFile() {
    this.dropzone.removeAllFiles(true)
    if (this.jsonLayer != null) { this.map.removeLayer(this.jsonLayer) }
    this.map.fire('shapefile:stop')
    this.file = null
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
    const { name, size } = file
    const fileSize = this.dropzone.filesize(size)
      .replace('<strong>', '')
      .replace('</strong>', '')

    // send response to saveShapefile to be saved in the database
    this.onSaveShapefile({
      auth_token: this.authToken,
      file: response,
      filename: name,
      size: fileSize
    })

    if (!this.isActive) { this.activate(false) }
    this.hideHelp()
    this.remove()

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

    this.file = file
    this.jsonLayer = jsonLayer

    this.map.addLayer(jsonLayer)
    this.map.fire('shapefile:start')
    this.map.fitBounds(jsonLayer.getBounds())

    const children = jsonLayer.getLayers()

    // const tourSteps = []
    if (children.length > 1) {
      // let el
      // const middleChild = children[Math.floor(children.length / 2)]
      // el = middleChild.container != null ? middleChild.container : middleChild.icon
    } if (children.length === 1) {
      this.setConstraint(children[0])
    }
  }

  displayError(file) {
    if (file.name.match('.*shp')) {
      const errorMessage = 'To use an ESRI Shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
      const errorDiv = document.createElement('div')
      errorDiv.appendChild(document.createTextNode(errorMessage))
      errorDiv.className += 'edsc-dz-error'
      const { previewElement } = file
      previewElement.getElementsByClassName('dz-details')[0].appendChild(errorDiv)
      previewElement.removeChild(previewElement.querySelector('.dz-error-message'))
    }
  }

  clickLayer(e) {
    this.setConstraint(e.layer)
  }

  setConstraint(sourceLayer) {
    let layer; let
      layerType
    if (sourceLayer.getLatLngs != null) {
      // Polygon
      const originalLatLngs = sourceLayer.getLatLngs()
      const latlngs = this.simplifyPoints(originalLatLngs)

      if ((originalLatLngs[0].length > MAX_POLYGON_SIZE)
        && (latlngs.length !== originalLatLngs.length)) {
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

      console.log(`size ${newLatLngs.length} => ${result.length}`)

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
      element.removeFile()
    }
  }
}

export default withLeaflet(ShapefileLayer)
