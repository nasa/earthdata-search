ns = @edsc.map.L

ns.GranuleGridLayer = do (
  L
  arrayUtil = @edsc.util.array
  capitalize = @edsc.util.string.capitalize
  config = @edsc.config
  dividePolygon = @edsc.map.geoutil.dividePolygon
  gibsUrl = @edsc.config.gibsUrl
  projectPath=ns.interpolation.projectPath
) ->

  MAX_RETRIES = 1 # Maximum number of times to attempt to reload an image

  isClockwise = (path) ->
    sum = 0
    for [p0, p1] in arrayUtil.pairs(path)
      sum += (p1.x - p0.x) * (p1.y + p0.y)
    sum > 0

  addPath = (ctx, path) ->
    {path, poly, line, point} = path

    if poly? || line?
      poly ?= line
      len = poly.length
      return if len < 2

      ctx.moveTo(poly[0].x, poly[0].y)
      ctx.lineTo(p.x, p.y) for p in poly[1...]
      ctx.closePath() unless line?
    else if point?
      {x, y} = point
      ctx.moveTo(x + 10, y)
      ctx.arc(x, y, 10, 0, 2 * Math.PI, isCounterclockwise ? true);
    null

  class GranuleGridLayer extends L.GridLayer
    initialize: (@collection, color, @multiOptions) ->
      if @collection.granuleDatasource()
        @granules = @collection.granuleDatasource().data()
      else
        @_datasourceSubscription = @collection.granuleDatasource.subscribe(@_subscribe)

      @color = color ? '#25c85b';
      @originalOptions = tileSize: 512
      super(@originalOptions)

    onAdd: (map) ->
      super()

      @_container.setAttribute('id', "granule-vis-#{@collection.id}")
      @_handle(map, 'on', 'edsc.focuscollection')
      @setFocus(map.focusedCollection?.id == @collection.id)

      @_resultsSubscription = @granules?.results?.subscribe(@_loadResults.bind(this))
      @_loadResults(@granules?.results())
      @_added = true

    onRemove: (map) ->
      super(map)
      @_added = false

      @setFocus(false, map)
      @_handle(map, 'off', 'edsc.focuscollection')
      @_resultsSubscription?.dispose()
      @_results = null

    _subscribe: ->
      console.warn 'sub', @collection.granuleDatasource()
      if @collection.granuleDatasource() && @_added && !@_resultsSubscription
        granuleDatasource = @collection.granuleDatasource()
        @granules = granuleDatasource.data()
        @_resultsSubscription = @granules?.results?.subscribe(@_loadResults.bind(this))
        @_loadResults(@granules?.results())
        @_datasourceSubscription?.dispose()

    createTile: (tilePoint) ->
      tile = @_createTile()

      # # force the map _zoom to the new value before we calculate
      # # where things need to be drawn
      # # This was to fix the granules being drawn incorrectly after a zoom, but
      # # it isn't needed if we turn zoomAnimation off for the map
      # @_map._zoom = tilePoint.z
      @drawTile(tile, @_getBackTile(tilePoint), tilePoint)

      tile

    _createTile: ->
      tile = L.DomUtil.create('canvas', 'leaflet-tile')

      size = @getTileSize()
      tile.width = size.x
      tile.height = size.y
      ctx = tile.getContext('2d')
      tile.onselectstart = tile.onmousemove = L.Util.falseFn
      tile

    _getBackTile: (tilePoint) ->
      key = "#{tilePoint.x}:#{tilePoint.y}"
      @_backTiles ?= {}
      @_backTiles[key] ?= @_createTile()
      @_backTiles[key]

    _matches: (granule, matcher) ->
      operators = ['>=', '<=']
      for own prop, value of matcher
        granuleValue = granule[prop].split('T')[0]
        return false if value && !granuleValue
        op = null
        for operator in operators
          if value.indexOf(operator) == 0
            op = operator
            value = value.substring(operator.length)
            break

        return false if op == '>=' && granuleValue < value
        return false if op == '<=' && granuleValue > value
        return false if !op && value != granuleValue
      true

    _getlprojection: ->
      if @options.geo
        'epsg4326'
      else if @options.arctic
        'epsg3031'
      else if @options.antarctic
        'epsg3413'

    _getTileUrl: (coords) ->
      data =
        lprojection: @_getlprojection()
        x: coords.x
        y: coords.y
        z: coords.z
        time: @options.time
      if @_map and !@_map.options.crs.infinite
        invertedY = @_globalTileRange.max.y - (coords.y)
        if @options.tms
          data['y'] = invertedY
        data['-y'] = invertedY
      L.Util.template @_url, L.Util.extend(data, @options)

    getTileUrl: (tilePoint, granule) ->
      return null unless @multiOptions
      date = granule.time_start?.substring(0, 10)

      matched = false
      for optionSet in @multiOptions when @_matches(granule, optionSet.match)
        oldResolution = optionSet.resolution
        # set resolution to {projection}_resolution if it exists
        # and if the layer exists within optionSet
        if this._map.projection == 'geo' && optionSet.geo
          matched = true
          newResolution = optionSet.geo_resolution
        else if this._map.projection == 'arctic' && optionSet.arctic
          matched = true
          newResolution = optionSet.arctic_resolution
        else if this._map.projection == 'antarctic' && optionSet.antarctic
          matched = true
          newResolution = optionSet.antarctic_resolution

        # Use default resolution unless newResolution exists
        newResolution = oldResolution unless newResolution?
        optionSet.resolution = newResolution

        @options = L.extend({}, @originalOptions, optionSet)
        break

      return unless matched

      @options.time = date
      if @options.granule
        this._originalUrl = this._originalUrl || this._url;
        this._url = config.gibsGranuleUrl || this._originalUrl;
        @options.time = granule.time_start.replace(/\.\d{3}Z$/, 'Z')
      else
        this._url = this._originalUrl || this._url || gibsUrl;

      @_getTileUrl(tilePoint)

    drawTile: (canvas, back, tilePoint) ->
      return unless @_results? && @_results.length > 0

      tileSize = @getTileSize()

      bounds = @_tileCoordsToBounds(tilePoint)
      nwPoint = @_map.latLngToLayerPoint(bounds.getNorthWest())

      nePoint = nwPoint.add([tileSize.x, 0])
      sePoint = nwPoint.add([tileSize.x, tileSize.y])
      swPoint = nwPoint.add([0, tileSize.y])
      boundary = {poly: [nwPoint, nePoint, sePoint, swPoint]}
      boundary.poly.reverse() unless isClockwise(boundary.poly)
      bounds = bounds.pad(0.1)
      date = null
      paths = []
      pathsWithHoles = []

      for granule, i in @_results
        overlaps = @_granulePathsOverlappingTile(granule, bounds)
        if overlaps.length > 0
          url = @getTileUrl(tilePoint, granule)
          for path, j in overlaps
            path.index = i
            path.url = url
            path.granule = granule
            if path.poly?
              reverse = (j == 0) == isClockwise(path.poly)
              path.poly.reverse() if reverse
          pathsWithHoles.push(overlaps)
          paths = paths.concat(overlaps)

      setTimeout((=> @_drawOutlines(canvas, paths, nwPoint)), 0)
      setTimeout((=> @_drawClippedPaths(canvas, boundary, pathsWithHoles, nwPoint)), 0)
      setTimeout((=> @_drawClippedImagery(canvas, boundary, paths, nwPoint, tilePoint)), 0)
      setTimeout((=> @_drawFullBackTile(back, boundary, pathsWithHoles.concat().reverse(), nwPoint)), 0)

      if paths.length > 0 && config.debug
        console.log "#{paths.length} Overlapping Granules [(#{bounds.getNorth()}, #{bounds.getWest()}), (#{bounds.getSouth()}, #{bounds.getEast()})]"
      null

    _drawOutlines: (canvas, paths, nwPoint) ->
      ctx = canvas.getContext('2d')
      ctx.save()
      ctx.translate(-nwPoint.x, -nwPoint.y)

      # Faint stroke of whole path
      ctx.strokeStyle = 'rgba(128, 128, 128, .2)'
      for path in paths
        ctx.beginPath()
        addPath(ctx, path)
        ctx.stroke()
      ctx.restore()
      null

    _drawClippedPaths: (canvas, boundary, pathsWithHoles, nwPoint) ->
      ctx = canvas.getContext('2d')
      ctx.save()
      ctx.translate(-nwPoint.x, -nwPoint.y)
      ctx.strokeStyle = @color

      for pathWithHoles in pathsWithHoles
        [path, holes...] = pathWithHoles

        ctx.beginPath()
        addPath(ctx, path)
        for hole in holes
          addPath(ctx, {poly: hole.poly.concat().reverse()})
        ctx.stroke()
        addPath(ctx, boundary)
        ctx.clip() unless path.line?.length > 0
      ctx.restore()
      null

    _loadImage: (url, callback, retries=0) ->
      if url?
        image = new Image()
        image.onload = ->
          callback(this)
          document.body.removeChild(image)

        image.onerror = (e) =>
          if retries < MAX_RETRIES
            @_loadImage(url, callback, retries + 1)
          else
            console.error("Failed to load tile after #{MAX_RETRIES} tries: #{url}")
            callback(null)

        # IE seems to like to get smart and occasionally not load images when they're
        # not in the DOM
        image.setAttribute('style', 'display: none;');
        document.body.appendChild(image)
        image.src = url
      else
        callback(null)

    _drawClippedImage: (ctx, boundary, paths, nwPoint, image, size) ->
      if image?
        ctx.save()
        ctx.beginPath()
        addPath(ctx, path) for path in paths
        ctx.clip()
        ctx.globalCompositeOperation = 'destination-over'
        ctx.drawImage(image, nwPoint.x, nwPoint.y, size, size)
        ctx.restore()

      for path in paths
        ctx.beginPath()
        addPath(ctx, path)
        addPath(ctx, boundary)
        ctx.clip()
      null

    _drawClippedImagery: (canvas, boundary, paths, nwPoint, tilePoint) ->
      ctx = canvas.getContext('2d')
      ctx.save()
      ctx.translate(-nwPoint.x, -nwPoint.y)

      url = null
      currentPaths = []
      pathsByUrl = []

      for path in paths
        if path.url != url
          # Draw everything in current
          if currentPaths.length > 0
            pathsByUrl.push({url: url, urlPaths: currentPaths})
          currentPaths = [path]
          url = path.url
        else
          currentPaths.push(path)

      if currentPaths.length > 0
        pathsByUrl.push({url: url, urlPaths: currentPaths})

      queue = []
      index = 0

      size = canvas.width
      self = this
      for {url, urlPaths}, i in pathsByUrl
        do (i, urlPaths, url) ->
          self._loadImage url, (image) ->
            queue[i] = ->
              self._drawClippedImage(ctx, boundary, urlPaths, nwPoint, image, size)

            while queue[index]?
              queue[index]()
              queue[index] = null # Allow GC of image data
              index++
            if index == pathsByUrl.length
              ctx.restore()
      null


    _drawFullBackTile: (canvas, boundary, pathsWithHoles, nwPoint) ->
      ctx = canvas.getContext('2d')

      ctx.save()
      ctx.translate(-nwPoint.x, -nwPoint.y)
      for pathWithHoles in pathsWithHoles
        [path, holes...] = pathWithHoles

        ctx.strokeStyle = ctx.fillStyle = '#' + (path.index + 0x1000000).toString(16).substr(-6)
        ctx.beginPath()
        addPath(ctx, path)
        for hole in holes
          addPath(ctx, hole)
        if path.line?
          ctx.lineWidth = 4
          ctx.stroke()
        else
          ctx.fill()
      ctx.restore()
      null

    _addIntersections: (result, paths, bounds, type, interpolation) ->
      return null unless paths?

      for path in paths
        shapeBounds = L.latLngBounds(path)
        if shapeBounds.intersects(bounds)
          intersection = {}
          intersection[type] = projectPath(@_map, path, interpolation, 2, 5)
          result.push(intersection)
      null

    _granulePathsOverlappingTile: (granule, tileBounds) ->
      result = []
      map = @_map

      intersects = @_intersects
      interpolation = if granule.isCartesian() then 'cartesian' else 'geodetic'
      for polygon in granule.getPolygons() ? []
        if granule.isCartesian()
          @_addIntersections(result, polygon, tileBounds, 'poly', interpolation)
        else
          # Handle holes
          polygon = [polygon] unless Array.isArray(polygon[0])
          for shape in polygon
            interiors = dividePolygon(shape).interiors
            @_addIntersections(result, interiors, tileBounds, 'poly', interpolation)
        # Workaround for EDSC-657
        # Avoid spamming the map with a large number of barely intersecting orbits by only
        # drawing the first orbit. Hovering will continue to draw the full orbit.
        break if granule.orbit

      @_addIntersections(result, granule.getRectangles(), tileBounds, 'poly', 'cartesian')
      @_addIntersections(result, granule.getLines(), tileBounds, 'line', interpolation)

      for point in granule.getPoints() ? [] when tileBounds.contains(point)
        result.push({point: @_map.latLngToLayerPoint(point)})

      result

    granuleAt: (p) ->
      origin = @_map.getPixelOrigin()
      tileSize = @getTileSize()
      tilePoint = p.add(origin).divideBy(tileSize.x).floor()
      canvas = @_getBackTile(tilePoint)
      bounds = @_tileCoordsToBounds(tilePoint)

      tilePixel = p.subtract(@_map.latLngToLayerPoint(bounds.getNorthWest()))

      result = null
      ctx = canvas.getContext('2d')
      data = ctx.getImageData(tilePixel.x, tilePixel.y, 1, 1).data
      if data[3] == 255
        index = (data[0] << 16) + (data[1] << 8) + data[2]
        result = @_results?[index]

      result

    setResults: (results) ->
      @_results = results
      @redraw()

    _reorderedResults: (results, defaultResults) ->
      if @_stickied?
        results = results.concat()
        index = results.indexOf(@_stickied)
        if index == -1
          @_stickied = null
          @stickyId = null
          @_granuleStickyLayer?.onRemove(@_map)
          @_granuleStickyLayer = null
        else
          results.splice(index, 1)
          results.unshift(@_stickied)
        results
      else
        defaultResults

    _loadResults: (results) ->
      @setResults(@_reorderedResults(results, @granules?.results()))

    setFocus: (focus, map=@_map) ->
      return if @_isFocused == focus
      @_isFocused = focus
      events = ['edsc.mousemove', 'edsc.mouseout', 'click', 'edsc.focusgranule', 'edsc.stickygranule']
      if focus
        @_handle(map, 'on', events...)
      else
        @_handle(map, 'off', events...)
        @_granuleFocusLayer?.onRemove(map)
        @_granuleFocusLayer = null
        @_granuleStickyLayer?.onRemove(map)
        @_granuleStickyLayer = null

    _handle: (obj, onOrOff, events...) ->
      for event in events
        method = '_on' + event.split('.').map(capitalize).join('')
        obj[onOrOff] event, this[method]

    _onEdscFocuscollection: (e) =>
      @setFocus(e.collection?.id == @collection.id)

    _onEdscMouseout: (e) =>
      if @_granule?
        @_map.fire('edsc.focusgranule', granule: null)

    _onEdscMousemove: (e) =>
      granule = @granuleAt(e.layerPoint)
      if @_granule != granule
        @_map.fire('edsc.focusgranule', granule: granule)

    _onClick: (e) =>
      if $(e.originalEvent.target).closest('a').hasClass('panel-list-remove')
        return @_map.fire('edsc.excludestickygranule')
      return unless $(e.originalEvent.target).closest('a').length == 0
      granule = @granuleAt(e.layerPoint)
      granule = null if @_stickied == granule
      @_map.fire('edsc.focusgranule', granule: granule)
      @_map.fire('edsc.stickygranule', granule: granule)

    _onEdscFocusgranule: (e) =>
      @_granule = granule = e.granule

      @_granuleFocusLayer?.onRemove(@_map)
      @_granuleFocusLayer = @_focusLayer(granule, false)
      @_granuleFocusLayer?.onAdd(@_map)

    _onEdscStickygranule: (e) =>
      granule = e.granule

      return if @_stickied == granule

      @_stickied = granule
      @stickyId = granule?.id # Ugly hack for testing

      @_granuleStickyLayer?.onRemove(@_map)
      @_granuleStickyLayer = @_stickyLayer(granule, true)
      if @_granuleStickyLayer?
        @_granuleStickyLayer.onAdd(@_map)

        if @_map.projection == 'geo' && @_granuleFocusLayer?
          bounds = @_granuleFocusLayer.getBounds()
          # Avoid zooming and panning tiny amounts
          if bounds?.isValid() && !@_map.getBounds().contains(bounds)
            @_map.fitBounds(bounds.pad(0.2)).panTo(bounds.getCenter())

      @_loadResults(@_results)

    _granuleLayer: (granule, options) ->
      granule.buildLayer(options)

    _focusLayer: (granule) ->
      return null unless granule?

      granule.buildLayer(clickable: false, color: @color, fillColor: @color, opacity: 1)

    _stickyLayer: (granule) ->
      return null unless granule?

      layer = granule.buildLayer(fillOpacity: 0, clickable: false, color: @color, fillColor: @color, opacity: 1)

      temporal = granule.getTemporal()

      if temporal[0] && temporal[1]
        temporalLabel = "<p>#{temporal[0]}</p><p>#{temporal[1]}</p>"
      else if temporal[0]
        temporalLabel = "<p>#{temporal[0]}</p>"
      else if temporal[1]
        temporalLabel = "<p>#{temporal[1]}</p>"

      excludeHtml = ''
      if @collection.granuleDatasource()?.hasCapability('excludeGranules')
        excludeHtml = '<a class="panel-list-remove" href="#" title="Remove granule"><span class="fa-stack"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-times fa-stack-1x fa-inverse"></i></span></a>'
      icon = new L.divIcon
        className: 'granule-spatial-label',
        html: "<span class=\"granule-spatial-label-temporal\">#{temporalLabel}</span>#{excludeHtml}"


      marker = L.marker([0, 0], clickable: false, icon: icon)
      layer.addLayer(marker)

      firstShape = layer.getLayers()[0]
      firstShape = firstShape._interiors if firstShape?._interiors?

      firstShape?.on 'add', (e) ->
        map = @_map
        center = if @getLatLng? then @getLatLng() else @getCenter()
        marker.setLatLng(center)

      layer

  exports = GranuleGridLayer
