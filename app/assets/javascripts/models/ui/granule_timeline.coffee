#= require models/knockout_model
#= require models/data/xhr_model

ns = @edsc.models.ui

ns.GranuleTimeline = do (ko
                         KnockoutModel = @edsc.models.KnockoutModel
                         XhrModel = @edsc.models.data.XhrModel
                         extend = $.extend
                         ) ->
  # intervals: 'year', 'month', 'day', 'hour', 'minute'
  class GranuleTimelineData extends XhrModel
    constructor: (@dataset, @range) ->
      super("/granules/timeline.json", this)
      @prevParams = {}
      @params = ko.computed(@_computeParams)

      # Start computing, but avoid introducing a dependency on results in the caller
      @results.peek()

    _computeParams: =>
      [start, end] = @range()
      timelineParams =
        start_date: new Date(start).toISOString()
        end_date: new Date(end).toISOString()
        interval: 'hour'

      params = extend({}, @dataset.granulesModel.params(), timelineParams)
      delete params.temporal
      delete params.page_num
      delete params.page_size
      delete params.sort_key
      params

    _computeSearchResponse: (current, callback) =>
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

      $('#timeline').timeline('loadstart', @dataset.id(), @range()...) if reload
      @_load(params, current, callback) if changed

    _toResults: (data, current, params) ->
      intervals = data[0].intervals
      $('#timeline').timeline('data', @dataset.id(), @range()..., intervals)
      intervals

  class GranuleTimeline extends KnockoutModel
    constructor: (@datasetsList, @projectList) ->
      @_datasetsToTimelines = {}

      @datasets = ko.computed(@_computeDatasets)
      @range = ko.observable(null)

      $timeline = $('#timeline')

      $timeline.on 'timeline.rangechange', (e, range...) =>
        @range(range)

      @range($timeline.timeline('range'))

    _computeDatasets: =>
      range = @range
      focused = @datasetsList.focused()
      result = []
      if focused?
        result = [focused.dataset]
      else if  @projectList.visible()
        result = @projectList.project.datasets()

      # Pick only the first 3 datasets with granules
      result = (dataset for dataset in result when dataset.has_granules())
      result = result[0...3]

      $timeline = $('#timeline')
      $timeline.timeline('datasets', result)

      currentTimelines = @_datasetsToTimelines
      newTimelines = {}

      for dataset in result
        id = dataset.id()
        if currentTimelines[id]
          newTimelines[id] = currentTimelines[id]
          delete currentTimelines[id]
        else
          data = new GranuleTimelineData(dataset, range)
          newTimelines[id] = data

      for own k, v of currentTimelines
        v.dispose()

      @_datasetsToTimelines = newTimelines

      for own key, data of newTimelines when !data.isLoading.peek()
        $timeline.timeline('data', data.dataset.id(), range..., data.results.peek())

      result

  exports = GranuleTimeline
