ns = @edsc.models.ui

ns.GranulesList = do ($=jQuery)->

  class GranulesList
    constructor: (@dataset) ->
      @granules = @dataset.granulesModel
      @_map = $('#map').data('map').map
      @_map.on 'edsc.focusgranule', @_onFocusGranule
      @focused = ko.observable(null)
      @stickied = ko.observable(null)

    dispose: ->
      @_map.off 'edsc.focusgranule', @_onFocusGranule
      @dataset.dispose()

    scrolled: (data, event) =>
      elem = event.target
      if (elem.scrollTop > (elem.scrollHeight - elem.offsetHeight - 40))
        @granules.loadNextPage()

    _onFocusGranule: (e) =>
      granule = e.granule
      sticky = e.sticky
      @focused(e.granule)
      stickied = @stickied()
      if stickied == granule && sticky == false
        @stickied(null)
      else if stickied != granule && sticky
        @stickied(granule)

    onGranuleMouseover: (granule) =>
      if granule != @focused()
        @_map.fire 'edsc.focusgranule', granule: granule

    onGranuleMouseout: (granule) =>
      if granule == @focused()
        @_map.fire 'edsc.focusgranule', granule: null

    isStickied: (granule) =>
      granule == @stickied()

    toggleStickyFocus: (granule) =>
      @_map.fire 'edsc.focusgranule', granule: granule, sticky: (@stickied() != granule)

  exports = GranulesList
