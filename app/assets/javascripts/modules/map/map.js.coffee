ns = window.edsc.map

ns.Map = do (window,
             document,
             L,
             searchModel = window.edsc.models.searchModel
             ProjExt = ns.L.Proj,
             ProjectionSwitcher = ns.L.ProjectionSwitcher
             LayerBuilder = ns.LayerBuilder,
             dateUtil = window.edsc.util.date) ->

  # Fix leaflet default image path
  L.Icon.Default.imagePath = L.Icon.Default.imagePath.replace(/\/images$/, '')

  # NOTE TO PQ: Override L.Polyline.prototype.projectLatlngs to follow arcs

  class SpatialSelectionControl
    addTo: (map) ->
      @map = map
      drawnItems = @_drawnItems = new L.FeatureGroup()
      drawnItems.addTo(map)

      drawControl = @_drawControl = new L.Control.Draw
        draw:
          polyline: false
          circle: false
        edit:
          featureGroup: drawnItems
        position: 'topright'

      drawControl.addTo(map)

      spatialModel = searchModel.query.spatial
      @_querySubscription = spatialModel.subscribe(@_onSpatialChange)
      @_onSpatialChange(spatialModel())

      map.on 'draw:drawstart', @_onDrawStart
      map.on 'draw:drawstop', @_onDrawStop
      map.on 'draw:created', @_onDrawCreated
      map.on 'draw:edited', @_onDrawEdited
      map.on 'draw:deleted', @_onDrawDeleted

      spatialType = searchModel.ui.spatialType
      el.addEventListener('click', spatialType.selectRectangle) for el in @_getToolLinksForName('Rectangle')
      el.addEventListener('click', spatialType.selectPolygon) for el in @_getToolLinksForName('Polygon')
      el.addEventListener('click', spatialType.selectPoint) for el in @_getToolLinksForName('Point')
      el.addEventListener('click', spatialType.selectNone) for el in @_getToolLinksForName('Cancel')

      @_toolSubscription = spatialType.name.subscribe(@_onToolChange)
      @_onToolChange(spatialType.name())

    onRemove: (map) ->
      @map = null

      @_drawnItems.removeFrom(map)
      @_drawControl.removeFrom(map)
      @_querySubscription.dispose()
      @_toolSubscription.dispose()
      map.off 'draw:drawstart', @_onDrawStart
      map.off 'draw:drawstop', @_onDrawStop
      map.off 'draw:created', @_onDrawCreated
      map.off 'draw:edited', @_onDrawEdited
      map.off 'draw:deleted', @_onDrawDeleted

      spatialType = searchModel.ui.spatialType
      el.removeEventListener('click', spatialType.selectRectangle) for el in @_getToolLinksForName('Rectangle')
      el.removeEventListener('click', spatialType.selectPolygon) for el in @_getToolLinksForName('Polygon')
      el.removeEventListener('click', spatialType.selectPoint) for el in @_getToolLinksForName('Point')
      el.removeEventListener('click', spatialType.selectNone) for el in @_getToolLinksForName('Cancel')

    _getToolLinksForName: (name) ->
      container = @map?.getContainer()
      return [] unless container?
      switch name
        when 'Rectangle' then container.getElementsByClassName('leaflet-draw-draw-rectangle')
        when 'Polygon' then container.getElementsByClassName('leaflet-draw-draw-polygon')
        when 'Point' then container.getElementsByClassName('leaflet-draw-draw-marker')
        else container.querySelectorAll('.leaflet-draw-section a[title="Cancel drawing"]')

    _onToolChange: (name) =>
      link = @_getToolLinksForName(name)[0]
      event = new MouseEvent('click', view: window, bubbles: true, cancelable: true)
      link?.dispatchEvent(event)

    _onDrawStart: (e) =>
      # Remove the old layer
      @_oldLayer = @_layer
      @_removeSpatial()

    _onDrawStop: (e) =>
      # The user cancelled without committing.  Restore the old layer
      if @_oldLayer?
        @_layer = @_oldLayer
        @_oldLayer = null
        @_drawnItems.addLayer(@_layer)

    _onDrawCreated: (e) =>
      @_addLayer(e.target, e.layer, e.layerType)

    _onDrawEdited: (e) =>
      @_addLayer(e.target)

    _addLayer: (map, layer=@_layer, type=@_layer.type) ->
      @_oldLayer = null
      @_layer = layer
      @_layer.type = type

      @_saveSpatialParams(layer, type)

      @_drawnItems.addLayer(layer)

    _onDrawDeleted: (e) =>
      @_removeSpatial()
      searchModel.query.spatial("")

    _onSpatialChange: (newValue) =>
      if !newValue? || newValue.length == 0
        @_removeSpatial()
      else
        @_loadSpatialParams(newValue)

    _renderSpatial: (type, shape) ->

    _removeSpatial: () ->
      if @_layer
        @_drawnItems.removeLayer(@_layer) if @_layer
        @_layer = null

    _renderMarker: (shape) ->
      console.log @_drawControl
      marker = new L.Marker(shape[0], icon: L.Draw.Marker.prototype.options.icon)
      @_drawnItems.addLayer(marker)

    _renderRectangle: (shape) ->
      bounds = new L.LatLngBounds(shape...)
      rect = new L.Rectangle(bounds, L.Draw.Rectangle.prototype.options.shapeOptions)
      @_drawnItems.addLayer(rect)

    _renderPolygon: (shape) ->
      poly = new L.Polygon(shape, L.Draw.Polygon.prototype.options.shapeOptions)
      @_drawnItems.addLayer(poly)

    _saveSpatialParams: (layer, type) ->
      type = 'point' if type == 'marker'

      shape = switch type
        when 'point'     then [layer.getLatLng()]
        when 'bounding_box' then [layer.getLatLngs()[0], layer.getLatLngs()[2]]
        when 'polygon'   then layer.getLatLngs()
        else console.error("Unrecognized shape: #{type}")

      shapePoints = ("#{p.lng},#{p.lat}" for p in shape)
      shapeStr = shapePoints.join(':')

      serialized = "#{type}:#{shapeStr}"
      @_spatial = serialized
      searchModel.query.spatial(serialized)

    _loadSpatialParams: (spatial) ->
      return if spatial == @_spatial
      console.log "Loading spatial params"
      @_spatial = spatial
      [type, shapePoints...] = spatial.split(':')
      shape = for pointStr in shapePoints
        L.latLng((pointStr.split(','))...)

      switch type
        when 'point'     then @_renderMarker(shape)
        when 'bounding_box' then @_renderRectangle(shape)
        when 'polygon'   then @_renderPolygon(shape)
        else console.error("Cannot render spatial type #{type}")

  # Constructs and performs basic operations on maps
  # This class wraps the details of setting up the map used by the application,
  # setting up GIBS layers, supported projections, etc.
  # Code outside of the edsc.map module should interact with this class only
  class Map
    # Creates a map attached to the given element with the given projection
    # Valid projections are:
    #   'geo' (EPSG:4326, WGS 84 / Plate Carree)
    #   'arctic' (EPSG:3413, WGS 84 / NSIDC Sea Ice Polar Stereographic North)
    #   'antarctic' (EPSG:3031, WGS 84 / Antarctic Polar Stereographic)
    constructor: (el, projection='geo') ->
      $(el).data('map', this)
      @layers = []
      map = @map = new L.Map(el, zoomControl: false, attributionControl: false)
      @_buildLayers()
      map.addControl(L.control.zoom(position: 'topright'))
      map.addControl(new ProjectionSwitcher())
      map.addControl(new SpatialSelectionControl())
      @setProjection(projection)
      @_addDrawControls()

    _createLayerMap: (productIds...) ->
      layerForProduct = LayerBuilder.layerForProduct
      projection = @projection
      result = {}
      for productId in productIds
        layer = layerForProduct(productId, projection)
        result[layer.name] = layer
      result

    _buildLayers: ->
      baseMaps = @_createLayerMap('MODIS_Terra_CorrectedReflectance_TrueColor', 'land_water_map')
      overlayMaps = @_createLayerMap('administrative_boundaries', 'coastlines')

      # Show the first layer
      for own k, layer of baseMaps
        @map.addLayer(layer)
        break

      @map.addControl(L.control.layers(baseMaps, overlayMaps))

    _addDrawControls: ->
      map = @map
      map.on 'draw:created', (e) ->


    # Removes the map from the page
    destroy: ->
      @map.remove()

    # Adds the given layer to the map
    addLayer: (layer) -> @map.addLayer(layer)

    # Removes the given layer from the map
    removeLayer: (layer) -> @map.removeLayer(layer)

    projectionOptions:
      arctic:
        crs: ProjExt.epsg3413
        minZoom: 0
        maxZoom: 5
        zoom: 0
        continuousWorld: true
        noWrap: true
        center: [90, 0]
      antarctic:
        crs: ProjExt.epsg3031
        minZoom: 0
        maxZoom: 5
        zoom: 0
        continuousWorld: true
        noWrap: true
        center: [-90, 0]
      geo:
        crs: ProjExt.epsg4326
        minZoom: 1
        maxZoom: 7
        zoom: 2
        continuousWorld: false
        noWrap: false
        center: [0, 0]

    setProjection: (name) ->
      map = @map
      return if @projection == name
      @projection = map.projection = name

      opts = @projectionOptions[name]
      L.setOptions(map, opts)
      map.fire('projectionchange', projection: name, map: map)
      map.setView(L.latLng(opts.center), opts.zoom, reset: true)

    # (For debugging) Display a layer with the given GeoJSON
    debugShowGeoJson: (json) ->
      layer = new L.geoJson(json);
      layer.setStyle
        color: "#0f0"
        weight: 1
        fill: false
        opacity: 1.0

      @addLayer(layer)

    # (For debugging) Log mouse lat / lon to the console as the mouse moves
    startMouseDebugging: ->
      @map.on 'mousemove', @_debugMouseMovement

    # (For debugging) Stop logging mouse lat / lon to the console
    stopMouseDebugging: ->
      @map.off 'mousemove', @_debugMouseMovement

    _debugMouseMovement: (e) =>
      console.log('mousemove', e.latlng.lat.toFixed(2), e.latlng.lng.toFixed(2))

  $(document).ready ->
    projection = 'geo'
    map = new Map(document.getElementById('map'), projection)

    # Useful debugging snippets

    # Add outlines of US States to the map to help ensure correct projections and tile positioning
    #$.getJSON '/assets-dev/modules/map/debug-geojson.json', {}, (json) -> map.debugShowGeoJson(json)

    # Log the mouse lat / lon to the console
    #map.startMouseDebugging()

  exports = Map
