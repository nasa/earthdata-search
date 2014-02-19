#= require models/data/xhr_model

ns = @edsc.models.data

ns.Granules = do (ko, getJSON=jQuery.getJSON, XhrModel=ns.XhrModel, extend=$.extend) ->

  class GranulesModel extends XhrModel
    constructor: (query, @parentQuery) ->
      super('/granules.json', query)

    _toResults: (data) ->
      data.feed.entry

    _computeSearchResponse: (callback, current) ->
      if @query? && @parentQuery?
        if @query.validQuery() && @parentQuery.validQuery()
          params = @parentQuery.params()
          extend(params, @query.params())
          @_load(params, current, callback)

  exports = GranulesModel