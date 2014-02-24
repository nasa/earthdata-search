#= require models/data/xhr_model

ns = @edsc.models.data

ns.Granules = do (ko, getJSON=jQuery.getJSON, XhrModel=ns.XhrModel, extend=$.extend) ->

  class GranulesModel extends XhrModel
    constructor: (query, @parentQuery) ->
      super('/granules.json', query)

    _toResults: (data) ->
      results = data.feed.entry
      for result in results
        if result.browse_flag == "true"
          result.edsc_browse_url = "https://api.echo.nasa.gov/browse-scaler/browse_images/granules/#{result.id}?h=170&w=170"
      results

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