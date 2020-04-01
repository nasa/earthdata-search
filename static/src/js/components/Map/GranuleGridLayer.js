/* eslint-disable no-underscore-dangle */

import L from 'leaflet'
import { capitalize, difference, isEqual } from 'lodash'
import $ from 'jquery'

import {
  withLeaflet,
  MapLayer
} from 'react-leaflet'

import {
  addPath,
  isClockwise,
  getlprojection
} from '../../util/map/granules'
import buildLayer, {
  isCartesian,
  getPolygons,
  getLines,
  getPoints,
  getRectangles
} from '../../util/map/layers'
import { panBoundsToCenter } from '../../util/map/actions/panBoundsToCenter'
import { dividePolygon } from '../../util/map/geo'
import projectPath from '../../util/map/interpolation'
import { getColorByIndex } from '../../util/colors'

import { eventEmitter } from '../../events/events'
import { getTemporal } from '../../util/edscDate'

import './GranuleGridLayer.scss'
import projections from '../../util/map/projections'
import { tagName } from '../../../../../sharedUtils/tags'

const config = {
  // debug: true,
  // eslint-disable-next-line max-len
  gibsUrl: 'https://gibs.earthdata.nasa.gov/wmts/{lprojection}/best/{product}/default/{time}/{resolution}/{z}/{y}/{x}.{format}',
  // eslint-disable-next-line max-len
  gibsGranuleUrl: 'http://uat.gibs.earthdata.nasa.gov/wmts/{projection}/std/{product}/default/{time}/{resolution}/{z}/{y}/{x}.{format}'
}

const MAX_RETRIES = 1 // Maximum number of times to attempt to reload an image

class GranuleGridLayerExtended extends L.GridLayer {
  initialize(props) {
    const {
      collectionId,
      metadata,
      granules,
      color,
      focusedGranule,
      projection,
      onChangeFocusedGranule,
      onExcludeGranule,
      onMetricsMap
    } = props

    this.collectionId = collectionId
    this.projection = projection
    this.onChangeFocusedGranule = onChangeFocusedGranule
    this.onExcludeGranule = onExcludeGranule
    this.onMetricsMap = onMetricsMap

    this.setResults({
      collectionId,
      metadata,
      granules,
      color,
      defaultGranules: granules,
      focusedGranule
    })

    eventEmitter.on('map.mousemove', e => this._onEdscMousemove(e))
    eventEmitter.on('map.mouseout', e => this._onEdscMouseout(e))
    eventEmitter.on('map.click', e => this._onClick(e))
    eventEmitter.on('map.focusgranule', granule => this._onEdscFocusgranule(granule))
    eventEmitter.on('map.stickygranule', granule => this._onEdscStickygranule(granule))
    eventEmitter.on('map.excludestickygranule', granuleId => this._onExcludeGranule(granuleId))

    this.originalOptions = { tileSize: 512 }
    return super.initialize(this.originalOptions)
  }

  // Overwrite the leaflet onAdd function
  onAdd(map) {
    this._map = map
    super.onAdd()

    this._container.setAttribute('id', `granule-vis-${this.collectionId}`)
    this._handle(this._map, 'on', 'edsc.focuscollection')
    this.setFocus(this.collectionId)
  }

  // Overwrite the leaflet onRemove function
  onRemove(map) {
    super.onRemove(map)
    eventEmitter.off('edsc.mousemove', e => this._onEdscMousemove(e))
    eventEmitter.off('edsc.mouseout', e => this._onEdscMouseout(e))
    eventEmitter.off('edsc.click', e => this._onClick(e))
    eventEmitter.off('edsc.focusgranule', granule => this._onEdscFocusgranule(granule))
    eventEmitter.off('edsc.stickygranule', granule => this._onEdscStickygranule(granule))
    eventEmitter.off('edsc.excludestickygranule', granuleId => this._onExcludeGranule(granuleId))

    this.granules = null
  }

  // Overwrite the leaflet createTile function
  createTile(tilePoint) {
    const tile = this.newTile()

    // # force the map _zoom to the new value before we calculate
    // # where things need to be drawn
    // # This was to fix the granules being drawn incorrectly after a zoom, but
    // # it isn't needed if we turn zoomAnimation off for the map
    // @_map._zoom = tilePoint.z
    this.drawTile(tile, this.getBackTile(tilePoint), tilePoint)

    return tile
  }

