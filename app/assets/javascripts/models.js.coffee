models = @edsc.models

class models.QueryModel
  constructor: ->
    @keywords = ko.observable("")
    @spatial = ko.observable("")
    @temporal_start = ko.observable("")
    @temporal_stop = ko.observable("")
    @temporal_recurring = ko.observable("")
    @facets = ko.observableArray()
    @placename = ko.observable("")

    @params = ko.computed(@_computeParams)

  clearFilters: =>
    @keywords('')
    @spatial('')
    models.searchModel.ui.spatialType.selectNone()
    @temporal_start('')
    @temporal_stop('')
    @temporal_recurring('')
    @placename('')
    $('.temporal').val('')
    $('.temporal-recurring-year-range').slider('setValue', [1960, new Date().getFullYear()])
    $('.temporal-recurring-year-range-value').text('1960 - ' + new Date().getFullYear())
    @facets.removeAll()

  toggleQueryDatasetSpatial: (dataset) =>
    constraint = dataset.spatial_constraint()
    spatial = @spatial()
    constraint = "" if constraint == spatial
    @spatial(constraint)
    false

  canQueryDatasetSpatial: (dataset) =>
    spatial = @spatial()
    constraint = dataset.spatial_constraint()
    constraint? && (!spatial || spatial == constraint)

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

    facets = @facets()
    params.facets = facets if facets.length > 0

    placename = @placename()
    params.placename = placename if placename?.length > 0

    params.page_size = 20

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

class models.DatasetFacetsModel
  constructor: ->
    @_searchResponse = ko.mapping.fromJS(results: [])
    @results = ko.computed(@_prepareResults)
    @pendingRequestId = 0
    @completedRequestId = 0
    @isLoading = ko.observable(false)

    @error = ko.observable(null)

  _prepareResults: =>
    results = []
    for item in @_searchResponse.results()
      result = {}
      result.name = item[0]
      result.class_name = result.name.toLowerCase().replace(' ', '-')
      result.values = item[1].sort (l, r) ->
        if l.term() > r.term() then 1 else -1
      results.push result

    results

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
        console.log("Rejected out-of-sequence request: /dataset_facets.json", requestId, params, data)
      @isLoading(@pendingRequestId != @completedRequestId)
    xhr.fail (response, type, reason) =>
      if requestId > @completedRequestId
        @completedRequestId = requestId
        errors = response.responseJSON?.errors
        @error(errors?.error)

  loadFacet: (facet_type, facet, event) =>
    facet_query = {type: facet_type, name: facet}
    facets = model.query.facets
    found = ko.utils.arrayFirst facets(), (item) ->
      #returns either null or the found facet
      facet_query.type == item.type and facet_query.name == item.name
    if !found
      facets.push(facet_query)
    else
      # facets.remove(facet_query) did not remove the item, but
      # facets.remove(found) does
      facets.remove(found)

  highlightFacet: (type, facet) =>
    applied_facets = model.query.facets()
    found = ko.utils.arrayFirst applied_facets, (item) ->
      #returns either null or the found facet
      type == item.type and facet() == item.name
    if !found
      false
    else
      true

  applied_facets: () =>
    facets = model.query.facets()
    # don't want to shift all the items out of the facet query
    facets_copy = ko.observableArray(facets.slice(0))
    results = []
    while temp = facets_copy.shift()
      type = temp.type
      found = ko.utils.arrayFirst results, (item) ->
        item.type == type

      if !found
        results.push {type: type, values: [temp.name]}
      else
        found.values.push(temp.name)

    results


class models.SearchModel
  constructor: ->
    @query = new models.QueryModel()
    @datasets = new models.DatasetsModel()
    @datasetsList = new models.DatasetsListModel(@query, @datasets)
    @ui =
      spatialType: new models.SpatialType()
      isLandingPage: ko.observable(null) # Used by modules/landing
    @bindingsLoaded = ko.observable(false)
    @datasetFacets = new models.DatasetFacetsModel()

    @spatialError = ko.computed(@_computeSpatialError)

    ko.computed(@_computeDatasetResults).extend(throttle: 500)
    ko.computed(@_computeDatasetFacetsResults).extend(throttle: 500)

  _computeDatasetResults: =>
    @datasets.search(@query.params())

  _computeDatasetFacetsResults: =>
    @datasetFacets.search(@query.params())

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
