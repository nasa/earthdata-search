#= require models/data/xhr_model

ns = @edsc.models.data
models = @edsc.models

ns.Granules = do (ko,
                  getJSON=jQuery.getJSON,
                  XhrModel=ns.XhrModel,
                  scalerUrl = @edsc.config.browseScalerUrl
                  extend=$.extend,
                  LatLng = L?.latLng,
                  uiModel = models.ui) ->

  class Granule
    constructor: (jsonData) ->
      extend(this, jsonData)

    edsc_browse_url: (w, h) ->
      w ?= 170
      h ?= w
      "#{scalerUrl}/#{@id}?h=#{h}&w=#{w}"

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

    getLines: ->
      if !@_lines? && @lines?
        @_lines = @lines.map(@_parseSpatial)
      @_lines

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

    equals: (other) ->
      other.id == @id

    _parseSpatial: (str) ->
      coords = str.split(' ')
      len = coords.length - 1
      new LatLng(coords[i], coords[i+1]) for i in [0...len] by 2


  class GranulesModel extends XhrModel
    constructor: (query, @parentQuery) ->
      super('/granules.json', query)
      @temporal = @disposable(new uiModel.Temporal(query))
      @_resultsComputed = false

      focusedTemporal = @parentQuery.focusedTemporal()
      @computed =>
        newFocus = @parentQuery.focusedTemporal()
        if newFocus != focusedTemporal && @isLoaded()
          @results.readImmediate()
        focusedTemporal = newFocus

    _toResults: (data, current, params) ->
      entries = data.feed.entry
      newItems = (new Granule(entry) for entry in entries)

      if params.page_num > 1
        current.concat(newItems)
      else
        newItems

    _computeSearchResponse: (current, callback) ->
      if @query?.validQuery() && @parentQuery?.validQuery()
        results = []
        @results([]) if @_resultsComputed
        @_resultsComputed = true
        @isLoaded(false)
        params = @params()
        params.page_num = @page = 1
        @_load(params, current, callback)

    params: =>
      parentParams = @parentQuery.globalParams()
      params = {}
      for param in ['bounding_box', 'point', 'line', 'polygon', 'temporal']
        parentValue = parentParams[param]
        params[param] = parentValue if parentValue?
      extend(params, @query.params())

  exports = GranulesModel