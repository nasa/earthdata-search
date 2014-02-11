#= require models/data/xhr_model

ns = @edsc.models.data

ns.Granules = do (ko, getJSON=jQuery.getJSON, XhrModel=ns.XhrModel) ->

  class GranulesModel extends XhrModel
    constructor: ->
      super('/granules.json')

    _onSuccess: (data, replace) ->
      results = data.feed.entry;

      if replace
        @_searchResponse(results)
      else
        currentResults.push.apply(@_searchResponse, results)

  exports = GranulesModel