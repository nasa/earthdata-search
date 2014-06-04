#= require models/data/granules
#= require models/data/service_options
#= require models/data/data_quality_summaries

ns = @edsc.models.data

ns.Dataset = do (ko
                 KnockoutModel = @edsc.models.KnockoutModel
                 scalerUrl = @edsc.config.browseScalerUrl
                 Granules=ns.Granules
                 GranuleQuery = ns.query.GranuleQuery
                 DataQualitySummaryQuery = ns.query.DataQualitySummaryQuery
                 ServiceOptionsModel = ns.ServiceOptions
                 DataQualitySummaryModel = ns.DataQualitySummary
                 toParam=jQuery.param
                 extend=jQuery.extend
                 ajax = jQuery.ajax
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
        if dataset.id == id
          if jsonData.links? && !dataset.links?
            dataset.fromJson(jsonData)
          return dataset.reference()
      register(new Dataset(jsonData, query, randomKey))

    @visible: ko.computed
      read: -> dataset for dataset in datasets() when dataset.visible()

    constructor: (jsonData, @query, inKey) ->
      throw "Datasets should not be constructed directly" unless inKey == randomKey

      @hasAtomData = ko.observable(false)

      @granuleQueryLoaded = ko.observable(false)
      Object.defineProperty this, 'granuleQuery',
        get: ->
          @granuleQueryLoaded(true)
          @_granuleQuery ?= @disposable(new GranuleQuery(jsonData.id, @query))

      Object.defineProperty this, 'granulesModel',
        get: -> @_granulesModel ?= @disposable(new Granules(@granuleQuery, @query))

      @granuleAccessOptions = @asyncComputed({}, 100, @_loadGranuleAccessOptions, this)

      @details = @asyncComputed({}, 100, @_computeDetails, this)
      @detailsLoaded = ko.observable(false)

      @visible = ko.observable(false)

      @serviceOptions = @disposable(new ServiceOptionsModel(@granuleAccessOptions))

      @fromJson(jsonData)

      @spatial_constraint = @computed =>
        if @points?
          'point:' + @points[0].split(/\s+/).reverse().join(',')
        else
          null

      @granuleDownloadsUrl = @computed
        read: =>
          paramStr = toParam(extend(@granuleQuery.params(), online_only: true, page_size: 2000))
          "/granules/download.html?#{paramStr}"
        deferEvaluation: true

      @granuleScriptUrl = @computed
        read: =>
          paramStr = toParam(@granuleQuery.params())
          "/data/download.sh?#{paramStr}"
        deferEvaluation: true

      @dqsModel = @disposable(new DataQualitySummaryModel(new DataQualitySummaryQuery(jsonData.id)))

    thumbnail: ->
      granule = @browseable_granule
      if granule?
        "#{scalerUrl}/#{granule}?h=85&w=85"
      else
        null

    _loadGranuleAccessOptions: ->
      params = @_granuleParams(@query.params())

      ajax
        dataType: 'json'
        url: '/data/options'
        data: params
        retry: => @_loadGranuleAccessOptions()
        success: (data, status, xhr) =>
          @granuleAccessOptions(data)

    _granuleParams: (params) ->
      extend({}, params, 'echo_collection_id[]': @id, @granuleQuery.params())

    granuleFiltersApplied: ->
      # granuleQuery.params() will have echo_collection_id and page_size by default
      params = @granuleQuery.serialize()
      return true for own key, value of params
      return false

    _computeDetails: ->
      id = @id
      path = "/datasets/#{id}.json"
      console.log("Request: #{path}", this)
      ajax
        dataType: 'json'
        url: path
        retry: => @_computeDetails()
        success: (data) =>
          details = data['dataset']
          details.summaryData = this
          @details(details)
          @detailsLoaded(true)

    serialize: ->
      result = {id: @id, dataset_id: @dataset_id, has_granules: @has_granules}
      if @has_granules
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

      this[key] = value for own key, value of jsonObj

      @hasAtomData(jsonObj.links?)
      if @gibs
        @gibs = ko.observable(@gibs)
      else
        @gibs = ko.observable(null)
