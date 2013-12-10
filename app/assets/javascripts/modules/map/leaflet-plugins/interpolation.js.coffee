do (L, gcInterpolate = window.edsc.map.geoutil.gcInterpolate) ->

  # NOTE TO PQ: Override L.Polyline.prototype.projectLatlngs to follow arcs

  interpolateCartesian = (ll0, ll1) ->
    L.latLng((ll0.lat + ll1.lat) / 2, (ll0.lng + ll1.lng) / 2)

  interpolateGeodetic = (ll0, ll1) ->
    gcInterpolate(ll0, ll1)

  dotProduct = (p, q) ->
    p.x * q.x + p.y * q.y

  # Returns the distance between q and the line connecting p0 and p1
  distance = (p0, p1, p) ->
    return p0.distanceTo(p) if p0.equals(p1)

    # http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Vector_formulation
    a = p0
    t = p0.distanceTo(p1)
    n = p1.subtract(p0).divideBy(t)

    # Intermediate term
    a_p = a.subtract(p)

    # Vector whose magnitude is the desired distance
    v = a_p.subtract(n.multiplyBy(dotProduct(a_p, n)))

    # Magnitude of the vector
    Math.sqrt(v.x * v.x + v.y * v.y)

  pathString = (points) ->
    (p.toString() for p in points).join(", ")

  projectLatLngPath = (latLngs, proj, interpolateFn=interpolateCartesian, tolerance=1, maxDepth=10) ->
    return [] if latLngs.length == 0
    # Clone path and set its last element to its first so we can interpolate the last segment
    latLngs = latLngs.concat(latLngs[0])

    points = (proj(ll) for ll in latLngs)
    depths = (0 for ll in latLngs)

    interpolatedLatLngs = [latLngs.shift()]
    interpolatedPoints = [points.shift()]
    interpolatedDepths = [depths.shift()]

    depth0 = 0
    depth1 = 0

    maxDepthReached = false

    while latLngs.length > 0
      ll0 = interpolatedLatLngs[interpolatedLatLngs.length - 1]
      p0 = interpolatedPoints[interpolatedPoints.length - 1]

      ll1 = latLngs[0]
      p1 = points[0]

      ll = interpolateFn(ll0, ll1)
      p = proj(ll)
      depth = Math.max(depth0, depth1) + 1

      d = distance(p0, p1, p)
      if d < tolerance || depth >= maxDepth
        maxDepthReached = true if depth >= maxDepth
        interpolatedLatLngs.push(ll, latLngs.shift())
        interpolatedPoints.push(p, points.shift())
        depth0 = depth1
        depth1 = Math.max(0, depth1 - 2)
      else
        latLngs.unshift(ll)
        points.unshift(p)
        depth1 += 1

    # Remove the last element from the path, which is the same as the first element of the path, added above
    interpolatedPoints.pop()

    if maxDepthReached
      console.warn("Max interpolation depth reach.  Interpolated shape has #{interpolatedPoints.length} points.")

    interpolatedPoints

  projectLatlngs = ->
    proj = @_map.latLngToLayerPoint.bind(@_map)
    @_originalPoints = projectLatLngPath(@_latlngs, proj)
    @_holePoints = (projectLatLngPath(hole, proj) for hole in @_holes ? [])

  L.Polyline.prototype.projectLatlngs = projectLatlngs
  L.Polygon.prototype.projectLatlngs = projectLatlngs
