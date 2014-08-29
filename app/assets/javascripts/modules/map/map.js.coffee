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
             page = @edsc.page) ->

  L.Map.include
    fitBounds: (bounds, options={}) ->
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

  # Fix leaflet default image path
  L.Icon.Default.imagePath = '/images/leaflet-0.7'

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

      map.loadingLayers = 0

      @_buildLayerSwitcher()
      map.addLayer(new GranuleVisualizationsLayer())
      map.addLayer(new MouseEventsLayer())

      map.addControl(L.control.zoom(position: 'topright'))
      map.addControl(new ProjectionSwitcher())
      map.addControl(new SpatialSelection())
      @setProjection(projection)

      @time = ko.computed(@_computeTime, this)
      @_showDatasetSpatial(page.ui.datasetsList.selected())
      @_datasetSubscription = page.ui.datasetsList.selected.subscribe(@_showDatasetSpatial)

      map.fire('edsc.visibledatasetschange', datasets: page.project.visibleDatasets())
      @_granuleVisualizationSubscription = page.project.visibleDatasets.subscribe (datasets) ->
        map.fire('edsc.visibledatasetschange', datasets: datasets)

      @_setupStatePersistence()

    # Removes the map from the page
    destroy: ->
      @map.remove()
      @time.dispose()
      @_datasetSubscription.dispose()
      @_granuleVisualizationSubscription.dispose()

    _setupStatePersistence: ->
      @serialized = state = ko.observable(null)
      map = @map
      map.on 'moveend', ->
        {lat, lng} = map.getCenter()
        zoom = map.getZoom()
        proj = Math.abs(['arctic', 'geo', 'antarctic'].indexOf(@projection))
        state([lat, lng, zoom, proj].join('!'))

      state.subscribe (newValue) =>
        if newValue? && newValue.length > 0
          [lat, lng, zoom, proj] = newValue.split('!')
          @setProjection(['arctic', 'geo', 'antarctic'][proj ? 1])
          mapCenter = map.getCenter()
          mapZoom = map.getZoom()
          center = L.latLng(lat, lng)
          zoom = parseInt(zoom, 10)
          # Avoid moving the map if the new center is very close to the old, preventing glitches from rounding errors
          if zoom != mapZoom || map.latLngToLayerPoint(mapCenter).distanceTo(map.latLngToLayerPoint(center)) > 10
            map.setView(L.latLng(lat, lng), parseInt(zoom, 10))

    focusDataset: (dataset) ->
      @map.focusedDataset = dataset
      @map.fire 'edsc.focusdataset', dataset: dataset

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
      overlayMaps = @_overlayMaps = @_createLayerMap('administrative_boundaries', 'coastlines')

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
        maxZoom: 5
        zoom: 0
        continuousWorld: true
        noWrap: true
        worldCopyJump: false
        center: [90, 0]
      antarctic:
        crs: ProjExt.epsg3031
        minZoom: 0
        maxZoom: 5
        zoom: 0
        continuousWorld: true
        noWrap: true
        worldCopyJump: false
        center: [-90, 0]
      geo:
        crs: ProjExt.epsg4326
        minZoom: 0
        maxZoom: 7
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

    _showDatasetSpatial: (dataset) =>
      @_hideDatasetSpatial()

      return unless dataset?

      layer = dataset.buildLayer(color: "#ff7800", weight: 1)
      layer.addTo(@map)
      @_datasetSpatialLayer = layer

    _hideDatasetSpatial: =>
      if @_datasetSpatialLayer
        @map.removeLayer(@_datasetSpatialLayer)
        @_datasetSpatialLayer = null

    # Debugging spherical polygons
    #L.sphericalPolygon([
    #  [-45, 0],
    #  [45, 45],
    #  [0, -45]
    #]).addTo(map).bindopup("I am a generic polygon.")

    #L.sphericalPolygon([
    #  [0, -45],
    #  [45, 45],
    #  [-45, 0]
    #]).addTo(map).bindPopup("I am a generic polygon specified in a reverse order.")

    #L.sphericalPolygon([[
    #  [-45, 0],
    #  [45, 45],
    #  [0, -45]
    #], [[-10, 0], [10, 10], [0, -10]]]).addTo(map).bindPopup("I have a hole.")

    #L.sphericalPolygon([
    #  [-45, 180],
    #  [45, 120],
    #  [20, -170],
    #  [50, 160],
    #  [0, -120]
    #]).addTo(map).bindPopup("I cross the antimeridian a few times going clockwise.");

    #L.sphericalPolygon([
    #  [0, -10],
    #  [70, -10],
    #  [70, -100],
    #  [70, 100],
    #  [70, 10],
    #  [0, 10],
    #  [-70, 10],
    #  [-70, 100],
    #  [-70, -100],
    #  [-70, -10]
    #]).addTo(map).bindPopup("I contain both poles and cross the antimeridian.");

    #L.sphericalPolygon([
    #  [0, -170],
    #  [70, -170],
    #  [70, 170],
    #  [0, 170],
    #  [-70, 170],
    #  [-70, -170]
    #]).addTo(map).bindPopup("I contain both poles and cross the antimeridian.");

    #L.sphericalPolygon([
    #  [-70, -170],
    #  [ 70, -170],
    #  [ 70,    0],
    #  [ 70,  170],
    #  [-70,  170],
    #  [-70,    0]
    #]).addTo(map).bindPopup("I contain both poles and do not cross the antimeridian.");

    #L.sphericalPolygon([
    #  [60, -120],
    #  [70, 0],
    #  [80, 120]
    #]).addTo(map).bindPopup("I contain the north pole.");

    #L.sphericalPolygon([
    #  [-60, -120],
    #  [-70, 0],
    #  [-80, 120]
    #]).addTo(map).bindPopup("I contain the south pole.");

  # For tests to be able to click
  $.fn.mapClick = ->
    @each (i, e) ->
      evt = document.createEvent("MouseEvents")
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      e.dispatchEvent(evt)

  exports = Map
