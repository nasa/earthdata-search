ns = @edsc.models.ui

ns.GranulesList = do ($=jQuery)->

  class GranulesList
    constructor: (@dataset) ->
      @dataset.reference()

      @_wasVisible = @dataset.visible()
      @dataset.visible(true)

      @granules = @dataset.granulesModel
      map = $('#map').data('map')
      @_map = map.map
      @_map.on 'edsc.focusgranule', @_onFocusGranule
      @_map.on 'edsc.stickygranule', @_onStickyGranule
      $granuleList = $('#granule-list')
      $granuleList.on 'keydown', @_onKeyDown

      @_hasFocus = false
      $granuleList.on 'blur', (e) =>
        @_hasFocus = false
      $granuleList.on 'focus.panel-list-item', (e) =>
        setTimeout((=> @_hasFocus = true), 500)

      map.focusDataset(@dataset)

      @focused = ko.observable(null)
      @stickied = ko.observable(null)
      @loadingBrowse = ko.observable(false)

    dispose: ->
      map = $('#map').data('map')
      map.focusDataset(null)

      @_map.off 'edsc.focusgranule', @_onFocusGranule
      @_map.off 'edsc.stickygranule', @_onStickyGranule
      @dataset.visible(@_wasVisible)
      @dataset.dispose()

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @granules.loadNextPage()

    _onFocusGranule: (e) =>
      @focused(e.granule)

    _onStickyGranule: (e) =>
      lastSelected = $('.panel-list-selected')
      @stickied(e.granule)
      @loadingBrowse(e.granule?)
      if e.granule?
        list = $('.master-overlay-content.panel-list')
        duration = edsc.config.defaultAnimationDurationMs
        if e.key == "map" # scroll till visible
          # TODO: Just scroll until the selected granule is visible
          list.scrollTo('.panel-list-selected',{duration: duration, offsetTop: list.offset().top}) if e.granule?
        else if e.key == "up" || e.key == "down" # scroll one item up/down
          list.scrollTo('.panel-list-selected',{duration: duration, offsetTop: lastSelected.offset().top}) if e.granule?
        # Do nothing for e.key == "mouse"

    _onKeyDown: (e) =>
      stickied = @stickied()
      key = e.keyCode
      up = 38
      down = 40
      if stickied && (key == up || key == down)
        granules = @granules.results()
        index = granules.indexOf(stickied)

        if index > 0 && key == up
          @_map.fire 'edsc.stickygranule', granule: granules[index-1], key: 'up'
        if index < granules.length-1 && key == down
          @_map.fire 'edsc.stickygranule', granule: granules[index+1], key: 'down'

        e.preventDefault()

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
      return if @stickied() && !@_hasFocus
      return true if $(e?.target).closest('a').length > 0
      granule = null if @stickied() == granule
      @_map.fire 'edsc.stickygranule', granule: granule, key: 'mouse'

  exports = GranulesList