  // Create a new canvas tile
  newTile() {
    const tile = L.DomUtil.create('canvas', 'leaflet-tile')

    const size = this.getTileSize()
    tile.width = size.x
    tile.height = size.y

    tile.onmousemove = L.Util.falseFn
    tile.onselectstart = L.Util.falseFn
    return tile
  }

  getBackTile(tilePoint) {
    const key = `${tilePoint.x}:${tilePoint.y}`
    if (this._backTiles == null) { this._backTiles = {} }
    if (this._backTiles[key] == null) { this._backTiles[key] = this.newTile() }
    return this._backTiles[key]
  }

  matches(granule, matcher) {
    const operators = ['>=', '<=']
    Object.keys(matcher || {}).forEach((prop) => {
      let value = matcher[prop]
      const granuleValue = granule[prop].split('T')[0]
      if (value && !granuleValue) { return false }
      let op = null
      operators.forEach((operator) => {
        if (value.indexOf(operator) === 0) {
          op = operator
          value = value.substring(operator.length)
          return true
        }
        return true
      })

      if ((op === '>=') && (granuleValue < value)) { return false }
      if ((op === '<=') && (granuleValue > value)) { return false }
      if (!op && (value !== granuleValue)) { return false }
      return true
    })
    return true
  }

  getTileUrl(tilePoint, granule) {
    if (!this.multiOptions) { return null }
    const date = granule.time_start != null ? granule.time_start.substring(0, 10) : undefined

    let matched = false
    this.multiOptions.forEach((optionSet) => {
      const newOptionSet = optionSet
      if (this.matches(granule, newOptionSet.match)) {
        let newResolution

        const oldResolution = newOptionSet.resolution

        // Set resolution to {projection}_resolution if it exists and if the layer exists within newOptionSet
        if ((this.projection === projections.geographic) && newOptionSet.geographic) {
          matched = true
          newResolution = newOptionSet.geographic_resolution
        } else if ((this.projection === projections.arctic) && newOptionSet.arctic) {
          matched = true
          newResolution = newOptionSet.arctic_resolution
        } else if ((this.projection === projections.antarctic) && newOptionSet.antarctic) {
          matched = true
          newResolution = newOptionSet.antarctic_resolution
        }

        // Use default resolution unless newResolution exists
        if (newResolution == null) { newResolution = oldResolution }
        newOptionSet.resolution = newResolution

        this.options = L.extend({}, this.originalOptions, newOptionSet)
      }
    })

    if (!matched) { return false }

    this.options.time = date
    if (this.options.granule) {
      this._originalUrl = this._originalUrl || this._url
      this._url = config.gibsGranuleUrl || this._originalUrl
      this.options.time = granule.time_start.replace(/\.\d{3}Z$/, 'Z')
    } else {
      this._url = this._originalUrl || this._url || config.gibsUrl
    }

    const data = {
      lprojection: getlprojection(this.options),
      x: tilePoint.x,
      y: tilePoint.y,
      z: tilePoint.z,
      time: this.options.time
    }
    if (this._map && !this._map.options.crs.infinite) {
      const invertedY = this._globalTileRange.max.y - (tilePoint.y)
      if (this.options.tms) {
        data.y = invertedY
      }
      data['-y'] = invertedY
    }
    return L.Util.template(this._url, L.Util.extend(data, this.options))
  }

