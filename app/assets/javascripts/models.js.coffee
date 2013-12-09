models = @edsc.models

class models.QueryModel
  constructor: ->
    @keywords = ko.observable("")
    @spatial = ko.observable("")

    @params = ko.computed(@_computeParams)

  _computeParams: =>
    params = {}

    keywords = @keywords()
    params.keywords = keywords if keywords?.length > 0

    spatial = @spatial()
    params.spatial = spatial if spatial?.length > 0

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
    @_detailResponse = ko.mapping.fromJS(results: [])
    @details = ko.computed => new models.DatasetDetailsModel(@_detailResponse.results())

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

  showDataset: (id) =>
    console.log("Request: /datasets/", id())
    $.getJSON '/datasets/' + id() + '.json', (data) =>
      @_detailResponse.results(ko.mapping.fromJS(data['results']['dataset']))


class models.DatasetDetailsModel
  constructor: (params) ->
    @dataset_id = params.dataset_id
    @description = params.description
    @archive_center = params.archive_center
    @processing_center = params.processing_center
    @short_name = params.short_name
    @version_id = params.version_id
    @online_access_urls = params.online_access_urls
    @online_resources = params.online_resources
    @browse_images = params.browse_images
    @associated_difs = params.associated_difs
    @contacts = params.contacts
    @spatial = params.spatial
    @temporal = params.temporal
    @science_keywords = params.science_keywords


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
    @icon ('fa-crop') #TODO (JS): Set correct icon class here

  selectPoint: =>
    @name('Point')
    @icon ('fa-crop') #TODO (JS): Set correct icon class here

  selectRectangle: =>
    @name('Rectangle')
    @icon ('fa-crop') #TODO (JS): Set correct icon class here

  selectPolygon: =>
    @name('Polygon')
    @icon ('fa-crop') #TODO (JS): Set correct icon class here

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
