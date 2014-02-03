#= require models/data/xhr_model
#= require models/data/granules

ns = @edsc.models.data

ns.Datasets = do (ko, getJSON=jQuery.getJSON, XhrModel=ns.XhrModel, Granules=ns.Granules) ->

  class Dataset
    constructor: (jsonData) ->
      @_loadJson(jsonData)

      @granulesModel = granulesModel = new Granules()
      @granules = ko.computed -> granulesModel.results()
      @granuleHits = ko.computed -> granulesModel.hits()

    _loadJson: (jsonData) ->
      @thumbnail = ko.observable(null)
      @spatial_constraint = ko.observable(null)
      @archive_center = ko.observable(null)
      ko.mapping.fromJS(jsonData, {}, this)
      @error = ko.observable(null)

    searchGranules: (params) ->
      @granulesModel.search(@_granuleParams(params))

    loadNextGranules: (params) ->
      @granulesModel.loadNextPage(@_granuleParams(params))

    _granuleParams: (params) ->
      $.extend({}, params, 'echo_collection_id[]': @id())

  class DatasetsModel extends XhrModel
    constructor: ->
      #super('http://localhost:3002/datasets')
      super('/datasets.json')
      @details = ko.observable({})
      @detailsLoading = ko.observable(false)
      @_visibleDatasetIds = ko.observableArray()
      @allDatasetsVisible = ko.observable(false)

    _onSuccess: (data, replace) ->
      results = data.feed.entry;
      if replace
        @_searchResponse(new Dataset(result) for result in results)
      else
        currentResults = @_searchResponse
        newResults = (new Dataset(result) for result in results)
        currentResults.push.apply(currentResults, newResults)

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

    toggleVisibleDataset: (dataset) =>
      if @hasVisibleDataset(dataset)
        @_visibleDatasetIds.remove(dataset.id())
      else
        @_visibleDatasetIds.push(dataset.id())

    toggleViewAllDatasets: (datasets) =>
      if @allDatasetsVisible()
        for dataset in datasets()
          @_visibleDatasetIds.remove(dataset.id())
        @allDatasetsVisible(false)
      else
        for dataset in datasets()
          @_visibleDatasetIds.push(dataset.id())
        @allDatasetsVisible(true)

  exports = DatasetsModel