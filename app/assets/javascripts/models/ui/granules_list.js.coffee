ns = @edsc.models.ui

ns.GranulesList = do ($=jQuery)->

  class GranulesList
    constructor: (@dataset) ->
      @dataset.reference()

      @_wasVisible = @dataset.visible()
      @dataset.visible(true)

      @granules = @dataset.granulesModel
      $map = $('#map')
      map = $map.data('map')
      @_map = map.map
      @_map.on 'edsc.focusgranule', @_onFocusGranule
      @_map.on 'edsc.stickygranule', @_onStickyGranule
      @_map.on 'edsc.excludestickygranule', @_onRemoveStickyGranule
      $granuleList = $('#granule-list')
      $granuleList.on 'keydown', @_onKeyDown
      $map.on 'keydown', @_onKeyDown

      @_hasFocus = false
      $granuleList.on 'blur', (e) =>
        @_hasFocus = false
      $granuleList.on 'focus.panel-list-item', (e) =>
        # We want click behavior when we have focus, but not when the focus came from the
        # click's mousedown.  Ugh.
        setTimeout((=> @_hasFocus = true), 500)

      map.focusDataset(@dataset)

      @focused = ko.observable(null)
      @stickied = ko.observable(null)
      @loadingBrowse = ko.observable(false)

      @serialized = ko.computed(read: @_readSerialized, write: @_writeSerialized, owner: this, deferEvaluation: true)

      @_pendingSticky = ko.observable(null)
      @_setStickyComputed = ko.computed(read: @_setSticky, owner: this)

    dispose: ->
      map = $('#map').data('map')
      map.focusDataset(null)

      @_map.off 'edsc.focusgranule', @_onFocusGranule
      @_map.off 'edsc.stickygranule', @_onStickyGranule
      @_map.off 'edsc.excludestickygranule', @_onRemoveStickyGranule
      @dataset.visible(@_wasVisible)
      @dataset.dispose()
      @_setStickyComputed.dispose()
      @stickied(null)

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @granules.loadNextPage()

    _setSticky: ->
      if @stickied()
        @_pendingSticky(null)
        return

      id = @_pendingSticky()
      return unless id

      for granule in @granules.results()
        if granule.id == id
          @_pendingSticky(null)
          # Set timeout to ensure the list renders before we try scrolling to it
          setTimeout((=> @_map.fire 'edsc.stickygranule', granule: granule), 0)
          return

    _readSerialized: ->
      @_pendingSticky() ? @stickied()?.id

    _writeSerialized: (serialized) ->
      @stickied(null)
      @_pendingSticky(serialized)

    _onFocusGranule: (e) =>
      @focused(e.granule)

    _onStickyGranule: (e) =>
      lastSelected = $('.panel-list-selected')
      @stickied(e.granule)
      @loadingBrowse(e.granule?)
      if e.granule?
        list = $('#granule-list .master-overlay-content.panel-list')
        topBound = list.offset().top
        bottomBound = topBound + list.height() - 175

        selected = $('.panel-list-selected')
        selectedOffset = selected.offset().top

        if selectedOffset > bottomBound
          offset = bottomBound
        else if selectedOffset < topBound
          offset = topBound + 50

        unless e.scroll == false # Treat undefined as true
          list.scrollTo(selected, {duration: edsc.config.defaultAnimationDurationMs, offsetTop: offset}) if offset?

    _onKeyDown: (e) =>
      stickied = @stickied()
      key = e.keyCode
      removalKeys = [
        8,  # Backspace
        46, # Delete
        88  # x -> Best option, really, since "Delete" will trigger the back button when blurred
      ]

      isUp = key == 38
      isDown = key == 40
      isRemoval = removalKeys.indexOf(key) != -1

      e.preventDefault() if isUp || isDown || isRemoval

      if stickied
        granules = @granules.results()
        index = granules.indexOf(stickied)
        return if index == -1

        if isUp || isDown
          return if (isUp && index == 0) || (isDown && index == granules.length - 1)
          granule = granules[index - 1] if isUp
          granule = granules[index + 1] if isDown
          @_map.fire 'edsc.stickygranule', granule: granule
          e.stopPropagation()

        if isRemoval
          @removeGranule(granules[index])

    finishLoad: =>
      @loadingBrowse(false)

    onGranuleMouseover: (granule) =>
      if granule != @focused()
        @_map.fire 'edsc.focusgranule', granule: granule

    onGranuleMouseout: (granule) =>
      if granule == @focused()
        @_map.fire 'edsc.focusgranule', granule: null

    isStickied: (granule) =>
      granule == @stickied()

    toggleStickyFocus: (granule, e) =>
      return if @isStickied(granule) && !@_hasFocus
      return true if $(e?.target).closest('a').length > 0
      granule = null if @isStickied(granule)
      @_map.fire 'edsc.stickygranule', granule: granule

    removeGranule: (granule, e) =>
      granules = @granules.results()
      index = granules.indexOf(granule)
      newGranule = granules[index + 1]
      newGranule = granules[index - 1] unless newGranule?

      if granule == @focused()
        @_map.fire('edsc.focusgranule', granule: newGranule)
      if granule == @stickied()
        @_map.fire('edsc.stickygranule', scroll: false, granule: newGranule ? null)
      @granules.exclude(granule)

    undoExcludeGranule: =>
      granule = @granules.undoExclude()

      if @focused()
        @_map.fire('edsc.focusgranule', granule: granule)
      if @stickied()
        @_map.fire('edsc.stickygranule', scroll: false, granule: granule ? null)

    _onRemoveStickyGranule: (e) =>
      @removeGranule(@stickied(), e)

    clearExclusions: =>
      @granules.excludedGranulesList([])
      @granules.query.excludedGranules([])

  exports = GranulesList
