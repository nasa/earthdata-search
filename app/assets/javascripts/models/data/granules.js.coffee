#= require models/data/xhr_model

ns = @edsc.models.data

ns.Granules = do (ko, getJSON=jQuery.getJSON, XhrModel=ns.XhrModel, extend=$.extend) ->

  class GranulesModel extends XhrModel
    constructor: (query, @parentQuery) ->
      super('/granules.json', query)

    _toResults: (data) ->
      data.feed.entry

    _computeSearchResponse: (current, callback) ->
      if @query?.validQuery() && @parentQuery?.validQuery()
        parentParams = @parentQuery.params()
        params = {}
        for param in ['spatial', 'temporal']
          parentValue = parentParams[param]
          params[param] = parentValue if parentValue?
        extend(params, @query.params())
        params.page_num = @page = 1
        @_load(params, current, callback)

  exports = GranulesModel