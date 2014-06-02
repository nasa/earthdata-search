#= require models/ui/granules_list

ns = @edsc.models.ui
data = @edsc.models.data

ns.DatasetsList = do ($=jQuery, DatasetsModel=data.Datasets, GranulesList=ns.GranulesList) ->

  class DatasetsList
    constructor: (@query, @datasets) ->
      @focused = ko.observable(null)
      @selected = ko.observable({})
      @fixOverlayHeight = ko.computed =>
        $('.master-overlay').masterOverlay('contentHeightChanged') if @selected().detailsLoaded?()

      @serialized = ko.computed
        read: @_toQuery
        write: @_fromQuery
        owner: this

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @datasets.loadNextPage(@query.params())

    showDatasetDetails: (dataset, event=null) =>
      @selected(dataset)
      # load the details
      @selected().details()

    focusDataset: (dataset, event=null) =>
      return true if $(event?.target).closest('a').length > 0
      return false unless dataset.has_granules
      return false if @focused()?.dataset.id == dataset.id

      @focused()?.dispose()
      @focused(new GranulesList(dataset))

    unfocusDataset: =>
      if @focused()?
        @focused().dispose()
        setTimeout((=> @focused(null)), 400)

    _toQuery: ->
      result = {}
      result.foc = @focused().dataset.id if @focused()?
      result.sel = @selected().id if @selected().id?
      result

    _fromQuery: (value) ->
      if value.foc? || value.sel?
        ids = [value.foc, value.sel]
        ids = [value.foc] if value.foc == value.sel
        ids = (id for id in ids when id?)
        DatasetsModel.forIds ids, @query, (datasets) =>
          for dataset in datasets
            @focusDataset(dataset) if value.foc == dataset.id
            @showDatasetDetails(dataset) if value.sel == dataset.id

      @unfocusDataset() unless value.foc?


  exports = DatasetsList
