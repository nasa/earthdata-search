models = @edsc.models
date = @edsc.util.date

current_year = new Date().getFullYear()

class models.QueryModel
  constructor: ->
    @keywords = ko.observable("")
    @spatial = ko.observable("")
    @temporal = ko.observable("")

    @temporal_range_start = ko.observable("")
    @temporal_range_stop = ko.observable("")
    @temporal_recurring_start = ko.observable("")
    @temporal_recurring_stop = ko.observable("")
    @temporal_recurring_year_range = ko.observable("")

    @temporal_range = ko.computed =>
      start = date.queryDateString(@temporal_range_start())
      stop = date.queryDateString(@temporal_range_stop())

      if start or stop
        [start, stop]
      else
        null

    @temporal_recurring = ko.computed =>
      years = @temporal_recurring_year_range().split(" - ")
      start = date.queryDateString(years[0] + "-" + @temporal_recurring_start()) if @temporal_recurring_start()
      stop = date.queryDateString(years[1] + "-" + @temporal_recurring_stop()) if @temporal_recurring_stop()

      start_day = date.findDayOfYear(new Date(start))
      stop_day = date.findDayOfYear(new Date(stop))

      if start and stop and start_day and stop_day
        [start,stop,start_day,stop_day]
      else
        null

    @placename = ko.observable("")

    @params = ko.computed(@_computeParams)

  clearFilters: =>
    @keywords(null)
    @spatial(null)
    models.searchModel.ui.spatialType.selectNone()
    models.searchModel.ui.temporal.selectNone()
    @temporal(null)
    @temporal_range_start("")
    @temporal_range_stop("")
    @temporal_recurring_start("")
    @temporal_recurring_stop("")
    @temporal_recurring_year_range('1960 - ' + current_year)
    $('.temporal-recurring-year-range').slider('setValue', [1960, current_year])
    @placename('')

  _computeParams: =>
    params = {}

    keywords = @keywords()
    params.keywords = keywords if keywords?.length > 0

    spatial = @spatial()
    params.spatial = spatial if spatial?.length > 0

    temporal = @temporal()
    params.temporal = temporal if temporal?.length > 0

    placename = @placename()
    params.placename = placename if placename?.length > 0

    params.page_size = 20

    params

  switchTemporal: (type) =>
    switch type
      when "range"
        range = @temporal_range()
        @temporal(range)
      when "recurring"
        recurring = @temporal_recurring()
        @temporal(recurring)

    model.ui.temporal.setTemporal(type)

  clearTemporal: (button) =>
    type = "range"
    switch button
      when "range"
        @temporal_range_start("")
        @temporal_range_stop("")
      when "recurring"
        type = "recurring"
        @temporal_recurring_start("")
        @temporal_recurring_stop("")
        @temporal_recurring_year_range('1960 - ' + current_year)
        $('.temporal-recurring-year-range').slider('setValue', [1960, current_year])
      when "range-start"
        @temporal_range_start("")
      when "range-stop"
        @temporal_range_stop("")
      when "recurring-start"
        type = "recurring"
        @temporal_recurring_start("")
      when "recurring-stop"
        type = "recurring"
        @temporal_recurring_stop("")

    @switchTemporal(type)

class models.DatasetsModel
  constructor: ->
    @_searchResponse = ko.mapping.fromJS(results: [], hits: 0)
    @results = ko.computed => @_searchResponse.results()
    @hits = ko.computed => @_searchResponse.hits()
    @hasNextPage = ko.computed => @results().length < @hits()
    @pendingRequestId = 0
    @completedRequestId = 0
    @isLoading = ko.observable(false)

    @details = ko.observable({})
    @detailsLoading = ko.observable(false)

    @error = ko.observable(null)

  search: (params) =>
    params.page = @page = 1
    @_load(params, true)

  loadNextPage: (params) =>
    if @hasNextPage() and !@isLoading()
      params.page = ++@page
      @_load(params, false)

  _load: (params, replace) =>
    requestId = ++@pendingRequestId
    @isLoading(@pendingRequestId != @completedRequestId)
    console.log("Request: /datasets.json", requestId, params)
    xhr = $.getJSON '/datasets.json', params, (data) =>
      if requestId > @completedRequestId
        @completedRequestId = requestId
        @error(null)
        #console.log("Response: /datasets.json", requestId, params, data)
        if replace
          ko.mapping.fromJS(data, @_searchResponse)
        else
          currentResults = @_searchResponse.results
          newResults = ko.mapping.fromJS(data['results'])
          currentResults.push.apply(currentResults, newResults())
      else
        console.log("Rejected out-of-sequence request: /datasets.json", requestId, params, data)
      @isLoading(@pendingRequestId != @completedRequestId)
    xhr.fail (response, type, reason) =>
      if requestId > @completedRequestId
        @completedRequestId = requestId
        errors = response.responseJSON?.errors
        @error(errors?.error)

  showDataset: (dataset) =>
    id = dataset.id()

    path = "/datasets/#{id}.json"
    console.log("Request: #{path}", this)
    @detailsLoading(true)
    $.getJSON path, (data) =>
      details = data['dataset']
      details.summaryData = dataset
      @details(details)
      @detailsLoading(false)
      $content = $('#dataset-information')
      $content.height($content.parents('.main-content').height() - $content.offset().top - 40)


