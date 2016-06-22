ns = window.edsc.map

ns.mbr = do (dividePolygon = ns.geoutil.dividePolygon, Coordinate = ns.Coordinate, Arc = ns.Arc) ->

  circularMax = (lng0, lng1) ->
    [left, right] = if lng0 < lng1 then [lng0, lng1] else [lng1, lng0]
    if right - left < 180
      right
    else
      left

  circularMin = (lng0, lng1) ->
    if circularMax(lng0, lng1) == lng1
      lng0
    else
      lng1

  findSimpleMbr = (latlngs) ->
    minLat = 91
    maxLat = -91
    minLng = 181
    maxLng = -181

    coords = (Coordinate.fromLatLng(latlng) for latlng in latlngs)
    len = coords.length
    latLngsWithInflections = []
    for coord, i in coords
      latLngsWithInflections.push(coord.toLatLng())
      next = coords[(i + 1) % len]
      inflection = new Arc(coord, next).inflection()
      if inflection
        latLng = inflection.toLatLng()
        if Math.abs(latLng.lat) != 90
          # Has an inflection point, and it's not at the pole (which is handled
          # separately for MBRs)
          latLngsWithInflections.push(latLng)

    first = latLngsWithInflections[0]
    minLat = maxLat = first.lat
    minLng = maxLng = first.lng

    for {lat, lng} in latLngsWithInflections[1..]
      minLat = Math.min(minLat, lat)
      maxLat = Math.max(maxLat, lat)
      if Math.abs(lat) != 90
        minLng = circularMin(minLng, lng)
        maxLng = circularMax(maxLng, lng)
      else
        minLng = Math.min(minLng, lng)
        maxLng = Math.max(maxLng, lng)

    [minLat, minLng, maxLat, maxLng]

  # Returns the distance of lng0 from the interval, a negative number
  # if it's outside and below the interval, a positive if it's outside
  # and above, and 0 if it's within the interval
  distance = (lng0, min, max) ->
    min += 720
    max += 360 while max < min
    mid = min + (max - min) / 2
    lng0 += 360 while lng0 < mid - 180

    if lng0 < min
      min - lng0
    else if lng0 > max
      lng0 - max
    else
      0

  mergeMbrs = (mbrs) ->
    first = mbrs[0]
    rest = mbrs[1..]
    minLat = first[0]
    minLng = first[1]
    maxLat = first[2]
    maxLng = first[3]

    for [lat0, lng0, lat1, lng1] in rest
      minLat = Math.min(minLat, lat0)
      maxLat = Math.max(maxLat, lat1)

      lng0Distance = distance(lng0, minLng, maxLng)
      lng1Distance = distance(lng1, minLng, maxLng)
      maxLngDistance = distance(maxLng, lng0, lng1)

      if lng0Distance == 0 || lng1Distance == 0 || maxLngDistance == 0
        # If the ranges overlap
        minLng = circularMin(minLng, lng0)
        maxLng = circularMax(maxLng, lng1)
      else
        # If the ranges are disjoint
        if lng0Distance < lng1Distance
          # Both points are on the same side
          if lng0Distance < 0
            minLng = lng0
          else
            maxLng = lng1
        else
          # The maximum point and minimum point are on opposite sides of the interval
          if Math.abs(lng0Distance - 360) < Math.abs(lng1Distance + 360)
            # It's closer to extend to the minimum
            minLng = lng0
          else
            maxLng = lng1

    [minLat, minLng, maxLat, maxLng]

  divideMbr = (mbr) ->
    [minLat, minLng, maxLat, maxLng] = mbr
    if maxLng < minLng
      [[minLat, -180, maxLat, maxLng],
       [minLat, minLng, maxLat, 180]]
    else if minLng == maxLng
      [[minLat, -180, maxLat, 180]]
    else
      [mbr]

  EPSILON = 0.00000001

  mbr = (type, latlngs) ->
    if type == 'bounding_box'
      [ll, ur] = latlngs
      [ll.lat, ll.lng, ur.lat, ur.lng]

    else if type == 'point'
      {lat, lng} = latlngs[0]
      [lat - EPSILON, lng - EPSILON, lat + EPSILON, lng + EPSILON]

    else
      {interiors} = dividePolygon(latlngs)
      mbrs = (findSimpleMbr(lls) for lls in interiors)
      mergeMbrs(mbrs)

  exports =
    mbr: mbr
    divideMbr: divideMbr
    mergeMbrs: mergeMbrs
