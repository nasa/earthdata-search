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
    if isClockwise(path) then path else path.concat().reverse()

  counterclockwise = (path) ->
    if isClockwise(path) then path.concat().reverse() else path

  addPath = (ctx, path) ->
    len = path.length

    return if len < 2

    ctx.moveTo(path[0].x, path[0].y)
    ctx.lineTo(point.x, point.y) for point in path[1...]
    null

  clipped = (ctx, boundary, maskedPaths, drawnPaths, fn) ->
    ctx.save()
    if maskedPaths.length > 0
      ctx.beginPath()
      addPath(ctx, clockwise(boundary))
      for path in maskedPaths
        addPath(ctx, counterclockwise(path))
        ctx.clip()

    if drawnPaths.length > 0
      ctx.beginPath()
      for path in drawnPaths
        addPath(ctx, counterclockwise(path))
      ctx.clip()

    fn()
    ctx.restore()

    null

  # The first few methods are ported from L.TileLayer.Canvas, which is in our leaflet version but
  # seems to be removed from more recent versions.
  GranuleCanvasLayer = L.TileLayer.extend
    options:
      async: false

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
      @drawTile(tile, tile._tilePoint, @_map._zoom)

    _createTile: ->
      tile = L.DomUtil.create('canvas', 'leaflet-tile')
      tile.width = tile.height = @options.tileSize
      tile.onselectstart = tile.onmousemove = L.Util.falseFn
      tile

    _loadTile: (tile, tilePoint) ->
      tile._layer = this

      # This line isn't in the leaflet source, which is seemingly a bug
      @_adjustTilePoint(tilePoint)

      tile._tilePoint = tilePoint

      @_redrawTile(tile)

      @tileDrawn unless @options.async

    _parsePolygon: (str) ->
      latLng = L.latLng
      coords = str.split(' ')
      len = coords.length - 1
      latLng(coords[i], coords[i+1]) for i in [0...len] by 2

    _granulePathsOverlappingTile: (granule, tileBounds) ->
      result = []
      map = @_map
      if granule.polygons?
        for polygonStr in granule.polygons when polygonStr.length > 0
          polygon = @_parsePolygon(polygonStr[0])
          divided = dividePolygon(polygon)

          for interior in divided.interiors when tileBounds.intersects(interior)
            result.push(projectPath(map, interior, [], 'geodetic', 2, 5).boundary)

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

    _loadClippedImage: (canvas, tilePoint, date, nwPoint, boundary, maskedPaths, drawnPaths, retries=0) ->
      #colors = ['rgba(255, 0, 0, 0.5)',
      #          'rgba(0, 255, 0, 0.5)',
      #          'rgba(0, 0, 255, 0.5)',
      #          'rgba(255, 255, 0, 0.5)',
      #          'rgba(255, 0, 255, 0.5)',
      #          'rgba(0, 255, 255, 0.5)',
      #          'rgba(255, 255, 255, 0.5)']

      url = @getTileUrl(tilePoint) + "&time=#{date}"
      image = new Image()
      image.onload = (e) =>
        ctx = canvas.getContext('2d')
        ctx.save()
        ctx.translate(-nwPoint.x, -nwPoint.y)
        clipped ctx, boundary, maskedPaths, drawnPaths, ->
          ctx.drawImage(image, nwPoint.x, nwPoint.y)
          #ctx.strokeStyle = colors[new Date(date) % colors.length]
          #for path in drawnPaths
          #  ctx.moveTo(path[0].x, path[0].y)
          #  ctx.lineTo(p.x, p.y) for p in path[1...]
          #  ctx.closePath()
          #  ctx.stroke()

        ctx.restore()
        @tileDrawn(canvas)

      image.onerror = (e) =>
        if retries == 0
          @_loadClippedImage(canvas, tilePoint, date, nwPoint, boundary, maskedPaths, drawnPaths, 1)
        else
          console.error("Failed to load tile after 2 tries: #{url}")

      image.src = url

    drawTile: (canvas, tilePoint) ->
      return unless @_results? && @_results.length > 0

      tileSize = @options.tileSize
      nwPoint = @_getTilePos(tilePoint)
      nePoint = nwPoint.add([tileSize, 0])
      sePoint = nwPoint.add([tileSize, tileSize])
      swPoint = nwPoint.add([0, tileSize])
      boundary = [nwPoint, nePoint, sePoint, swPoint]
      bounds = new L.latLngBounds(@_map.layerPointToLatLng(nwPoint),
                                  @_map.layerPointToLatLng(sePoint))

      bounds.pad(0.1)

      date = null
      drawnPaths = []
      maskedPaths = []

      for granule, i in @_results
        start = granule.time_start?.substring(0, 10)

        # Note: GIBS is currently ambiguous about which day to use
        if start != date
          if drawnPaths.length > 0
            @_loadClippedImage(canvas, tilePoint, date, nwPoint, boundary, maskedPaths, drawnPaths)

          maskedPaths = maskedPaths.concat(drawnPaths)
          drawnPaths = @_granulePathsOverlappingTile(granule, bounds)
          date = start
        else
          drawnPaths = drawnPaths.concat(@_granulePathsOverlappingTile(granule, bounds))

      if drawnPaths.length > 0
        @_loadClippedImage(canvas, tilePoint, date, nwPoint, boundary, maskedPaths, drawnPaths)

        maskedPaths = maskedPaths.concat(drawnPaths)


      console.log "#{maskedPaths.length} Overlapping Granules [(#{bounds.getNorth()}, #{bounds.getWest()}), (#{bounds.getSouth()}, #{bounds.getEast()})]"

      return @tileDrawn(canvas) # DELETE ME

    tileDrawn: (tile) ->
      # If we do upgrade, this will break, as well as our tile reloading calls.
      # Tile loading seems to be handled via callbacks now.
      @_tileOnLoad.call(tile)

  class GranuleLayer extends GibsTileLayer
    constructor: (@granules, options) ->
      @_hasGibs = options?.product?

      super(options)

    onAdd: (map) ->
      super(map)

      @_resultsSubscription = @granules.results.subscribe(@_loadResults.bind(this))
      @_loadResults(@granules.results())

    onRemove: (map) ->
      @_destroyFootprintsLayer()

      super(map)

      @_resultsSubscription.dispose()
      @_results = null

    _destroyFootprintsLayer: ->
      @_footprintsLayer?.onRemove(@_map)
      @_footprintsLayer = null

    _createFootprintsLayer: ->
      @_destroyFootprintsLayer()
      @_footprintsLayer = L.featureGroup()
      @_footprintsLayer.onAdd(@_map)

    _buildLayerWithOptions: (newOptions) ->
      layer = null
      if @_hasGibs
        # GranuleCanvasLayer needs to handle time
        newOptions = L.extend({}, newOptions)
        delete newOptions.time

        layer = new GranuleCanvasLayer(@url(), @_toTileLayerOptions(newOptions))
        layer.setResults(@_results)
      layer

    _loadResults: (results) ->
      @_results = results
      @layer?.setResults(results)

      @_createFootprintsLayer()

      @_visualizePoints(results)

      bounds = @_footprintsLayer.getBounds()
      if bounds.getNorthEast()?
        @_map.fitBounds(bounds)

    _visualizePoints: (granules) ->
      footprints = @_footprintsLayer
      added = []
      for granule in granules
        for point in granule.getPoints() ? []
          pointStr = point.toString()
          if added.indexOf(pointStr) == -1
            added.push(pointStr)
            footprints.addLayer(L.circleMarker(point))
