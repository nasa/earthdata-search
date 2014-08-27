ns = @edsc.models.data

ns.XhrModel = do (ko
                  KnockoutModel=@edsc.models.KnockoutModel
                  config=@edsc.config
                  ajax=@edsc.util.xhr.ajax
                  toParam=$.param) ->


  class XhrModel extends KnockoutModel
    constructor: (@path, @query) ->
      @results = @asyncComputed([], config.xhrRateLimitMs, @_computeSearchResponse, this)

      @completedRequestId = 0
      @isLoading = ko.observable(false)
      @error = ko.observable(null)
      @isError = ko.observable(false)

      @isLoaded = ko.observable(false)
      @stale = true
      @loadTime = ko.observable(null)
      @currentRequest = null
      @isRelevant = ko.observable(true)

      @hits = ko.observable(0)
      @hasNextPage = ko.observable(true)
      @hitsEstimated = ko.observable(false)

    search: (params=@params(), callback=null) =>
      params.page_num = @page = 1
      @_loadAndSet params, [], callback

    _decorateNextPage: (params, results) ->
        # Double the page size with every fetch
        if results.length > 0
          params.page_num = 2
          params.page_size = results.length if params.page_size? && results.length > 0
        else
          params.page_num = 1

    loadNextPage: (params=@params(), callback=null) =>
      if @hasNextPage() and !@isLoading()
        results = @results()
        @_decorateNextPage(params, results)
        @_loadAndSet params, results, callback

    params: ->
      @query.params()

    abort: ->
      if @currentRequest? && @currentRequest.state() == 'pending'
        @currentRequest.reject()

    _computeSearchResponse: (current, callback) ->
      if @query?
        params = @params()
        params.page_num = @page = 1
        unless @isRelevant()
          if !@isLoaded.peek()
            @stale = true
          @isLoaded(false)
          return
        if !@stale && !@isLoaded.peek()
          @isLoaded(true)
          return
        if @stale
          @results([])
          @hits(0)
        @_load(params, current, callback)

    _loadAndSet: (params, current, callback) ->
      @_load params, current, (results) =>
        callback?(results)
        @results(results)

    _shouldLoad: (url) ->
      @_prevUrl != url || @isError.peek()

    _queryFor: (params) ->
      $.param(params)

    _load: (params, current, callback) =>
      query = @_queryFor(params)
      url = "#{@path}?#{query}"
      return unless @_shouldLoad(url)
      @_prevUrl = url

      @abort()
      @isLoading(true)
      @isError(false)

      requestId = @completedRequestId + 1
      console.log("Request (#{requestId}): #{url}")
      start = new Date()

      method = @method ? 'get'
      data = null
      if method == 'post'
        url = @path
        data = query

      @currentRequest = xhr = ajax
        method: method
        dataType: 'json'
        url: url
        data: data
        retry: => @_load(params, current, callback)
        success: (data, status, xhr) =>
          #console.profile(@path)
          @stale = false

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
        edsc.banner(null, 'Session has ended', 'Please sign in')

      errors = response.responseJSON?.errors
      @error(errors?.error)

  exports = XhrModel
