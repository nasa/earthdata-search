class QueryModel
  constructor: ->
    @keywords = ko.observable("")
    @datasets = new DatasetsModel()
    @params = ko.computed(@_computeParams)

  _computeParams: =>
    keywords: @keywords()

class DatasetsModel
  constructor: ->
    @_searchResponse = ko.mapping.fromJS(results: [], hits: 0)
    @results = ko.computed => @_searchResponse.results()
    @hits = ko.computed => @_searchResponse.hits()
    @pendingRequestId = 0
    @completedRequestId = 0
    @isLoading = ko.observable(false)

  search: (params) =>
    params.page = @page = 1
    @_load(params, true)

  loadNextPage: (params) =>
    params.page = @page++
    @_load(params, false)

  _load: (params, replace) =>
    requestId = ++@pendingRequestId
    @isLoading(@pendingRequestId != @completedRequestId)
    console.log("Request: /datasets.json", requestId, params)
    $.getJSON '/datasets.json', params, (data) =>
      if requestId > @completedRequestId
        console.log("Response: /datasets.json", requestId, params, data)
        if replace
          ko.mapping.fromJS(data, @_searchResponse)
        else
          currentResults = @_searchResponse.results
          newResults = ko.mapping.fromJS(data['results'])
          console.log('push it', currentResults(), newResults())
          currentResults.push.apply(currentResults, newResults())
        @completedRequestId = requestId
      else
        console.log("Rejected out-of-sequence request: /datasets.json", requestId, params, data)
      @isLoading(@pendingRequestId != @completedRequestId)

class DatasetsListModel
  constructor: (@query, @datasets) ->

  # I'm not super happy with this in this model.  I'd like to move it for separation of concerns.
  scrolled: (data, event) =>
    elem = event.target
    if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 100))
      @datasets.loadNextPage(@query.params()) unless @datasets.isLoading()


class SearchModel
  constructor: ->
    @query = new QueryModel()
    @datasets = new DatasetsModel()
    @datasetsList = new DatasetsListModel(@query, @datasets)
    ko.computed(@_computeDatasetResults).extend(throttle: 500)

  _computeDatasetResults: =>
    @datasets.search(@query.params())


$(document).ready ->
  model = new SearchModel()
  ko.applyBindings(model)