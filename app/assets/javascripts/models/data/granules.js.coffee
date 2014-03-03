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

    edsc_browse_url: ->
      "https://api.echo.nasa.gov/browse-scaler/browse_images/granules/#{@id}?h=170&w=170"

    getPoints: ->
      if !@_points? && @points?
        merged = []
        @_points = merged.concat.apply(merged, @points.map(@_parseSpatial))
      @_points

    getPolygons: ->
      if !@_polygons? && @polygons?
        @_polygon = (polygon.map(@_parseSpatial) for polygon in @polygons)

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