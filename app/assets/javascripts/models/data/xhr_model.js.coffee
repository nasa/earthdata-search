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
      @hasNextPage = ko.observable(true)
      @hitsEstimated = ko.observable(false)

    search: (params=@params(), callback=null) =>
      params.page_num = @page = 1
      @_loadAndSet params, [], callback

    loadNextPage: (params=@params(), callback=null) =>
      if @hasNextPage() and !@isLoading()
        params.page_num = ++@page
        @_loadAndSet params, @results(), callback

    params: ->
      @query.params()

    abort: ->
      if @currentRequest? && @currentRequest.readystate != 4
        @currentRequest.abort()
        console.log "Aborted (#{@pendingRequestId}): #{@path}"

    _computeSearchResponse: (current, callback) ->
      if @query?
        params = @params()
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
          @hasNextPage(xhr.getResponseHeader('echo-cursor-at-end') == 'false')
          @hitsEstimated(xhr.getResponseHeader('echo-hits-estimated') == 'true')
          #console.log("Response: #{@path}", requestId, params, data)
          results = @_toResults(data, current, params)

          @hits(Math.max(parseInt(xhr.getResponseHeader('echo-hits') ? '0', 10), results?.length ? 0))

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

    _onFailure: (response) ->
      errors = response.responseJSON?.errors
      @error(errors?.error)

  exports = XhrModel
