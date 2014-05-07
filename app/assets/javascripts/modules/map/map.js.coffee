ns = @edsc.map

ns.Map = do (window,
             document,
             L,
             ProjExt = ns.L.Proj,
             ProjectionSwitcher = ns.L.ProjectionSwitcher
             LayerBuilder = ns.LayerBuilder,
             SpatialSelection = ns.SpatialSelection,
             GranuleVisualizationsLayer = ns.GranuleVisualizationsLayer,
             MouseEventsLayer = ns.MouseEventsLayer,
             Dataset = @edsc.models.data.Dataset,
             page = @edsc.page) ->

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

      # TODO: I need to be subscribed to selected.details, but I can't because details doesn't 
      # exist until a dataset is selected
      @_datasetSubscription = page.ui.datasetsList.selected.subscribe(@_showDatasetSpatial)
      @_granuleVisualizationSubscription = Dataset.visible.subscribe (datasets) ->
        map.fire('edsc.visibledatasetschange', datasets: datasets)

      $('#dataset-results, #project-overview, #granule-list').on('edsc.navigate', @_hideDatasetSpatial)

    # Removes the map from the page
    destroy: ->
      @map.remove()
      @_datasetSubscription.dispose()
      @_granuleVisualizationSubscription.dispose()
      $('#dataset-results, #project-overview, #granule-list').off('edsc.navigate', @_hideDatasetSpatial)

    focusDataset: (dataset) ->
      @map.focusedDataset = dataset
      @map.fire 'edsc.focusdataset', dataset: dataset

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
        minZoom: 1
        maxZoom: 7
        zoom: 2
        continuousWorld: false
        noWrap: false
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
      # TODO: This is failing because details() doesn't exist yet
      dataset = dataset.details().summaryData
      # dataset = dataset.summaryData

      @_hideDatasetSpatial()

      layer = new L.FeatureGroup()

      @_showLine(layer, @_parseSpatial(s))      for s in dataset.lines?()    if dataset.lines?
      @_showRectangle(layer, @_parseSpatial(s)) for s in dataset.boxes?()    if dataset.boxes?
      @_showPoint(layer, @_parseSpatial(s))     for s in dataset.points?()   if dataset.points?
      @_showPolygon(layer, @_parseSpatial(s))   for s in dataset.polygons?() if dataset.polygons?

      layer.addTo(@map)
      @_datasetSpatialLayer = layer

    _showLine:      (layer, points) -> L.polyline(points, color: "#ff7800", weight: 1).addTo(layer)
    _showRectangle: (layer, points) -> L.rectangle(points, color: "#ff7800", weight: 1).addTo(layer)
    _showPoint:     (layer, points) -> L.marker(points...).addTo(layer)
    _showPolygon:   (layer, points) -> L.sphericalPolygon(points, color: "#ff7800", weight: 1).addTo(layer)


    _parseSpatial: (s) ->
      s = s[0] if s instanceof Array

      coords = s.split(' ')
      points = []
      for i in [0...coords.length] by 2
        points.push([parseFloat(coords[i]), parseFloat(coords[i+1])])
      points

    _hideDatasetSpatial: =>
      if @_datasetSpatialLayer
        @map.removeLayer(@_datasetSpatialLayer)
        @_datasetSpatialLayer = null

  $(document).ready ->
    projection = 'geo'
    map = new Map(document.getElementById('map'), projection)
    page.map = map

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
