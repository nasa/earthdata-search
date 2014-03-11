#= require models/data/xhr_model

ns = @edsc.models.data

ns.Granules = do (ko,
                  getJSON=jQuery.getJSON,
                  XhrModel=ns.XhrModel,
                  extend=$.extend,
                  LatLng = L.latLng) ->

  class Granule
    constructor: (jsonData) ->
      extend(this, jsonData)

    edsc_browse_url: (w, h) ->
      w ?= 170
      h ?= w
      "https://api.echo.nasa.gov/browse-scaler/browse_images/granules/#{@id}?h=#{h}&w=#{w}"

    edsc_full_browse_url: ->
      for link in @links
        return link.href if link.rel.indexOf('browse') != -1
      null

    getTemporal: ->
      time_end = @_normalizeTime(@time_end)
      time_start = @_normalizeTime(@time_start)

      return time_start if time_start == time_end
      return time_start unless time_end?
      return time_end unless time_start?

      "#{time_start} to #{time_end}"

    _normalizeTime: (time) ->
      return null unless time?

      time.replace(/\.0+Z/, 'Z')

    getPoints: ->
      if !@_points? && @points?
        merged = []
        @_points = merged.concat.apply(merged, @points.map(@_parseSpatial))
      @_points

    getPolygons: ->
      if !@_polygons? && @polygons?
        @_polygons = (polygon.map(@_parseSpatial) for polygon in @polygons)
      @_polygons

    getRectangles: ->
      if !@_rects? && @boxes?
        rects = []
        for rect in @boxes.map(@_parseSpatial)
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

    _parseSpatial: (str) ->
      coords = str.split(' ')
      len = coords.length - 1
      new LatLng(coords[i], coords[i+1]) for i in [0...len] by 2


  class GranulesModel extends XhrModel
    constructor: (query, @parentQuery) ->
      super('/granules.json', query)

    _toResults: (data) ->
      new Granule(result) for result in data.feed.entry

    _computeSearchResponse: (current, callback) ->
      if @query?.validQuery() && @parentQuery?.validQuery()
        results = []
        @results([])
        result.dispose?() for result in results
        @isLoaded(false)
        params = @params()
        params.page_num = @page = 1
        @_load(params, current, callback)

    params: ->
      parentParams = @parentQuery.params()
      params = {}
      for param in ['bounding_box', 'point', 'line', 'polygon', 'temporal']
        parentValue = parentParams[param]
        params[param] = parentValue if parentValue?
      extend(params, @query.params())

  exports = GranulesModel