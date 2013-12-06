ns = window.edsc.map.L

ns.GibsTileLayer = do (L, ProjectionSwitchingLayer = ns.ProjectionSwitchingLayer) ->

  gibsUrl = 'https://map1c.vis.earthdata.nasa.gov/wmts-{endpoint}/wmts.cgi?{timeparam}SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER={product}&STYLE=&TILEMATRIXSET={projection}_{resolution}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2F{format}{extra}'

  parent = ProjectionSwitchingLayer.prototype

  # Wraps L.TileLayer to handle GIBS-based tile layers, with the additional
  # ability to change layer projections.
  # Implements the ILayer interface, so it may be added directly to an Leaflet
  # map
  class GibsTileLayer extends ProjectionSwitchingLayer
    defaultOptions:
      format: 'jpeg'
      tileSize: 512
      extra: ''

    arcticOptions: L.extend({}, parent.arcticOptions, projection: 'EPSG3413', endpoint: 'arctic')
    antarcticOptions: L.extend({}, parent.antarcticOptions, projection: 'EPSG3031', endpoint: 'antarctic')
    geoOptions: L.extend({}, parent.geoOptions, projection: 'EPSG4326', endpoint: 'geo')

    # Given a set of options, re-initializes the underlying T.TileLayer
    # so that it uses those options.  If the underlying T.TileLayer does
    # not yet exists, constructs it.
    _buildLayerWithOptions: (newOptions) ->
      options = @options
      L.extend(options, newOptions)

      time = options['time']
      options['timeparam'] = if time? then "TIME=#{time}&" else ""

      new L.TileLayer(gibsUrl, options)

  exports = GibsTileLayer
