#= require models/data/datasets
#= require models/data/dataset

ns = @edsc.models.data

ns.Project = do (ko,
                 QueryModel = ns.Query,
                 DatasetsModel = ns.Datasets
                 Dataset = ns.Dataset) ->

  class Project
    constructor: (@query) ->
      @_datasetIds = ko.observableArray()
      @_datasetsById = {}
      @selectedDatasetId = ko.observable(null)
      @selectedDataset = ko.computed => @_datasetsById[@selectedDatasetId()]

      @id = ko.observable(null)
      @datasets = ko.computed(read: @getDatasets, write: @setDatasets, owner: this)
      @searchGranulesDataset = ko.observable(null)
      @allReadyToDownload = ko.computed(@_computeAllReadyToDownload, this, deferEvaluation: true)

    _computeAllReadyToDownload: ->
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
        datasetsById[id] = ds.clone()
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

      clonedDataset = dataset.clone()
      @_datasetsById[id] = clonedDataset
      @_datasetIds.remove(id)
      @_datasetIds.push(id)

      # Force results to start being calculated
      clonedDataset.granulesModel.results()
      clonedDataset.dqsModel.results()

      null

    removeDataset: (dataset) =>
      id = dataset.id()

      @_datasetsById[id]?.dispose()

      delete @_datasetsById[id]
      @_datasetIds.remove(id)

      dataset.dispose()
      #dataset.granulesModel.connect()

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
      query = @query

      query.fromJson(jsonObj.datasetQuery)

      @datasets(new Dataset(dataset, query) for dataset in jsonObj.datasets)

      new DatasetsModel(@query).search {echo_collection_id: @_datasetIds()}, (results) =>
        for result in results
          dataset = @_datasetsById[result.id()]
          if dataset?
            dataset.fromJson(result.json)

    serialize: (datasets) ->
      datasetQuery: @query.serialize()
      datasets: (ds.serialize() for ds in datasets)

  exports = Project
