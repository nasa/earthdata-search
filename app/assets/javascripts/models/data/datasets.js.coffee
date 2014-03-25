#= require models/data/xhr_model
#= require models/data/dataset

ns = @edsc.models.data

ns.Datasets = do (ko
                  getJSON=jQuery.getJSON
                  XhrModel=ns.XhrModel
                  Dataset=ns.Dataset
                  ) ->

  class DatasetsModel extends XhrModel
    constructor: (query) ->
      #super('http://localhost:3002/datasets')
      super('/datasets.json', query)

      @details = ko.observable({})
      @detailsLoading = ko.observable(false)
      @visibleDatasets = @computed(@_computeVisibleDatasets, this, deferEvaluation: true)
      @allDatasetsVisible = ko.observable(false)

    _toResults: (data, current, params) ->
      query = @query
      entries = data.feed.entry
      newItems = (Dataset.findOrCreate(entry, query) for entry in entries)

      if params.page_num > 1
        current.concat(newItems)
      else
        dataset.dispose() for dataset in current
        newItems

    showDataset: (dataset, callback) =>
      id = dataset.id()

      path = "/datasets/#{id}.json"
      console.log("Request: #{path}", this)
      @detailsLoading(true)
      getJSON path, (data) =>
        details = data['dataset']
        details.summaryData = dataset
        @details(details)
        @detailsLoading(false)
        callback?(details)

    _computeVisibleDatasets: =>
      dataset for dataset in @results() when dataset.visible()

    toggleVisibleDataset: (dataset) =>
      dataset.visible(!dataset.visible())

    toggleViewAllDatasets: (datasets) =>
      visible = !@allDatasetsVisible()
      for dataset in datasets()
        dataset.visible(visible)
      @allDatasetsVisible(visible)

  exports = DatasetsModel