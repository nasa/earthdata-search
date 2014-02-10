#= require models/data/datasets

ns = @edsc.models.data

ns.Project = do (ko, QueryModel = ns.Query, getJSON=jQuery.getJSON, DatasetsModel = ns.Datasets) ->

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

    fromJson: (jsonObj) ->
      @query.fromJson(jsonObj.dataset_query)
      @granule_query.fromJson(jsonObj.granule_query)

      ids = (dataset.id for dataset in jsonObj.datasets)

      new DatasetsModel().search {echo_collection_id: ids}, (params, model) =>
        @datasets(model.results())
        for ds in @datasets()
          dataset_params = @query.params()
          granule_params = @granule_query.params()
          params = $.extend({}, dataset_params, granule_params)
          ds.searchGranules(params)

      # TODO set granule query conditions here, once we pass those to the results page

    serialize: ->
      project = {}
      project.dataset_query = @query.serialize()
      project.granule_query = @granule_query.serialize()
      project.datasets = []

      console.log "Ordering without per-dataset customizations"
      for dataset in @datasets()
        id = dataset.id()
        serializedDataset =
          id: id
        if dataset.has_granules()
          # TODO: Eventually this will need to have per-dataset customizations
          serializedDataset.params =
            echo_collection_id: id
        project.datasets.push(serializedDataset)

      project

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
