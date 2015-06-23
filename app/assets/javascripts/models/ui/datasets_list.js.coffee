#= require models/ui/granules_list

ns = @edsc.models.ui
data = @edsc.models.data

ns.DatasetsList = do ($=jQuery, document, config = @edsc.config, DatasetsModel=data.Datasets, GranulesList=ns.GranulesList) ->

  class DatasetsList
    constructor: (@query, @datasets, @project) ->
      @pendingSerialized = ko.observable(null)
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
        $('.master-overlay')?.masterOverlay('contentHeightChanged') if @selected()?.detailsLoaded?()

      @serialized = ko.computed
        read: @_readSerialized
        write: @_writeSerialized
        owner: this
        deferEvaluation: true

    scrolled: (data, event) =>
      elem = event.target
      if @datasets.isRelevant() && (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @datasets.loadNextPage(@query.params())

    showDatasetDetails: (dataset, event=null) =>
      @selected(dataset) unless @selected() == dataset

    hideDatasetDetails: (event=null) =>
      if @selected()?
        @_unselectTimeout = setTimeout((=> @selected(null)), config.defaultAnimationDurationMs)

    focusDataset: (dataset, event=null) =>
      return true if $(event?.target).closest('a').length > 0
      return false unless dataset.has_granules
      return false if @focused()?.dataset.id == dataset.id

      @focused(new GranulesList(dataset))

    canQueryDatasetSpatial: (dataset) =>
      spatial = @query.spatial()
      constraint = dataset.spatial_constraint()
      constraint? && (!spatial || spatial == constraint)

    toggleQueryDatasetSpatial: (dataset) =>
      constraint = dataset.spatial_constraint()
      spatial = @query.spatial()
      if constraint == spatial
        constraint = ""
      else if dataset.points?
        point = dataset.points[0].split(/\s+/)
        $('#map').data('map').map.fitBounds([point, point])
      @query.spatial(constraint)
      false

    unfocusDataset: =>
      if @focused()?
        @_unfocusTimeout = setTimeout((=> @focused(null)), config.defaultAnimationDurationMs)

    _readFocused: ->
      current = @_focusedList
      dataset = @project.focus()
      if !@_hasFocus() || !dataset?
        current?.dispose()
        @_focusedList = null
      else if current?.dataset != dataset
        current?.dispose()
        clearTimeout(@_unfocusTimeout)
        @_focusedList = new GranulesList(dataset)
        @_focusedList.serialized(@pendingSerialized.peek())
        @pendingSerialized(null)
      @_focusedList

    _writeFocused: (focus) ->
      @_hasFocus(focus?)
      @_focusedList?.dispose()
      @_focusedList = focus
      clearTimeout(@_unfocusTimeout)
      dataset = focus?.dataset
      @project.focus(dataset) if dataset || !@_hasSelected()

    _readSelected: ->
      if @_hasSelected()
        clearTimeout(@_unselectTimeout)
        selected = @project.focus()
        selected?.details()
        selected

    _writeSelected: (selected) ->
      clearTimeout(@_unselectTimeout)
      @project.focus(selected) if @project.focus.peek() != selected && selected || !@_hasFocus()
      @_hasSelected(selected?)

    _readSerialized: ->
      result = {}
      value = @pendingSerialized() ? @focused()?.serialized()
      result.g = value if value?
      result

    _writeSerialized: (params) ->
      id = params.g
      if @focused()
        @focused().serialized(id)
      else
        @pendingSerialized(id)

    state: (focused, selected) ->
      @_hasFocus(focused)
      @_hasSelected(selected)

    $(document).on 'click', '.description-toggle', (e) =>
      e.preventDefault()
      $('.long-paragraph').toggleClass('expanded')
      $('.description-toggle').find('i').toggleClass('fa-chevron-down')
      $('.description-toggle').find('i').toggleClass('fa-chevron-up')

    $(document).on 'mouseenter', '.description-toggle', (e) =>
      $('.description-toggle').addClass('.active')

  exports = DatasetsList
