#= require models/data/grid
#= require models/data/xhr_model

ns = @edsc.models.data
models = @edsc.models

ns.Granules = do (ko,
                  getJSON=jQuery.getJSON,
                  param = jQuery.param
                  XhrModel=ns.XhrModel,
                  scalerUrl = @edsc.config.browseScalerUrl
                  extend=$.extend,
                  LatLng = L?.latLng,
                  Temporal = models.ui.Temporal) ->

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
      @method = 'post'
      super('/granules.json', query)
      @temporal = query.temporal
      @_resultsComputed = false

      focusedTemporal = @parentQuery.focusedTemporal()
      @computed =>
        newFocus = @parentQuery.focusedTemporal()
        if newFocus != focusedTemporal && @isLoaded()
          @results.readImmediate()
        focusedTemporal = newFocus

      @excludedGranulesList = ko.observableArray()

    _toResults: (data, current, params) ->
      entries = data.feed.entry
      newItems = (new Granule(entry) for entry in entries)

      if params.page_num > 1
        current.concat(newItems)
      else
        newItems

    _shouldLoad: (url) ->
      true

    _queryFor: (params) ->
      # Hack around problem with ECHO accepting explicitly indexed attributes
      super(params).replace(/attribute%5B\d+%5D/g, 'attribute%5B%5D')

    _computeSearchResponse: (current, callback, needsLoad=true) ->
      if @query?.isValid()
        results = []
        params = @params()
        query = param(params)
        params.page_num = @page = 1

        if needsLoad && @_prevQuery != query
          @excludedGranulesList([])
          @_prevQuery = query
          if params.temporal == 'no-data'
            @results([])
            @hits(0)
            return

          @results([]) if @_resultsComputed
          @_resultsComputed = true
          @isLoaded(false)
          @_load(params, current, callback)

    exclude: (granule) ->
      results = @results()
      index = results.indexOf(granule)

      results.splice(index, 1)
      @results(results)
      @hits(@hits() - 1)

      currentQuery = param(@params())
      @excludedGranulesList.push({index: index, granule: granule})
      @query.excludedGranules.push(granule.id)
      # Avoid reloading if no other changes are pending
      @_prevQuery = param(@params()) if @_prevQuery == currentQuery

    undoExclude: =>
      newGranule = @excludedGranulesList.pop()
      index = newGranule.index
      granule = newGranule.granule

      granules = @results()

      if index == 0
        granules.unshift(granule)
        newList = granules
      else
        beforeValues = granules.splice(0, index)
        afterValues = granules.splice(index-1)
        newList = beforeValues.concat(granule, afterValues)

      @results(newList)

      @hits(@hits() + 1)
      currentQuery = param(@params())
      @query.excludedGranules.pop()
      # Avoid reloading if no other changes are pending
      @_prevQuery = param(@params()) if @_prevQuery == currentQuery

      granule

    params: =>
      parentParams = @parentQuery.globalParams()
      params = extend({}, parentParams, @query.params())
      focusedTemporal = @parentQuery.focusedTemporal()

      if focusedTemporal?
        granuleTemporal = @query.temporal.applied
        datasetTemporal = @parentQuery.temporal.applied
        condition = datasetTemporal
        condition = granuleTemporal if granuleTemporal.isSet()

        focusedTemporal = condition.intersect(focusedTemporal...)

        if focusedTemporal?
          params.temporal = (t.toISOString() for t in focusedTemporal).join(',')
        else
          params.temporal = 'no-data'
      params

  exports = GranulesModel
