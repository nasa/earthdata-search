ns = edsc.map

ns.L.sphericalPolygon = do (L, geoutil=ns.geoutil, config=@edsc.config) ->

  # This is a bit tricky.  We need to be an instanceof L.Polygon for L.Draw methods
  # to work, but in reality we're an L.FeatureGroup, hence the "includes"
  L.SphericalPolygon = L.Polygon.extend
    includes: [L.LayerGroup.prototype, L.FeatureGroup.prototype]
    options:
      fill: true

    initialize: (latlngs, options) ->
      @_layers = {}
      @_options = L.extend({}, @options, options)
      @setLatLngs(latlngs)

    setLatLngs: (latlngs) ->
      @_bounds = new L.LatLngBounds()

      holes = []
      if latlngs[0] && Array.isArray(latlngs[0]) && latlngs[0].length > 2
        holes = latlngs[1...]
        latlngs = latlngs[0]
      latlngs = (L.latLng(latlng) for latlng in latlngs)

      @_latlngs = latlngs.concat()

      # Draw closed path when not editing
      if latlngs.length > 2 && !@drawing
        if Math.abs(latlngs[0].lng) == Math.abs(latlngs[latlngs.length - 1].lng) == 180
          # In this case the last element is an artificial longitude crossing.  Avoid interpolating
          # with the first to prevent drawing strokes along the dateline
          latlngs.push(latlngs[latlngs.length - 1])
        else
          latlngs.push(latlngs[0])

      {boundaries, interiors} = geoutil.dividePolygon(latlngs)

      for hole in holes
        dividedHole = geoutil.dividePolygon(hole)
        boundaries = boundaries.concat(dividedHole.boundaries)
        interiors = boundaries.concat(dividedHole.interiors)

      if @_boundaries
        @_interiors.setLatLngs(interiors)
        @_boundaries.setLatLngs(boundaries)
      else
        @_interiors = L.polygon(interiors, L.extend({}, @_options, stroke: false))
        @_boundaries = L.polygon(boundaries, L.extend({}, @_options, fill: false))
        @addLayer(@_interiors)
        @addLayer(@_boundaries)

    addLatLng: (latlng) ->
      latlng = L.latLng(latlng)
      @_latlngs.push(latlng)
      @_bounds.extend(latlng)
      @redraw()

    getLatLngs: ->
      geoutil.makeCounterclockwise(@_latlngs.concat())

    newLatLngIntersects: (latlng, skipFirst) ->
      false

    setOptions: (options) ->
      @_options = @options = L.extend({}, @_options, options)
      L.setOptions(@_interiors, L.extend({}, @_options, stroke: false))
      L.setOptions(@_boundaries, L.extend({}, @_options, fill: false))
      @redraw()

    setStyle: (style) ->
      if @options.previousOptions
        @options.previousOptions = @_options
      @_interiors.setStyle(L.extend({}, style, stroke: false))
      @_boundaries.setStyle(L.extend({}, style, fill: false))

    redraw: ->
      @setLatLngs(@_latlngs)

  L.sphericalPolygon = (latlngs, options) -> new L.SphericalPolygon(latlngs, options)

  # Monkey-patch _removeLayer.  The original doesn't handle event propagation
  # from FeatureGroups, and SphericalPolygons are FeatureGroups
  originalRemove = L.EditToolbar.Delete.prototype._removeLayer
  L.EditToolbar.Delete.prototype._removeLayer = (e) ->
    e.layer = e.target if e.target?._boundaries
    originalRemove.call(this, e)

  L.Draw.Polygon = L.Draw.Polygon.extend
    Poly: L.SphericalPolygon

    addHooks: ->
      L.Draw.Polyline.prototype.addHooks.call(this)
      if @_map
        this._poly = new L.sphericalPolygon([], @options.shapeOptions)
        this._poly.drawing = true
    removeHooks: ->
      this._poly.drawing = false
      L.Draw.Polyline.prototype.removeHooks.call(this)

  L.Edit.Poly = L.Edit.Poly.extend
    _getMiddleLatLng: (marker1, marker2) ->
      latlng = geoutil.gcInterpolate(marker1.getLatLng(), marker2.getLatLng())

  exports = {}
