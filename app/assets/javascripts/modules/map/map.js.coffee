ns = window.edsc.map

ns.Map = do (window,
             document,
             L,
             LExt=ns.L,
             GibsTileLayer=ns.L.GibsTileLayer,
             ProjExt = ns.L.Proj,
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
      @layers = []
      map = @map = new L.Map(el,
        attributionControl: false
        zoomControl: false)
      map.addControl(L.control.layers())
      map.addControl(L.control.zoom(position: 'topright'))
      this[projection]()

    # Removes the map from the page
    destroy: ->
      @map.remove()

    # Adds the given layer to the map
    addLayer: (layer) -> @map.addLayer(layer)

    # Removes the given layer from the map
    removeLayer: (layer) -> @map.removeLayer(layer)

    # Change to the arctic projection
    arctic: ->
      map = @map
      center = [90, 0]
      zoom = 0
      L.setOptions(map,
        crs: ProjExt.epsg3413
        minZoom: 0
        maxZoom: 5
        zoom: zoom
        continuousWorld: true
        noWrap: true
        center: center)
      map.setView(L.latLng(center), zoom, reset: true)
      map.eachLayer(((l) -> l.arctic?()), this)

    # Change to the antarctic projection
    antarctic: ->
      map = @map
      center = [-90, 0]
      zoom = 0
      L.setOptions(map,
        crs: ProjExt.epsg3031
        minZoom: 0
        maxZoom: 5
        zoom: zoom
        center: center)
      map.setView(L.latLng(center), zoom, reset: true)
      map.eachLayer(((l) -> l.antarctic?()), this)

    # Change to the geo projection
    geo: ->
      map = @map
      center = [0, 0]
      zoom = 2
      L.setOptions(map,
        crs: ProjExt.epsg4326
        minZoom: 1
        maxZoom: 7
        zoom: zoom
        zoomControl: false
        center: center)
      map.setMaxBounds([[-90, -360], [90, 360]])
      map.setView(L.latLng(center), zoom, reset: true)
      map.eachLayer(((l) -> l.geo?()), this)
      map.panTo(L.latLng(center))

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
    modisOpts =
      time: dateUtil.isoUtcDateString(new Date())
      product: 'MODIS_Terra_CorrectedReflectance_TrueColor'
      resolution: '250m'
      format: 'jpeg'
    landWaterOpts =
      product: 'land_water_map'
      resolution: '250m'
      format: 'png'

    projection = 'geo'
    map = new Map(document.getElementById('map'), projection)
    map.addLayer(new GibsTileLayer(modisOpts, projection))

    # Useful debugging snippets

    # Add outlines of US States to the map to help ensure correct projections and tile positioning
    # $.getJSON '/assets-dev/modules/map/debug-geojson.json', {}, (json) -> map.debugShowGeoJson(json)

    # Log the mouse lat / lon to the console
    #map.startMouseDebugging()

  exports = Map
