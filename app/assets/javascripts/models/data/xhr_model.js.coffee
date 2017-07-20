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

      @error.subscribe((value) =>
        if @isError()
          url = @path
          title = "An unexpected error occurred"
          resource = url.match(/([^\/\.]+)(?:\.[^\/]*)?$/)?[1]
          if resource?
            resource = resource.replace('_', ' ')
            title = "Error retrieving #{resource}"

          #TODO Remove this translation when CMR can provide a more user friendly error message (CMR-3534)
          error = @_translateCMRError(value) ? 'There was a problem completing the request'

          # Ignore errors from /granules/timeline.json since it is the same as what /search/granules.json returns.
          edsc.banner(url, title, error, className: 'banner-error', immediate: true, html: true) unless url.indexOf('/granules/timeline.json') > -1

          if url.indexOf('/granules/timeline.json') > -1
            currentPage=window.edsc.models.page.current
            currentPage.ui.projectList.showFilters(currentPage.project.focusedProjectCollection().collection)
      )

    _translateCMRError: (cmrError) ->
      matchGroups = cmrError?[0].match(/^The query contained \[(\d+)\] conditions which used a leading wildcard. This is more than the maximum allowed amount of \[\d+\]\.(.*)$/)
      if matchGroups?
        return "The query contained #{matchGroups[1]/2} conditions which used a leading wildcard: #{@query.params().readable_granule_name}. Only 2 conditions that start with a wildcard are allowed.#{matchGroups[2]}"
      cmrError

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
      @_prevUrl != url || @isError.peek() || @stale

    _queryFor: (params) ->
      toParam(params)

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

          #console.log("Response: #{@path}", requestId, params, data)
          console.log("Complete (#{requestId}): #{url}")
          results = @_toResults(data, current, params)

          @hitsEstimated(false)

          fetched = results?.length ? 0
          hits = @_responseHits(xhr, data)
          @hasNextPage(@_responseHasNextPage(xhr, data, results))
          @hits(Math.max(hits, fetched))

          timing = ((new Date() - start) / 1000).toFixed(1)
          @loadTime(timing)
          $(document).trigger('timingevent', [url.split('?')[0], timing*1000] )
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

    _responseHasNextPage: (xhr, data, results) ->
      hits = @_responseHits(xhr, data)
      if data.page_size && data.page_num
        data.page_size * data.page_num < hits
      else
        (results?.length ? 0) < hits


    _responseHits: (xhr, data) ->
      parseInt(xhr.getResponseHeader('cmr-hits') ? data.feed?.totalResults ? '0', 10)

    _onFailure: (response) ->
      if response.status == 403
        # TODO: don't reference page logout the user
        edsc.banner(null, 'Session has ended', 'Please sign in')

      unless response.status >= 500 || response.status == 408 || response.status == 0
        errors = response.responseJSON?.errors
        @error(errors) if errors?

  exports = XhrModel
