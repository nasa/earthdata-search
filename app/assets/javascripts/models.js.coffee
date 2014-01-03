models = @edsc.models

class models.QueryModel
  constructor: ->
    @keywords = ko.observable("")
    @spatial = ko.observable("")
    @temporal_start = ko.observable("")
    @temporal_stop = ko.observable("")
    @temporal_recurring = ko.observable("")

    @params = ko.computed(@_computeParams)

  clearFilters: =>
    @keywords(null)
    @spatial(null)
    models.searchModel.ui.spatialType.selectNone()
    @temporal_start('')
    @temporal_stop('')
    @temporal_recurring('')
    $('.temporal').val('')
    $('.temporal-recurring-year-range').slider('setValue', [1960, new Date().getFullYear()])
    $('.temporal-recurring-year-range-value').text('1960 - ' + new Date().getFullYear())

  _computeParams: =>
    params = {}

    keywords = @keywords()
    params.keywords = keywords if keywords?.length > 0

    spatial = @spatial()
    params.spatial = spatial if spatial?.length > 0

    temporal_start = @temporal_start()
    temporal_stop = @temporal_stop()
    temporal_recurring = @temporal_recurring()
    params.temporal = [temporal_start,temporal_stop] if temporal_start?.length > 0 or temporal_stop?.length > 0
    params.temporal = temporal_recurring if temporal_recurring?.length > 0

    params


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
        #console.log("Response: /datasets.json", requestId, params, data)
        if replace
          ko.mapping.fromJS(data, @_searchResponse)
        else
          currentResults = @_searchResponse.results
          newResults = ko.mapping.fromJS(data['results'])
          currentResults.push.apply(currentResults, newResults())
        @completedRequestId = requestId
      else
        console.log("Rejected out-of-sequence request: /datasets.json", requestId, params, data)
      @isLoading(@pendingRequestId != @completedRequestId)
    xhr.fail (response, type, reason) =>
      errors = response.responseJSON?.errors
      if errors?
        console.error errors
        # Placeholder.  Not currently needed but will be soon.

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

class models.SearchModel
  constructor: ->
    @query = new models.QueryModel()
    @datasets = new models.DatasetsModel()
    @datasetsList = new models.DatasetsListModel(@query, @datasets)
    @ui =
      spatialType: new models.SpatialType()
    @bindingsLoaded = ko.observable(false)

    ko.computed(@_computeDatasetResults).extend(throttle: 500)

  _computeDatasetResults: =>
    @datasets.search(@query.params())

model = models.searchModel = new models.SearchModel()

$(document).ready ->
  ko.applyBindings(model)
  model.bindingsLoaded(true)
