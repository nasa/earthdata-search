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
                  ) ->
  class Dataset
    constructor: (jsonData, @query) ->
      @_loadJson(jsonData)

      @granulesModel = granulesModel = new Granules(@query)
      @granules = ko.computed(granulesModel.results, granulesModel, deferEvaluation: true)
      @granuleHits = ko.computed(granulesModel.hits, granulesModel, deferEvaluation: true)
      @granuleAccessOptions = ko.computed(@_loadGranuleAccessOptions, this, deferEvaluation: true).extend(delayed: {})
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

    _loadGranuleAccessOptions: ->
      params = @query.params()
      downloadableParams = extend(@_granuleParams(params), online_only: true, page_size: 2000)
      @searchGranules params, (_, granulesModel) =>
        hits = granulesModel.hits()
        granulesModel = new Granules().search downloadableParams, (params, model) =>
          downloadableHits = model.hits()

          sizeMB = 0
          sizeMB += parseFloat(granule.granule_size) for granule in model.results()
          size = sizeMB * 1024 * 1024

          units = ['', 'Kilo', 'Mega', 'Giga', 'Tera', 'Peta', 'Exa']
          while size > 1000 && units.length > 1
            size = size / 1000
            units.shift()

          size = Math.round(size * 10) / 10
          size = "> #{size}" if hits > 2000

          options =
            count: hits
            size: size
            sizeUnit: "#{units[0]}bytes"
            canDownloadAll: hits == downloadableHits
            canDownload: downloadableHits > 0
            downloadCount: hits - downloadableHits
          @granuleAccessOptions(options)

    _granuleParams: (params) ->
      extend({}, params, 'echo_collection_id[]': @id())

    _onGranuleQueryChange: =>
      dataset_params = @query.params()
      granule_params = @granule_query.params()
      # TODO on the access page when loading the granule information, this is called twice.
      # The first call is with a 'blank' granule_query, and the second time (if there are extra
      # granule params) will load the granule query passed from the search page.
      # We need to only make one call to load granules
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
        currentResults = @_searchResponse()
        newResults = (new Dataset(result, query) for result in results)
        @_searchResponse(currentResults.concat(newResults))

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