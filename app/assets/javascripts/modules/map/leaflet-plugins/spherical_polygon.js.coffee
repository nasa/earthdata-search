do (L, geoutil=window.edsc.map.geoutil) ->

  convertLatLngs = (latlngs) ->
    result = []
    for original in latlngs
      latlng = L.latLng(original)
      latlng.lng -= 360 while latlng.lng > 180
      latlng.lng += 360 while latlng.lng < -180
      result.push(latlng)

    result

  # Ensures that latlngs is counterclockwise around its smallest area
  # This is an in-place operation modifying the original list.
  makeCounterclockwise = (latlngs) ->
    area = geoutil.area(latlngs)
    latlngs.reverse() if area > 2 * Math.PI
    latlngs

  # For debugging
  ll2s = (latlngs) ->
    ("(#{ll.lat}, #{ll.lng})" for ll in latlngs).join(', ')

  ll2j = (latlngs) ->
    ("#{ll.lng},#{ll.lat}" for ll in latlngs.concat(latlngs[0])).join(', ')

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

    # Ensure the exterior points are counterclockwise around their smallest area
    # TODO: This is probably not the right place to do this when it comes to displaying
    #       granule geometries
    latlngs = makeCounterclockwise(latlngs)

    containedPoles = geoutil.containsPole(latlngs)
    containsNorthPole = (containedPoles & geoutil.NORTH_POLE) != 0
    containsSouthPole = (containedPoles & geoutil.SOUTH_POLE) != 0

    maxCrossingLat = -95
    minCrossingLat = 95

    split = []
    len = latlngs.length
    for i in [0...len]
      latlng1 = latlngs[i]
      latlng2 = latlngs[(i + 1) % len]

      crossing = geoutil.antimeridianCrossing(latlng1, latlng2)

      split.push(latlng1)

      # FIXME: What if they're both at +/-180 or one is at -180 and one is at 180
      #        Test cases needed

      extras = []
      if crossing?
        lat = crossing.lat
        if latlng1.lng < latlng2.lng
          extras = [[lat, -180], [lat, 180]]
        else
          extras = [[lat, 180], [lat, -180]]
      else if latlng1.lng == 180 && latlng2.lng < 0
        extras = [[latlng1.lat, -180]]
      else if latlng1.lng == -180 && latlng2.lng > 0
        extras = [[latlng1.lat, 180]]
      else if latlng2.lng == 180 && latlng1.lng < 0
        extras = [[latlng2.lat, -180]]
      else if latlng2.lng == -180 && latlng1.lng > 0
        extras = [[latlng2.lat, 180]]

      for extra in extras
        [lat, lng] = extra
        split.push(L.latLng(lat, lng))
        maxCrossingLat = Math.max(lat, maxCrossingLat)
        minCrossingLat = Math.min(lat, minCrossingLat)


    hasInsertions = latlngs.length < split.length

    interior = []
    boundary = []

    if hasInsertions
      # Rearrange the split array so that its beginning and end contain separate polygons
      if Math.abs(split[0].lng) != 180 || Math.abs(split[split.length - 1].lng) != 180
        while Math.abs(split[0].lng) != 180
          split.push(split.shift())
        split.push(split.shift())

    for latlng, i in split
      interior.push(latlng)
      boundary.push(latlng)

      next = split[(i + 1) % split.length]
      if interior.length > 2 && Math.abs(latlng.lng) == 180 && Math.abs(next.lng) == 180
        boundaries.push(boundary)
        boundary = []

        hasPole = false
        if containsNorthPole && latlng.lat == maxCrossingLat
          hasPole = true
          lng = latlng.lng
          inc = if lng < 0 then 90 else -90
          for i in [0..4]
            interior.push(L.latLng(90, lng + i*inc))
        if containsSouthPole && latlng.lat == minCrossingLat
          hasPole = true
          lng = latlng.lng
          inc = if lng < 0 then 90 else -90
          for i in [0..4]
            interior.push(L.latLng(-90, lng + i*inc))
        unless hasPole
          interiors.push(interior)
          interior = []

    boundaries.push(boundary) if boundary.length > 0
    interiors.push(interior) if interior.length > 0

    # Special case: If we contain both poles but do not have an edge crossing the meridian
    # as dealt with above, reverse our drawing.
    if containsNorthPole && containsSouthPole && !hasInsertions
      interior = []
      interior.push(L.latLng(90, -180 + i*90)) for i in [0..4]
      interior.push(L.latLng(-90, 180 - i*90)) for i in [0..4]
      interiors.unshift(interior)

    #for interior in interiors
    #  console.log "Interior:", ll2s(interior)
    #for interior in boundaries
    #  console.log "Boundary:", ll2s(interior)


    {interiors: interiors, boundaries: boundaries}

  # This is a bit tricky.  We need to be an instanceof L.Polygon for L.Draw methods
  # to work, but in reality we're an L.FeatureGroup, hence the "includes"
  L.SphericalPolygon = L.Polygon.extend
    includes: [L.LayerGroup.prototype, L.FeatureGroup.prototype]
    options:
      fill: true

    initialize: (latlngs, options) ->
      @_layers = {}
      @_options = @options = options
      @setLatLngs(latlngs)

    setLatLngs: (latlngs) ->
      latlngs = (L.latLng(latlng) for latlng in latlngs)

      @_latlngs = latlngs

      divided = dividePolygon(latlngs)

      if @_boundaries
        @_interiors.setLatLngs(divided.interiors)
        @_boundaries.setLatLngs(divided.boundaries)
      else
        @_interiors = L.polygon(divided.interiors, L.extend({}, @_options, stroke: false))
        @_boundaries = L.multiPolyline(divided.boundaries, L.extend({}, @_options, fill: false))
        @addLayer(@_interiors)
        @addLayer(@_boundaries)

    getLatLngs: ->
      makeCounterclockwise(@_latlngs.concat())

    newLatLngIntersects: (latlng, skipFirst) ->
      false

    setOptions: (options) ->
      @_options = @options = L.extend({}, @_options, options)
      L.setOptions(@_interiors, L.extend({}, @_options, stroke: false))
      L.setOptions(@_boundaries, L.extend({}, @_options, fill: false))
      @redraw()

    setStyle: (style) ->
      @setOptions(style)
      @_interiors.setStyle(L.extend({}, style, stroke: false))
      @_boundaries.setStyle(L.extend({}, style, fill: false))

    redraw: ->
      @setLatLngs(@_latlngs)

  L.sphericalPolygon = (latlngs, options) -> new L.SphericalPolygon(latlngs, options)

  L.Draw.Polygon = L.Draw.Polygon.extend
    Poly: L.SphericalPolygon

    addHooks: ->
      L.Draw.Polyline.prototype.addHooks.call(this)
      if @_map
        this._poly = new L.SphericalPolygon([], @options.shapeOptions)

  L.Edit.Poly = L.Edit.Poly.extend
    _getMiddleLatLng: (marker1, marker2) ->
      latlng = geoutil.gcInterpolate(marker1.getLatLng(), marker2.getLatLng())
