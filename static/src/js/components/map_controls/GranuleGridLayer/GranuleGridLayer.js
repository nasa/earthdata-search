/* eslint-disable no-underscore-dangle */

import L from 'leaflet'

import {
  withLeaflet,
  GridLayer
} from 'react-leaflet'

import {
  addPath,
  isCartesian,
  isClockwise,
  getPolygons,
  getLines,
  getPoints,
  getRectangles,
  getlprojection
} from '../../../util/map/granules'
import { dividePolygon } from '../../../util/map/geo'
import { projectPath } from '../../../util/map/interpolation'

const config = {
  gibsUrl: 'https://gibs.earthdata.nasa.gov/wmts/{lprojection}/best/{product}/default/{time}/{resolution}/{z}/{y}/{x}.{format}',
  gibsGranuleUrl: 'http://uat.gibs.earthdata.nasa.gov/wmts/{projection}/std/{product}/default/{time}/{resolution}/{z}/{y}/{x}.{format}'
}

const MAX_RETRIES = 1 // Maximum number of times to attempt to reload an image

class GranuleGridLayerExtended extends L.GridLayer {
  initialize(props) {
    const { focusedCollection, granules } = props
    this.collection = focusedCollection

    this.granules = granules
    this._results = granules

    // If on the search page, the color should always be green.
    // if (page.current.page() === 'search') {
    //   color = colors.green
    // }

    // // If were on the project page, set it to blue while we finish loading the collection data.
    // if (page.current.page() === 'project') {
    //   color = color != null ? color : colors.blue
    // }

    this.color = '#2ECC71'

    this.originalOptions = { tileSize: 512 }
    return super.initialize(this.originalOptions)
  }

  // Overwrite the leaflet onAdd function
  onAdd() {
    super.onAdd()

    this._container.setAttribute('id', `granule-vis-${this.collection}`)
    // this._handle(map, 'on', 'edsc.focuscollection')
    // this.setFocus((map.focusedCollection != null ? map.focusedCollection.id : undefined) === this.collection.id)

    // this._resultsSubscription = __guard__(this.granules != null ? this.granules.results : undefined, x => x.subscribe(this.loadResults.bind(this)))
    // this.loadResults(this.granules.byIds !== undefined ? Object.values(this.granules.byIds) : undefined)
    this._added = true
  }

  // Overwrite the leaflet onRemove function
  onRemove(map) {
    super.onRemove(map)
    this._added = false

    // this.setFocus(false, map)
    // this._handle(map, 'off', 'edsc.focuscollection')
    // if (this._resultsSubscription != null) {
    //   this._resultsSubscription.dispose()
    // }
    this._results = null
  }

