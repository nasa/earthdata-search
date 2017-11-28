#= require models/data/xhr_model
#= require models/data/variable

ns = @edsc.models.data

ns.Variables = do (ko
                  extend=$.extend
                  XhrModel=ns.XhrModel
                  Variable=ns.Variable) ->

  class VariablesModel extends XhrModel
    @forIds: (ids, query, callback) ->
      variables = (Variable.findOrCreate({meta: {'concept-id': id}}, query) for id in ids)
      needsLoad = (variable.meta()['concept-id'] for variable in variables when !variable.hasAtomData())

      # awaitDatasources = ->
      #   Variable.awaitDatasources variables, callback

      if needsLoad.length > 0
        params = {concept_id: needsLoad}
        new VariablesModel(query).search params, (results) =>
          variables = results
          result.dispose() for result in results
          callback(variables)
      else
        callback(variables)
      null

    constructor: (query) ->
      super('/variables.json', query)

    _decorateNextPage: (params, results) ->
      @page++
      params.page_size = 20
      params.page_num = @page

    _toResults: (data, current, params) ->
      query = @query
      entries = data.items
      newItems = (Variable.findOrCreate(entry, query) for entry in entries)

      if params.page_num > 1
        current.concat(newItems)
      else
        variable.dispose() for variable in current
        newItems

  exports = VariablesModel
