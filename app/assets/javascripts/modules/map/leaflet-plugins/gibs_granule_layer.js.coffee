ns = @edsc.map.L

ns.GibsGranuleLayer = do (L, GibsTileLayer = ns.GibsTileLayer) ->

  # Most of this is ported from L.TileLayer.Canvas, which is in our leaflet version but
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

    drawTile: (canvas, tilePoint, zoom) ->
      image = new Image()
      image.onload = (e) =>
        img = e.srcElement
        ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        @tileDrawn(canvas)
      image.src = @getTileUrl(tilePoint)


    tileDrawn: (tile) ->
      # If we do upgrade, this will break, as well as our tile reloading calls.
      # Tile loading seems to be handled via callbacks now.
      @_tileOnLoad.call(tile)

  #parent = GibsTileLayer.prototype

  class GibsGranuleLayer extends GibsTileLayer
    constructor: (@granules, options={}) ->
      super(options)

    onAdd: (map) ->
      super(map)

      @_resultsSubscription = @granules.results.subscribe (results) =>
        @_results = results
        @layer?.setResults(results)

    onRemove: (map) ->
      super(map)

      @_resultsSubscription.dispose()
      @_results = null

    #arcticOptions: parent.arcticOptions
    #antarcticOptions: parent.antarcticOptions
    #geoOptions: parent.geoOptions

    _buildLayerWithOptions: (newOptions) ->
      # GranuleCanvasLayer needs to handle time
      newOptions = L.extend({}, newOptions)
      delete newOptions.time

      # DELETE ME
      yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      newOptions.time = window.edsc.util.date.isoUtcDateString(yesterday)

      layer = new GranuleCanvasLayer(@url(), @_toTileLayerOptions(newOptions))
      layer.setResults(@_results)
      layer