  // Draw the granule tile
  drawTile(canvas, back, tilePoint) {
    let reverse
    if ((this.granules == null) || (this.granules.length <= 0)) { return }

    const tileSize = this.getTileSize()

    const layerPointToLatLng = this._map.layerPointToLatLng.bind(this._map)
    const nwPoint = this._getTilePos(tilePoint)

    const nePoint = nwPoint.add([tileSize.x, 0])
    const sePoint = nwPoint.add([tileSize.x, tileSize.y])
    const swPoint = nwPoint.add([0, tileSize.y])

    const boundary = { poly: [nwPoint, nePoint, sePoint, swPoint] }
    if (!isClockwise(boundary.poly)) { boundary.poly.reverse() }

    let bounds = new L.LatLngBounds(boundary.poly.map(layerPointToLatLng))
    bounds = bounds.pad(0.1)

    let paths = []
    const pathsWithHoles = []

    this.granules.forEach((granule, index) => {
      const overlaps = this.granulePathsOverlappingTile(granule, bounds)
      if (overlaps.length > 0) {
        const url = this.getTileUrl(tilePoint, granule)
        for (let j = 0; j < overlaps.length; j += 1) {
          const path = overlaps[j]
          path.index = index
          path.url = url
          path.granule = granule
          if (path.poly != null) {
            reverse = (j === 0) === isClockwise(path.poly)
            if (reverse) { path.poly.reverse() }
          }
        }
        pathsWithHoles.push(overlaps)
        paths = paths.concat(overlaps)
      }
    })

    setTimeout((
      () => this.drawOutlines(canvas, paths, nwPoint)
    ), 0)
    setTimeout((
      () => this.drawClippedPaths(canvas, boundary, pathsWithHoles, nwPoint)
    ), 0)
    setTimeout((
      () => this.drawClippedImagery(canvas, boundary, paths, nwPoint, tilePoint)
    ), 0)
    setTimeout((
      () => this.drawFullBackTile(back, boundary, pathsWithHoles.concat().reverse(), nwPoint)
    ), 0)

    if ((paths.length > 0) && config.debug) {
      console.log(`${paths.length} Overlapping Granules [(${bounds.getNorth()}, ${bounds.getWest()}), (${bounds.getSouth()}, ${bounds.getEast()})]`)
    }
  }

  // Draws an outline of the granule paths
  drawOutlines(canvas, paths, nwPoint) {
    const ctx = canvas.getContext('2d')
    ctx.save()
    ctx.translate(-nwPoint.x, -nwPoint.y)

    // Faint stroke of whole path
    ctx.strokeStyle = 'rgba(128, 128, 128, .2)'
    paths.forEach((path) => {
      ctx.beginPath()
      addPath(ctx, path)
      ctx.stroke()
    })
    ctx.restore()
    return null
  }

  // Draws the granule paths
  drawClippedPaths(canvas, boundary, pathsWithHoles, nwPoint) {
    const ctx = canvas.getContext('2d')
    ctx.save()
    ctx.translate(-nwPoint.x, -nwPoint.y)
    ctx.strokeStyle = this.color

    pathsWithHoles.forEach((pathWithHoles) => {
      const [path, ...holes] = Array.from(pathWithHoles)

      ctx.beginPath()
      addPath(ctx, path)

      holes.forEach((hole) => {
        addPath(ctx, { poly: hole.poly.concat().reverse() })
      })

      ctx.stroke()
      addPath(ctx, boundary)

      if (!(path.line != null ? path.line.length : undefined) > 0) { ctx.clip() }
    })
    ctx.restore()
    return null
  }

  loadImage(url, callback, retries = 0) {
    if (url != null) {
      const image = new Image()
      image.onload = function onload() {
        callback(this)
        return document.body.removeChild(image)
      }

      image.onerror = () => {
        if (retries < MAX_RETRIES) {
          return this.loadImage(url, callback, retries + 1)
        }
        console.error(`Failed to load tile after ${MAX_RETRIES} tries: ${url}`)
        return callback(null)
      }

      // IE seems to like to get smart and occasionally not load images when they're
      // not in the DOM
      image.setAttribute('style', 'display: none;')
      document.body.appendChild(image)
      image.src = url
      return url
    }
    return callback(null)
  }

  drawClippedImage(ctx, boundary, paths, nwPoint, image, size) {
    if (image != null) {
      ctx.save()
      ctx.beginPath()
      paths.forEach(path => addPath(ctx, path))
      ctx.clip()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.drawImage(image, nwPoint.x, nwPoint.y, size, size)
      ctx.restore()
    }

    paths.forEach((path) => {
      ctx.beginPath()
      addPath(ctx, path)
      addPath(ctx, boundary)
      ctx.clip()
    })
    return null
  }

