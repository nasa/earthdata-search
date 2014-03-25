#= require models/ui/granules_list

ns = @edsc.models.ui

ns.DatasetsList = do ($=jQuery, GranulesList=ns.GranulesList) ->

  class DatasetsList
    constructor: (@query, @datasets) ->
      @focused = ko.observable(null)

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @datasets.loadNextPage(@query.params())

    showDatasetDetails: (dataset, event=null) =>
      @datasets.showDataset dataset, ->
        $('.master-overlay').masterOverlay('contentHeightChanged')

    focusDataset: (dataset, event=null) =>
      return true if $(event?.target).closest('a').length > 0
      return false unless dataset.has_granules()

      @focused()?.dispose()
      @focused(new GranulesList(dataset))

    unfocusDataset: (dataset, event=null) =>
      @focused()?.dispose()
      setTimeout((=> @focused(null)), 400)

  exports = DatasetsList