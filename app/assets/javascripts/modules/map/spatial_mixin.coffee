
do (L, extend = $.extend, Dataset = @edsc.models.data.Dataset, Granule = @edsc.models.data.Granule) ->

  parseSpatial = (str) ->
    str = str[0] if str instanceof Array
    coords = str.split(' ')
    len = coords.length - 1
    new L.LatLng(coords[i], coords[i+1]) for i in [0...len] by 2

  # Mixin for datasets and granules that parses/normalizes their spatial coordinates
  SpatialMixin =
    getPoints: ->
      if !@_points? && @points?
        merged = []
        @_points = merged.concat.apply(merged, @points.map(parseSpatial))
      @_points

    getPolygons: ->
      if !@_polygons? && @polygons?
        @_polygons = (@polygons.map(parseSpatial) for polygon in @polygons)
      @_polygons

    getLines: ->
      if !@_lines? && @lines?
        @_lines = @lines.map(parseSpatial)
      @_lines

    getRectangles: ->
      if !@_rects? && @boxes?
        rects = []
        for rect in @boxes.map(parseSpatial)
          if rect[0].lng > rect[1].lng
            divided = [[rect[0], L.latLng(rect[1].lat, 180)],
                       [L.latLng(rect[0].lat, -180), rect[1]]]
          else
            divided = [rect]

          for box in divided
            rects.push([L.latLng(box[0].lat, box[0].lng), L.latLng(box[0].lat, box[1].lng),
                        L.latLng(box[1].lat, box[1].lng), L.latLng(box[1].lat, box[0].lng),
                        L.latLng(box[0].lat, box[0].lng)])

        @_rects = rects

      @_rects

    buildLayer: (options) ->
      layer = L.featureGroup()
      layer.addLayer(L.circleMarker(point, options)) for point in @getPoints() ? []
      layer.addLayer(L.sphericalPolygon(poly, options)) for poly in @getPolygons() ? []
      layer.addLayer(L.polyline(line, options)) for line in @getLines() ? []

      for rect in @getRectangles() ? []
        # granule.getRectanges() returns a path, so it's really a polygon
        shape = L.polygon(rect, options)
        shape._interpolationFn = 'cartesian'
        layer.addLayer(shape)
      layer


  extend(Dataset.prototype, SpatialMixin)
  extend(Granule.prototype, SpatialMixin)

  null
