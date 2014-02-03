ns = @edsc.models.data

ns.Project = do (ko, evilJQuery=$, QueryModel = ns.Query) ->

  class Project
    constructor: (@query) ->
      @_datasetIds = ko.observableArray()
      @_datasetsById = {}
      @datasets = ko.computed(read: @getDatasets, write: @setDatasets, owner: this)
      @searchGranulesDataset = ko.observable(null)
      @query.params.subscribe(@_onQueryChange)

      @granule_query = new QueryModel()
      @granule_query.params.subscribe(@_onGranuleQueryChange)

    getDatasets: ->
      @_datasetsById[id] for id in @_datasetIds()

    setDatasets: (datasets) ->
      datasetIds = []
      datasetsById = {}
      for ds in datasets
        id = ds.id()
        datasetIds.push(id)
        datasetsById[id] = ds
      @_datasetsById = datasetsById
      @_datasetIds(datasetIds)
      null

    isEmpty: () ->
      @_datasetIds.isEmpty()

    toggleDataset: (dataset) =>
      if @hasDataset(dataset)
        @removeDataset(dataset)
      else
        @addDataset(dataset)
      null

    addDataset: (dataset) =>
      id = dataset.id()
      @_datasetsById[id] = dataset
      @_datasetIds.remove(id)
      @_datasetIds.push(id)

      dataset.searchGranules(@query.params())

      null

    removeDataset: (dataset) =>
      id = dataset.id()
      delete @_datasetsById[id]
      @_datasetIds.remove(id)
      null

    hasDataset: (other) =>
      @_datasetIds.indexOf(other.id()) != -1

    isSearchingGranules: (dataset) =>
      if @searchGranulesDataset() == dataset
        true
      else
        false

    searchGranules: (dataset) =>
      @searchGranulesDataset(dataset)

    clearSearchGranules: =>
      @searchGranulesDataset(null)

    _onQueryChange: =>
      params = @query.params()
      for dataset in @getDatasets()
        dataset.searchGranules(params)

    _onGranuleQueryChange: =>
      dataset_params = @query.params()
      granule_params = @granule_query.params()
      params = $.extend({}, dataset_params, granule_params)
      if @searchGranulesDataset()
        @searchGranulesDataset().searchGranules(params)

  exports = Project
