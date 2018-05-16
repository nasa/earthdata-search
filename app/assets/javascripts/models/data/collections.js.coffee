#= require models/data/xhr_model
#= require models/data/collection
#= require models/data/collection_facets

ns = @edsc.models.data

ns.Collections = do (ko
                  extend=$.extend
                  XhrModel=ns.XhrModel
                  Collection=ns.Collection
                  CollectionFacetsModel = ns.CollectionFacets
                  ) ->

  class CollectionsModel extends XhrModel
    @forIds: (ids, query, callback) ->
      collections = (Collection.findOrCreate({id: id}, query) for id in ids)
      needsLoad = (collection.id for collection in collections when !collection.hasAtomData())

      awaitDatasources = ->
        Collection.awaitDatasources collections, callback

      if needsLoad.length > 0
        params = {echo_collection_id: needsLoad}
        params.all_collections = query.params().all_collections if query.params().all_collections?
        new CollectionsModel(query).search params, (results) =>
          result.dispose() for result in results
          awaitDatasources()
      else
        awaitDatasources()
      null

    constructor: (query) ->
      super('/collections.json', query)

      @facets = new CollectionFacetsModel(query)

    params: ->
      extend({include_facets: 'v2'}, super())

    _decorateNextPage: (params, results) ->
      @page++
      if @page > 1
        delete params.include_facets
      params.page_size = 20
      params.page_num = @page

    _toResults: (data, current, params) ->
      query = @query
      entries = data.feed.entry
      newItems = (Collection.findOrCreate(entry, query) for entry in entries)

      if params.page_num > 1
        current.concat(newItems)
      else
        collection.dispose() for collection in current
        @facets.update(data.feed.facets.children || [])
        newItems

    toggleVisibleCollection: (collection) =>
      collection.visible(!collection.visible())

  exports = CollectionsModel
