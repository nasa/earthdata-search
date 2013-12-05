models = @edsc.models

class models.QueryModel
  constructor: ->
    @keywords = ko.observable("")
    @params = ko.computed(@_computeParams)

  _computeParams: =>
    keywords: @keywords()

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
    $.getJSON '/datasets.json', params, (data) =>
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

  showDataset: (id) =>
    console.log("Request: /datasets/", id())
    $.getJSON '/datasets/' + id() + '.json', (data) =>
      @_detailResponse.results(ko.mapping.fromJS(data['results']))


class models.DatasetDetailsModel
  constructor: (params) ->
    @dataset_id = params.dataset_id || null
    @description = params.description || null
    @archive_center = params.archive_center || null
    @processing_center = params.processing_center || null
    @short_name = params.short_name || null
    @version_id = params.version_id || null

    # Hack because catalog-rest only returns an array of access_urls when
    # there is more than one url.
    if params.online_access_urls? and params.online_access_urls.length?
      @online_access_urls = params.online_access_urls()
    else if params.online_access_urls?
      @online_access_urls = [params.online_access_urls]
    else
      @online_access_urls = []

    @online_resources = params.online_resources || null
    @browse_images = params.browse_images || null
    @associated_difs = new models.DifModel(params.associated_difs) if params?
    @contacts = new models.ContactModel(params.contacts) if params?
    @spatial = new models.SpatialModel(params.geometry) if params?
    @temporal = new models.TemporalModel(params.temporal) if params?
    if params.science_keywords?
      @science_keywords = (new models.ScienceKeywordsModel(p) for p in params.science_keywords())
    else
      @science_keywords = []


class models.DetailsUrlModel
  constructor: (params) ->
    @url = params.url


class models.DifModel
  constructor: (dif) ->
    if dif
      @id = dif
      @url = 'http://gcmd.gsfc.nasa.gov/getdif.htm?' + @id()
    else
      @id = null
      @url = null


class models.ContactModel
  constructor: (contact) ->
    if contact? and contact.ContactPersons? and contact.ContactPersons.ContactPerson?
      @name = contact.ContactPersons.ContactPerson.FirstName() + ' ' + contact.ContactPersons.ContactPerson.LastName()
    else if contact? and contact.OrganizationName?
      @name = contact.OrganizationName
    else
      @name = null
    @email = if contact? then contact.OrganizationEmails.Email else null
    if contact? and contact.OrganizationPhones?
      @phones = (new models.PhoneModel(p) for p in contact.OrganizationPhones.Phone())
    else
      @phones = null


class models.PhoneModel
  constructor: (phone) ->
    number = phone.Number
    type = phone.Type
    @number = ko.computed => number() + ' (' + type() + ')'


class models.SpatialModel
  constructor: (spatial) ->
    if spatial? and spatial.Point?
      latitude = spatial.Point.PointLatitude
      longitude = spatial.Point.PointLongitude
      @geometry = ko.computed => 'Point: ' +
                  latitude() + '\xB0, ' +
                  longitude() + '\xB0'
    else if spatial? and spatial.BoundingRectangle?
      north = spatial.BoundingRectangle.NorthBoundingCoordinate
      south = spatial.BoundingRectangle.SouthBoundingCoordinate
      east = spatial.BoundingRectangle.EastBoundingCoordinate
      west = spatial.BoundingRectangle.WestBoundingCoordinate
      @geometry = ko.computed => 'Bounding Rectangle: ' +
                  north() + '\xB0, ' + west() + '\xB0, ' +
                  south() + '\xB0, ' + east() + '\xB0'
    else
      @geometry = null


class models.TemporalModel
  constructor: (temporal) ->
    if temporal and temporal.RangeDateTime?
      beginning = temporal.RangeDateTime.BeginningDateTime
      end = temporal.RangeDateTime.EndingDateTime
      @temporalRange = ko.computed => beginning() + ' to ' + end()
    else
      @temporalRange = null


class models.ScienceKeywordsModel
  constructor: (keyword) ->
    if keyword?
      category = keyword.CategoryKeyword
      topic = keyword.TopicKeyword
      term = keyword.TermKeyword
      @keywordString = ko.computed => category() + ' >> ' +
                                      topic() + ' >> ' + term()
    else
      @keywordString = null


class models.DatasetsListModel
  constructor: (@query, @datasets) ->

  scrolled: (data, event) =>
    elem = event.target
    if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
      @datasets.loadNextPage(@query.params())


class models.SearchModel
  constructor: ->
    @query = new models.QueryModel()
    @datasets = new models.DatasetsModel()
    @datasetsList = new models.DatasetsListModel(@query, @datasets)
    @bindingsLoaded = ko.observable(false)

    ko.computed(@_computeDatasetResults).extend(throttle: 500)

  _computeDatasetResults: =>
    @datasets.search(@query.params())


$(document).ready ->
  model = new models.SearchModel()
  ko.applyBindings(model)
  model.bindingsLoaded(true)
