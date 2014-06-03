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
        deferEvaluation: true

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
      focused = @focused()?.dataset.id ? @_pendingFocus
      selected = @selected()?.id ? @_pendingSelect
      result.focused = focused if focused?
      result.selected = selected if selected?
      result

    _fromQuery: (value) ->
      @_pendingFocus = value.focused
      @_pendingSelect = value.selected
      if @_pendingFocus? || @_pendingSelect?
        ids = [@_pendingFocus, @_pendingSelect]
        ids = [ids[0]] if ids[0] == ids[1]
        ids = (id for id in ids when id?)
        DatasetsModel.forIds ids, @query, (datasets) =>
          for dataset in datasets
            @focusDataset(dataset) if @_pendingFocus == dataset.id
            @showDatasetDetails(dataset) if @_pendingSelect == dataset.id
          @_pendingFocus = null
          @_pendingSelect = null

      @unfocusDataset() unless value.focused?


  exports = DatasetsList