  // _subscribe() {
  //   if (this.collection.granuleDatasource() && this._added && !this._resultsSubscription) {
  //     const granuleDatasource = this.collection.granuleDatasource()
  //     this.granules = granuleDatasource.data()
  //     this._resultsSubscription = __guard__(this.granules != null ? this.granules.results : undefined, x => x.subscribe(this.loadResults.bind(this)))
  //     this.loadResults(this.granules != null ? this.granules.results() : undefined)
  //     return (this._datasourceSubscription != null ? this._datasourceSubscription.dispose() : undefined)
  //   }
  //   return false
  // }

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
    // for (const optionSet of this.multiOptions) {
    this.multiOptions.forEach((optionSet) => {
      const newOptionSet = optionSet
      if (this.matches(granule, newOptionSet.match)) {
        let newResolution

        const oldResolution = newOptionSet.resolution

        // set resolution to {projection}_resolution if it exists
        // and if the layer exists within newOptionSet

        // TODO force map project to geo because we don't have projection switching yet
        this._map.projection = 'geo'
        if ((this._map.projection === 'geo') && newOptionSet.geo) {
          matched = true
          newResolution = newOptionSet.geo_resolution
        } else if ((this._map.projection === 'arctic') && newOptionSet.arctic) {
          matched = true
          newResolution = newOptionSet.arctic_resolution
        } else if ((this._map.projection === 'antarctic') && newOptionSet.antarctic) {
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
    if ((this._results == null) || (this._results.length <= 0)) { return }

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

    for (let i = 0; i < this._results.length; i += 1) {
      const granule = this._results[i]
      const overlaps = this.granulePathsOverlappingTile(granule, bounds)
      if (overlaps.length > 0) {
        const url = this.getTileUrl(tilePoint, granule)
        for (let j = 0; j < overlaps.length; j += 1) {
          const path = overlaps[j]
          path.index = i
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
    }

    setTimeout((() => this.drawOutlines(canvas, paths, nwPoint)), 0)
    setTimeout((() => this.drawClippedPaths(canvas, boundary, pathsWithHoles, nwPoint)), 0)
    setTimeout((() => this.drawClippedImagery(canvas, boundary, paths, nwPoint, tilePoint)), 0)
    setTimeout((() => this.drawFullBackTile(back, boundary, pathsWithHoles.concat().reverse(), nwPoint)), 0)

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
      // for (const hole of holes) {
      holes.forEach((hole) => {
        addPath(ctx, { poly: hole.poly.concat().reverse() })
      })
      ctx.stroke()
      addPath(ctx, boundary)
      if ((path.line != null ? path.line.length : undefined) <= 0) { ctx.clip() }
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

      // ((i, urlPaths, url) => {
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
      // })(i, urlPaths, url)
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
      // for (const hole of holes) {
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

    // const interpolation = granule.isCartesian() ? 'cartesian' : 'geodetic'
    const interpolation = isCartesian(granule) ? 'cartesian' : 'geodetic'
    // for (let polygon of (left = granule.getPolygons()) != null ? left : []) {
    // Array.from(granule.getPolygons()).forEach((polygon) => {
    Array.from(getPolygons(granule)).forEach((polygon) => {
      // if (granule.isCartesian()) {
      if (isCartesian(granule)) {
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
      if (granule.orbit) { return true }
      return false
    })

    this.addIntersections(result, getRectangles(granule), tileBounds, 'poly', 'cartesian')
    this.addIntersections(result, getLines(granule), tileBounds, 'line', interpolation)

    // for (const point of (left1 = granule.getPoints()) != null ? left1 : []) {
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
      result = this._results != null ? this._results[index] : undefined
    }

    return result
  }

  // Set the granule results that need to be drawna
  setResults(results) {
    this._results = results
    if (results && results[0] && results[0].collection_concept_id === 'C24931-LAADS') {
      // Hard code C24931-LAADS to work with gibs imagery until we have that full functionality in place
      this.multiOptions = [{
        antarctic: true,
        antarctic_resolution: '1km',
        arctic: true,
        arctic_resolution: '1km',
        format: 'png',
        geo: true,
        geo_resolution: '1km',
        group: 'overlays',
        match: {
          time_start: '>=2000-02-24T00:00:00Z'
        },
        maxNativeZoom: 5,
        product: 'MODIS_Terra_Brightness_Temp_Band31_Day',
        resolution: '1km',
        source: 'Terra / MODIS',
        title: 'Brightness Temperature (Band 31-Day)'
      }]
    } else {
      this.multiOptions = undefined
    }
    return this.redraw()
  }

  // We might need this once we start looking at sticky granules
  // _reorderedResults(results, defaultResults) {
  //   if (this._stickied != null) {
  //     const newResults = results.concat()
  //     const index = newResults.indexOf(this._stickied)
  //     if (index === -1) {
  //       this._stickied = null
  //       this.stickyId = null
  //       if (this._granuleStickyLayer != null) {
  //         this._granuleStickyLayer.onRemove(this._map)
  //       }
  //       this._granuleStickyLayer = null
  //     } else {
  //       newResults.splice(index, 1)
  //       newResults.unshift(this._stickied)
  //     }
  //     return newResults
  //   }
  //   return defaultResults
  // }

  // loadResults(results) {
  //   return this.setResults(this._reorderedResults(results, this.granules.byIds !== undefined ? Object.values(this.granules.byIds) : undefined))
  // }

  // setFocus(focus, map = this._map) {
  //   if (this._isFocused === focus) { return }
  //   this._isFocused = focus
  //   const events = ['edsc.mousemove', 'edsc.mouseout', 'click', 'edsc.focusgranule', 'edsc.stickygranule']
  //   if (focus) {
  //     this._handle(map, 'on', ...Array.from(events))
  //   }
  //   this._handle(map, 'off', ...Array.from(events))
  //   if (this._granuleFocusLayer != null) {
  //     this._granuleFocusLayer.onRemove(map)
  //   }
  //   this._granuleFocusLayer = null
  //   if (this._granuleStickyLayer != null) {
  //     this._granuleStickyLayer.onRemove(map)
  //   }
  //   this._granuleStickyLayer = null
  // }

  // _handle(obj, onOrOff, ...events) {
  //   return (() => {
  //     const result = []
  //     events.forEach((event) => {
  //       const method = `_on${event.split('.').map(capitalize).join('')}`
  //       result.push(obj[onOrOff](event, this[method]))
  //     })
  //     return result
  //   })()
  // }

  // _onEdscFocuscollection(e) {
  //   return this.setFocus((e.collection != null ? e.collection.id : undefined) === this.collection.id)
  // }

  // _onEdscMouseout() {
  //   if (this._granule != null) {
  //     return this._map.fire('edsc.focusgranule', { granule: null })
  //   }
  //   return null
  // }

  // _onEdscMousemove(e) {
  //   const granule = this.granuleAt(e.layerPoint)
  //   if (this._granule !== granule) {
  //     return this._map.fire('edsc.focusgranule', { granule })
  //   }
  //   return null
  // }

  // _onClick(e) {
  //   if ($(e.originalEvent.target).closest('a').hasClass('panel-list-remove')) {
  //     return this._map.fire('edsc.excludestickygranule')
  //   }
  //   if ($(e.originalEvent.target).closest('a').length !== 0) { return null }
  //   let granule = this.granuleAt(e.layerPoint)
  //   if (this._stickied === granule) { granule = null }
  //   this._map.fire('edsc.focusgranule', { granule })
  //   return this._map.fire('edsc.stickygranule', { granule })
  // }

  // _onEdscFocusgranule(e) {
  //   const { granule } = e
  //   this._granule = granule

  //   if (this._granuleFocusLayer != null) {
  //     this._granuleFocusLayer.onRemove(this._map)
  //   }
  //   this._granuleFocusLayer = this._focusLayer(granule, false)
  //   return (this._granuleFocusLayer != null ? this._granuleFocusLayer.onAdd(this._map) : undefined)
  // }

  // _onEdscStickygranule(e) {
  //   const { granule } = e

  //   if (this._stickied === granule) { return }

  //   this._stickied = granule
  //   this.stickyId = granule != null ? granule.id : undefined // Ugly hack for testing

  //   if (this._granuleStickyLayer != null) {
  //     this._granuleStickyLayer.onRemove(this._map)
  //   }
  //   this._granuleStickyLayer = this._stickyLayer(granule, true)
  //   if (this._granuleStickyLayer != null) {
  //     this._granuleStickyLayer.onAdd(this._map)

  //     if ((this._map.projection === 'geo') && (this._granuleFocusLayer != null)) {
  //       const bounds = this._granuleFocusLayer.getBounds()
  //       // Avoid zooming and panning tiny amounts
  //       if ((bounds != null ? bounds.isValid() : undefined) && !this._map.getBounds().contains(bounds)) {
  //         this._map.fitBounds(bounds.pad(0.2)).panTo(bounds.getCenter())
  //       }
  //     }
  //   }

  //   this.loadResults(this._results)
  // }

  // _granuleLayer(granule, options) {
  //   return granule.buildLayer(options)
  // }

  // _focusLayer(granule) {
  //   if (granule == null) { return null }

  //   return granule.buildLayer({
  //     clickable: false, color: this.color, fillColor: this.color, opacity: 1
  //   })
  // }

  // _stickyLayer(granule) {
  //   let temporalLabel
  //   if (granule == null) { return null }

  //   const layer = granule.buildLayer({
  //     fillOpacity: 0, clickable: false, color: this.color, fillColor: this.color, opacity: 1
  //   })

  //   const temporal = granule.getTemporal()

  //   if (temporal[0] && temporal[1]) {
  //     temporalLabel = `<p>${temporal[0]}</p><p>${temporal[1]}</p>`
  //   } else if (temporal[0]) {
  //     temporalLabel = `<p>${temporal[0]}</p>`
  //   } else if (temporal[1]) {
  //     temporalLabel = `<p>${temporal[1]}</p>`
  //   }

  //   let excludeHtml = ''
  //   if (__guard__(this.collection.granuleDatasource(), x => x.hasCapability('excludeGranules'))) {
  //     excludeHtml = '<a class="panel-list-remove" href="#" title="Remove granule"><span class="fa-stack"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-times fa-stack-1x fa-inverse"></i></span></a>'
  //   }
  //   const icon = new L.DivIcon({
  //     className: 'granule-spatial-label',
  //     html: `<span class="granule-spatial-label-temporal">${temporalLabel}</span>${excludeHtml}`
  //   })


  //   const marker = L.marker([0, 0], { clickable: false, icon })
  //   layer.addLayer(marker)

  //   let firstShape = layer.getLayers()[0]
  //   if ((firstShape != null ? firstShape._interiors : undefined) != null) { firstShape = firstShape._interiors }

  //   if (firstShape != null) {
  //     firstShape.on('add', function add() {
  //       const center = (this.getLatLng != null) ? this.getLatLng() : this.getCenter()
  //       return marker.setLatLng(center)
  //     })
  //   }

  //   return layer
  // }
}

class GranuleGridLayer extends GridLayer {
  createLeafletElement(props) {
    const layer = new GranuleGridLayerExtended(props)
    this.layer = layer
    return layer
  }

  // Update the granules if the new props are different
  updateLeafletElement(fromProps, toProps) {
    const { layer } = this
    console.log('updateLeafletElement', fromProps, toProps)
    if (fromProps.granules !== toProps.granules) {
      console.log('do stuff with the layer!', layer)
      layer.setResults(Object.values(toProps.granules.byId))
    }
  }
}

export default withLeaflet(GranuleGridLayer)