  // Draws the gibs imagery for the granule
  drawClippedImagery(canvas, boundary, paths, nwPoint) {
    const ctx = canvas.getContext('2d')
    ctx.save()
    ctx.translate(-nwPoint.x, -nwPoint.y)

    let url = null
    let currentPaths = []
    const pathsByUrl = []

    paths.forEach((path) => {
      if (path.url !== url) {
        // Draw everything in current
        if (currentPaths.length > 0) {
          pathsByUrl.push({ url, urlPaths: currentPaths })
        }
        ({ url } = path)
        currentPaths = [path]
      } else {
        currentPaths.push(path)
      }
    })

    if (currentPaths.length > 0) {
      pathsByUrl.push({ url, urlPaths: currentPaths })
    }

    const queue = []
    let index = 0

    const size = canvas.width
    const self = this
    for (let i = 0; i < pathsByUrl.length; i += 1) {
      const {
        url,
        urlPaths
      } = pathsByUrl[i]

      // eslint-disable-next-line no-loop-func
      self.loadImage(url, (image) => {
        queue[i] = () => this.drawClippedImage(ctx, boundary, urlPaths, nwPoint, image, size)

        while (queue[index] != null) {
          queue[index]()
          queue[index] = null // Allow GC of image data
          index += 1
        }
        if (index === pathsByUrl.length) {
          return ctx.restore()
        }
        return null
      })
    }
    return null
  }

  drawFullBackTile(canvas, boundary, pathsWithHoles, nwPoint) {
    const ctx = canvas.getContext('2d')

    ctx.save()
    ctx.translate(-nwPoint.x, -nwPoint.y)
    pathsWithHoles.forEach((pathWithHoles) => {
      const [path, ...holes] = Array.from(pathWithHoles)

      ctx.fillStyle = `#${(path.index + 0x1000000).toString(16).substr(-6)}`
      ctx.strokeStyle = ctx.fillStyle
      ctx.beginPath()
      addPath(ctx, path)

      holes.forEach(hole => addPath(ctx, hole))

      if (path.line != null) {
        ctx.lineWidth = 4
        ctx.stroke()
      } else {
        ctx.fill()
      }
    })
    ctx.restore()
    return null
  }

  addIntersections(result, paths, bounds, type, interpolation) {
    if (paths == null) { return null }

    paths.forEach((path) => {
      const shapeBounds = L.latLngBounds(path)
      if (shapeBounds.intersects(bounds)) {
        const intersection = {}
        intersection[type] = projectPath(this._map, path, interpolation, 2, 5)
        result.push(intersection)
      }
    })
    return null
  }

  // Determine what granule paths fit into a given tileBounds
  granulePathsOverlappingTile(granule, tileBounds) {
    const result = []

    const interpolation = isCartesian(granule) ? 'cartesian' : 'geodetic'

    Array.from(getPolygons(granule)).some((polygon) => {
      if (interpolation === 'cartesian') {
        this.addIntersections(result, polygon, tileBounds, 'poly', interpolation)
      } else {
        // Handle holes
        Array.from(polygon).forEach((shape) => {
          const { interiors } = dividePolygon(shape)
          this.addIntersections(result, interiors, tileBounds, 'poly', interpolation)
        })
      }
      // Workaround for EDSC-657
      // Avoid spamming the map with a large number of barely intersecting orbits by only
      // drawing the first orbit. Hovering will continue to draw the full orbit.
      return granule.orbit
    })

    this.addIntersections(result, getRectangles(granule), tileBounds, 'poly', 'cartesian')
    this.addIntersections(result, getLines(granule), tileBounds, 'line', interpolation)

    Array.from(getPoints(granule)).forEach((point) => {
      if (tileBounds.contains(point)) {
        result.push({ point: this._map.latLngToLayerPoint(point) })
      }
    })

    return result
  }

  // Is there are granule at a give point?
  granuleAt(point) {
    const origin = this._map.getPixelOrigin()
    const tileSize = this.getTileSize()
    const tilePoint = point.add(origin).divideBy(tileSize.x).floor()
    const canvas = this.getBackTile(tilePoint)
    const bounds = this._tileCoordsToBounds(tilePoint)

    const tilePixel = point.subtract(this._map.latLngToLayerPoint(bounds.getNorthWest()))

    let result = null
    const ctx = canvas.getContext('2d')
    const { data } = ctx.getImageData(tilePixel.x, tilePixel.y, 1, 1)
    if (data[3] === 255) {
      // eslint-disable-next-line no-bitwise
      const index = (data[0] << 16) + (data[1] << 8) + data[2]
      result = this.granules != null ? this.granules[index] : undefined
    }

    return result
  }

