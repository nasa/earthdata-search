#= require models/data/xhr_model
#= require models/data/granules

ns = @edsc.models.data

ns.Datasets = do (ko
                  getJSON=jQuery.getJSON
                  XhrModel=ns.XhrModel
                  Granules=ns.Granules
                  QueryModel = ns.Query
                  toParam=jQuery.param
                  extend=jQuery.extend

  class Dataset
    constructor: (jsonData, @query) ->
      @_loadJson(jsonData)

      @granulesModel = granulesModel = new Granules(@query)
      @granules = ko.computed(granulesModel.results, granulesModel, deferEvaluation: true)
      @granuleHits = ko.computed(granulesModel.hits, granulesModel, deferEvaluation: true)
      @granuleAccessOptions = ko.onDemandObservable(@_loadGranuleAccessOptions, this)
      @granuleDownloadsUrl = ko.computed =>
        params = @query.params()
        paramStr = toParam(extend(@_granuleParams(params), online_only: true, page_size: 2000))
        "/granules/download.html?#{paramStr}"
      @granule_query = new QueryModel()
      @granule_query.params.subscribe(@_onGranuleQueryChange)

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

    searchGranules: (params, callback) ->
      @granulesModel.search(@_granuleParams(params), callback)

    loadNextGranules: (params, callback) ->
      @granulesModel.loadNextPage(@_granuleParams(params), callback)

    granuleDownloadsUrl: ->


    _loadGranuleAccessOptions: ->
      params = @query.params()
      downloadableParams = extend(@_granuleParams(params), online_only: true)
      @searchGranules params, (_, granulesModel) =>
        hits = @granuleHits()
        granulesModel = new Granules().search downloadableParams, (params, model) =>
          downloadableHits = model.hits()
          options =
            count: hits
            canDownloadAll: hits == downloadableHits
            canDownload: downloadableHits > 0
            downloadCount: hits - downloadableHits
          @granuleAccessOptions(options)
      @granuleAccessOptions({})

    _granuleParams: (params) ->
      extend({}, params, 'echo_collection_id[]': @id())

    _onGranuleQueryChange: =>
      console.log 'granule query change'
      # TODO, what is the best way to get to the query params?
      dataset_params = edsc.page.query.params()
      granule_params = @granule_query.params()
      # Don't want to search granules again if there are no
      # real granule params, e.g., more than just page_size
      if Object.keys(granule_params).length > 1
        params = $.extend({}, dataset_params, granule_params)
        @searchGranules(params)

  class DatasetsModel extends XhrModel
    constructor: (query) ->
      #super('http://localhost:3002/datasets')
      super('/datasets.json', query)

      @details = ko.observable({})
      @detailsLoading = ko.observable(false)
      @_visibleDatasetIds = ko.observableArray()
      @_visibleDatasets = {}
      @visibleGibsDatasets = ko.computed(@_computeVisibleGibsDatasets)
      @allDatasetsVisible = ko.observable(false)

    _onSuccess: (data, replace) ->
      results = data.feed.entry;
      query = @query
      if replace
        @_searchResponse(new Dataset(result, query) for result in results)
      else
        currentResults = @_searchResponse
        newResults = (new Dataset(result, query) for result in results)
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
        datasets().forEach(@removeVisibleDataset, this)
        @allDatasetsVisible(false)
      else
        datasets().forEach(@addVisibleDataset, this)
        @allDatasetsVisible(true)

  exports = DatasetsModel