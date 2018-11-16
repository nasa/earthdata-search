ns = @edsc.map

ns.Map = do (window,
             document,
             L,
             ko,
             ProjExt = ns.L.Proj,
             ProjectionSwitcher = ns.L.ProjectionSwitcher
             LayerBuilder = ns.LayerBuilder,
             SpatialSelection = ns.SpatialSelection,
             GranuleVisualizationsLayer = ns.GranuleVisualizationsLayer,
             MouseEventsLayer = ns.MouseEventsLayer,
             urlUtil = @edsc.util.url,
             ZoomHome = ns.L.ZoomHome,
             Legend = @edsc.Legend,
             page = @edsc.page,
             ajax = @edsc.util.xhr.ajax
             config = @edsc.config) ->

  L.Map.include
    fitBounds: (bounds, options={}) ->
      options.animate = config.animateMap

      bounds = L.latLngBounds(bounds)

      if !bounds.isValid()
        throw new Error('Bounds are not valid.')

      target = @_getBoundsCenterZoom(bounds, options)
      @setView target.center, target.zoom, options

  # Fix leaflet default image path
  L.Icon.Default.imagePath = '/images/leaflet-1.3.4/'

  LegendControl = L.Control.extend
    setData: (name, data) ->
      @legend.setData(name, data)

    onAdd: (map) ->
      @legend = new Legend()
      @legend.container

  # Constructs and performs basic operations on maps
  # This class wraps the details of setting up the map used by the application,
  # setting up GIBS layers, supported projections, etc.
  # Code outside of the edsc.map module should interact with this class only
  class Map
    MAPBASES = ["Blue Marble", "Corrected Reflectance (True Color)", "Land / Water Map *"]
    OVERLAYS = ["Borders and Roads *", "Coastlines *", 'Place Labels *<span class="map-attribution">* &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span>']
    # Creates a map attached to the given element with the given projection
    # Valid projections are:
    #   'geo' (EPSG:4326, WGS 84 / Plate Carree)
    #   'arctic' (EPSG:3413, WGS 84 / NSIDC Sea Ice Polar Stereographic North)
    #   'antarctic' (EPSG:3031, WGS 84 / Antarctic Polar Stereographic)
    constructor: (el, projection = 'geo', isMinimap = false) ->
      @isMinimap = isMinimap
      $(el).data('map', this)
      @layers = []

      map = @map = new L.Map(
        el,
        zoomControl: false,
        attributionControl: false,
        # turning off zoom animations fixes the fitBounds issue on sticky granules, but looks bad
        zoomAnimation: false
      )
      map.projection = projection

      @_buildLayerSwitcher()
      @setProjection(projection)
      @setBaseMap("Blue Marble")
      @setOverlays([OVERLAYS[0], OVERLAYS[2]])

      map.loadingLayers = 0
      if !@isMinimap
        map.addControl(L.control.scale(position: 'topright'))
        map.addLayer(new GranuleVisualizationsLayer())
        map.addLayer(new MouseEventsLayer())
        map.addControl(new ZoomHome())
        map.addControl(new ProjectionSwitcher())
        map.addControl(new SpatialSelection())
        @legendControl = new LegendControl(position: 'topleft')
        map.addControl(@legendControl)

      if !@isMinimap
        @time = ko.computed(@_computeTime, this)
        map.fire('edsc.visiblecollectionschange', collections: page.project.visibleCollections())
        @_granuleVisualizationSubscription = page.project.visibleCollections.subscribe (collections) ->
          map.fire('edsc.visiblecollectionschange', collections: collections)
      if @isMinimap
        map.addControl(new SpatialSelection(@isMinimap))
        map.dragging.disable()
        map.touchZoom.disable()
        map.doubleClickZoom.disable()
        map.scrollWheelZoom.disable()
        # Disable tap handler, if present.
        map.tap.disable() if (map.tap)
      @_setupStatePersistence()

    # Removes the map from the page
    destroy: ->
      @map.remove()
      if !@isMiniMap
        @time.dispose()
        @_granuleVisualizationSubscription.dispose()

    _setupStatePersistence: ->
      @serialized = state = ko.observable(null)
      map = @map
      map.on 'moveend baselayerchange overlayadd overlayremove', (data) ->
        base = Math.abs(MAPBASES.indexOf(@_baseMap))
        overlays = for layer in @_overlays
          OVERLAYS.indexOf(layer)
        overlays ?= []
        if data.type == 'baselayerchange'
          base = Math.abs(MAPBASES.indexOf(data.name))
        if data.type == 'overlayadd'
          index = OVERLAYS.indexOf(data.name)
          overlays.push(index) if index > -1
        if data.type == 'overlayremove'
          index = OVERLAYS.indexOf(data.name)
          overlays.splice(overlays.indexOf(index), 1)

        {lat, lng} = map.getCenter()
        zoom = map.getZoom()
        proj = Math.abs(['arctic', 'geo', 'antarctic'].indexOf(@projection))
        state([lat, lng, zoom, proj, base, overlays.join(',')].join('!'))

      state.subscribe (newValue) =>
        if newValue? && newValue.length > 0
          [lat, lng, zoom, proj, base, overlays] = newValue.split('!')
          # don't break old projects/urls
          base = '0' if !base? || base == ''
          overlays ?= ""

          @setProjection(['arctic', 'geo', 'antarctic'][proj ? 1], true)
          @setBaseMap(MAPBASES[parseInt(base) ? 0])
          # get overlay names from indexes
          overlayNames = []
          for index in overlays.split(',')
            # This returns [undefined] if overlays==""
            i = parseInt(index)
            overlayNames.push(OVERLAYS[i]) if i > -1
          @setOverlays(overlayNames)
          mapCenter = map.getCenter()
          mapZoom = map.getZoom()
          center = L.latLng(lat, lng)
          zoom = parseInt(zoom, 10)
          # Avoid moving the map if the new center is very close to the old, preventing glitches from rounding errors
          if zoom != mapZoom || map.latLngToLayerPoint(mapCenter).distanceTo(map.latLngToLayerPoint(center)) > 10
            map.setView(L.latLng(lat, lng), parseInt(zoom, 10))

    focusCollection: (collection) ->
      @_addLegend(collection)
      @map.focusedCollection = collection
      @map.fire 'edsc.focuscollection', collection: collection

    _addLegend: (collection) ->
      @legendControl.setData(null, {})
      gibs = collection?.gibs() ? []
      name = null
      for config in gibs
        unless config.match?.sit
          name = config.product
          break

      if name?
        # get json from server
        path = "/colormaps/#{name}.json"
        console.log("Request #{path}")
        ajax
          dataType: 'json'
          url: path
          retry: => @_addLegend(collection)
          success: (data) =>
            console.log "Adding legend: #{name}"
            @legendControl.setData(name, data)
        null

    _computeTime: ->
      time = null
      query = page.query
      focused = query.focusedTemporal()
      if focused?
        time = new Date(focused[1] - 1) # Go to the previous day on day boundaries
      else
        time = query.temporal.applied.stop.date()
      unless time == @map.time
        @map.time = time
        @map.fire 'edsc.timechange', time: time

    _createLayerMap: (productIds...) ->
      layerForProduct = LayerBuilder.layerForProduct
      result = {}
      for productId in productIds
        layer = layerForProduct(productId, @map.projection)
        result[layer.options.name] = layer
      result

    _buildLayers: ->
      baseMaps = @_createLayerMap('blue_marble', 'MODIS_Terra_CorrectedReflectance_TrueColor', 'land_water_map')
      overlayMaps = @_createLayerMap('borders', 'coastlines', 'labels')
      [baseMaps, overlayMaps]

    _buildLayerSwitcher: ->
      [baseMaps, overlayMaps] = @_buildLayers()
      @_baseMaps = baseMaps
      @_overlayMaps = overlayMaps

      # Show the first layer
      for own k, layer of baseMaps
        @map.addLayer(layer)
        break

      @_layerControl = L.control.layers(baseMaps, overlayMaps)
      if !@isMinimap
        @map.addControl(@_layerControl)

    _hasLayer: (layers, newLayer) ->
      for layer in layers
        return true if layer.layer.options.name == newLayer.options.name && layer.layer.options.projection == newLayer.options.projection
      false

    _rebuildLayers: ->
      layerControl = @_layerControl
      needsNewBaseLayer = true
      projection = @projection

      [newBaseMaps, newOverlayMaps] = @_buildLayers()
      for own layerName, layer of @_baseMaps
        valid = layer.validForProjection(projection)
        hasLayer = @_hasLayer(layerControl._layers, layer)
        needsNewBaseLayer &&= (!valid || !layer?._map)

        if valid && !hasLayer
          layerControl.addBaseLayer(layer, layerName)
          layer.setZIndex(0) # Keep baselayers below overlays
        if !valid && hasLayer
          needsNewBaseLayer = layer?._map?
          @map.removeLayer(layer)
          layerControl.removeLayer(layer)

          newLayer = newBaseMaps[layerName]
          layerControl.addBaseLayer(newLayer, layerName)
          @map.addLayer(newLayer) if needsNewBaseLayer

      @_baseMaps = newBaseMaps

      for own layerName, layer of @_overlayMaps
        valid = layer.validForProjection(projection)
        hasLayer = @_hasLayer(layerControl._layers, layer)

        if valid && !hasLayer
          layerControl.addOverlay(layer, layerName)
          layer.setZIndex(10) # Keep baselayers below overlays
        if !valid && hasLayer
          needsOverlay = layer?._map?
          @map.removeLayer(layer)
          layerControl.removeLayer(layer)

          newOverlay = newOverlayMaps[layerName]
          layerControl.addOverlay(newOverlay, layerName)
          @map.addLayer(newOverlay) if needsOverlay
      @_overlayMaps = newOverlayMaps

    # Adds the given layer to the map
    addLayer: (layer) -> @map.addLayer(layer)

    # Removes the given layer from the map
    removeLayer: (layer) -> @map.removeLayer(layer)

    projectionOptions:
      arctic:
        crs: ProjExt.epsg3413
        minZoom: 0
        maxZoom: 4
        zoom: 0
        center: [90, 0]
      antarctic:
        crs: ProjExt.epsg3031
        minZoom: 0
        maxZoom: 4
        zoom: 0
        center: [-90, 0]
      geo:
        crs: ProjExt.epsg4326
        minZoom: 0
        maxZoom: 8 # This should probably go to 11 when we have higher resolution imagery
        zoom: 2
        center: [0, 0]

    setProjection: (name, rebuild) ->
      map = @map
      return if @projection == name

      $(map._container).removeClass("projection-#{@projection}")
      $(map._container).addClass("projection-#{name}")

      @projection = map.projection = name

      opts = L.setOptions(map, @projectionOptions[name])
      map.options.crs = opts.crs
      map._resetView(L.latLng(opts.center), opts.zoom)
      map.setView(L.latLng(opts.center), opts.zoom)
      map.fire('projectionchange', projection: name, map: map)
      @_rebuildLayers() if rebuild

    setBaseMap: (name) ->
      map = @map
      return if map._baseMap == name

      baseLayers = @_baseMaps
      for base in baseLayers
        if map.hasLayer(baseLayers[base])
          map.removeLayer(baseLayers[base])

      map.fire('basemapchange', name: name)
      map.addLayer(baseLayers[name])
      map._baseMap = name

    setOverlays: (overlays) ->
      # remove any undefined from overlays
      for overlay, i in overlays
        if overlay == undefined
          overlays.splice(i, 1)

      # apply overlays
      map = @map
      overlayLayers = @_overlayMaps
      for layerName, _layer in overlayLayers
        if map.hasLayer(overlayLayers[layerName])
          map.removeLayer(overlayLayers[layerName])

      for name in overlays
        map.addLayer(overlayLayers[name])

      map.fire('overlayschange', overlays: overlays)

      map._overlays = overlays

  # For tests to be able to click
  $.fn.mapClick = ->
    @each (i, e) ->
      evt = document.createEvent("MouseEvents")
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      e.dispatchEvent(evt)

  exports = Map
