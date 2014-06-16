#= require models/data/granules
#= require models/data/service_options

ns = @edsc.models.data

ns.Dataset = do (ko
                 KnockoutModel = @edsc.models.KnockoutModel
                 scalerUrl = @edsc.config.browseScalerUrl
                 Granules=ns.Granules
                 GranuleQuery = ns.query.GranuleQuery
                 ServiceOptionsModel = ns.ServiceOptions
                 toParam=jQuery.param
                 extend=jQuery.extend
                 ajax = jQuery.ajax
                 ) ->

  datasets = ko.observableArray()

  randomKey = Math.random()

  register = (dataset) ->
    dataset.reference()
    datasets.push(dataset)
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

      @details = @asyncComputed({}, 100, @_computeDetails, this)
      @detailsLoaded = ko.observable(false)

      @visible = ko.observable(false)

      @fromJson(jsonData)

      @spatial_constraint = @computed =>
        if @points?
          'point:' + @points[0].split(/\s+/).reverse().join(',')
        else
          null

      @granuleDownloadsUrl = @computed
        read: =>
          paramStr = toParam(extend({}, @granuleQuery.params(), online_only: true, page_size: 2000))
          "/granules/download.html?#{paramStr}"
        deferEvaluation: true

      @granuleScriptUrl = @computed
        read: =>
          paramStr = toParam(@granuleQuery.params())
          "/data/download.sh?#{paramStr}"
        deferEvaluation: true

    thumbnail: ->
      granule = @browseable_granule
      "#{scalerUrl}/#{granule}?h=85&w=85" if granule?

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

    hasGranuleConfig: ->
      @granuleQueryLoaded() && Object.keys(@granuleQuery.serialize()).length > 0

    shouldDispose: ->
      result = !@hasGranuleConfig()
      datasets.remove(this) if result
      result

    fromJson: (jsonObj) ->
      @json = jsonObj

      this[key] = value for own key, value of jsonObj

      @hasAtomData(jsonObj.links?)
      @gibs = ko.observable(@gibs ? null)

  exports = Dataset
