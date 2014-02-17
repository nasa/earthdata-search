#= require models/data/granules
#= require models/data/service_options

ns = @edsc.models.data

ns.Dataset = do (ko
                 Granules=ns.Granules
                 QueryModel = ns.Query
                 ServiceOptionsModel = ns.ServiceOptions
                 toParam=jQuery.param
                 extend=jQuery.extend
                 ) ->
  class Dataset
    constructor: (jsonData, @query) ->
      @granuleQuery = new QueryModel('echo_collection_id': jsonData.id)
      @granulesModel = granulesModel = new Granules(@query, @granuleQuery)
      @granules = ko.computed(granulesModel.results, granulesModel, deferEvaluation: true)
      @granuleHits = ko.computed(granulesModel.hits, granulesModel, deferEvaluation: true)
      @granuleAccessOptions = ko.asyncComputed({}, 100, @_loadGranuleAccessOptions, this)

      @serviceOptions = new ServiceOptionsModel(@granuleAccessOptions)

      @fromJson(jsonData)

      # TODO: Is this needed?
      @error = ko.observable(null)
      @spatial_constraint = ko.computed =>
        if @points?
          'point:' + @points()[0].split(/\s+/).reverse().join(',')
        else
          null

      @granuleDownloadsUrl = ko.computed =>
        params = @query.params()
        paramStr = toParam(extend(@_granuleParams(params), online_only: true, page_size: 2000))
        "/granules/download.html?#{paramStr}"

    searchGranules: (params, callback) ->
      @granulesModel.search(@_granuleParams(params), callback)

    loadNextGranules: (params, callback) ->
      @granulesModel.loadNextPage(@_granuleParams(params), callback)

    _loadGranuleAccessOptions: (current, callback) ->
      params = @query.params()
      downloadableParams = extend(@_granuleParams(params), online_only: true, page_size: 2000)
      granulesModel = new Granules()
      granulesModel.search @_granuleParams(params), =>
        hits = granulesModel.hits()
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
      extend({}, params, 'echo_collection_id[]': @id())

    serialize: ->
      result = {id: @id(), dataset_id: @dataset_id()}
      if @has_granules()
        result.params = @granuleQuery.serialize()
        result.granuleAccessOptions = @granuleAccessOptions() if @granuleAccessOptions().count?
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
