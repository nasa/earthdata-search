#= require models/data/granules
#= require models/data/service_options
#= require models/data/data_quality_summaries

ns = @edsc.models.data

ns.Dataset = do (ko
                 KnockoutModel = @edsc.models.KnockoutModel
                 Granules=ns.Granules
                 GranuleQuery = ns.query.GranuleQuery
                 DataQualitySummaryQuery = ns.query.DataQualitySummaryQuery
                 ServiceOptionsModel = ns.ServiceOptions
                 DataQualitySummaryModel = ns.DataQualitySummary
                 toParam=jQuery.param
                 extend=jQuery.extend
                 getJSON = jQuery.getJSON
                 ) ->

  datasets = ko.observableArray()

  randomKey = Math.random()

  register = (dataset) ->
    dataset.reference()
    datasets.push(dataset)
    subscription = dataset.refCount.subscribe (count) ->
      if count <= 0
        datasets.remove(dataset)
        subscription.dispose()

    dataset

  class Dataset extends KnockoutModel
    @findOrCreate: (jsonData, query) ->
      id = jsonData.id
      for dataset in datasets()
        if dataset.id.peek() == id
          if jsonData.links? && !dataset.links?
            dataset.fromJson(jsonData)
          return dataset.reference()
      register(new Dataset(jsonData, query, randomKey))

    @visible: ko.computed
      read: -> dataset for dataset in datasets() when dataset.visible()

    constructor: (jsonData, @query, inKey) ->
      throw "Datasets should not be constructed directly" unless inKey == randomKey

      @hasAtomData = ko.observable(false)
      @granuleQuery = @disposable(new GranuleQuery(jsonData.id, @query))
      @granulesModel = granulesModel = @disposable(new Granules(@granuleQuery, @query))
      @granuleAccessOptions = @asyncComputed({}, 100, @_loadGranuleAccessOptions, this)

      @details = @asyncComputed({}, 100, @_computeDetails, this)
      @detailsLoaded = ko.observable(false)

      @visible = ko.observable(false)

      @serviceOptions = @disposable(new ServiceOptionsModel(@granuleAccessOptions))

      @fromJson(jsonData)

      # TODO: Is this needed?
      @error = ko.observable(null)
      @spatial_constraint = @computed =>
        if @points?
          'point:' + @points()[0].split(/\s+/).reverse().join(',')
        else
          null

      @granuleDownloadsUrl = @computed
        read: =>
          params = @query.params()
          paramStr = toParam(extend(@_granuleParams(params), online_only: true, page_size: 2000))
          "/granules/download.html?#{paramStr}"
        deferEvaluation: true

      @granuleScriptUrl = @computed
        read: =>
          params = @query.params()
          paramStr = toParam(@_granuleParams(params))
          "/data/download.sh?#{paramStr}"
        deferEvaluation: true

      @dqsModel = @disposable(new DataQualitySummaryModel(new DataQualitySummaryQuery(jsonData.id)))

    # A granules model not directly connected to the dataset model so classes can, e.g. query
    # for granules under a point without messing with displayed hits or timing values
    createGranulesModel: ->
      new Granules(new GranuleQuery(@id(), @query), @query)

    _loadGranuleAccessOptions: ->
      params = @_granuleParams(@query.params())

      getJSON '/data/options', params, (data, status, xhr) =>
        @granuleAccessOptions(data)

    _granuleParams: (params) ->
      extend({}, params, 'echo_collection_id[]': @id(), @granuleQuery.params())

    granuleFiltersApplied: ->
      # granuleQuery.params() will have echo_collection_id and page_size by default
      params = @granuleQuery.ownParams()
      ignored_params = ['page_size', 'page_num', 'sort_key', 'echo_collection_id']
      for own key, value of params
        return true if ignored_params.indexOf(key) == -1
      return false

    _computeDetails: ->
      id = @id()
      path = "/datasets/#{id}.json"
      console.log("Request: #{path}", this)
      getJSON path, (data) =>
        details = data['dataset']
        details.summaryData = this
        @details(details)
        @detailsLoaded(true)

    serialize: ->
      result = {id: @id(), dataset_id: @dataset_id(), has_granules: @has_granules()}
      if @has_granules()
        result.query = @granuleQuery.serialize()
        result.params = $.param(@granuleQuery.params())
        if @granuleAccessOptions.isSetup()
          result.granuleAccessOptions = @granuleAccessOptions()
      result.serviceOptions = @serviceOptions.serialize()
      result

    fromJson: (jsonObj) ->
      jsonObj = extend({}, jsonObj)

      @granuleQuery.fromJson(jsonObj.query) if jsonObj.query?
      @granuleAccessOptions(jsonObj.granuleAccessOptions) if jsonObj.granuleAccessOptions?
      @serviceOptions.fromJson(jsonObj.serviceOptions) if jsonObj.serviceOptions?

      delete jsonObj.query
      delete jsonObj.granuleAccessOptions
      delete jsonObj.serviceOptions

      @json = jsonObj

      @thumbnail ?= ko.observable(null)
      @archive_center ?= ko.observable(null)
      ko.mapping.fromJS(jsonObj, {}, this)
      @hasAtomData(jsonObj.links?)
      if @gibs
        @gibs = ko.observable(ko.mapping.toJS(@gibs))
      else
        @gibs = ko.observable(null)
