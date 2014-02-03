ns = @edsc.models.data

ns.XhrModel = do (ko, getJSON=jQuery.getJSON) ->

  class XhrModel
    constructor: (@path) ->
      @_searchResponse = ko.mapping.fromJS([])
      @pendingRequestId = 0
      @completedRequestId = 0
      @isLoading = ko.observable(false)
      @error = ko.observable(null)
      @isLoaded = ko.observable(false)

      @results = ko.computed => @_searchResponse() ? []
      @hits = ko.observable(0)
      @hasNextPage = ko.computed => @results().length < @hits()

    search: (params) =>
      params.page_num = @page = 1
      @_load(params, true)

    loadNextPage: (params) =>
      if @hasNextPage() and !@isLoading()
        params.page_num = ++@page
        @_load(params, false)

    _load: (params, args...) =>
      requestId = ++@pendingRequestId
      @isLoading(@pendingRequestId != @completedRequestId)
      console.log("Request: #{@path}", requestId, params)
      xhr = getJSON @path, params, (data, status, xhr) =>
        if requestId > @completedRequestId
          @isLoaded(true)
          @completedRequestId = requestId
          @error(null)
          @hits(parseInt(xhr.getResponseHeader('echo-hits'), 10))
          #console.log("Response: #{@path}", requestId, params, data)
          @_onSuccess(data, args...)
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