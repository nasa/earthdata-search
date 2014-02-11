ns = @edsc.models.data

ns.XhrModel = do (ko, getJSON=jQuery.getJSON, toParam=$.param) ->

  class XhrModel
    constructor: (@path, @query) ->
      @_searchResponse = ko.computed(@_computeSearchResponse, this, deferEvaluation: true).extend(delayed: [])
      @pendingRequestId = 0
      @completedRequestId = 0
      @isLoading = ko.observable(false)
      @error = ko.observable(null)
      @isLoaded = ko.observable(false)

      @hits = ko.observable(0)
      @results = ko.computed(@_computeSearchResults, this, deferEvaluation: true)
      @hasNextPage = ko.computed(@_computeHasNextPage, this, deferEvaluation: true)

    search: (params, callback) =>
      params.page_num = @page = 1
      @_load(params, callback, true)

    loadNextPage: (params, callback) =>
      if @hasNextPage() and !@isLoading()
        params.page_num = ++@page
        @_load(params, callback, false)

    _computeHasNextPage: ->
      @results().length < @hits()

    _computeSearchResults: ->
      @_searchResponse()

    _computeSearchResponse: ->
      @search(@query.params()) if @query?

    _load: (params, callback, args...) =>
      requestId = ++@pendingRequestId
      @isLoading(@pendingRequestId != @completedRequestId)
      console.log("Request (#{requestId}): #{@path}?#{$.param(params)}")
      xhr = getJSON @path, params, (data, status, xhr) =>
        if requestId > @completedRequestId
          @isLoaded(true)
          @completedRequestId = requestId
          @error(null)
          @hits(parseInt(xhr.getResponseHeader('echo-hits') ? '0', 10))
          #console.log("Response: #{@path}", requestId, params, data)
          @_onSuccess(data, args...)
          callback?(params, this)
        else
          console.log("Rejected out-of-sequence request: #{@path}", requestId, params, data)
        @isLoading(@pendingRequestId != @completedRequestId)
      xhr.fail (response, type, reason) =>
        if requestId > @completedRequestId
          @completedRequestId = requestId
          @_onFailure(response)
        @isLoading(@pendingRequestId != @completedRequestId)

    _onSuccess: (data) ->
      ko.mapping.fromJS(data, @_searchResponse)

    _onFailure: (response) ->
      errors = response.responseJSON?.errors
      @error(errors?.error)

  exports = XhrModel