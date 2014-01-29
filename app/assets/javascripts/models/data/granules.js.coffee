#= require models/data/xhr_model

ns = @edsc.models.data

ns.Granules = do (ko, getJSON=jQuery.getJSON, XhrModel=ns.XhrModel) ->

  class GranulesModel extends XhrModel
    constructor: ->
      super('/granules.json')

  exports = GranulesModel