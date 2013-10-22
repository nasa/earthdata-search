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

  search: (params) =>
    requestId = ++@pendingRequestId
    console.log("Request: /datasets.json", requestId, params)
    $.getJSON '/datasets.json', params, (data) =>
      if requestId > @completedRequestId
        console.log("Response: /datasets.json", requestId, params, data)
        ko.mapping.fromJS(data, @_searchResponse)
        @completedRequestId = requestId
      else
        console.log("Rejected out-of-sequence request: /datasets.json", requestId, params, data)

class SearchModel
  constructor: ->
    @query = new QueryModel()
    @datasets = new DatasetsModel()
    ko.computed(@_computeDatasetResults).extend(throttle: 500)

  _computeDatasetResults: =>
    @datasets.search(@query.params())


$(document).ready ->
  model = new SearchModel()
  ko.applyBindings(model)