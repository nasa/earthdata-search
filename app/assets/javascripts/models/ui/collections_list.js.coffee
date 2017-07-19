#= require models/ui/granules_list

ns = @edsc.models.ui
data = @edsc.models.data

ns.CollectionsList = do ($ = jQuery
                      document
                      config = @edsc.config
                      CollectionsModel = data.Collections
                      GranulesList = ns.GranulesList
                      edscplugin = @edscplugin
                      ajax = @edsc.util.xhr.ajax
                      ) ->

  class CollectionsList
    constructor: (@query, @collections, @project) ->
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

      @resetScrollOnUpdate()

    resetScrollOnUpdate: ->
      id = -1
      ko.computed =>
        collections = @collections
        if !collections.isLoading() && id != collections.completedRequestId && collections.page == 1
          id = collections.completedRequestId
          document.getElementById('collection-scroll-pane')?.scrollTop = 0

    toggleBrowseImage: ->
      event.stopPropagation();
      if $('#toggleBrowseImageButton').html().indexOf("fa-close") >= 0
        $('#toggleBrowseImageButton').html('<span class="fa-stack open-browse"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-plus fa-stack-1x fa-inverse"></i></span>')
      else
        $('#toggleBrowseImageButton').html('<span class="fa-stack"><i class="fa fa-circle fa-stack-2x"></i><i class="fa fa-close fa-stack-1x fa-inverse"></i></span>')
      $('#browseImageDiv').toggle('fast');

    escapePortal: (data, event) ->
      href = window.location.href.replace(/\/portal\/[\w]+/, '')
      window.location.href = href

    scrolled: (data, event) =>
      elem = event.target
      if @collections.isRelevant() && (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @collections.loadNextPage(@query.params())

    showCollectionDetails: (collection, event=null) =>
      @selected(collection) unless @selected() == collection

    hideCollectionDetails: (event=null) =>
      if @selected()?
        @_unselectTimeout = setTimeout((=> @selected(null)), config.defaultAnimationDurationMs)

    toggleButtonGroup: (data, event) ->
      $(event.currentTarget).parent().find('.dropdown').toggle()

    focusCollection: (collection, event=null) =>
      query = @query.params()
      collections = @collections.results().map (collection) -> collection.id
      index = @collections.results().indexOf(collection)

      exactMatch = switch query.original_keyword?.toLowerCase()
        when collection.dataset_id?.toLowerCase() then true
        when collection.id?.toLowerCase() then true
        when collection.short_name()?.toLowerCase() then true
        when "#{collection.short_name()?.toLowerCase()}_#{collection.version_id.toLowerCase()}" then true
        when "#{collection.short_name()?.toLowerCase()} #{collection.version_id.toLowerCase()}" then true
        else false

      data =
        query: query
        collections: collections
        selected_index: index
        selected_collection: collection.id
        exact_match: exactMatch

      return true if $(event?.target).closest('a').length > 0
      return false unless collection.canFocus()
      return false if @focused()?.collection.id == collection.id

      ajax
        data: data
        dataType: 'json'
        url: "/collections/collection_relevancy"
        method: 'post'
        success: (data) ->
          console.log data

      @focused(new GranulesList(collection))

      return true


    canQueryCollectionSpatial: (collection) =>
      spatial = @query.spatial()
      constraint = collection.spatial_constraint()
      constraint? && (!spatial || spatial == constraint)

    toggleQueryCollectionSpatial: (collection) =>
      constraint = collection.spatial_constraint()
      spatial = @query.spatial()
      if constraint == spatial
        constraint = ""
      else if collection.points?
        point = collection.points[0].split(/\s+/)
        $('#map').data('map').map.fitBounds([point, point])
      @query.spatial(constraint)
      false

    unfocusCollection: =>
      if @focused()?
        @_unfocusTimeout = setTimeout((=> @focused(null)), config.defaultAnimationDurationMs)

    _readFocused: ->
      current = @_focusedList
      collection = @project.focus()
      if !@_hasFocus() || !collection?
        current?.dispose()
        @_focusedList = null
      else if current?.collection != collection
        current?.dispose()
        clearTimeout(@_unfocusTimeout)
        @_focusedList = new GranulesList(collection)
        @_focusedList.serialized(@pendingSerialized.peek())
        @pendingSerialized(null)
      @_focusedList

    _writeFocused: (focus) ->
      @_hasFocus(focus?)
      @_focusedList?.dispose()
      @_focusedList = focus
      clearTimeout(@_unfocusTimeout)
      collection = focus?.collection
      @project.focus(collection) if collection || !@_hasSelected()

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

  exports = CollectionsList
