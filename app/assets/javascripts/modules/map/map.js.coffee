ns = window.edsc.map

ns.Map = do (window,
             document,
             L,
             ProjExt = ns.L.Proj,
             ProjectionSwitcher = ns.L.ProjectionSwitcher
             LayerBuilder = ns.LayerBuilder,
             dateUtil = window.edsc.util.date) ->

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
      map = @map = new L.Map(el, zoomControl: false)
      map.addControl(L.control.zoom(position: 'topright'))
      map.addControl(new ProjectionSwitcher())
      @setProjection(projection)
      @_buildLayers()

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
    # $.getJSON '/assets-dev/modules/map/debug-geojson.json', {}, (json) -> map.debugShowGeoJson(json)

    # Log the mouse lat / lon to the console
    #map.startMouseDebugging()

  exports = Map
