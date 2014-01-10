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
    constructor: (@name, options={}) ->
      @options = L.extend({}, @defaultOptions, options)

    # ILayer methods.  Delegate to the underlying L.TileLayer
    onAdd: (map) ->
      @layer = @_buildLayerWithOptions(this["#{map.projection}Options"])
      @layer.setZIndex(@zIndex ? 0)
      @layer.onAdd(map)
      map.on 'projectionchange', @_onProjectionChange

    onRemove: (map) ->
      @layer.onRemove(map)
      @layer = null
      map.off 'projectionchange', @_onProjectionChange

    setZIndex: (@zIndex) ->

    validForProjection: (proj) ->
      @options[proj] != false

    _onProjectionChange: (e) =>
      @layer.onRemove(e.map)
      @layer = @_buildLayerWithOptions(this["#{e.projection}Options"])
      @layer.setZIndex(@zIndex ? 0)
      @layer.addTo(e.map)

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
      noWrap: false
      continuousWorld: false

    _buildLayerWithOptions: (newOptions) ->
      console.error("Implement _buildLayerWithOptions", this)

  exports = ProjectionSwitchingLayer
