#= require util/url
#= require util/deparam

@edsc.models.ui.StateManager = do (window
                                   document
                                   extend = $.extend
                                   config = @edsc.config
                                   urlUtil = @edsc.util.url
                                   deparam = @edsc.util.deparam) ->

  class StateManager
    constructor: (@page) ->
      first = true
      @overlayState = ko.observable(null)
      @historyChanged = false
      @loaded = false

    monitor: ->
      @overlayState.subscribe @_onOverlayStateChange, this
      @loadFromUrl()
      $(document).ready(@_onReady)
      $(window).on 'edsc.pagechange', @loadFromUrl

    serialize: ->
      result = {}
      result = extend(result, @page.project.serialized(), @page.ui.datasetsList.serialized())
      result.o = @overlayState() if @overlayState()
      result

    load: (params) ->
      @page.project.serialized(params)
      @page.ui.datasetsList.serialized(params)
      @overlayState(params.o)
      unless @loaded
        @loaded = true
        ko.computed(@_persistStateInUrl, this).extend(throttle: config.xhrRateLimitMs)

    loadFromUrl: =>
      unless @page.ui.isLandingPage() # Avoid problem where switching to /search overwrites uncommited search conditions
        @load(deparam(window.location.search.substring(1)))

    _onReady: =>
      @loadFromUrl()
      $overlay = $('.master-overlay')
      $overlay.masterOverlay()
      @overlay = $overlay.data('master-overlay')
      $overlay.on 'edsc.olstatechange', => @overlayState(@overlay.state())
      ko.computed => @overlay.state(@overlayState())

    _persistStateInUrl: ->
      @persistStateInUrl = true if urlUtil.saveState(@serialize(), !@historyChanged)

    _onOverlayStateChange: (state) ->
      {datasets, datasetFacets, ui} = @page
      if first
        first = false
        return
      if !state
        datasetFacets.isRelevant(true)
        datasets.isRelevant(true)
        return
      if state[0] == 'f'
        datasetFacets.isRelevant(false)
        datasets.isRelevant(false)
        return
      if state[1] == 't'
        datasetFacets.isRelevant(true)
      else
        setTimeout((-> datasetFacets.isRelevant(false)), config.defaultAnimationDurationMs)
      ui.projectList.visible(state[3] == 't' && state[7] == '1')
      if state[7] == '0'
        datasets.isRelevant(true)
      else
        setTimeout((=> datasets.isRelevant(false)), config.defaultAnimationDurationMs)

  exports = StateManager
