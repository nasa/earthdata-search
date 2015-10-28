#= require models/data/datasets
#= require models/data/dataset

ns = @edsc.models.data

ns.Project = do (ko,
                 document,
                 $ = jQuery,
                 extend = $.extend,
                 param = $.param,
                 deparam = @edsc.util.deparam
                 ajax = @edsc.util.xhr.ajax
                 urlUtil = @edsc.util.url
                 QueryModel = ns.query.DatasetQuery,
                 DatasetsModel = ns.Datasets
                 ServiceOptionsModel = ns.ServiceOptions
                 Dataset = ns.Dataset) ->

  # Maintains a finite pool of values to be distributed on demand.  Calling
  # next() on the pool returns either an unused value, prioritizing those
  # which have been returned to the pool most recently or, in the case where
  # there are no unused values, the value which has been checked out of the
  # pool the longest.
  class ValuePool
    constructor: (values) ->
      @_pool = values.concat()

    use: (value) ->
      @_remove(value)
      @_pool.push(value)
      value

    next: ->
      @use(@_pool[0])

    has: (value) ->
      @_pool.indexOf(value) != -1

    unuse: (value) ->
      @_remove(value)
      @_pool.unshift(value)
      value

    _remove: (value) ->
      index = @_pool.indexOf(value)
      @_pool.splice(index, 1) unless index == -1

  colorPool = new ValuePool([
    '#3498DB',
    '#E67E22',
    '#2ECC71',
    '#E74C3C',
    '#9B59B6'
  ])

  class ProjectDataset
    constructor: (@dataset, @meta={}) ->
      @dataset.reference()
      @meta.color ?= colorPool.next()

      @granuleAccessOptions = ko.asyncComputed({}, 100, @_loadGranuleAccessOptions, this)
      @serviceOptions = new ServiceOptionsModel(@granuleAccessOptions)

    dispose: ->
      colorPool.unuse(@meta.color) if colorPool.has(@meta.color)
      @dataset.dispose()
      @serviceOptions.dispose()
      @granuleAccessOptions.dispose()

    _loadGranuleAccessOptions: ->
      console.log "Loading granule access options for #{@dataset.id}"
      $(document).trigger('dataaccessevent', [@dataset.id])
      singleGranuleId = @dataset.granuleQuery.singleGranuleId()
      if singleGranuleId
        params = extend(@dataset.granuleQuery.params(), {echo_granule_id: singleGranuleId})
      else
        params = @dataset.granuleQuery.params()
      ajax
        dataType: 'json'
        url: '/data/options'
        data: params
