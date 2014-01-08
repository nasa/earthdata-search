ns = window.edsc.map

ns.geoutil = do (L) ->

  class Coordinate
    @fromLatLng: (args...) ->
      if args.length == 1
        {lat, lng} = args[0]
      else
        [lat, lng] = args
      Coordinate.fromPhiTheta(lat * DEG_TO_RAD, lng * DEG_TO_RAD)

    @fromPhiTheta: (phi, theta) ->
      PI = Math.PI
      cos = Math.cos
      sin = Math.sin

      # Normalize phi to the interval [-PI / 2, PI / 2]
      phi -= 2 * PI while phi >= PI
      phi += 2 * PI while phi < PI

      if phi > PI / 2
        phi = PI - phi
        theta += PI
      if phi < -PI / 2
        phi = - PI  - phi
        theta += PI

      theta -= 2 * PI while theta >= PI
      theta += 2 * PI while theta < -PI

      x = cos(phi) * cos(theta)
      y = cos(phi) * sin(theta)
      z = sin(phi)

      new Coordinate(phi, theta, x, y, z)

    # +X axis passes through the (anti-)meridian at the equator
    # +Y axis passes through 90 degrees longitude at the equator
    # +Z axis passes through the north pole
    @fromXYZ: (x, y, z) ->
      d = x*x + y*y + z*z
      d = x = 1 if d == 0 # Should never happen, but stay safe

      # We normalize so that x, y, and z fall on a unit sphere
      scale = 1 / Math.sqrt(d)
      x *= scale
      y *= scale
      z *= scale

      theta = Math.atan2(y, x)
      phi = Math.asin(z)

      new Coordinate(phi, theta, x, y, z)

    constructor: (@phi, @theta, @x, @y, @z) ->

    # Dot product
    dot: (other) ->
      @x * other.x + @y * other.y + @z * other.z

    # Normalized cross product
    cross: (other) ->
      x = @y * other.z - @z * other.y
      y = @z * other.x - @x * other.z
      z = @x * other.y - @y * other.x
      Coordinate.fromXYZ(x, y, z)

    # Distance to other coordinate on a unit sphere.  Same as the angle between the two points at the origin.
    distanceTo: (other) ->
      Math.acos(@dot(other))

    toLatLng: ->
      new L.LatLng(RAD_TO_DEG * @phi, RAD_TO_DEG * @theta)

    toString: ->
      latlng = @toLatLng()
      "(#{latlng.lat.toFixed(3)}, #{latlng.lng.toFixed(3)})"

    toXYZString: ->
      "<#{@x.toFixed(3)}, #{@y.toFixed(3)}, #{@z.toFixed(3)}>"

  # A small number for dealing with near-0
  EPSILON = 0.00000001

  class Arc
    constructor: (coordA, coordB) ->
      if coordB.theta < coordA.theta
        [coordB, coordA] = [coordA, coordB]

      if coordB.theta - coordA.theta > Math.PI
        @coordB = coordA
        @coordA = coordB
      else
        @coordA = coordA
        @coordB = coordB
      @normal = @coordA.cross(@coordB)

    antimeridianCrossing: ->
      abs = Math.abs

      # Doesn't cross the meridian
      return null if @coordA.theta < @coordB.theta

      # On the meridian
      return null if abs(Math.PI - abs(@coordA.theta)) < EPSILON || abs(Math.PI - abs(@coordB.theta)) < EPSILON

      xN = @normal.x
      yN = @normal.y
      zN = @normal.z

      # We have two vectors and a normal vector.  We need to find a third
      # vector which passes through the (anti-)meridian (y = 0) and whose
      # normal vector with either @coordA or @coordB is @normal (or at least
      # points in the same direction).
      #
      # xN = yA * z - zA * y
      # yN = zA * x - xA * z
      # zN = xA * y - yA * x
      #
      # x = - zN / yA
      # y = 0
      # z = xN / yA

      # We need to be careful of two things here.  First, yA cannot be 0,
      # in other words our chosen arc endpoint cannot itself be on the meridian

      yA = @coordA.y
      yA = @coordB.y if abs(yA) < EPSILON

      # If they're both on the meridian, bail
      return null if abs(yA) < EPSILON

      # Second, the normal directions zN and xN cannot both be 0.  This happens
      # when the arc follows the meridian, so in theory this case should never
      # occur.

      return null if abs(zN) < EPSILON && abs(xN) < EPSILON

      x = -zN / yA
      y = 0
      z = xN / yA

      # Finally, we need <x, y, z> to point in the direction of the anti-meridian

      if x > 0
        x = -x
        z = -z

      Coordinate.fromXYZ(x, y, z)


  # Given two points, returns their midpoint along the shortest great circle between them.  The
  # two points may not be antipodal, since such a midpoint would be undefined
  gcInterpolate = (p1, p2) ->
    do (abs=Math.abs, asin=Math.asin, sqrt=Math.sqrt, pow=Math.pow, sin=Math.sin, cos=Math.cos, atan2=Math.atan2) ->
      return p1 if abs(p1.lat) == abs(p2.lat) == 90

      d2r  = L.LatLng.DEG_TO_RAD
      r2d  = L.LatLng.RAD_TO_DEG

      [p1, p2] = [p2, p1] if p2.lng < p1.lng

      lat1 = p1.lat * d2r
      lon1 = p1.lng * d2r
      lat2 = p2.lat * d2r
      lon2 = p2.lng * d2r

      # http://williams.best.vwh.net/avform.htm#Dist
      d = 2 * asin(sqrt(pow(sin((lat1 - lat2) / 2), 2) +
                        cos(lat1) * cos(lat2) * pow(sin((lon1 - lon2) / 2), 2)))

      # http://williams.best.vwh.net/avform.htm#Intermediate
      # This is a special case where f = 1/2 and therefore A = B, allowing us
      # to simplify a few expressions
      AB = sin(d / 2) / sin(d)
      x = AB * (cos(lat1) * cos(lon1) +  cos(lat2) * cos(lon2))
      y = AB * (cos(lat1) * sin(lon1) +  cos(lat2) * sin(lon2))
      z = AB * (sin(lat1)             +  sin(lat2))
      lat = r2d * atan2(z, sqrt(x*x + y*y))
      lon = r2d * atan2(y, x)

      # Guard against the points being the same or antipodal
      return p1 if isNaN(lat) || isNaN(lon)

      lon += 360 while lon < p1.lng
      lon -= 360 while lon > p2.lng

      L.latLng(lat, lon)

  DEG_TO_RAD = Math.PI / 180
  RAD_TO_DEG = 180 / Math.PI

  area = (latlngs) ->
    return 0 if latlngs.length < 3

    # http://trs-new.jpl.nasa.gov/dspace/bitstream/2014/40409/3/JPL%20Pub%2007-3%20%20w%20Errata.pdf
    # Page 7

    sum = 0
    len = latlngs.length
    for i in [0...len]
      thetaA = latlngs[i].lng * DEG_TO_RAD
      phiB = latlngs[(i + 1) % len].lat * DEG_TO_RAD
      thetaC = latlngs[(i + 2) % len].lng * DEG_TO_RAD
      sum += (thetaC - thetaA) * Math.sin(phiB)

    -sum / 2

  antimeridianCrossing = (latlng0, latlng1) ->
    arc = new Arc(Coordinate.fromLatLng(L.latLng(latlng0)),
                  Coordinate.fromLatLng(L.latLng(latlng1)))
    arc.antimeridianCrossing()?.toLatLng()


  course = (latlng1, latlng2) ->
    # http://williams.best.vwh.net/avform.htm#Crs
    {sin, cos, atan2, PI} = Math

    c1 = Coordinate.fromLatLng(latlng1)
    c2 = Coordinate.fromLatLng(latlng1)

    lat1 = latlng1.lat * DEG_TO_RAD
    lng1 = latlng1.lng * DEG_TO_RAD

    lat2 = latlng2.lat * DEG_TO_RAD
    lng2 = latlng2.lng * DEG_TO_RAD

    return PI     if lat1 >  PI / 2 - EPSILON
    return 2 * PI if lat1 < -PI / 2 + EPSILON

    numer = sin(lng1 - lng2) * cos(lat2)
    denom = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(lng1 - lng2)
    result = atan2(numer, denom) % (2 * PI)

    result += 2 * PI if result < 0

    result

  angleDelta = (a1, a2) ->
    a2 += 360 if a2 < a1

    left_turn_amount = a2 - a1

    if left_turn_amount == 180
      0
    else if left_turn_amount > 180
      left_turn_amount - 360
    else
      left_turn_amount

  COUNTERCLOCKWISE = 1
  CLOCKWISE = -1
  NONE = 0

  rotationDirection = (angles) ->
    delta = 0
    len = angles.length

    for i in [0...len]
      a1 = angles[i]
      a2 = angles[(i + 1) % len]
      delta += angleDelta(a1, a2)

    if Math.abs(delta) < EPSILON
      direction = NONE
    else if delta > 0
      direction = COUNTERCLOCKWISE
    else
      direction = CLOCKWISE
    direction

  NORTH_POLE = 1 # = 0001
  SOUTH_POLE = 2 # = 0010

  containsPole = (latlngs) ->
    return false if latlngs.length < 3

    latlngs = (L.latLng(latlng) for latlng in latlngs)

    # http://www.element84.com/determining-if-a-spherical-polygon-contains-a-pole.html

    delta = 0
    len = latlngs.length
    for i in [0...len]
      latlng0 = latlngs[(i - 1 + len) % len]
      latlng1 = latlngs[i]
      latlng2 = latlngs[(i + 1) % len]

      prev = (course(latlng1, latlng0) + Math.PI) % (2 * Math.PI)
      initial = course(latlng1, latlng2)
      final = (course(latlng2, latlng1) + Math.PI) % (2 * Math.PI)

      delta0 = initial - prev
      delta0 -= 2 * Math.PI if delta0 > Math.PI
      delta0 += 2 * Math.PI if delta0 < -Math.PI
      if Math.abs(Math.PI - Math.abs(delta0)) < EPSILON
        delta0 = 0

      delta1 = final - initial
      delta1 -= 2 * Math.PI if delta1 > Math.PI
      delta1 += 2 * Math.PI if delta1 < -Math.PI
      if Math.abs(Math.PI - Math.abs(delta1)) < EPSILON
        delta1 = 0

      delta += delta0 + delta1

    delta = delta * RAD_TO_DEG

    if delta < -360 + EPSILON
      NORTH_POLE | SOUTH_POLE
    else if delta < EPSILON
      angles = (latlng.lng for latlng in latlngs)
      dir = rotationDirection(angles)
      if dir == COUNTERCLOCKWISE
        NORTH_POLE
      else if dir == CLOCKWISE
        SOUTH_POLE
      else
        console.warn("Rotation direction is NONE despite containing a pole")
        NONE
    else
      NONE

  #180, -45, 120, 45, -170, 20, 160, 50, -120, 0, 180, -45

  #console.log "DELTA n. pole: 1?", containsPole([[60, -120], [70, 0], [80, 120]])
  #console.log "DELTA no pole: 0?", containsPole([[-45, 180], [45, 120], [0, -120]])
  #console.log "DELTA no pole: 0?", containsPole([[1, 0], [1, 4], [5, 6], [5, 2]])
  #console.log "DELTA 2 poles: 3?", containsPole([[1, 0], [5, 2], [5, 6], [1, 4]])
  #console.log "DELTA n. pole: 1?", containsPole([[85, -135], [85, -45], [85, 45], [85, 135]])
  #console.log "DELTA no pole: 0?", containsPole([[85, -90], [85, 0], [85, 90]])
  #console.log "DELTA s. pole: 2?", containsPole([[-85, -135], [-85, 135], [-85, 45], [-85, -45]])
  #console.log "DELTA no pole: 0?", containsPole([[-85, 90], [-85, 0], [-85, -90]])

  exports =
    gcInterpolate: gcInterpolate
    area: area
    Coordinate: Coordinate
    Arc: Arc
    antimeridianCrossing: antimeridianCrossing
    containsPole: containsPole
    NORTH_POLE: NORTH_POLE
    SOUTH_POLE: SOUTH_POLE
