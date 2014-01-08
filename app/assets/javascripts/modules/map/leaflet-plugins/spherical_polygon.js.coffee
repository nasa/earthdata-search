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

  # Ensures that latlngs is counterclockwise around its smallest area
  # This is an in-place operation modifying the original list.
  makeCounterclockwise = (latlngs) ->
    latlngs.reverse() if geoutil.area(latlngs) < 0
    latlngs

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
    makeCounterclockwise(latlngs)

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

    if hasInsertions
      console.log containsNorthPole, containsSouthPole
      # FIXME: Polygon is reversed if we cross the meridian
      #containsNorthPole = !containsNorthPole
      #containsSouthPole = !containsSouthPole

      # Rearrange the split array so that its beginning and end contain separate polygons
      if Math.abs(split[0].lng) != 180 || Math.abs(split[split.length - 1].lng) != 180
        while Math.abs(split[0].lng) != 180
          split.push(split.shift())
        split.push(split.shift())

    interior = []
    for latlng, i in split
      interior.push(latlng)

      next = split[(i + 1) % split.length]
      if interior.length > 2 && Math.abs(latlng.lng) == 180 && Math.abs(next.lng) == 180
        interiors.push(interior)
        boundaries.push(interior.concat())
        interior = []

    if containsNorthPole && containsSouthPole
      # Reverse everything
      lat = 90
      interiors.unshift([L.latLng( lat, -180),
                         L.latLng( lat,  -90),
                         L.latLng( lat,    0),
                         L.latLng( lat,   90),
                         L.latLng( lat,  180),
                         L.latLng(-lat,  180),
                         L.latLng(-lat,   90),
                         L.latLng(-lat,    0),
                         L.latLng(-lat,  -90),
                         L.latLng(-lat, -180)])
    else if containsNorthPole
      newCrossings = []
      crossingIndex = -1
      for interior, i in interiors
        latlng = interior[0]
        if latlng.lat == maxCrossingLat
          crossingIndex = i
          break


    else if containsSouthPole
      for interior in interiors
        latlng = interior[0]
        if latlng.lat == minCrossingLat
          interior.push(L.latLng(-90, -latlng.lng))
          interior.push(L.latLng(-90, latlng.lng))
          break

    for interior in interiors
      console.log "Interior:", ll2s(interior)

    # Split along meridian, adding points for poles

    #interiors.push([latlngs].concat(holes))
    #boundaries.push(latlngs)
    #boundaries = boundaries.concat(holes)

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
        @_interiors = L.polygon(divided.interiors, L.extend({}, @_options, stroke: false))
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
