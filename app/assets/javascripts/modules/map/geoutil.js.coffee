ns = window.edsc.map

ns.geoutil = do (L) ->
  gcInterpolate = (p1, p2) ->
    do (asin=Math.asin, sqrt=Math.sqrt, pow=Math.pow, sin=Math.sin, cos=Math.cos, atan2=Math.atan2) ->
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

      lon += 360 while lon < p1.lng
      lon -= 360 while lon > p2.lng
      L.latLng(lat, lon)

  exports =
    gcInterpolate: gcInterpolate
