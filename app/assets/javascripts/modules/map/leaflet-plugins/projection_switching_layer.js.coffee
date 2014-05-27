ns = window.edsc.map.L

ns.ProjectionSwitchingLayer = do (L) ->
  # Wraps L.TileLayer to add ability to change layer projections.
  # Implements the ILayer interface, so it may be added directly to an Leaflet
  # map.
  # Abstract class.  Child classes must implement _buildLayerWithOptions to
  # build and return the underlying layer
  class ProjectionSwitchingLayer
    defaultOptions: {}

    # Given options (optional, see L.TileLayer docs) and a projection (optional,
    # see edsc.map.Map docs) constructs a new GIBS-based tile layer
    constructor: (options={}) ->
      @options = L.extend({}, @defaultOptions, options)

    # ILayer methods.  Delegate to the underlying L.TileLayer
    onAdd: (map) ->
      @_map = map
      @updateOptions()
      map.on 'projectionchange', @_onProjectionChange

    onRemove: (map) ->
      @_map = null
      @layer?.onRemove(map)
      @layer = null
      map.off 'projectionchange', @_onProjectionChange

    setZIndex: (@zIndex) ->
      @layer?.setZIndex(@zIndex)

    validForProjection: (proj) ->
      @options[proj] != false

    _onProjectionChange: (e) =>
      @updateOptions()

    updateOptions: (options={}) ->
      map = @_map

      if @layer?
        @layer.onRemove(map)
        @layer.off 'tileerror'
        @layer = null

      projection = map.projection
      return unless @validForProjection(projection)

      options = L.extend({}, this["#{projection}Options"], options)
      layer = @layer = @_buildLayerWithOptions(options)
      if layer?
        layer.setZIndex(@zIndex ? 0)
        layer.addTo(map)

        # Retry loading a tile once if it errors
        layer.on 'tileerror', (e) ->
          src = e.tile.src
          retryCount = src.match(/&retry=(\d+)$/)
          if !retryCount
            e.tile.src += '&retry=1'

    # Arctic projection options
    arcticOptions:
      noWrap: true
      continuousWorld: true

    # Arctic projection options
    antarcticOptions:
      noWrap: true
      continuousWorld: true

    # Geo projection options
    geoOptions:
      noWrap: true # Set this to false when people inevitibly ask us for imagery across the meridian
      continuousWorld: false

    _buildLayerWithOptions: (newOptions) ->
      console.error("Implement _buildLayerWithOptions", this)

  exports = ProjectionSwitchingLayer
