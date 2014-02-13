#= require models/data/datasets

ns = @edsc.models.data

ns.Project = do (ko, QueryModel = ns.Query, DatasetsModel = ns.Datasets) ->

  class Project
    constructor: (@query) ->
      @_datasetIds = ko.observableArray()
      @_datasetsById = {}
      @id = ko.observable(null)
      @datasets = ko.computed(read: @getDatasets, write: @setDatasets, owner: this)
      @searchGranulesDataset = ko.observable(null)
      @query.params.subscribe(@_onQueryChange)
      @allReadyToDownload = ko.computed =>
        result = true
        for ds in @datasets()
          result = false if !ds.serviceOptions.readyToDownload()
        result

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
      @query.fromJson(jsonObj.datasetQuery)

      ids = (dataset.id for dataset in jsonObj.datasets)

      new DatasetsModel(@query).search {echo_collection_id: ids}, (results) =>
        @datasets(results)
        # TODO, is there a better way to do this?
        for jsonDataset in jsonObj.datasets
          for ds in @datasets()
            if jsonDataset.id == ds.id() && jsonDataset.params
              ds.granuleQuery.fromJson(jsonDataset.params.granuleQuery)

    serialize: ->
      project = {}
      project.datasetQuery = @query.serialize()
      project.datasets = []

      console.log "Ordering without per-dataset customizations"
      for dataset in @datasets()
        id = dataset.id()
        serializedDataset =
          id: id
        if dataset.has_granules()
          serializedDataset.params =
            echo_collection_id: id
            granuleQuery: dataset.granuleQuery.serialize()
        project.datasets.push(serializedDataset)

      project

    _onQueryChange: =>
      params = @query.params()
      for dataset in @getDatasets()
        dataset.searchGranules(params)

  exports = Project