  // Set the granule results that need to be drawna
  setResults(props) {
    const {
      collectionId,
      metadata,
      granules,
      color,
      defaultGranules,
      focusedGranule
    } = props

    this.granules = granules
    if (defaultGranules) {
      this.defaultGranules = defaultGranules

      if (focusedGranule === '') {
        this._onEdscStickygranule({ granule: null })
      } else {
        const [granule] = defaultGranules.filter(g => g.id === focusedGranule)
        this._onEdscStickygranule({ granule })
      }
    }

    if (color) this.color = color

    if (metadata) {
      // Set multiOptions (gibs data)
      const { tags = {} } = metadata
      const gibsTag = tags[tagName('gibs')] || {}
      const { data } = gibsTag

      this.multiOptions = data
    }

    if (collectionId && this._container) {
      this._container.setAttribute('id', `granule-vis-${collectionId}`)
      this.setFocus(collectionId)
    }

    return this.redraw()
  }

  _reorderedResults(results, defaultResults) {
    if (this._stickied && this._stickied !== null) {
      const newResults = results.concat()
      const index = newResults.indexOf(this._stickied)
      if (index === -1) {
        this._stickied = null
        this.stickyId = null
        if (this._granuleStickyLayer != null) {
          this._granuleStickyLayer.onRemove(this._map)
        }
        this._granuleStickyLayer = null
      } else {
        newResults.splice(index, 1)
        newResults.unshift(this._stickied)
      }
      return newResults
    }
    return defaultResults
  }

  loadResults(results) {
    const granules = this._reorderedResults(
      results,
      Object.values(this.defaultGranules)
    )

    return this.setResults({
      granules
    })
  }

  setFocus(focus, map = this._map) {
    if (this._isFocused === focus) { return }
    this._isFocused = focus
    const events = ['edsc.mousemove', 'edsc.mouseout', 'click', 'edsc.focusgranule', 'edsc.stickygranule']
    if (focus) {
      this._handle(map, 'on', ...Array.from(events))
    }
    this._handle(map, 'off', ...Array.from(events))
    if (this._granuleFocusLayer != null) {
      this._granuleFocusLayer.onRemove(map)
    }
    this._granuleFocusLayer = null
    if (this._granuleStickyLayer != null) {
      this._granuleStickyLayer.onRemove(map)
    }
    this._granuleStickyLayer = null
  }

  _handle(obj, onOrOff, ...events) {
    return (() => {
      const result = []
      events.forEach((event) => {
        const method = `_on${event.split('.').map(str => capitalize(str)).join('')}`
        result.push(obj[onOrOff](event, this[method]))
      })
      return result
    })()
  }

  _onEdscFocuscollection(e) {
    if (this._map) {
      this.setFocus(
        (e.collection != null ? e.collection.id : undefined) === this.collectionId
      )
    }
  }

  _onEdscMouseout() {
    if (this._map) {
      if (this._granule != null) {
        eventEmitter.emit('map.focusgranule', { granule: null })
      }
    }
  }

  _onEdscMousemove(e) {
    if (this._map) {
      const granule = this.granuleAt(e.layerPoint)
      if (this._granule !== granule) {
        eventEmitter.emit('map.focusgranule', { granule })
      }
    }
  }

  _onClick(e) {
    if (this._map) {
      const tag = $(e.originalEvent.target).closest('a, button')

      if (tag.hasClass('panel-list-remove')) {
        const granuleId = tag.data('granuleId')
        eventEmitter.emit('map.excludestickygranule', granuleId)
        return
      }

      // If the element that triggered the event is an `a` or `button` and is also inside
      // the leaflet map, prevent the clearing of the focused granule.
      if (tag.length !== 0 && tag.parents('.map.leaflet-container').length > 0) return

      let granule = this.granuleAt(e.layerPoint)

      if (this._stickied === granule) granule = null

      eventEmitter.emit('map.focusgranule', { granule })
      eventEmitter.emit('map.stickygranule', { granule })
    }
  }

  _onEdscFocusgranule(e) {
    if (this._map) {
      const { granule } = e
      this._granule = granule

      if (this._granuleFocusLayer != null) {
        this._granuleFocusLayer.onRemove(this._map)
      }
      this._granuleFocusLayer = this._focusLayer(granule, false)
      if (this._granuleFocusLayer != null) this._granuleFocusLayer.onAdd(this._map)
    }
  }

