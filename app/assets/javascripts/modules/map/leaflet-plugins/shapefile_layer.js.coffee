ns = @edsc.map.L

ns.ShapefileLayer = do (L, Dropzone, config=@edsc.config) ->

  MAX_POLYGON_SIZE = config.maxPolygonSize

  Dropzone.autoDiscover = false

  dropzoneOptions =
    # Official Ogre web service
    # We likely want to use this, once they fix OPTIONS requests
    # See: https://github.com/wavded/ogre/pull/22
    #url: 'http://ogre.adc4gis.com/convert'

    # Ogre running locally on port 3001
    #url: 'http://localhost:3001/convert'

    # Ogre proxied through Rails
    url: '/convert'
    headers: {'X-CSRF-Token': config.csrfToken}

    # Test fallback behavior
    #forceFallback: true

    # Common options
    paramName: 'upload'
    clickable: '.geojson-dropzone-link'
    createImageThumbnails: false
    acceptedFiles: ".zip,.kml,.kmz,.json,.geojson,.rss,.georss,.xml"
    fallback: -> # If the browser can't support the necessary features
      $('.select-shapefile').parent().hide()
    parallelUploads: 1
    uploadMultiple: false
    addRemoveLinks: true

  class ShapefileLayer extends L.Layer
    defaultOptions:
      selection: L.Draw.Polygon.prototype.options.shapeOptions

    constructor: (options={}) ->
      @options =
        selection: L.extend({}, @defaultOptions.selection, options.selection)

    onAdd: (map) ->
      @map = map
      container = map.getContainer()
      dropzone = new Dropzone(container, dropzoneOptions)
      dropzone.on 'success', @_geoJsonResponse
      dropzone.on 'removedfile', @_removeFile
      dropzone.on 'error', @_displayError
      @_dropzone = dropzone
      L.DomUtil.addClass(container, 'dropzone')
      @_isAdded = true

    onRemove: (map) ->
      @remove()
      @map = null
      @_jsonLayer = null
      @_isAdded = false

    activate: (showHelp=true) ->
      @_isActive = true
      @show()
      @showHelp() if showHelp

    deactivate: ->
      @_isActive = false
      @hide()
      @hideHelp()

    showHelp: ->
      L.DomUtil.addClass(@map.getContainer(), 'is-geojson-help-visible')

    hideHelp: ->
      L.DomUtil.removeClass(@map.getContainer(), 'is-geojson-help-visible')

    isActive: ->
      @_isActive

    hide: ->
      $('.dz-preview').hide()
      @map.removeLayer(@_jsonLayer) if @_jsonLayer? && @_isAdded
      @_isAdded = false

    show: ->
      $('.dz-preview').show()
      @map.addLayer(@_jsonLayer) if @_jsonLayer? && !@_isAdded
      @_isAdded = true if @_jsonLayer?

    remove: ->
      @_dropzone.removeFile(@_file) if @_file?

    _removeFile: =>
      @map.removeLayer(@_jsonLayer) if @_jsonLayer?
      @map.fire 'shapefile:stop'
      @_file = null

    # Leaflet 1.0+ changed the way that MultiPolygons are handled.
    # Instead of creating a new layer for each polgon in a MultiPolygon
    # feature (v0.7) it creates a single layer with multiple polygons.
    # This means when you hover over one island in Hawaii it highlights
    # all the islands, and passes all the polygons to _setConstraint.
    # This method takes all the MultiPolygon geometries and separates them
    # into individual polygons, to mimick the 0.7 functionality.
    _separateMultiPolygons: (geojson) ->
      featureIndexesToRemove = []
      for feature, featureIndex in geojson.features
        type = feature.geometry.type

        # KML type file
        if type == 'GeometryCollection'
          geometries = feature.geometry.geometries

          for geometry, index in geometries
            if geometry.type == 'MultiPolygon'
              # If we see a MultiPolygon, separate into Polygons
              for polygon in geometry.coordinates
                newPolygon = { 'type': 'Polygon', 'coordinates': polygon }
                geometries.push newPolygon
              # remove the MultiPolygon from the list of geometries
              geometries.splice(index, 1)

        # geojson type file
        if type == 'MultiPolygon'
          featureIndexesToRemove.push featureIndex
          for coordinate in feature.geometry.coordinates
            newFeature = {
              'type': 'Feature',
              'geometry': {
                'type': 'Polygon',
                'coordinates': coordinate
              }
            }
            geojson.features.push newFeature
      # remove MultiPolygon features from geojson files
      for index in featureIndexesToRemove.reverse()
        geojson.features.splice(index, 1)

    _geoJsonResponse: (file, response) =>
      @activate(false) unless @isActive()
      @hideHelp()
      @remove()

      # look through response and separate all MultiPolygon types into their own polygon
      @_separateMultiPolygons(response)

      icon = new L.Icon.Default()
      icon.options.className = 'geojson-icon'
      jsonLayer = new L.geoJson response,
        className: 'geojson-svg'
        onEachFeature: (feature, featureLayer) ->
          addIconClasses = (layer) ->
            if layer.options?.icon?
              layer.options?.icon = icon

          addIconClasses(featureLayer)
          if featureLayer.getLayers?
            for layer in featureLayer.getLayers()
              addIconClasses(layer)

      jsonLayer.on 'click', @_clickLayer

      @_file = file
      @_jsonLayer = jsonLayer

      @map.addLayer(jsonLayer)
      @map.fire 'shapefile:start'
      @map.fitBounds(jsonLayer.getBounds())

      children = jsonLayer.getLayers()

      tourSteps = []
      if children.length > 1
        middleChild = children[Math.floor(children.length / 2)]
        el = middleChild._container ? middleChild._icon
      else if children.length == 1
        @_setConstraint(children[0])

    _displayError: (file, response) ->
      if file.name.match('.*shp')
        errorMessage = 'To use an ESRI Shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
        errorDiv = document.createElement('div')
        errorDiv.appendChild(document.createTextNode(errorMessage))
        errorDiv.className += 'edsc-dz-error'
        previewElement = file.previewElement
        previewElement.getElementsByClassName('dz-details')[0].appendChild(errorDiv)
        previewElement.removeChild(previewElement.querySelector('.dz-error-message'))

    _clickLayer: (e) =>
      @_setConstraint(e.layer)

    _setConstraint: (sourceLayer) ->
      if sourceLayer.getLatLngs?
        # Polygon
        latlngs = @_simplifyPoints(sourceLayer.getLatLngs())

        layer = L.sphericalPolygon(latlngs, @options.selection)
        layerType = 'polygon'

      else if sourceLayer.getLatLng?
        # Point
        layer = L.marker(sourceLayer.getLatLng())
        layerType = 'marker'

      if layer?
        map = @map
        map.fire 'draw:drawstart'
        map.fire 'draw:created',
          target: map
          layer: layer
          layerType: layerType
        map.fire 'draw:drawstop'

    _simplifyPoints: (latlngs) ->
      latlngs = latlngs[0] unless L.LineUtil.isFlat(latlngs)
      if latlngs.length > MAX_POLYGON_SIZE

        map = @map
        points = (map.latLngToLayerPoint(latlng) for latlng in latlngs)
        tolerance = 1
        result = points
        while result.length > MAX_POLYGON_SIZE
          result = L.LineUtil.simplify(points, tolerance++)

        console.log "size #{latlngs.length} => #{result.length}"

        latlngs = (map.layerPointToLatLng(point) for point in result)

      # Remove redundancies
      result = []
      prev = latlngs[latlngs.length - 1]
      for latlng in latlngs
        result.push(latlng) unless latlng.equals(prev)
        prev = latlng

      result

  exports = ShapefileLayer
