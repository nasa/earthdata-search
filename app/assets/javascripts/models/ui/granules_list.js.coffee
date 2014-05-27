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
      # TODO: This shouldn't be on 'body'
      $('body').on 'keydown', @_onKeyDown

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
      @stickied(e.granule)
      @loadingBrowse(e.granule?)

    _onKeyDown: (e) =>
      # TODO: add focus changes from EDSC-323
      stickied = @stickied()
      key = e.keyCode
      up = 38
      down = 40
      if stickied && (key == up || key == down)
        granules = @granules.results()
        index = granules.indexOf(stickied)

        if index > 0 && key == up
          @_map.fire 'edsc.stickygranule', granule: granules[index-1]
        if index < granules.length-1 && key == down
          @_map.fire 'edsc.stickygranule', granule: granules[index+1]

          # scrool height to newly stickied granule?
      # e.preventDefault()


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
      return true if $(e?.target).closest('a').length > 0
      granule = null if @stickied() == granule
      @_map.fire 'edsc.stickygranule', granule: granule

  exports = GranulesList