#        method: 'post'
        retry: => @_loadGranuleAccessOptions()
        success: (data, status, xhr) =>
          console.log "Finished loading access options for #{@dataset.id}"
          @granuleAccessOptions(data)

    fromJson: (jsonObj) ->
      @serviceOptions.fromJson(jsonObj.serviceOptions)

    serialize: ->
      options = @serviceOptions.serialize()
      $(document).trigger('dataaccessevent', [@dataset.id, options])

      id: @dataset.id
      params: param(@dataset.granuleQuery.params())
      serviceOptions: options

  class Project
    constructor: (@query, @loadGranulesOnAdd=true) ->
      @_datasetIds = ko.observableArray()
      @_datasetsById = {}

      @id = ko.observable(null)
      @datasets = ko.computed(read: @getDatasets, write: @setDatasets, owner: this)
      @focusedProjectDataset = ko.observable(null)
      @focus = ko.computed(read: @_readFocus, write: @_writeFocus, owner: this)
      @searchGranulesDataset = ko.observable(null)
      @accessDatasets = ko.computed(read: @_computeAccessDatasets, owner: this, deferEvaluation: true)
      @allReadyToDownload = ko.computed(@_computeAllReadyToDownload, this, deferEvaluation: true)
      @visibleDatasets = ko.computed(read: @_computeVisibleDatasets, owner: this, deferEvaluation: true)

      @serialized = ko.computed
        read: @_toQuery
        write: @_fromQuery
        owner: this
        deferEvaluation: true
      @_pending = ko.observable(null)

    _computeAllReadyToDownload: ->
      return false for ds in @accessDatasets() when !ds.serviceOptions.readyToDownload()
      true

    _computeAccessDatasets: ->
      focused = @focusedProjectDataset()
      if focused
        [focused]
      else
        @_datasetsById[id] for id in @_datasetIds()

    _readFocus: -> @focusedProjectDataset()?.dataset
    _writeFocus: (dataset) ->
      observable = @focusedProjectDataset
      current = observable()
      unless current?.dataset == dataset
        current?.dispose()
        if dataset?
          projectDataset = new ProjectDataset(dataset)
          dataset.makeRecent()
        observable(projectDataset)

    getDatasets: ->
      @_datasetsById[id]?.dataset for id in @_datasetIds()

    setDatasets: (datasets) ->
      datasetIds = []
      datasetsById = {}
      for ds, i in datasets
        id = ds.id
        datasetIds.push(id)
        datasetsById[id] = @_datasetsById[id] ? new ProjectDataset(ds)
      @_datasetsById = datasetsById
      @_datasetIds(datasetIds)
      null

    _computeVisibleDatasets: ->
      datasets = (dataset for dataset in @datasets() when dataset.visible())

      focus = @focus()
      if focus && focus.visible() && datasets.indexOf(focus) == -1
        datasets.push(focus)

      # Other visible datasets not controlled by the project
      for dataset in Dataset.visible()
        datasets.push(dataset) if datasets.indexOf(dataset) == -1
      datasets

    # This seems like a UI concern, but really it's something that spans several
    # views and something we may eventually want to persist with the project or
    # allow the user to alter.
    colorForDataset: (dataset) ->
      return null unless @hasDataset(dataset)

      @_datasetsById[dataset.id].meta.color

    isEmpty: () ->
      @_datasetIds.isEmpty()

    addDataset: (dataset) ->
      id = dataset.id

      @_datasetsById[id] ?= new ProjectDataset(dataset)
      @_datasetIds.remove(id)
      @_datasetIds.push(id)

      # Force results to start being calculated
      dataset.granulesModel.results() if @loadGranulesOnAdd && dataset.has_granules
      null

    removeDataset: (dataset) =>
      id = dataset.id
      @_datasetsById[id]?.dispose()
      delete @_datasetsById[id]
      @_datasetIds.remove(id)
      null

    hasDataset: (other) =>
      @_datasetIds.indexOf(other.id) != -1

    isSearchingGranules: (dataset) =>
      @searchGranulesDataset() == dataset

    fromJson: (jsonObj) ->
      datasets = null
      if jsonObj.datasets?
        datasets = {}
        datasets[ds.id] = ds for ds in jsonObj.datasets
      @_pendingAccess = datasets
      @serialized(deparam(jsonObj.query))

    serialize: (datasets=@datasets) ->
      datasets = (ds.serialize() for ds in @accessDatasets())
      {query: param(@serialized()), datasets: datasets, source: urlUtil.realQuery()}

    getProjectDataset: (id) ->
      focus = @focusedProjectDataset()
      if focus?.dataset.id == id
        focus
      else
        @_datasetsById[id]

    _toQuery: ->
      return @_pending() if @_pending()?
      result = $.extend({}, @query.serialize())
      datasets = [@focus()].concat(@datasets())
      ids = (ds?.id ? '' for ds in datasets)
      if datasets.length > 1 || datasets[0]
        queries = [{}]
        result.p = ids.join('!')
        start = 1
        start = 0 if @focus() && !@hasDataset(@focus())
        for dataset, i in datasets[start...]
          query = dataset.granuleQuery.serialize()
          query.v = 't' if (i + start) != 0 && dataset.visible()
          queries[i + start] = query
        result.pg = queries if queries.length > 0
      result

    _fromQuery: (value) ->
      @query.fromJson(value)

      datasetIdStr = value.p
      if datasetIdStr
        singleGranuleId = value.sgd
        if datasetIdStr != @_datasetIds().join('!')
          datasetIds = datasetIdStr.split('!')
          focused = !!datasetIds[0]
          datasetIds.shift() unless focused
          @_pending(value)
          value.pg ?= []
          value.pg[0] ?= {}

          # if focused dataset id is duplicated in params, copy query
          if focused
            for id, i in datasetIds
              if i > 0 && id == datasetIds[0]
                value.pg[0] = value.pg[i]

          DatasetsModel.forIds datasetIds, @query, (datasets) =>
            @_pending(null)
            pending = @_pendingAccess ? {}
            offset = 0
            offset = 1 unless focused
            queries = value["pg"] ? []
            for dataset, i in datasets
              query = queries[i + offset]
              if query?
                dataset.granuleQuery.fromJson(query)
                dataset.granuleQuery.singleGranuleId(singleGranuleId) if singleGranuleId?
                dataset.visible(true) if query.v == 't'
              if i == 0 && focused
                @focus(dataset)
              else
                @addDataset(dataset)
              dataset.dispose() # forIds ends up incrementing reference count
              @getProjectDataset(dataset.id).fromJson(pending[dataset.id]) if pending[dataset.id]
            @_pendingAccess = null
      else
        @datasets([])

  exports = Project
