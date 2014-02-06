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
      @spatial_constraint = ko.computed =>
        if @points?
          'point:' + @points()[0].split(/\s+/).reverse().join(',')
        else
          null

    _loadJson: (jsonData) ->
      @thumbnail = ko.observable(null)
      @archive_center = ko.observable(null)
      ko.mapping.fromJS(jsonData, {}, this)
      if @gibs
        @gibs = ko.observable(ko.mapping.toJS(@gibs))
      else
        @gibs = ko.observable(null)
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
      @_visibleDatasets = {}
      @visibleGibsDatasets = ko.computed(@_computeVisibleGibsDatasets)
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

    addVisibleDataset: (dataset) ->
      unless @hasVisibleDataset(dataset)
        id = dataset.id()
        @_visibleDatasets[id] = dataset
        @_visibleDatasetIds.push(id)

    removeVisibleDataset: (dataset) ->
      id = dataset.id()
      @_visibleDatasetIds.remove(id)
      delete @_visibleDatasets[id]

    _computeVisibleGibsDatasets: =>
      result = []
      for id in @_visibleDatasetIds()
        dataset = @_visibleDatasets[id]
        if dataset.gibs()?
          result.push(dataset)
      result

    toggleVisibleDataset: (dataset) =>
      if @hasVisibleDataset(dataset)
        @removeVisibleDataset(dataset)
      else
        @addVisibleDataset(dataset)

    toggleViewAllDatasets: (datasets) =>
      if @allDatasetsVisible()
        datasets.forEach(@removeVisibleDataset, this)
        @allDatasetsVisible(false)
      else
        datasets.forEach(@addVisibleDataset, this)
        @allDatasetsVisible(true)

  exports = DatasetsModel