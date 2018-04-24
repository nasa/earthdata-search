#= require models/data/xhr_model
#= require models/data/service

ns = @edsc.models.data

ns.Services = do (ko
                  extend=$.extend
                  XhrModel=ns.XhrModel
                  Service=ns.Service) ->

  class ServicesModel extends XhrModel
    @forIds: (ids, query, callback) ->
      services = (Service.findOrCreate({meta: {'concept-id': id}}, query) for id in ids)
      needsLoad = (service.meta()['concept-id'] for service in services when !service.hasAtomData())

      awaitDatasources = ->
        Service.awaitDatasources services, callback

      if needsLoad.length > 0
        params = {concept_id: needsLoad}
        new ServicesModel(query).search params, (results) =>
          result.dispose() for result in results
          awaitDatasources()
      else
        awaitDatasources()
      null

    constructor: (query) ->
      super('/services.json', query)

    _decorateNextPage: (params, results) ->
      @page++
      params.page_size = 20
      params.page_num = @page

    _toResults: (data, current, params) ->
      query = @query
      entries = data.items
      newItems = (Service.findOrCreate(entry, query) for entry in entries)

      if params.page_num > 1
        current.concat(newItems)
      else
        service.dispose() for service in current
        newItems

  exports = ServicesModel
