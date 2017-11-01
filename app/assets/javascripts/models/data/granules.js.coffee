#= require models/data/granule
#= require models/data/spatial_entry
#= require models/data/grid
#= require models/data/xhr_model

ns = @edsc.models.data
models = @edsc.models

ns.Granules = do (ko,
                  param = jQuery.param
                  XhrModel=ns.XhrModel,
                  Granule = ns.Granule,
                  extend=$.extend
                  dateUtil=@edsc.util.date) ->

  class GranulesModel extends XhrModel
    constructor: (query, @parentQuery) ->
      @method = 'post'
      super('/granules.json', query)
      @temporal = query.temporal
      @_resultsComputed = false

      focusedTemporal = @parentQuery.focusedTemporal()
      @computed =>
        newFocus = @parentQuery.focusedTemporal()
        if newFocus != focusedTemporal && @isLoaded()
          @results.readImmediate()
        focusedTemporal = newFocus

      @excludedGranulesList = ko.observableArray()

    _toResults: (data, current, params) ->
      entries = data.feed.entry || []
      newItems = (new Granule(entry) for entry in entries)

      if params.page_num > 1
        current.concat(newItems)
      else
        newItems

    _shouldLoad: (url) ->
      true

    _queryFor: (params) ->
      # Hack around problem with ECHO accepting explicitly indexed attributes
      super(params).replace(/attribute%5B\d+%5D/g, 'attribute%5B%5D')

    _computeSearchResponse: (current, callback, needsLoad=true) ->
      if @query?.isValid()
        results = []
        params = @params()
        query = param(params)
        params.page_num = @page = 1

        if needsLoad && @_prevQuery != query
          @excludedGranulesList([])
          @_prevQuery = query
          if params.temporal == 'no-data'
            @results([])
            @hits(0)
            return

          @results([]) if @_resultsComputed
          @_resultsComputed = true
          @isLoaded(false)
          @_load(params, current, callback)

    exclude: (granule) =>
      results = @results()
      index = results.indexOf(granule)

      results.splice(index, 1)
      @results(results)
      @hits(@hits() - 1)

      currentQuery = param(@params())
      @excludedGranulesList.push({index: index, granule: granule})
      @query.excludedGranules.push(granule.id)
      # Avoid reloading if no other changes are pending
      @_prevQuery = param(@params()) if @_prevQuery == currentQuery

    undoExclude: =>
      newGranule = @excludedGranulesList.pop()
      index = newGranule.index
      granule = newGranule.granule

      granules = @results()

      if index == 0
        granules.unshift(granule)
        newList = granules
      else
        beforeValues = granules.splice(0, index)
        afterValues = granules.splice(index-1)
        newList = beforeValues.concat(granule, afterValues)

      @results(newList)

      @hits(@hits() + 1)
      currentQuery = param(@params())
      @query.excludedGranules.pop()
      # Avoid reloading if no other changes are pending
      @_prevQuery = param(@params()) if @_prevQuery == currentQuery

      granule

    clearExclusions: =>
      @excludedGranulesList([])
      @query.excludedGranules([])

    params: =>
      parentParams = @parentQuery.globalParams()
      params = extend({}, parentParams, @query.params())
      focusedTemporal = @parentQuery.focusedTemporal()

      if focusedTemporal?
        granuleTemporal = @query.temporal.applied
        collectionTemporal = @parentQuery.temporal.applied
        condition = collectionTemporal
        condition = granuleTemporal if granuleTemporal.isSet()

        focusedTemporal = condition.intersect(focusedTemporal...)

        if focusedTemporal?
          params.temporal = (dateUtil.toISOString(t) for t in focusedTemporal).join(',')
        else
          params.temporal = 'no-data'
      params

  exports = GranulesModel
