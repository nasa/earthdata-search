#= require models/data/datasets
#= require models/data/dataset

ns = @edsc.models.data

ns.Project = do (ko,
                 extend = $.extend,
                 param = $.param,
                 QueryModel = ns.query.DatasetQuery,
                 DatasetsModel = ns.Datasets
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

    dispose: ->
      colorPool.unuse(@meta.color) if colorPool.has(@meta.color)
      @dataset.dispose()

  class Project
    constructor: (@query) ->
      @_datasetIds = ko.observableArray()
      @_datasetsById = {}

      @id = ko.observable(null)
      @datasets = ko.computed(read: @getDatasets, write: @setDatasets, owner: this)
      @focus = ko.observable(null)
      @searchGranulesDataset = ko.observable(null)
      @allReadyToDownload = ko.computed(@_computeAllReadyToDownload, this, deferEvaluation: true)

      @serialized = ko.computed
        read: @_toQuery
        write: @_fromQuery
        owner: this

    _computeAllReadyToDownload: ->
      result = true
      for ds in @datasets()
        result = false if !ds.serviceOptions.readyToDownload()
      result

    getDatasets: ->
      @_datasetsById[id]?.dataset for id in @_datasetIds()

    setDatasets: (datasets) ->
      datasetIds = []
      datasetsById = {}
      for ds, i in datasets
        id = ds.id
        datasetIds.push(id)
        datasetsById[id] = new ProjectDataset(ds)
      @_datasetsById = datasetsById
      @_datasetIds(datasetIds)
      null

    # This seems like a UI concern, but really it's something that spans several
    # views and something we may eventually want to persist with the project or
    # allow the user to alter.
    colorForDataset: (dataset) ->
      return null unless @hasDataset(dataset)

      @_datasetsById[dataset.id].meta.color

    isEmpty: () ->
      @_datasetIds.isEmpty()

    addDataset: (dataset) =>
      id = dataset.id

      @_datasetsById[id] ?= new ProjectDataset(dataset)
      @_datasetIds.remove(id)
      @_datasetIds.push(id)

      # Force results to start being calculated
      dataset.granulesModel.results() if dataset.has_granules

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

    clearSearchGranules: =>
      @searchGranulesDataset(null)

    fromJson: (jsonObj) ->
      query = @query

      query.fromJson(jsonObj.datasetQuery)

      @datasets(Dataset.findOrCreate(dataset, query) for dataset in jsonObj.datasets)

      new DatasetsModel(@query).search {echo_collection_id: @_datasetIds()}, (results) =>
        for result in results
          dataset = @_datasetsById[result.id]
          if dataset?
            dataset.dataset.fromJson(result.json)

    serialize: (datasets=@datasets) ->
      datasetQuery: @query.serialize()
      datasets: (ds.serialize() for ds in datasets)

    _toQuery: ->
      result = $.extend({}, @query.serialize())
      datasets = [@focus()].concat(@datasets())
      ids = (ds?.id ? '' for ds in datasets)
      if datasets.length > 1 || datasets[0]
        result.p = ids.join('!')
        start = 1
        start = 0 if @focus() && !@hasDataset(@focus())
        for dataset, i in datasets[start...]
          query = dataset?.granuleQuery.serialize()
          result["p#{i + start}"] = query if query
      result

    _fromQuery: (value) ->
      @query.fromJson(value)

      datasetIdStr = value.p
      if datasetIdStr
        if datasetIdStr != @_datasetIds().join('!')
          datasetIds = datasetIdStr.split('!')
          focused = !!datasetIds[0]
          datasetIds.shift() unless focused
          DatasetsModel.forIds datasetIds, @query, (datasets) =>
            for dataset, i in datasets
              query = value["p#{i}"]
              dataset.granuleQuery.fromJson(query) if query?
              if i == 0 && focused
                @focus(dataset)
              else
                @addDataset(dataset)
      else
        @datasets([])

  exports = Project
