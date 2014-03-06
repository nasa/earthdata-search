ns = @edsc.map.L

ns.GranuleLayer = do (L,
                      GibsTileLayer = ns.GibsTileLayer,
                      projectPath=ns.interpolation.projectPath,
                      dateUtil = @edsc.util.date
                      dividePolygon = ns.sphericalPolygon.dividePolygon
                      ) ->


  isClockwise = (path) ->
    sum = 0
    len = path.length
    for i in [0...len]
      p0 = path[i]
      p1 = path[(i + 1) % len]
      sum += (p1.x - p0.x) * (p1.y + p0.y);
    sum > 0

  clockwise = (path) ->
    if !Array.isArray(path) || isClockwise(path) then path else path.concat().reverse()

  counterclockwise = (path) ->
    if Array.isArray(path) && isClockwise(path) then path.concat().reverse() else path

  addPath = (ctx, path, isCounterclockwise) ->
    if Array.isArray(path)
      len = path.length

      return if len < 2

      if isCounterclockwise != !isClockwise(path)
        path = path.concat().reverse()

      ctx.moveTo(path[0].x, path[0].y)
      ctx.lineTo(point.x, point.y) for point in path[1...]
    else
      ctx.moveTo(path.x + 10, path.y)
      ctx.arc(path.x, path.y, 10, 0, 2 * Math.PI, isCounterclockwise);
    null

  clipped = (ctx, boundary, maskedPaths, drawnPaths, fn) ->
    ctx.save()
    if maskedPaths.length > 0
      ctx.beginPath()
      addPath(ctx, boundary, false)
      for path in maskedPaths
        addPath(ctx, path, true)
        ctx.clip()

    if drawnPaths.length > 0
      ctx.beginPath()
      for path in drawnPaths
        addPath(ctx, path, true)
      ctx.clip()

    fn()
    ctx.restore()

    null

  # The first few methods are ported from L.TileLayer.Canvas, which is in our leaflet version but
  # seems to be removed from more recent versions.
  GranuleCanvasLayer = L.TileLayer.extend
    options:
      async: true

    setResults: (results) ->
      @_results = results
      @redraw()

    redraw: ->
      if @_map
        @_reset(hard: true)
        @_update()
        @_redrawTile(tile) for tile in @_tiles

      this

    _redrawTile: (tile) ->
      tilePoint = tile._tilePoint
      @drawTile(tile, @_getBackTile(tilePoint), tilePoint, @_map._zoom)

    _createTile: ->
      tile = L.DomUtil.create('canvas', 'leaflet-tile')
      tile.width = tile.height = @options.tileSize
      tile.onselectstart = tile.onmousemove = L.Util.falseFn
      tile

    _reset: (e) ->
      @_backTiles = {}
      tilesToLoad = @_tilesToLoad
      L.TileLayer.prototype._reset.call(this, e)
      @fire('load') if tilesToLoad > 0

    _getBackTile: (tilePoint) ->
      key = "#{tilePoint.x}:#{tilePoint.y}"
      @_backTiles ?= {}
      @_backTiles[key] ?= @_createTile()
      @_backTiles[key]

    _loadTile: (tile, tilePoint) ->
      tile._layer = this

      # This line isn't in the leaflet source, which is seemingly a bug
      @_adjustTilePoint(tilePoint)

      tile._tilePoint = tilePoint

      @_redrawTile(tile)

      @tileDrawn() unless @options.async

    _granulePathsOverlappingTile: (granule, tileBounds) ->
      result = []
      map = @_map
      polygons = granule.getPolygons()
      if polygons?
        for polygon in polygons
          divided = dividePolygon(polygon[0])

          for interior in divided.interiors when tileBounds.intersects(interior)
            result.push(projectPath(map, interior, [], 'geodetic', 2, 5).boundary)

      rects = granule.getRectangles()
      if rects?
        for path in rects when tileBounds.intersects(path)
          result.push(projectPath(map, path, [], 'cartesian', 2, 5).boundary)

      points = granule.getPoints()
      if points?
        for point in points when tileBounds.contains(point)
          result.push(@_map.latLngToLayerPoint(point))

      result

    _clipPolygon: (ctx, str, tileBounds) ->
      intersects = false
      for polygon in dividePolygon(@_parsePolygon(str)).interiors

        bounds = new L.LatLngBounds()
        bounds.extend(latlng) for latlng in polygon

        if tileBounds.intersects(bounds)
          intersects = true
          path = (@_map.latLngToLayerPoint(ll) for ll in polygon)

          ctx.strokeStyle = "rgb(200,0,0)";
          ctx.moveTo(path[0].x, path[0].y)

          for point in path[1...]
            ctx.lineTo(point.x, point.y)

          ctx.closePath()
          #ctx.stroke()

      intersects

    _drawFootprint: (canvas, nwPoint, boundary, maskedPaths, drawnPaths) ->
      #colors = ['rgba(255, 0, 0, 0.5)',
      #          'rgba(0, 255, 0, 0.5)',
      #          'rgba(0, 0, 255, 0.5)',
      #          'rgba(255, 255, 0, 0.5)',
      #          'rgba(255, 0, 255, 0.5)',
      #          'rgba(0, 255, 255, 0.5)',
      #          'rgba(255, 255, 255, 0.5)']

      ctx = canvas.getContext('2d')
      ctx.save()

      # Faint stroke of whole path
      ctx.lineWidth = 1
      ctx.translate(-nwPoint.x, -nwPoint.y)
      ctx.strokeStyle = 'rgba(128, 128, 128, .2)'
      for path in drawnPaths
        addPath(ctx, path, true)
        ctx.stroke()

      # Bold stroke of unclipped portion of path, black + white
      clipped ctx, boundary, maskedPaths, [], ->
        for path in drawnPaths
          ctx.beginPath()
          addPath(ctx, path, true)
          ctx.closePath()
          # For debugging clip paths
          #ctx.fillStyle = colors[Math.abs(nwPoint.x + nwPoint.y) % colors.length]
          #ctx.fill()
          ctx.lineWidth = 2
          ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
          ctx.stroke()
          ctx.lineWidth = 1
          ctx.strokeStyle = 'rgba(255, 255, 255, 1)'
          ctx.stroke()
      ctx.restore()

    granuleAt: (p) ->
      origin = @_map.getPixelOrigin()
      tileSize = @_getTileSize()
      tilePoint = p.add(origin).divideBy(tileSize).floor()

      canvas = @_getBackTile(tilePoint)

      tilePixel = p.subtract(@_getTilePos(tilePoint))

      result = null
      ctx = canvas.getContext('2d')
      data = ctx.getImageData(tilePixel.x, tilePixel.y, 1, 1).data
      if data[3] != 0
        index = (data[0] << 16) + (data[1] << 8) + data[2]
        result = @_results?[index]

      result

    _drawBackTile: (canvas, index, nwPoint, boundary, maskedPaths, drawnPaths) ->
      ctx = canvas.getContext('2d')
      ctx.save()

      # http://www.w3.org/TR/2011/WD-2dcontext-20110405/#imagedata
      ctx.fillStyle = '#' + (index + 0x1000000).toString(16).substr(-6)

      ctx.translate(-nwPoint.x, -nwPoint.y)
      tileSize = @options.tileSize
      clipped ctx, boundary, maskedPaths, drawnPaths, ->
        ctx.fillRect(nwPoint.x, nwPoint.y, tileSize, tileSize)
      ctx.restore()


    getTileUrl: (tilePoint, date) ->
      L.TileLayer.prototype.getTileUrl.call(this, tilePoint) + "&time=#{date}" if @_url?

    _loadClippedImage: (canvas, tilePoint, date, nwPoint, boundary, maskedPaths, drawnPaths, retries=0) ->
      url = @getTileUrl(tilePoint, date)

      if url?
        image = new Image()
        image.onload = (e) =>
          ctx = canvas.getContext('2d')
          ctx.save()
          ctx.translate(-nwPoint.x, -nwPoint.y)
          clipped ctx, boundary, maskedPaths, drawnPaths, ->
            ctx.drawImage(image, nwPoint.x, nwPoint.y)

          ctx.restore()

          for path, i in drawnPaths
            masked = maskedPaths.concat(drawnPaths.slice(0, i))
            @_drawFootprint(canvas, nwPoint, boundary, masked, [path])

        image.onerror = (e) =>
          if retries == 0
            @_loadClippedImage(canvas, tilePoint, date, nwPoint, boundary, maskedPaths, drawnPaths, 1)
          else
            console.error("Failed to load tile after 2 tries: #{url}")

        image.src = url
      else
        for path, i in drawnPaths
          masked = maskedPaths.concat(drawnPaths.slice(0, i))
          @_drawFootprint(canvas, nwPoint, boundary, masked, [path])

    drawTile: (canvas, back, tilePoint) ->
      return unless @_results? && @_results.length > 0

      tileSize = @options.tileSize
      nwPoint = @_getTilePos(tilePoint)
      nePoint = nwPoint.add([tileSize, 0])
      sePoint = nwPoint.add([tileSize, tileSize])
      swPoint = nwPoint.add([0, tileSize])
      boundary = [nwPoint, nePoint, sePoint, swPoint]
      bounds = new L.latLngBounds(@_map.layerPointToLatLng(nwPoint),
                                  @_map.layerPointToLatLng(sePoint))

      bounds = bounds.pad(0.1)

      date = null
      drawnPaths = []
      maskedPaths = []

      for granule, i in @_results
        start = granule.time_start?.substring(0, 10)

        paths = @_granulePathsOverlappingTile(granule, bounds)

        if paths.length > 0
          @_drawBackTile(back, i, nwPoint, boundary, maskedPaths.concat(drawnPaths), paths)

        # Note: GIBS is currently ambiguous about which day to use
        if start != date
          if drawnPaths.length > 0
            @_loadClippedImage(canvas, tilePoint, date, nwPoint, boundary, maskedPaths, drawnPaths)

          maskedPaths = maskedPaths.concat(drawnPaths)
          drawnPaths = paths
          date = start
        else
          drawnPaths = drawnPaths.concat(paths)

      if drawnPaths.length > 0
        @_loadClippedImage(canvas, tilePoint, date, nwPoint, boundary, maskedPaths, drawnPaths)

        maskedPaths = maskedPaths.concat(drawnPaths)


      console.log "#{maskedPaths.length} Overlapping Granules [(#{bounds.getNorth()}, #{bounds.getWest()}), (#{bounds.getSouth()}, #{bounds.getEast()})]"
      @tileDrawn(canvas)
      null

    tileDrawn: (tile) ->
      # If we do upgrade, this will break, as well as our tile reloading calls.
      # Tile loading seems to be handled via callbacks now.
      @_tileOnLoad.call(tile)

  class GranuleLayer extends GibsTileLayer
    constructor: (@granules, options) ->
      @_hasGibs = options?.product?
      @_stickyFocus = false

      super(options)

    onAdd: (map) ->
      super(map)

      map.on 'edsc.mousemove', @_onMouseMove
      map.on 'edsc.mouseout', @_onMouseOut
      map.on 'click', @_onClick
      map.on 'edsc.focusgranule', @_onFocusGranule
      @_resultsSubscription = @granules.results.subscribe(@_loadResults.bind(this))
      @_loadResults(@granules.results())

    onRemove: (map) ->
      super(map)

      map.off 'edsc.mousemove', @_onMouseMove
      map.off 'edsc.mouseout', @_onMouseOut
      map.off 'click', @_onClick
      map.off 'edsc.focusgranule', @_onFocusGranule
      @_resultsSubscription.dispose()
      @_results = null
      @_granuleFocusLayer?.onRemove(@_map)
      @_granuleStickyLayer?.onRemove(@_map)

    url: ->
      super() if @_hasGibs

    _onMouseOut: (e) =>
      if @_granule?
        @_map.fire('edsc.focusgranule', granule: null)

    _onMouseMove: (e) =>
      granule = @layer?.granuleAt(e.layerPoint)
      if @_granule != granule
        @_map.fire('edsc.focusgranule', granule: granule)

    _onClick: (e) =>
      granule = @layer?.granuleAt(e.layerPoint)
      @_map.fire('edsc.focusgranule', granule: granule, sticky: @_stickied != granule)

    _onFocusGranule: (e) =>
      @_granule = granule = e.granule
      sticky = e.sticky

      @_granuleFocusLayer?.onRemove(@_map)
      @_granuleFocusLayer = @_layerForGranule(granule, false)
      @_granuleFocusLayer?.onAdd(@_map)

      needsReload = (sticky == false && @_stickied != null) || (sticky && @_stickied != granule)

      if sticky == false
        @_stickied = null
        @_granuleStickyLayer?.onRemove(@_map)
        @_granuleStickyLayer = null
        if @_restoreBounds?
          @_map.fitBounds(@_restoreBounds)
          @_restoreBounds = null

      if sticky && @_stickied != granule
        @_stickied = granule
        @_granuleStickyLayer?.onRemove(@_map)
        @_granuleStickyLayer = @_layerForGranule(granule, true)
        if @_granuleStickyLayer?
          @_granuleStickyLayer.onAdd(@_map)
          @_restoreBounds ?= @_map.getBounds()
          @_map.fitBounds(@_granuleFocusLayer.getBounds())

      @_loadResults(@_results) if needsReload

    _buildLayerWithOptions: (newOptions) ->
      # GranuleCanvasLayer needs to handle time
      newOptions = L.extend({}, newOptions)
      delete newOptions.time

      layer = new GranuleCanvasLayer(@url(), @_toTileLayerOptions(newOptions))

      # For tests to figure out if things are still loading
      map = @_map
      map.loadingLayers ?= 0
      layer.on 'loading', -> map.loadingLayers++
      layer.on 'load', -> map.loadingLayers--

      layer.setResults(@_results)
      layer

    _loadResults: (results) ->
      @_results = results

      if @_stickied?
        results = results.concat()
        index = results.indexOf(@_stickied)
        if index != -1
          results.splice(index, 1)
          results.unshift(@_stickied)

      @layer?.setResults(results)

    _layerForGranule: (granule, sticky) ->
      return null unless granule?

      if sticky
        options =
          fillOpacity: 0
          clickable: false
      else
        options =
          clickable: false

      layer = L.featureGroup()
      layer.addLayer(L.circleMarker(point, options)) for point in granule.getPoints() ? []
      layer.addLayer(L.sphericalPolygon(poly, options)) for poly in granule.getPolygons() ? []

      for rect in granule.getRectangles() ? []
        # granule.getRectanges() returns a path, so it's really a polygon
        shape = L.polygon(rect, options)
        shape._interpolationFn = 'cartesian'
        layer.addLayer(shape)

      if sticky
        temporal = [granule.time_start, granule.time_end].join(' to ')
        icon = L.divIcon
          className: 'granule-spatial-label',
          html: temporal + '<a class="panel-list-remove" href="#" title="remove"><i class="fa fa-times"></i></a>'

        marker = L.marker([0, 0], icon: icon)

        firstShape = layer.getLayers()[0]
        if firstShape._interiors?
          firstShape = firstShape._interiors

        firstShape?.on 'add', (e) ->
          map = @_map

          center = @getLatLng?()
          unless center?
            xmin = Infinity
            xmax = -Infinity
            ymin = Infinity
            ymax = -Infinity
            latlngs = @getLatLngs()
            latlngs = latlngs[0] if Array.isArray(latlngs[0])
            for latlng in latlngs
              p = map.latLngToLayerPoint(latlng)
              xmin = Math.min(xmin, p.x)
              xmax = Math.max(xmax, p.x)
              ymin = Math.min(ymin, p.y)
              ymax = Math.max(ymax, p.y)
            center = map.layerPointToLatLng(L.point((xmin + xmax) / 2, (ymin + ymax) / 2))
          marker.setLatLng(center)
          layer.addLayer(marker)

      layer

  exports = GranuleLayer