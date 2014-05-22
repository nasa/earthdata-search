ns = @edsc.map.L

ns.GibsTileLayer = do (L,
                       ProjectionSwitchingLayer = ns.ProjectionSwitchingLayer,
                       gibsUrl = @edsc.config.gibsUrl,
                       dateUtil = window.edsc.util.date,
                       config = @edsc.config
                       ) ->

  # TODO: Add blue marble north / south
  # http://map1.vis.earthdata.nasa.gov/wmts-bluemarble-antarctic/blue_marble_antarctic/default/EPSG3031_BlueMarble/0/0/0.jpg
  # http://map1.vis.earthdata.nasa.gov/wmts-bluemarble-arctic/blue_marble_arctic/default/EPSG3413_BlueMarble/0/0/0.jpg

  parent = ProjectionSwitchingLayer.prototype

  yesterday = new Date(config.present())
  yesterday.setDate(yesterday.getDate() - 1)

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

    onAdd: (map) ->
      @options.time = dateUtil.isoUtcDateString(map.time) if @options.syncTime && map.time?
      super(map)
      map.on 'edsc.timechange', @_onTimeChange

    onRemove: (map) ->
      super(map)
      map.off 'edsc.timechange', @_onTimeChange

    _onTimeChange: (e) =>
      if @options.syncTime
        date = e.time ? yesterday
        console.log 'time', dateUtil.isoUtcDateString(date)
        @updateOptions(time: dateUtil.isoUtcDateString(date))

    _toTileLayerOptions: (newOptions) ->
      options = @options
      L.extend(options, newOptions)

      time = options['time']
      options['timeparam'] = if time? then "TIME=#{time}&" else ""

      if options['endpoint'] == 'arctic' && options['product_arctic']
        options['product'] = options['product_arctic']

      if options['endpoint'] == 'antarctic' && options['product_antarctic']
        options['product'] = options['product_antarctic']

      if options['endpoint'] == 'geo' && options['product_geo']
        options['product'] = options['product_geo']

      options

    url: ->
      gibsUrl

    # Given a set of options, re-initializes the underlying T.TileLayer
    # so that it uses those options.  If the underlying T.TileLayer does
    # not yet exists, constructs it.
    _buildLayerWithOptions: (newOptions) ->
      new L.TileLayer(@url(), @_toTileLayerOptions(newOptions))

  exports = GibsTileLayer
