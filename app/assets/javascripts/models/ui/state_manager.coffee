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
      @overlayState.subscribe(@_onOverlayStateChange, this)
      @path = ko.computed(read: @_readPath, write: @_writePath, owner: this)
      @historyChanged = false
      @loaded = false

    monitor: ->
      @loadFromUrl()
      $(document).ready(@_onReady)
      $(window).on 'edsc.pagechange', @loadFromUrl

    serialize: ->
      result = {}
      result = extend(result, @page.project.serialized())
      result

    load: (params) ->
      @page.project.serialized(params)
      unless @loaded
        @loaded = true
        ko.computed(@_persistStateInUrl, this).extend(throttle: config.xhrRateLimitMs)

    loadFromUrl: =>
      unless @page.ui.isLandingPage() # Avoid problem where switching to /search overwrites uncommited search conditions
        @path(window.location.pathname)
        @load(deparam(window.location.search.substring(1)))

    _onReady: =>
      @loadFromUrl()
      $overlay = $('.master-overlay')
      $overlay.masterOverlay()
      @overlay = $overlay.data('master-overlay')
      @overlayState(@overlay.state())
      $overlay.on 'edsc.olstatechange', => @overlayState(@overlay.state())
      ko.computed => @overlay.state(@overlayState())

    _onOverlayStateChange: (state) ->
      @page.ui.projectList.visible(state.current == 'project-overview')
      @_toggleWithTimeout('facets', @page.datasetFacets.isRelevant, state.visible && state.parent)
      @_toggleWithTimeout('datasets', @page.datasets.isRelevant, state.visible && state.current == 'dataset-results')

    # The following two methods read a path from and write a path to the master overlay state, respectively
    #
    # Paths are as follows:
    #   / - The landing page
    #   /search - The search page with browse datasets and dataset list open
    #   /search/map - The search page with the overlays closed
    #   /search/datasets - The search page with browse datasets closed
    #   /search/project - The project page
    #   /search(/project)?/:id/granules - The granule results page for the given dataset id
    #   /search(/project)?/:id(/granules)?/details - The dataset details page for the given dataset id
    #
    # Note this is not perfect serialization of the overlay state.  In particular, hiding the overlay and reloading
    # from a bookmark will not save information on the state of the hidden overlay.  This is fixable, but doesn't
    # seem worthwhile to fix.

    _readPath: ->
      state = @overlayState()
      return '/' if !state? || @page.ui.isLandingPage()

      root = '/search'

      return root if state.parent
      return "#{root}/map" unless state.visible
      return "#{root}/datasets" if state.current == 'dataset-results'

      root += '/project' if state.children.indexOf('project-overview') != -1
      return root if state.current == 'project-overview'

      {selected, focused} = @page.ui.datasetsList.serialized()

      root += "/#{selected ? focused}"
      root += "/granules" if state.children.indexOf('granule-list') != -1
      return root if state.current == 'granule-list'
      return "#{root}/details" if state.current == 'dataset-details'

      console.error 'Unrecognized overlay state: #{JSON.stringify(state)}'
      root

    _writePath: (path) ->
      unless path.indexOf('/search') == 0
        return

      # Default state
      state = @overlayState.peek() ?
        visible: true
        parent: true
        secondary: false
        children: null
        current: 'dataset-results'

      datasetsList = {}

      components = path[1...].split('/')

      children = ['dataset-results']

      component = components.shift() # 'search'
      component = components.shift()

      state.visible = component != 'map'
      state.parent = !component
      state.current = 'dataset-results' if component == 'datasets' || state.parent

      if component == 'project'
        children.push('project-overview')
        state.current = 'project-overview'
        component = components.shift()

      if component?.indexOf('C') == 0
        id = component
        if components.indexOf('granules') != -1
          children.push('granule-list')
          datasetsList.focused = id
          state.current = 'granule-list'
        if components.indexOf('details') != -1
          datasetsList.selected = id
          state.current = 'dataset-details'

      children.push('dataset-details')
      state.children = children

      @page.ui.datasetsList.serialized(datasetsList)
      @overlayState(state)

    _toggleWithTimeout: (key, observable, bool) ->
      @_timeouts ?= {}
      clearTimeout(@_timeouts[key])
      if bool
        observable(true)
      else
        @_timeouts[key] = setTimeout((-> observable(false)), config.defaultAnimationDurationMs)

    _persistStateInUrl: ->
      @historyChanged = true if urlUtil.saveState(@path(), @serialize(), !@historyChanged)

  exports = StateManager
