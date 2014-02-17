ns = @edsc.models.data

ns.XhrModel = do (ko, getJSON=jQuery.getJSON, toParam=$.param) ->

  class XhrModel
    constructor: (@path, @query) ->
      @results = ko.asyncComputed([], 500, @_computeSearchResponse, this)

      @pendingRequestId = 0
      @completedRequestId = 0
      @isLoading = ko.observable(false)
      @error = ko.observable(null)
      @isLoaded = ko.observable(false)
      @loadTime = ko.observable(null)

      @hits = ko.observable(0)
      @hasNextPage = ko.computed(@_computeHasNextPage, this, deferEvaluation: true)

    search: (params, callback) =>
      params.page_num = @page = 1
      @_loadAndSet params, [], callback

    loadNextPage: (params, callback) =>
      if @hasNextPage() and !@isLoading()
        params.page_num = ++@page
        @_loadAndSet params, @results(), callback

    _computeHasNextPage: ->
      @results().length < @hits()

    _computeSearchResponse: (current, callback) ->
      if @query?
        params = @query.params()
        params.page_num = @page = 1
        @_load(params, current, callback)

    _loadAndSet: (params, current, callback) ->
      @_load params, current, (results) =>
        callback?(results)
        @results(results)

    _load: (params, current, callback) =>
      requestId = ++@pendingRequestId
      @isLoading(@pendingRequestId != @completedRequestId)
      console.log("Request (#{requestId}): #{@path}?#{$.param(params)}")
      start = new Date()
      xhr = getJSON @path, params, (data, status, xhr) =>
        if requestId > @completedRequestId
          @isLoaded(true)
          @completedRequestId = requestId
          @error(null)
          @hits(parseInt(xhr.getResponseHeader('echo-hits') ? '0', 10))
          #console.log("Response: #{@path}", requestId, params, data)
          results = @_toResults(data)

          if params.page_num? && params.page_num > 1
            results = current.concat(results)

          @loadTime(((new Date() - start) / 1000).toFixed(3))
          callback?(results)
        else
          console.log("Rejected out-of-sequence request: #{@path}", requestId, params, data)
        @isLoading(@pendingRequestId != @completedRequestId)
      xhr.fail (response, type, reason) =>
        if requestId > @completedRequestId
          @completedRequestId = requestId
          @_onFailure(response)
        @isLoading(@pendingRequestId != @completedRequestId)

    _toResults: (data) ->
      ko.mapping.fromJS(data)

    _onFailure: (response) ->
      errors = response.responseJSON?.errors
      @error(errors?.error)

  exports = XhrModel
