#= require models/knockout_model
#= require models/data/xhr_model

ns = @edsc.models.ui

ns.GranuleTimeline = do (ko
                         KnockoutModel = @edsc.models.KnockoutModel
                         XhrModel = @edsc.models.data.XhrModel
                         GranulesModel = @edsc.models.data.Granules
                         extend = $.extend
                         config = @edsc.config
                         dateUtil = @edsc.util.date
                         ) ->
  # intervals: 'year', 'month', 'day', 'hour', 'minute'
  class GranuleTimelineData extends XhrModel
    constructor: (@collection, @range, @color) ->
      @method = 'post'
      super("/granules/timeline.json", this)
      @prevParams = {}
      @params = @computed(@_computeParams)

      $timeline = $('#timeline')
      $timeline.on 'rowtemporalchange.timeline', (e, rowId, start, stop) =>
        if rowId == @collection.id
          @collection.granuleDatasource()?.setTemporal?(startDate: start, endDate: stop, recurring: false)

      # Start computing, but avoid introducing a dependency on results in the caller
      @results.peek()

    refreshData: (start, end, resolution) ->
      return if @isLoading.peek()
      $('#timeline').timeline 'data', @collection.id,
        start: start,
        end: end,
        resolution: resolution
        intervals: @results.peek()
        color: @color

    _computeParams: =>
      [start, end, interval] = @range()
      timelineParams =
        start_date: dateUtil.toISOString(start)
        end_date: dateUtil.toISOString(end)
        interval: interval

      temporal = @collection.granuleDatasource()?.getTemporal?()
      ranges = null

      ranges = dateUtil.computeRanges(temporal) if temporal
      $timeline = $('#timeline')
      if $timeline.timeline('getRowTemporal', @collection.id)?.toString() != ranges?.toString()
        $timeline.timeline('setRowTemporal', @collection.id, ranges)
      params = extend({}, @collection.granuleDatasource()?.toTimelineQueryParams(), timelineParams)

      delete params.temporal
      delete params.page_num
      delete params.page_size
      delete params.sort_key
      params

    _queryFor: (params) ->
      GranulesModel.prototype._queryFor(params)

    _computeSearchResponse: (current, callback) =>
      return unless @collection.granuleDatasource()?.cmrQuery?().isValid()
      params = @params()
      prev = @prevParams

      changed = false
      reload = false

      keys = (k for own k, v of params).concat(k for own k, v of prev)
      for k in keys
        if params[k] != prev[k]
          changed = true
          if k != 'start_date' && k != 'end_date' && k != 'interval'
            reload = true
            break

      @prevParams = params

      $('#timeline').timeline('loadstart', @collection.id, @range()...) if reload
      @_load(params, current, callback) if changed

    _toResults: (data, current, params) ->
      intervals = data[0]?.intervals ? []
      [start, end, resolution] = @range()
      $('#timeline').timeline 'data', @collection.id,
        start: start,
        end: end,
        resolution: resolution
        intervals: intervals
        color: @color
      intervals

  class IndeterminateGranuleTimelineData extends KnockoutModel
    constructor: (@collection, @range, @color) ->
      @params = @computed(@_computeParams)

      $timeline = $('#timeline')

      intervals = []
      if @collection.time_start || @collection.time_end
        start = @collection.time_start ? 0
        end = @collection.time_end ? config.present()

        intervals.push([new Date(start).getTime() / 1000, new Date(end).getTime() / 1000])

      @intervals = intervals
      @results = ko.observable(intervals)

      # setTimeout ensures it renders on the first load
      setTimeout(@refreshData, 0)

      $timeline.on 'rowtemporalchange.timeline', (e, rowId, start, stop) =>
        if rowId == @collection.id
          @collection.granuleDatasource()?.setTemporal?(startDate: start, endDate: stop, recurring: false)

    refreshData: (start, end, resolution) =>
      $('#timeline').timeline 'data', @collection.id,
        intervals: @intervals
        color: @color
        indeterminate: true

    _computeParams: =>
      temporal = @collection.granuleDatasource()?.getTemporal?()
      ranges = dateUtil.computeRanges(temporal) if temporal
      $timeline = $('#timeline')
      if $timeline.timeline('getRowTemporal', @collection.id)?.toString() != ranges?.toString()
        $timeline.timeline('setRowTemporal', @collection.id, ranges)


  class GranuleTimeline extends KnockoutModel
    constructor: (@collectionsList, @projectList, @project) ->
      @_collectionsToTimelines = {}

      @_constructed = ko.observable(false)
      @_pending = null

      @serialized = @computed(read: @_readSerialized, write: @_writeSerialized, owner: this, deferEvaluation: true)
      @range = ko.observable(null)

      $timeline = $('#timeline')

      $timeline.on 'rangechange.timeline', (e, range...) =>
        @range(range)

      $timeline.on 'heightchange.timeline', (e, height) =>
        $('.master-overlay').masterOverlay().masterOverlay('contentHeightChanged')

      $timeline.on 'temporalchange.timeline', (e, start, stop) =>
        temporal = @collectionsList.query.temporal.applied
        temporal.isRecurring(false)
        temporal.start.date(start)
        temporal.stop.date(stop)

      $timeline.on 'focusset.timeline', (e, t0, t1, interval) =>
        query = @collectionsList.query
        query.focusedInterval(interval)
        query.focusedTemporal((new Date(t) for t in [t0, t1]))

      $timeline.on 'focusremove.timeline', (e) =>
        query = @collectionsList.query
        query.focusedInterval(null)
        query.focusedTemporal(null)

      @range(null)
      @collections = @computed(@_computeCollections)

    _readSerialized: ->
      return @_pending unless @_constructed()
      return null if @collections()? && @collections().length == 0

      @range() # Read and discard this to register as an observer
      query = @collectionsList.query
      timeline = $('#timeline').data('timeline')

      center = Math.round(timeline.center() / 1000)
      zoom = timeline.zoom()
      if query.focusedTemporal()
        [start, end] = query.focusedTemporal()
        start = Math.floor(start / 1000)
        end = Math.floor(end / 1000)

      # Don't bother serializing if the timeline hasn't moved from the default
      return null if !start && !end && (timeline.end == config.present() || timeline.end == @_lastDate)

      [center, zoom, start, end].join('!')

    _writeSerialized: (newValue) ->
      timeline = $('#timeline').data('timeline')
      if timeline?
        if newValue
          query = @collectionsList.query
          [center, zoom, start, end] = newValue.split('!')
          timeline.center(parseInt(center, 10) * 1000)
          timeline.zoom(parseInt(zoom, 10))
          temporal = []
          temporal = [new Date(parseInt(start, 10) * 1000), new Date(parseInt(end, 10) * 1000)] if start && end
          timeline.focus(temporal...)
        @_constructed(true)
        @_pending = null
      else
        @_pending = newValue

    clear: ->
      $('#timeline').timeline('focus')

    _computeTemporal: =>
      temporal = @collectionsList.query.temporal.applied.ranges()
      $timeline = $('#timeline')
      if $timeline.timeline('getTemporal')?.toString() != temporal?.toString()
        $timeline.timeline('setTemporal', temporal)

    _computeCollections: =>
      range = @range
      focused = @collectionsList.focused()
      result = []
      if focused?
        result = [focused.collection]
      else if  @projectList.visible()
        result = @projectList.project.collections()
      else if @project?.collections().length > 0
        result = (projectCollection.collection for projectCollection in @project.collections())

      # Pick only the first 3 collections with granules
      result = (collection for collection in result when collection.has_granules)
      result = result[0...3]

      $timeline = $('#timeline')

      # First load.  Construct if there are collections, otherwise wait
      if !$timeline.data('timeline')?
        if result.length > 0
          $timeline.timeline(animate: config.defaultAnimationDurationMs > 0, end: config.present())
          @serialized(@_pending)
          @computed(@_computeTemporal)
        else
          return

      $timeline.timeline('rows', result)

      currentTimelines = @_collectionsToTimelines
      newTimelines = {}

      lastDate = Number.MIN_VALUE
      firstDate = Number.MAX_VALUE
      listChanged = false
      for collection in result
        listChanged = listChanged || !currentTimelines[collection.id]?
        if collection.time_end?
          lastDate = Math.max(lastDate, new Date(collection.time_end).getTime())
          firstDate = Math.min(firstDate, new Date(collection.time_start).getTime())
      [start, end] = @range.peek()

      # pan the timeline to the applied temporal range
      if result[0]?
        appliedStop = result[0].query.temporal.applied?.stop
        appliedStart = result[0].query.temporal.applied?.start
        timelineStart = $timeline.timeline('startTime')
        timelineEnd = $timeline.timeline('endTime')
        if listChanged
          if appliedStart.date()? && appliedStop.date()?
            appliedStartTime = new Date(appliedStart.date()).getTime()
            appliedStopTime = new Date(appliedStop.date()).getTime()
            @_lastDate = lastDate = appliedStartTime + .5 * (appliedStopTime - appliedStartTime) + .5 * (timelineEnd - timelineStart)
            $timeline.timeline('panToTime', lastDate)
          else if appliedStart.date()?
            appliedStartTime = new Date(appliedStart.date()).getTime()
            @_lastDate = lastDate = appliedStartTime + (timelineEnd - timelineStart)
            $timeline.timeline('panToTime', lastDate)
          else if appliedStop.date()?
            @_lastDate = lastDate = new Date(appliedStop.date()).getTime()
            $timeline.timeline('panToTime', lastDate)

      if listChanged && (lastDate > Number.MIN_VALUE && lastDate < start || firstDate < Number.MAX_VALUE && firstDate > end)
        @_lastDate = lastDate
        $timeline.timeline('panToTime', lastDate)

      project = @projectList.project
      for collection in result
        id = collection.id
        if currentTimelines[id]
          newTimelines[id] = currentTimelines[id]
          delete currentTimelines[id]
        else
          if collection.granuleDatasource()?.hasCapability('timeline')
            data = new GranuleTimelineData(collection, range, project.colorForCollection(collection))
          else
            data = new IndeterminateGranuleTimelineData(collection, range, project.colorForCollection(collection))
          newTimelines[id] = data

      for own k, v of currentTimelines
        v.dispose()

      @_collectionsToTimelines = newTimelines

      for own key, data of newTimelines
        data.refreshData(range()...)

      result

  exports = GranuleTimeline
