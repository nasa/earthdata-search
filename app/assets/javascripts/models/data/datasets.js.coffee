ns = @edsc.models.data

ns.Datasets = do (ko, getJSON=jQuery.getJSON) ->

  class DatasetsModel
    constructor: ->
      @_searchResponse = ko.mapping.fromJS(results: [], hits: 0)
      @results = ko.computed => @_searchResponse.results()
      @hits = ko.computed => @_searchResponse.hits()
      @hasNextPage = ko.computed => @results().length < @hits()
      @pendingRequestId = 0
      @completedRequestId = 0
      @isLoading = ko.observable(false)

      @details = ko.observable({})
      @detailsLoading = ko.observable(false)

      @_visibleDatasetIds = ko.observableArray()
      @allDatasetsVisible = ko.observable(false)

      @error = ko.observable(null)

    search: (params) =>
      params.page = @page = 1
      @_load(params, true)

    loadNextPage: (params) =>
      if @hasNextPage() and !@isLoading()
        params.page = ++@page
        @_load(params, false)

    _load: (params, replace) =>
      requestId = ++@pendingRequestId
      @isLoading(@pendingRequestId != @completedRequestId)
      console.log("Request: /datasets.json", requestId, params)
      xhr = getJSON '/datasets.json', params, (data) =>
        if requestId > @completedRequestId
          @completedRequestId = requestId
          @error(null)
          #console.log("Response: /datasets.json", requestId, params, data)
          if replace
            ko.mapping.fromJS(data, @_searchResponse)
          else
            currentResults = @_searchResponse.results
            newResults = ko.mapping.fromJS(data['results'])
            currentResults.push.apply(currentResults, newResults())
        else
          console.log("Rejected out-of-sequence request: /datasets.json", requestId, params, data)
        @isLoading(@pendingRequestId != @completedRequestId)
      xhr.fail (response, type, reason) =>
        if requestId > @completedRequestId
          @completedRequestId = requestId
          errors = response.responseJSON?.errors
          @error(errors?.error)

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