  _onEdscStickygranule(e) {
    if (this._map) {
      const { granule } = e

      if (this._stickied === granule) { return }

      this._stickied = granule
      this.stickyId = granule != null ? granule.id : undefined // Ugly hack for testing

      let focusedGranuleId = ''
      if (granule != null) focusedGranuleId = granule.id
      this.onChangeFocusedGranule(focusedGranuleId)

      if (this._granuleStickyLayer != null) {
        this._granuleStickyLayer.onRemove(this._map)
      }
      this._granuleStickyLayer = this._stickyLayer(granule, true)
      if (this._granuleStickyLayer != null) {
        this.onMetricsMap('Selected Granule')
        this._granuleStickyLayer.onAdd(this._map)

        if ((this.projection === projections.geographic) && (this._granuleFocusLayer != null)) {
          const bounds = this._granuleFocusLayer.getBounds()
          // Avoid zooming and panning tiny amounts
          if (
            (bounds != null ? bounds.isValid() : undefined)
            && !this._map.getBounds().contains(bounds)
          ) {
            panBoundsToCenter(this._map, bounds)
          }
        }
      }

      this.loadResults(this.granules)
    }
  }

  _onExcludeGranule(granuleId) {
    this.onExcludeGranule({
      collectionId: this.collectionId,
      granuleId
    })
  }

  _granuleLayer(granule, options) {
    return buildLayer(options, granule)
  }

  _focusLayer(granule) {
    if (granule == null) { return null }
    return buildLayer({
      clickable: false, color: this.color, fillColor: this.color, opacity: 1
    }, granule)
  }

  _stickyLayer(granule) {
    let temporalLabel
    if (granule == null) { return null }

    const layer = buildLayer({
      fillOpacity: 0,
      clickable: false,
      color: this.color,
      fillColor: this.color,
      opacity: 1
    }, granule)

    const temporal = getTemporal(granule.time_start, granule.time_end)

    if (temporal[0] && temporal[1]) {
      temporalLabel = `<p>${temporal[0]}</p><p>${temporal[1]}</p>`
    } else if (temporal[0]) {
      temporalLabel = `<p>${temporal[0]}</p>`
    } else if (temporal[1]) {
      temporalLabel = `<p>${temporal[1]}</p>`
    }

    const { id: granuleId } = granule

    let excludeHtml = ''
    excludeHtml = `<a class="panel-list-remove" data-granule-id="${granuleId}" href="#" title="Remove granule"><span class="fa-stack"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-times fa-stack-1x fa-inverse"></i></span></a>`
    const icon = new L.DivIcon({
      className: 'granule-spatial-label',
      html: `<span class="granule-spatial-label-temporal">${temporalLabel}</span>${excludeHtml}`
    })


    const marker = L.marker([0, 0], { clickable: false, icon })
    layer.addLayer(marker)

    let firstShape = layer.getLayers()[0]
    if ((firstShape != null ? firstShape._interiors : undefined) != null) {
      firstShape = firstShape._interiors
    }

    if (firstShape != null) {
      firstShape.on('add', function add() {
        const center = (this.getLatLng != null) ? this.getLatLng() : this.getCenter()
        return marker.setLatLng(center)
      })
    }

    return layer
  }
}

export class GranuleGridLayer extends MapLayer {
  /**
   * Get the data needed to create a new GranuleGridLayerExtended layer
   * @param {object} props
   * @returns {array} Array of layer data objects
   */
  getLayerData(props) {
    const {
      collections,
      focusedCollection,
      isProjectPage,
      granules,
      project
    } = props

    const layers = {}
    const color = '#2ECC71'

    if (isProjectPage) {
      // If we are on the project page, return data for each project collection
      const { collectionIds: projectIds } = project
      projectIds.forEach((collectionId, index) => {
        const { byId } = collections
        const { [collectionId]: iterationCollection = {} } = byId
        const {
          granules: collectionGranules,
          isVisible,
          metadata
        } = iterationCollection

        if (!collectionGranules) return

        layers[collectionId] = {
          collectionId,
          color: getColorByIndex(index),
          metadata,
          isVisible,
          granules: collectionGranules
        }
      })
    } else if (focusedCollection && focusedCollection !== '') {
      // If we aren't on the project page, return data for focusedCollection if it exists
      const { byId } = collections
      const { [focusedCollection]: focusedCollectionObject = {} } = byId
      const { metadata = {} } = focusedCollectionObject

      layers[focusedCollection] = {
        collectionId: focusedCollection,
        color,
        isVisible: true,
        metadata,
        granules
      }
    }

    return layers
  }

