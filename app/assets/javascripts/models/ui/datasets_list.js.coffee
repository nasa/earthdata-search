#= require models/ui/granules_list

ns = @edsc.models.ui

ns.DatasetsList = do (GranulesList=ns.GranulesList) ->

  class DatasetsList
    constructor: (@query, @datasets) ->
      @focused = ko.observable(null)

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @datasets.loadNextPage(@query.params())

    clickDataset: (dataset, event=null) =>
      @datasets.showDataset(dataset)

    focusDataset: (dataset, event=null) =>
      dataset = dataset.clone()
      @focused(new GranulesList(dataset))
      @datasets.addVisibleDataset(dataset)

    unfocusDataset: (dataset, event=null) =>
      focused = @focused()
      if focused?
        @datasets.removeVisibleDataset(focused.dataset)
        focused.dispose()
      setTimeout((=> @focused(null)), 400)

  exports = DatasetsList