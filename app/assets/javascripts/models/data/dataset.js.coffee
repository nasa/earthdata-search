#= require models/data/granules
#= require models/data/service_options

ns = @edsc.models.data

ns.Dataset = do (ko
                 KnockoutModel = @edsc.models.KnockoutModel
                 Granules=ns.Granules
                 QueryModel = ns.Query
                 ServiceOptionsModel = ns.ServiceOptions
                 toParam=jQuery.param
                 extend=jQuery.extend
                 ) ->
  class Dataset extends KnockoutModel
    constructor: (jsonData, @query) ->
      @granuleQuery = @disposable(new QueryModel('echo_collection_id': jsonData.id))
      @granuleQuery.sortKey(['-start_date'])
      @granulesModel = granulesModel = @disposable(new Granules(@granuleQuery, @query))
      @granuleAccessOptions = @asyncComputed({}, 100, @_loadGranuleAccessOptions, this)

      @serviceOptions = @disposable(new ServiceOptionsModel(@granuleAccessOptions))

      @fromJson(jsonData)

      # TODO: Is this needed?
      @error = ko.observable(null)
      @spatial_constraint = @computed =>
        if @points?
          'point:' + @points()[0].split(/\s+/).reverse().join(',')
        else
          null

      @granuleDownloadsUrl = @computed =>
        params = @query.params()
        paramStr = toParam(extend(@_granuleParams(params), online_only: true, page_size: 2000))
        "/granules/download.html?#{paramStr}"

    hasAreaSpatial: ->
      @has_granules()? && !@points?

    # A granules model not directly connected to the dataset model so classes can, e.g. query
    # for granules under a point without messing with displayed hits or timing values
    createGranulesModel: ->
      granuleQuery = new QueryModel('echo_collection_id': @id())
      new Granules(granuleQuery, @query)

    searchGranules: (params, callback) ->
      @granulesModel.search(@_granuleParams(params), callback)

    loadNextGranules: (params, callback) ->
      @granulesModel.loadNextPage(@_granuleParams(params), callback)

    clone: ->
      result = new Dataset(@json, @query)
      result.serviceOptions.fromJson(@serviceOptions.serialize())
      if result.granuleAccessOptions.isSetup()
        result.granuleAccessOptions(@granuleAccessOptions())
      result

    _loadGranuleAccessOptions: (current, callback) ->
      params = @query.params()
      downloadableParams = extend(@_granuleParams(params), online_only: true, page_size: 2000)
      granulesModel = new Granules()
      granulesModel.search @_granuleParams(params), =>
        hits = granulesModel.hits()
        granulesModel.dispose()

        downloadableModel = new Granules()
        downloadableModel.search downloadableParams, (results) =>
          downloadableHits = downloadableModel.hits()

          sizeMB = 0
          sizeMB += parseFloat(granule.granule_size) for granule in results
          size = sizeMB * 1024 * 1024

          units = ['', 'Kilo', 'Mega', 'Giga', 'Tera', 'Peta', 'Exa']
          while size > 1000 && units.length > 1
            size = size / 1000
            units.shift()

          size = Math.round(size * 10) / 10
          size = "> #{size}" if hits > 2000

          downloadableModel.dispose()

          options =
            count: hits
            size: size
            sizeUnit: "#{units[0]}bytes"
            canDownloadAll: hits == downloadableHits
            canDownload: downloadableHits > 0
            downloadCount: downloadableHits
            accessMethod: null
          callback(options)

    _granuleParams: (params) ->
      extend({}, params, 'echo_collection_id[]': @id(), @granuleQuery.params())

    granuleFiltersApplied: ->
      # granuleQuery.params() will have echo_collection_id and page_size by default
      params = @granuleQuery.params()
      Object.keys(params).length > 2

    serialize: ->
      result = {id: @id(), dataset_id: @dataset_id()}
      if @has_granules()
        result.params = @granuleQuery.serialize()
        if @granuleAccessOptions.isSetup()
          result.granuleAccessOptions = @granuleAccessOptions()
      result.serviceOptions = @serviceOptions.serialize()
      result

    fromJson: (jsonObj) ->
      jsonObj = extend({}, jsonObj)

      @granuleQuery.fromJson(jsonObj.params) if jsonObj.params?
      @granuleAccessOptions(jsonObj.granuleAccessOptions) if jsonObj.granuleAccessOptions?
      @serviceOptions.fromJson(jsonObj.serviceOptions) if jsonObj.serviceOptions?

      delete jsonObj.params
      delete jsonObj.granuleAccessOptions
      delete jsonObj.serviceOptions

      @json = jsonObj

      @thumbnail = ko.observable(null)
      @archive_center = ko.observable(null)
      ko.mapping.fromJS(jsonObj, {}, this)
      if @gibs
        @gibs = ko.observable(ko.mapping.toJS(@gibs))
      else
        @gibs = ko.observable(null)
