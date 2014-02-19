ns = @edsc.models.data

ns.XhrModel = do (ko
                  KnockoutModel=@edsc.models.KnockoutModel
                  getJSON=jQuery.getJSON
                  toParam=$.param) ->

  class XhrModel extends KnockoutModel
    constructor: (@path, @query) ->
      @results = @asyncComputed([], 500, @_computeSearchResponse, this)

      @pendingRequestId = 0
      @completedRequestId = 0
      @isLoading = ko.observable(false)
      @error = ko.observable(null)
      @isLoaded = ko.observable(false)
      @loadTime = ko.observable(null)
      @currentRequest = null

      @hits = ko.observable(0)
      @hasNextPage = @computed(@_computeHasNextPage, this, deferEvaluation: true)

    search: (params, callback) =>
      params.page_num = @page = 1
      @_loadAndSet params, [], callback

    loadNextPage: (params, callback) =>
      if @hasNextPage() and !@isLoading()
        params.page_num = ++@page
        @_loadAndSet params, @results(), callback

    abort: ->
      if @currentRequest? && @currentRequest.readystate != 4
        @currentRequest.abort()
        console.log "Aborted (#{@pendingRequestId}): #{@path}"

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
      @abort()
      requestId = ++@pendingRequestId
      @isLoading(@pendingRequestId != @completedRequestId)
      console.log("Request (#{requestId}): #{@path}?#{$.param(params)}")
      start = new Date()
      @currentRequest = xhr = getJSON @path, params, (data, status, xhr) =>
        if requestId > @completedRequestId
          @currentRequest = null
          @isLoaded(true)
          @completedRequestId = requestId
          @error(null)
          @hits(parseInt(xhr.getResponseHeader('echo-hits') ? '0', 10))
          #console.log("Response: #{@path}", requestId, params, data)
          results = @_toResults(data)

          if params.page_num? && params.page_num > 1
            results = current.concat(results)
          else
            result.dispose?() for result in current

          @loadTime(((new Date() - start) / 1000).toFixed(1))
          @currentRequest = null
          callback?(results)
        else
          console.log("Rejected out-of-sequence request: #{@path}", requestId, params, data)
        @isLoading(@pendingRequestId != @completedRequestId)
      xhr.fail (response, type, reason) =>
        @currentRequest = null
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
