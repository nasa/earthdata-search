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
             ZoomHome = ns.L.ZoomHome,
             Legend = @edsc.Legend,
             page = @edsc.page,
             ajax = @edsc.util.xhr.ajax
             config = @edsc.config) ->

  L.Map.include
    fitBounds: (bounds, options={}) ->
      options.animate = config.animateMap
      bounds = bounds.getBounds?() ? L.latLngBounds(bounds)

      paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0])
      paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0])

      leftPad = L.point([$('.master-overlay-main').offset().left + $('.master-overlay-main').width(), 0])

      zoom = @getBoundsZoom(bounds, false, paddingTL.add(paddingBR))
      paddingOffset = paddingBR.subtract(paddingTL).divideBy(2)

      swPoint = this.project(bounds.getSouthWest(), zoom).subtract(leftPad)
      nePoint = this.project(bounds.getNorthEast(), zoom)

      center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom)

      zoom = Math.min(options.maxZoom ? Infinity, zoom)

      @setView(center, zoom, options)

    setZoom: (zoom, options) ->
      zoom = @_limitZoom(zoom)

      if !@_loaded
        @_zoom = @_limitZoom(zoom)
        return this

      # if overlay is visible, adjust center
      overlayWidth = $('.master-overlay-parent').width() + $('.master-overlay-main').width() # parent and main visible
      if $('.master-overlay.is-master-overlay-parent-hidden').length > 0 #only main visible
        overlayWidth -= $('.master-overlay-parent').width()
      if $('.master-overlay.is-hidden').length > 0 # parent and main hidden
        overlayWidth = 0
      overlayWidth /= 2

      currentZoom = @getZoom()
      return this if currentZoom == zoom
      if currentZoom > zoom
        targetPoint = @project(@getCenter(), zoom).subtract([overlayWidth / 2, 0])
      else
        targetPoint = @project(@getCenter(), zoom).add([overlayWidth, 0])
      targetLatLng = @unproject(targetPoint, zoom)

      @setView(targetLatLng, zoom, {zoom: options})

  # Fix leaflet default image path
  L.Icon.Default.imagePath = '/images/leaflet-0.7'

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
    constructor: (el, projection='geo') ->
      $(el).data('map', this)
      @layers = []
      map = @map = new L.Map(el, zoomControl: false, attributionControl: false)

      map.loadingLayers = 0

      @_buildLayerSwitcher()
      map.addLayer(new GranuleVisualizationsLayer())
      map.addLayer(new MouseEventsLayer())

      map.addControl(new ZoomHome())
      map.addControl(new ProjectionSwitcher())
      map.addControl(new SpatialSelection())

      @legendControl = new LegendControl(position: 'bottomright')
      map.addControl(@legendControl)

      map.addControl(L.control.scale(position: 'bottomright'))

      @setProjection(projection)
      @setBaseMap("Blue Marble")
      @setOverlays([OVERLAYS[0], OVERLAYS[2]])

      @time = ko.computed(@_computeTime, this)

      map.fire('edsc.visiblecollectionschange', collections: page.project.visibleCollections())
      @_granuleVisualizationSubscription = page.project.visibleCollections.subscribe (collections) ->
        map.fire('edsc.visiblecollectionschange', collections: collections)

      @_setupStatePersistence()

    # Removes the map from the page
    destroy: ->
      @map.remove()
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

          @setProjection(['arctic', 'geo', 'antarctic'][proj ? 1])
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
        layer = layerForProduct(productId)
        result[layer.options.name] = layer
      result

    _buildLayerSwitcher: ->
      baseMaps = @_baseMaps = @_createLayerMap('blue_marble', 'MODIS_Terra_CorrectedReflectance_TrueColor', 'land_water_map')
      overlayMaps = @_overlayMaps = @_createLayerMap('borders', 'coastlines', 'labels')

      # Show the first layer
      for own k, layer of baseMaps
        @map.addLayer(layer)
        break

      @_layerControl = L.control.layers(baseMaps, overlayMaps)
      @map.addControl(@_layerControl)

    _rebuildLayers: ->
      layerControl = @_layerControl
      needsNewBaseLayer = true
      projection = @projection

      for own k, layer of @_baseMaps
        valid = layer.validForProjection(projection)
        hasLayer = layerControl._layers[L.stamp(layer)]?
        needsNewBaseLayer &&= (!valid || !layer.layer?._map)

        if valid && !hasLayer
          layerControl.addBaseLayer(layer, k)
          layer.setZIndex(0) # Keep baselayers below overlays
        if !valid && hasLayer
          layerControl.removeLayer(layer)
          needsNewBaseLayer = true if layer.layer?._map?
          @map.removeLayer(layer)

      if needsNewBaseLayer
        # Show the first layer
        for own k, layer of @_baseMaps
          if layer.validForProjection(projection)
            @map.addLayer(layer)
            break

      for own k, layer of @_overlayMaps
        valid = layer.validForProjection(projection)
        hasLayer = layerControl._layers[L.stamp(layer)]?
        if valid && !hasLayer
          layerControl.addOverlay(layer, k)
          layer.setZIndex(10) # Keep baselayers below overlays
        if !valid && hasLayer
          layerControl.removeLayer(layer)


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
        continuousWorld: true
        noWrap: true
        worldCopyJump: false
        center: [90, 0]
      antarctic:
        crs: ProjExt.epsg3031
        minZoom: 0
        maxZoom: 4
        zoom: 0
        continuousWorld: true
        noWrap: true
        worldCopyJump: false
        center: [-90, 0]
      geo:
        crs: ProjExt.epsg4326
        minZoom: 0
        maxZoom: 7 # This should probably go to 11 when we have higher resolution imagery
        zoom: 2
        continuousWorld: false
        noWrap: true # Set this to false when people inevitibly ask us for imagery across the meridian
        worldCopyJump: true
        center: [0, 0]

    setProjection: (name) ->
      map = @map
      return if @projection == name

      $(map._container).removeClass("projection-#{@projection}")
      $(map._container).addClass("projection-#{name}")

      @projection = map.projection = name

      opts = @projectionOptions[name]
      L.setOptions(map, opts)

      map.fire('projectionchange', projection: name, map: map)
      map.setView(L.latLng(opts.center), opts.zoom, reset: true)
      @_rebuildLayers()

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
      @_rebuildLayers()

    setOverlays: (overlays) ->
      # remove any undefined from overlays
      for overlay, i in overlays
        if overlay == undefined
          overlays.splice(i, 1)

      # apply overlays
      map = @map
      overlayLayers = @_overlayMaps
      for layer in overlayLayers
        if map.hasLayer(overlayLayers[layer])
          map.removeLayer(overlayLayers[layer])

      for name in overlays
        map.addLayer(overlayLayers[name])

      map.fire('overlayschange', overlays: overlays)

      map._overlays = overlays
      @_rebuildLayers()

  # For tests to be able to click
  $.fn.mapClick = ->
    @each (i, e) ->
      evt = document.createEvent("MouseEvents")
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      e.dispatchEvent(evt)

  exports = Map
