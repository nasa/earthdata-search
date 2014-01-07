do (L, geoutil=window.edsc.map.geoutil) ->

  convertLatLngs = (latlngs) ->
    L.latLng(latlng) for latlng in latlngs

  denormalizePath = (latlngs) ->
    len = latlngs.length

    for i in [0...len]
      latlng1 = latlngs[i]
      latlng2 = latlngs[(i + 1) % len]

      if Math.abs(latlng1.lng - latlng2.lng) > 180
        if latlng1.lng < latlng2.lng
          latlng1.lng += 360
        else
          latlng2.lng += 360


  # 1. Orient points based on area
  # 2. Crosses meridian?
  # 3. Contains N. pole?  Add points
  # 4. Contains S. pole?  Add points
  # 5. Split along meridian

  dividePolygon = (latlngs) ->
    interiors = []
    boundaries = []
    holes = []

    if latlngs && L.Util.isArray(latlngs[0]) && typeof latlngs[0][0] != 'number'
      for hole in latlngs[1..]
        hole = convertLatLngs(hole)
        denormalizePath(hole)
        holes.push(hole)
      latlngs = latlngs[0]

    latlngs = convertLatLngs(latlngs)
    latlngs.reverse() if geoutil.area(latlngs) < 0

    denormalizePath(latlngs)

    interiors.push([latlngs].concat(holes))
    boundaries.push(latlngs)
    boundaries = boundaries.concat(holes)

    {interiors: interiors, boundaries: boundaries}

  L.SphericalPolygon = L.FeatureGroup.extend
    options:
      fill: true

    initialize: (latlngs, options) ->
      console.log 'Using L.SphericalPolygon'
      @_layers = {}
      @_options = options
      @setLatLngs(latlngs)

    setLatLngs: (latlngs) ->
      divided = dividePolygon(latlngs)

      @_latlngs = latlngs

      if @_boundaries
        @_interiors.setLatLngs(divided.interiors)
        @_boundaries.setLatLngs(divided.boundaries)
      else
        @_interiors = L.multiPolygon(divided.interiors, L.extend({}, @_options, stroke: false))
        @_boundaries = L.multiPolyline(divided.boundaries, L.extend({}, @_options, fill: false))
        @addLayer(@_interiors)
        @addLayer(@_boundaries)

    getLatLngs: ->
      @_latlngs.reverse() if geoutil.area(@_latlngs) < 0
      @_latlngs

    newLatLngIntersects: (latlng, skipFirst) ->
      false
      # FIXME

    addLatLng: (latlng) ->
      @_latlngs.push(L.latLng(latlng))
      @setLatLngs(@_latlngs)

  L.sphericalPolygon = (latlngs, options) -> new L.SphericalPolygon(latlngs, options)

  L.Draw.Polygon = L.Draw.Polygon.extend
    Poly: L.SphericalPolygon

    addHooks: ->
      L.Draw.Polyline.prototype.addHooks.call(this)
      if @_map
        this._poly = new L.SphericalPolygon([], @options.shapeOptions)
