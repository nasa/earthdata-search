#= require models/data/xhr_model
#= require models/data/dataset

ns = @edsc.models.data

ns.Datasets = do (ko
                  getJSON=jQuery.getJSON
                  XhrModel=ns.XhrModel
                  Dataset=ns.Dataset
                  ) ->

  class DatasetsModel extends XhrModel
    constructor: (query) ->
      #super('http://localhost:3002/datasets')
      super('/datasets.json', query)

      @details = ko.observable({})
      @detailsLoading = ko.observable(false)
      @_visibleDatasetIds = ko.observableArray()
      @_visibleDatasets = {}
      @visibleDatasets = @computed(@_computeVisibleDatasets)
      @allDatasetsVisible = ko.observable(false)

    _toResults: (data) ->
      results = data.feed.entry;
      query = @query
      new Dataset(result, query) for result in results

    showDataset: (dataset) =>
      id = dataset.id()

      path = "/datasets/#{id}.json"
      console.log("Request: #{path}", this)
      @detailsLoading(true)
      getJSON path, (data) =>
        details = data['dataset']
        details.summaryData = dataset
        @details(details)
        @detailsLoading(false)
        $content = $('#dataset-information')
        $content.height($content.parents('.main-content').height() - $content.offset().top - 40)

    hasVisibleDataset: (dataset) =>
      @_visibleDatasetIds.indexOf(dataset.id()) != -1

    addVisibleDataset: (dataset) ->
      unless @hasVisibleDataset(dataset)
        id = dataset.id()
        @_visibleDatasets[id] = dataset
        @_visibleDatasetIds.push(id)

    removeVisibleDataset: (dataset) ->
      id = dataset.id()
      @_visibleDatasetIds.remove(id)
      delete @_visibleDatasets[id]

    _computeVisibleDatasets: =>
      @_visibleDatasets[id] for id in @_visibleDatasetIds()

    toggleVisibleDataset: (dataset) =>
      if @hasVisibleDataset(dataset)
        @removeVisibleDataset(dataset)
      else
        @addVisibleDataset(dataset)

    toggleViewAllDatasets: (datasets) =>
      if @allDatasetsVisible()
        datasets().forEach(@removeVisibleDataset, this)
        @allDatasetsVisible(false)
      else
        datasets().forEach(@addVisibleDataset, this)
        @allDatasetsVisible(true)

  exports = DatasetsModel