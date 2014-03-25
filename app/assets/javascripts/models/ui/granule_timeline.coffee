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
    constructor: (@dataset, @interval) ->
      super("/granules/timeline.json", this)
      @params = ko.computed(@_computeParams)
      @results()

    _computeParams: =>
      params = extend({}, @dataset.granulesModel.params(), @interval())
      delete params.temporal
      delete params.page_num
      delete params.page_size
      delete params.sort_key
      params

    _computeSearchResponse: (current, callback) ->
      @_load(@params(), current, callback)

    _toResults: (data, current, params) ->
      intervals = data[0].intervals
      $('#timeline').timeline('data', @dataset.id(), intervals)
      intervals

  class GranuleTimeline extends KnockoutModel
    constructor: (@datasetsList, @projectList) ->
      @_datasetsToTimelines = {}
      @datasets = ko.computed(@_computeDatasets)
      @interval = ko.observable($('#timeline').timeline('params'))

    _computeDatasets: =>
      interval = @interval
      focused = @datasetsList.focused()
      result = []
      if focused?
        result = [focused.dataset]
      else if  @projectList.visible()
        result = @projectList.project.datasets()

      currentTimelines = @_datasetsToTimelines
      newTimelines = {}
      for dataset in result
        id = dataset.id()
        if currentTimelines[id]
          newTimelines[id] = currentTimelines[id]
          delete currentTimelines[id]
        else
          data = new GranuleTimelineData(dataset, interval)
          newTimelines[id] = data

      for own k, v of currentTimelines
        v.dispose()

      @_datasetsToTimelines = newTimelines
      $('#timeline').timeline('datasets', result)

      result



  exports = GranuleTimeline
