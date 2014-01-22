ns = @edsc.models.ui

ns.DatasetsList = do ($=jQuery) ->
  class DatasetsList
    constructor: (@query, @datasets) ->

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @datasets.loadNextPage(@query.params())

    clickDataset: (dataset, event=null) =>
      source = event?.target

      if !source? || $(source).closest('a').length == 0
        @datasets.showDataset(dataset)

  exports = DatasetsList