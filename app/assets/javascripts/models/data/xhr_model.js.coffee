ns = @edsc.models.data

ns.XhrModel = do (ko
                  KnockoutModel=@edsc.models.KnockoutModel
                  config=@edsc.config
                  ajax=jQuery.ajax
                  toParam=$.param) ->


  class XhrModel extends KnockoutModel
    constructor: (@path, @query) ->
      @results = @asyncComputed([], config.xhrRateLimitMs, @_computeSearchResponse, this)

      @completedRequestId = 0
      @isLoading = ko.observable(false)
      @error = ko.observable(null)
      @isError = ko.observable(false)

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
      @isLoading(true)
      @isError(false)

      requestId = @completedRequestId + 1
      url = "#{@path}?#{$.param(params)}"
      console.log("Request (#{requestId}): #{url}")
      start = new Date()

      @currentRequest = xhr = $.ajax
        dataType: 'json'
        url: @path
        data: params
        retry: => @_load(params, current, callback)
        success: (data, status, xhr) =>
          #console.profile(@path)

          @currentRequest = null
          @isLoaded(true)
          @error(null)
          @hasNextPage(xhr.getResponseHeader('echo-cursor-at-end') == 'false')
          @hitsEstimated(xhr.getResponseHeader('echo-hits-estimated') == 'true')
          #console.log("Response: #{@path}", requestId, params, data)
          console.log("Complete (#{requestId}): #{url}")
          results = @_toResults(data, current, params)

          @hits(Math.max(parseInt(xhr.getResponseHeader('echo-hits') ? '0', 10), results?.length ? 0))

          @loadTime(((new Date() - start) / 1000).toFixed(1))
          callback?(results)

        complete: =>
          @completedRequestId = requestId
          @currentRequest = null
          @isLoading(false)
          #console.profileEnd(@path)

        error: (response, type, reason) =>
          @isError(true)
          console.log("Fail (#{requestId}) [#{reason}]: #{url}")
          @_onFailure(response)
      null

    _onFailure: (response) ->
      if response.status == 403
        # TODO: don't reference page logout the user
        edsc.page.user.logout()
        edsc.banner(null, 'Session has ended', 'Please sign in')

      errors = response.responseJSON?.errors
      @error(errors?.error)

  exports = XhrModel