class models.DatasetsListModel
  constructor: (@query, @datasets) ->

  scrolled: (data, event) =>
    elem = event.target
    if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
      @datasets.loadNextPage(@query.params())

# Keeps track of the user's interface selections for the purpose of keeping buttons in sync
class models.SpatialType
  constructor: ->
    @icon = ko.observable('fa-crop')
    @name = ko.observable('Spatial')

  selectNone: =>
    @name('Spatial')
    @icon ('fa-crop')

  selectPoint: =>
    @name('Point')
    @icon ('fa-map-marker')

  selectRectangle: =>
    @name('Rectangle')
    @icon ('edsc-icon-rect-open')

  selectPolygon: =>
    @name('Polygon')
    @icon ('edsc-icon-poly-open')

class models.Temporal
  constructor:  ->
    @start = ko.observable("")
    @stop = ko.observable("")
    @years = ko.observable("")

  _formatDate: (date) ->
    date.replace("T", " ").replace("Z", "") if date

  selectNone: =>
      @start("")
      @stop("")
      @years("")

  setTemporal: (type) =>
    query = model.query
    if query.temporal()
      if type == "recurring"
        recurring = query.temporal_recurring()
        @start(@_formatDate(recurring[0].substring(5)))
        @stop(@_formatDate(recurring[1].substring(5)))
        @years(recurring[0].substring(0,4) + " - " + recurring[1].substring(0,4))
      else if type == "range"
        @start(@_formatDate(query.temporal_range_start()))
        @stop(@_formatDate(query.temporal_range_stop()))
        @years("")
    else
      @selectNone()

class models.DatasetFacetsModel
  constructor: ->
    @_searchResponse = ko.mapping.fromJS(results: [])
    @results = ko.computed => @_searchResponse.results()
    @pendingRequestId = 0
    @completedRequestId = 0
    @isLoading = ko.observable(false)

    @error = ko.observable(null)

  search: (params) =>
    @_load(params)

  _load: (params) =>
    requestId = ++@pendingRequestId
    @isLoading(@pendingRequestId != @completedRequestId)
    console.log("Request: /dataset_facets.json", requestId, params)
    xhr = $.getJSON '/dataset_facets.json', params, (data) =>
      if requestId > @completedRequestId
        @completedRequestId = requestId
        @error(null)

        ko.mapping.fromJS(data, @_searchResponse)
      else
        console.log("Rejected out-of-sequence request: /datasets.json", requestId, params, data)
      @isLoading(@pendingRequestId != @completedRequestId)
    xhr.fail (response, type, reason) =>
      if requestId > @completedRequestId
        @completedRequestId = requestId
        errors = response.responseJSON?.errors
        @error(errors?.error)


class models.SearchModel
  constructor: ->
    @query = new models.QueryModel()
    @datasets = new models.DatasetsModel()
    @datasetsList = new models.DatasetsListModel(@query, @datasets)
    @ui =
      spatialType: new models.SpatialType()
      temporal: new models.Temporal()
    @bindingsLoaded = ko.observable(false)
    @datasetFacets = new models.DatasetFacetsModel()

    @spatialError = ko.computed(@_computeSpatialError)

    ko.computed(@_computeDatasetResults).extend(throttle: 500)
    ko.computed(@_computeDatasetFacetsResults)

  _computeDatasetResults: =>
    @datasets.search(@query.params())

  _computeDatasetFacetsResults: =>
    @datasetFacets.search()

  _computeSpatialError: =>
    error = @datasets.error()
    if error?
      return "Polygon boundaries must not cross themselves" if error.indexOf('ORA-13349') != -1
      return "Polygon is too large" if error.indexOf('ORA-13367') != -1
    null

model = models.searchModel = new models.SearchModel()

$(document).ready ->
  ko.applyBindings(model)
  model.bindingsLoaded(true)
