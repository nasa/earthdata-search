ns = @edsc.models.ui

ns.GranulesList = do ($=jQuery, config = @edsc.config)->

  class GranulesList
    constructor: (@collection) ->
      @collection.reference()

      @_wasVisible = @collection.visible()
      @collection.visible(true)

      @granules = ko.computed =>
        @collection.granuleDatasource()?.data()

      @_hasFocus = ko.observable(false)
      @focused = ko.observable(null)
      @stickied = ko.observable(null)
      @loadingBrowse = ko.observable(false)

      @serialized = ko.computed(read: @_readSerialized, write: @_writeSerialized, owner: this, deferEvaluation: true)

      @_pendingSticky = ko.observable(null)
      @_setStickyComputed = ko.computed(read: @_setSticky, owner: this)

      @_hasSelected = ko.observable(false)
      @selected = ko.observable(null)

      @fixOverlayHeight = ko.computed =>
        $('.master-overlay').masterOverlay('contentHeightChanged') if @selected()?.detailsLoaded?()

      @_constructWithDom()

    _constructWithDom: =>
      $map = $('#map')
      map = $map.data('map')

      # Fix timing issue with construction where
      # this list can be created before the map
      # generally hosing the workspace
      unless map?
        setTimeout(@_constructWithDom, 0)
        return

      @_map = map.map
      @_map.on 'edsc.focusgranule', @_onFocusGranule
      @_map.on 'edsc.stickygranule', @_onStickyGranule
      @_map.on 'edsc.excludestickygranule', @_onRemoveStickyGranule

      $granuleList = $('#granule-list')
      $granuleList.on 'keydown', @_onKeyDown
      $map.on 'keydown', @_onKeyDown

      $granuleList.on 'focusout', (e) =>
        @_hasFocus(false)
      $granuleList.on 'focusin', (e) =>
        # We want click behavior when we have focus, but not when the focus came from the
        # click's mousedown.  Ugh.
        setTimeout((=> @_hasFocus(true)), 500)

      @_setupSwipeEvents($granuleList)
      map.focusCollection(@collection)

    dispose: ->
      map = $('#map').data('map')
      map.focusCollection(null)

      @_map.off 'edsc.focusgranule', @_onFocusGranule
      @_map.off 'edsc.stickygranule', @_onStickyGranule
      @_map.off 'edsc.excludestickygranule', @_onRemoveStickyGranule
      @collection.visible(@_wasVisible)
      @collection.dispose()
      @_setStickyComputed.dispose()
      @stickied(null)

    _setupSwipeEvents: ($granuleList) ->
      x0 = 0
      y0 = 0
      self = this
      $granuleList.on 'touchstart', '.panel-list-item', (e) ->
        original = e.originalEvent
        return unless original.touches?.length == 1
        touch = original.touches[0]

        x0 = touch.clientX
        y0 = touch.clientY

      $granuleList.on 'touchmove', '.panel-list-item', (e) ->
        original = e.originalEvent
        return unless original.touches?.length == 1
        touch = original.touches[0]

        dx = x0 - touch.clientX
        if dx > Math.abs(touch.clientY - y0)
          e.preventDefault()
          $(this).css(transform: "translateX(#{-dx}px)")

      $granuleList.on 'touchend', '.panel-list-item', (e) ->
        original = e.originalEvent
        return unless original.touches?.length == 0 && original.changedTouches?.length == 1
        touch = original.changedTouches[0]

        dx = x0 - touch.clientX
        if dx > Math.abs(touch.clientY - y0)
          x0 = 0
          y0 = 0
          if 3 * dx > this.clientWidth
            $(this).css(transform: "translateX(-1000px)")
            granule = ko.dataFor(this)
            setTimeout((-> self.removeGranule(granule)), config.defaultAnimationDurationMs)
          else
            $(this).css(transform: "")

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @granules().loadNextPage()

    _setSticky: ->
      if @stickied()
        @_pendingSticky(null)
        return

      id = @_pendingSticky()
      return unless id

      for granule in @granules().results()
        if granule.id == id
          @_pendingSticky(null)

          # Set timeout to ensure the list renders before we try scrolling to it
          setTimeout((=> @_map.fire 'edsc.stickygranule', granule: granule), 0)
          if @_hasSelected()
            @selected(granule)
            @selected().details()
          return

    _readSerialized: ->
      @_pendingSticky() ? @stickied()?.id

    _writeSerialized: (serialized) ->
      if serialized != (@_pendingSticky.peek() ? @stickied.peek()?.id)
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
          if offset?
            scroll = $(selected).offset().top + $(list).scrollTop() - parseInt(offset)
            $(list).animate({scrollTop : scroll }, edsc.config.defaultAnimationDurationMs, 'swing')

    _onKeyDown: (e) =>
      return true if e.target.id == 'granule-ids'
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
        granules = @granules().results()
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
      if (!config.allowTouch || !L.Browser.touch) && granule != @focused()
        @_map.fire 'edsc.focusgranule', granule: granule

    onGranuleMouseout: (granule) =>
      if (!config.allowTouch || !L.Browser.touch) && granule == @focused()
        @_map.fire 'edsc.focusgranule', granule: null

    isStickied: (granule) =>
      granule == @stickied()

    toggleStickyFocus: (granule, e) =>
      isStickied = @isStickied(granule)

      return if isStickied && !@_hasFocus()
      return true if $(e?.target).closest('a').length > 0
      granule = null if isStickied
      # IE9 needs this for timing reasons despite it being set by knockout
      $(e.target).closest('.panel-list-item').toggleClass('panel-list-selected', !isStickied)
      @_map.fire 'edsc.stickygranule', granule: granule

    canRemoveGranules: ->
      @collection.granuleDatasource()?.hasCapability('excludeGranules')

    removeGranule: (granule, e) =>
      return unless @canRemoveGranules()

      granules = @granules().results()
      index = granules.indexOf(granule)
      newGranule = granules[index + 1]
      newGranule = granules[index - 1] unless newGranule?

      if granule == @focused()
        @_map.fire('edsc.focusgranule', granule: newGranule)
      if granule == @stickied()
        @_map.fire('edsc.stickygranule', scroll: false, granule: newGranule ? null)
      @granules().exclude(granule)
      @scrolled(null, target: document.getElementById('granules-scroll'))

    undoExcludeGranule: =>
      granule = @granules().undoExclude()

      if @focused()
        @_map.fire('edsc.focusgranule', granule: granule)
      if @stickied()
        @_map.fire('edsc.stickygranule', scroll: false, granule: granule ? null)

    _onRemoveStickyGranule: (e) =>
      @removeGranule(@stickied(), e)

    clearExclusions: => @granules().clearExclusions()

    showGranuleDetails: (granule, event=null) =>
      @_map.fire 'edsc.stickygranule', granule: granule
      @selected(granule) unless @selected() == granule

    hideGranuleDetails: (event=null) =>
      if @selected()
        @_unselectTimeout = setTimeout((=> @selected(null)), config.defaultAnimationDurationMs)

    state: (selected) ->
      @_hasSelected(selected)

    clearGranuleIds: =>
      @granules().query.granuleIds('')

  exports = GranulesList
