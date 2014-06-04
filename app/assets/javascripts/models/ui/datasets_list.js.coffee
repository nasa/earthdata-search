#= require models/ui/granules_list

ns = @edsc.models.ui
data = @edsc.models.data

ns.DatasetsList = do ($=jQuery, DatasetsModel=data.Datasets, GranulesList=ns.GranulesList) ->

  class DatasetsList
    constructor: (@query, @datasets, @project) ->
      @_hasFocus = ko.observable(false)
      @_focusedList = null
      @focused = ko.computed
        read: @_readFocused
        write: @_writeFocused
        owner: this

      @_hasSelected = ko.observable(false)
      @selected = ko.computed
        read: @_readSelected
        write: @_writeSelected
        owner: this

      @fixOverlayHeight = ko.computed =>
        $('.master-overlay').masterOverlay('contentHeightChanged') if @selected()?.detailsLoaded?()

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
      @selected(dataset) unless @selected() == dataset

    focusDataset: (dataset, event=null) =>
      return true if $(event?.target).closest('a').length > 0
      return false unless dataset.has_granules
      return false if @focused()?.dataset.id == dataset.id

      @focused(new GranulesList(dataset))

    unfocusDataset: =>
      if @focused()?
        setTimeout((=> @focused(null)), 400)

    _readFocused: ->
      current = @_focusedList
      dataset = @project.focus()
      if !@_hasFocus() || !dataset?
        current?.dispose()
        @_focusedList = null
      else if current?.dataset != dataset
        current?.dispose()
        @_focusedList = new GranulesList(dataset)
      @_focusedList

    _writeFocused: (focus) ->
      @_hasFocus(focus?)
      @_focusedList?.dispose()
      @_focusedList = focus
      @project.focus(focus?.dataset) unless @_hasSelected()

    _readSelected: ->
      if @_hasSelected()
        selected = @project.focus()
        selected?.details()
        selected

    _writeSelected: (selected) ->
      @project.focus(selected) unless @project.focus.peek() == selected
      @_hasSelected(selected?)

    _toQuery: ->
      focused: @_hasFocus()
      selected: @_hasSelected()

    _fromQuery: (value) ->
      @_hasFocus(value.focused)
      @_hasSelected(value.selected)

  exports = DatasetsList
