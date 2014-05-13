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

    _toResults: (data, current, params) ->
      query = @query
      entries = data.feed.entry
      newItems = (Dataset.findOrCreate(entry, query) for entry in entries)

      if params.page_num > 1
        current.concat(newItems)
      else
        dataset.dispose() for dataset in current
        newItems

    toggleVisibleDataset: (dataset) =>
      dataset.visible(!dataset.visible())

  exports = DatasetsModel
