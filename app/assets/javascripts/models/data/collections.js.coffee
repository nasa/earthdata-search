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
        new CollectionsModel(query).search {echo_collection_id: needsLoad}, (results) =>
          result.dispose() for result in results
          awaitDatasources()
      else
        awaitDatasources()
      null


    constructor: (query) ->
      super('/collections.json', query)

      @facets = new CollectionFacetsModel(query)

      # The index where featured collections stop and un-featured begin
      @_featuredSplitIndex = @computed(read: @_computeFeaturedSplitIndex, deferEvaluation: true, owner: this)
      @featured = @computed(read: @_computeFeatured, deferEvaluation: true, owner: this)
      @unfeatured = @computed(read: @_computeUnfeatured, deferEvaluation: true, owner: this)

    params: ->
      extend({include_facets: true}, super())

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
        @facets.update(data.feed.facets || [])
        newItems

    toggleVisibleCollection: (collection) =>
      collection.visible(!collection.visible())

    _computeFeaturedSplitIndex: ->
      results = @results()
      return 0 if results.length > 0 && !results[0].hasAtomData()
      for ds, i in results
        return i if !ds.hasAtomData() || !ds.featured
      results.length

    _computeFeatured: ->
      @results().slice(0, @_featuredSplitIndex())

    _computeUnfeatured: ->
      @results().slice(@_featuredSplitIndex())

  exports = CollectionsModel
