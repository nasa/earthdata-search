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
