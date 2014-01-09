ns = window.edsc.map

ns.SpatialSelection = do (window,
                          document,
                          toastr,
                          L,
                          searchModel = window.edsc.models.searchModel) ->

  L.drawLocal.draw.toolbar.buttons.polygon = "Search by spatial polygon"
  L.drawLocal.draw.toolbar.buttons.rectangle = "Search by spatial rectangle"
  L.drawLocal.draw.toolbar.buttons.marker = "Search by spatial point"

  normalColor = '#009900'
  errorColor = '#990000'

  class SpatialSelection
    addTo: (map) ->
      @map = map
      drawnItems = @_drawnItems = new L.FeatureGroup()
      drawnItems.addTo(map)

      @_colorOptions = colorOptions =
        color: normalColor
        dashArray: null
      @_errorOptions = errorOptions =
        color: errorColor
        dashArray: null
      selectedOptions =
        dashArray: '10, 10'

      drawControl = @_drawControl = new L.Control.Draw
        draw:
          polygon:
            drawError:
              color: errorColor
              dashArray: null
            shapeOptions:
              color: normalColor
              dashArray: null
          rectangle:
            drawError:
              color: errorColor
              dashArray: null
            shapeOptions:
              color: normalColor
              dashArray: null
          polyline: false
          circle: false
        edit:
          selectedPathOptions:
            opacity: 0.6
            dashArray: '10, 10'

          featureGroup: drawnItems
        position: 'topright'

      drawControl.addTo(map)

      spatialModel = searchModel.query.spatial
      @_querySubscription = spatialModel.subscribe(@_onSpatialChange)
      @_spatialErrorSubscription = searchModel.spatialError.subscribe(@_onSpatialErrorChange)
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
      @_spatialErrorSubscription.dispose()
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
      # Avoid sending events for already-selected tools (infinite loop in firefox)
      return if @_currentTool == name
      @_currentTool = name
      link = @_getToolLinksForName(name)[0]
      event = document.createEvent("MouseEvents")
      event.initMouseEvent("click", true, true, window)
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
      console.log e
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

    _onSpatialErrorChange: (newValue) =>
      if newValue?
        if @_layer?
          toastr.error(newValue, "Spatial Query Error")
          console.log @_layer, @_errorOptions
          @_layer.setStyle(@_errorOptions)
      else
        if @_layer?
          @_layer.setStyle(@_colorOptions)


    _renderSpatial: (type, shape) ->

    _removeSpatial: () ->
      if @_layer
        @_drawnItems.removeLayer(@_layer) if @_layer
        @_layer = null

    _renderMarker: (shape) ->
      marker = @_layer = new L.Marker(shape[0], icon: L.Draw.Marker.prototype.options.icon)
      @_drawnItems.addLayer(marker)

    _renderRectangle: (shape) ->
      bounds = new L.LatLngBounds(shape...)
      rect = @_layer = new L.Rectangle(bounds, L.Draw.Rectangle.prototype.options.shapeOptions)
      @_drawnItems.addLayer(rect)

    _renderPolygon: (shape) ->
      poly = @_layer = new L.SphericalPolygon(shape, L.Draw.Polygon.prototype.options.shapeOptions)
      @_drawnItems.addLayer(poly)

    _saveSpatialParams: (layer, type) ->
      type = 'point' if type == 'marker'
      type = 'bounding_box' if type == 'rectangle'

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

  exports = SpatialSelection