  /**
   * Create a feature group of GranuleGridLayerExtended layers.
   * @param {object} props
   */
  createLeafletElement(props) {
    const { layers = [] } = this

    const {
      focusedGranule,
      projection,
      onChangeFocusedGranule,
      onExcludeGranule,
      onMetricsMap
    } = props

    // Create a GranuleGridLayerExtended layer from each data object in getLayerData
    const layerData = this.getLayerData(props)

    Object.keys(layerData).forEach((id, index) => {
      const {
        collectionId,
        color,
        metadata,
        granules = {}
      } = layerData[id]

      const { byId = {} } = granules
      const granuleData = Object.values(byId)

      const layer = new GranuleGridLayerExtended({
        collectionId,
        metadata,
        granules: granuleData,
        color,
        focusedGranule,
        projection,
        onChangeFocusedGranule,
        onExcludeGranule,
        onMetricsMap
      })

      // Set the ZIndex for the layer
      layer.setZIndex(20 + index)

      layers.push(layer)
    })

    // Save the list of layers and create a feature group for the layers
    const featureGroup = new L.FeatureGroup(layers)
    return featureGroup
  }

  /**
   * Handles updating the granules in each GranuleGridLayerExtended layer on the map
   * @param {object} fromProps
   * @param {obect} toProps
   */
  updateLeafletElement(fromProps, toProps) {
    const layers = this.leafletElement._layers // List of layers

    const {
      focusedGranule,
      projection,
      onChangeFocusedGranule,
      onExcludeGranule,
      onMetricsMap
    } = toProps

    const oldLayerData = this.getLayerData(fromProps)
    const layerData = this.getLayerData(toProps)

    const layerDataCollectionIds = Object.keys(layerData)

    // Nothing should be drawn, remove any existing layers
    if (layerDataCollectionIds.length === 0) {
      Object.values(layers).forEach(layer => this.leafletElement.removeLayer(layer))
    } else if (layerDataCollectionIds.length < Object.keys(oldLayerData).length) {
      // If there is less data than before, figure out which collection was removed and remove the layer

      const oldIds = Object.keys(oldLayerData)
      const diffIds = difference(oldIds, layerDataCollectionIds)

      diffIds.forEach((collectionId) => {
        Object.values(layers).forEach((layer) => {
          if (layer.collectionId === collectionId) {
            this.leafletElement.removeLayer(layer)
          }
        })
      })
    }

    // Loop through each layer data object to update the layer
    layerDataCollectionIds.forEach((id) => {
      const {
        collectionId,
        color,
        metadata,
        isVisible,
        granules = {}
      } = layerData[id]

      // If there are no granules, bail out
      const { byId: granulesById = {} } = granules
      if (Object.keys(granulesById).length === 0) return

      // If no granules were changed, bail out
      const oldCollection = oldLayerData[collectionId]
      const { granules: oldGranules = {} } = oldCollection || {}
      if (oldCollection
        && isEqual(Object.keys(granulesById), Object.keys(oldGranules.byId))) return

      // If the collecton is not visible, set the granuleData to an empty array
      const granuleData = isVisible ? Object.values(granulesById) : []

      // Find the layer for this collection
      const [layer] = Object.values(layers).filter(l => l.collectionId === collectionId)
      if (layer) {
        const {
          isVisible: oldIsVisible
        } = oldCollection

        // If the granules and the visibility haven't changed, bail out
        if (oldGranules === granules && oldIsVisible === isVisible) return

        // Update the layer with the new granuleData
        layer.setResults({
          collectionId,
          metadata,
          granules: granuleData,
          color,
          defaultGranules: granuleData,
          focusedGranule
        })
      } else {
        // A layer doesn't exist for this collection yet, maybe we just added a focusedCollection, so create a new layer
        const layer = new GranuleGridLayerExtended({
          collectionId,
          metadata,
          granules: granuleData,
          color,
          focusedGranule,
          projection,
          onChangeFocusedGranule,
          onExcludeGranule,
          onMetricsMap
        })
        layer.setZIndex(20)

        // Add the layer to the feature group
        layer.addTo(this.leafletElement)
      }
    })
  }
}

export default withLeaflet(GranuleGridLayer)
