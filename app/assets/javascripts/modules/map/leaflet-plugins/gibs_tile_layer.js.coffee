ns = window.edsc.map.L

ns.GibsTileLayer = do (L) ->

  gibsUrl = 'https://map1c.vis.earthdata.nasa.gov/wmts-{endpoint}/wmts.cgi?{timeparam}SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={product}&STYLE=&TILEMATRIXSET={projection}_{resolution}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2F{format}{extra}'

  defaultLayerOptions =
    format: 'jpeg'
    tileSize: 512
    extra: ''

  # Wraps L.TileLayer to handle GIBS-based tile layers, with the additional
  # ability to change layer projections.
  # Implements the ILayer interface, so it may be added directly to an Leaflet
  # map
  class GibsTileLayer
    # Given options (optional, see L.TileLayer docs) and a projection (optional,
    # see edsc.map.Map docs) constructs a new GIBS-based tile layer
    constructor: (options={}, projection='geo') ->
      @options = options
      (options[k] ?= v for own k, v of defaultLayerOptions)
      this[projection]()

    # ILayer methods.  Delegate to the underlying L.TileLayer
    onAdd: (map) ->
      @layer.onAdd(map)
      map.on 'projectionchange', @_onProjectionChange

    onRemove: (map) ->
      @layer.onRemove(map)
      map.off 'projectionchange', @_onProjectionChange

    _onProjectionChange: (e) => this[e.projection]()

    # Switch to arctic projection
    arctic: ->
      @_initWithOptions
        projection: 'EPSG3413'
        endpoint: 'arctic'
        noWrap: true
        continuousWorld: true

    # Switch to antarctic projection
    antarctic: ->
      @_initWithOptions
        projection: 'EPSG3031'
        endpoint: 'antarctic'
        noWrap: true
        continuousWorld: true

    # Switch to geo projection
    geo: ->
      @_initWithOptions
        projection: 'EPSG4326'
        endpoint: 'geo'

    # Given a set of options, re-initializes the underlying T.TileLayer
    # so that it uses those options.  If the underlying T.TileLayer does
    # not yet exists, constructs it.
    _initWithOptions: (newOptions) ->
      options = @options
      options[k] = v for own k, v of newOptions

      time = options['time']
      options['timeparam'] = if time? then "TIME=#{time}&" else ""

      if @layer?
        L.TileLayer.prototype.initialize.call(@layer, gibsUrl, options)
        @layer.setUrl(gibsUrl) # Forces a redraw / cache refresh
        @layer.redraw()
      else
        @layer = new L.TileLayer(gibsUrl, options)

  exports = GibsTileLayer
