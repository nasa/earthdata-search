#= require util/url

@edsc.models.ui.StateManager = do (window
                                   document
                                   extend = $.extend
                                   config = @edsc.config
                                   urlUtil = @edsc.util.url
                                   xhrUtil = @edsc.util.xhr) ->

  class StateManager
    constructor: (@page) ->
      @overlayState = ko.observable(null)
      @isDomLoaded = ko.observable(false)
      @path = ko.computed(read: @_readPath, write: @_writePath, deferEvaluation: true, owner: this)
      @historyChanged = false
      @loaded = false
      @preservedParams = {
        cmr_env: null
        portal: null
        tour: null
        test_facets: null
      }
      @lastKeywords = null

      $(window).on 'edsc.save_workspace', =>
        urlUtil.saveState(@path(), @serialize(), !@historyChanged, @page.workspaceNameField())
        @page.workspaceName(@page.workspaceNameField())
        $('.save-dropdown').removeClass('open')

    monitor: ->
      setTimeout((=>
        @loadFromUrl()
        $(document).ready(@_onReady)
        $(window).on 'edsc.pagechange', @loadFromUrl), 0)

    serialize: ->
      page = @page
      ui = page.ui
      result = {}
      result.labs = page.labs() if page.labs()

      result[k] = v for k, v of @preservedParams when v?

      result = extend(result, page.project.serialized(), ui.collectionsList.serialized())

      if @isDomLoaded()
        serialMap = @page.map.serialized()
        serialTimeline = @page.ui.granuleTimeline.serialized()
      else
        serialMap = @_mapParams
        serialTimeline = @_timelineParams
      result.m = serialMap if serialMap
      result.tl = serialTimeline if serialTimeline
      result

    load: (params) ->
      page = @page
      ui = page.ui

      if page.map
        page.map.serialized(params.m)
        ui.collectionsList.serialized(params)
      else
        @_mapParams = params.m
        @_dsListParams = {g: params.g}

      if ui.granuleTimeline
        ui.granuleTimeline?.serialized(params.tl)
      else
        @_timelineParams = params.tl

      page.labs(params.labs)
      @preservedParams[k] = params[k] for k, _ of @preservedParams

      page.project.serialized(params)

      unless @loaded
        @loaded = true
        ko.computed(@_persistStateInUrl, this).extend(throttle: config.xhrRateLimitMs)

    loadFromUrl: =>
      xhrUtil.wait(@loadFromUrlImmediate)

    loadFromUrlImmediate: =>
      clean = urlUtil.cleanPath()
      if clean
        [path, query] = clean.split('?')
        @path(path)
        @page.workspaceName(urlUtil.getProjectName())
        @page.workspaceNameField(urlUtil.getProjectName())
        @load(urlUtil.currentParams())

    _onReady: =>
      $overlay = $('.master-overlay')
      @overlay = $overlay.data('master-overlay')
      @overlayState(@overlay.state()) unless @overlayState()?
      $overlay.on 'edsc.olstatechange', => @overlayState(@overlay.state())
      ko.computed => @overlay.state(@overlayState())

      @page.map.serialized(@_mapParams) if @_mapParams
      @page.ui.granuleTimeline.serialized(@_timelineParams) if @_timelineParams
      @page.ui.collectionsList.serialized(@_dsListParams) if @_dsListParams?

      @isDomLoaded(true)

    _onPathChange: (path) ->
      parts = path.split('/')
      last = null
      last = parts.pop() while !last && parts.length > 0
      @page.ui.projectList.visible(last == 'project')
      @_toggleWithTimeout('facets', @page.collections.facets.isRelevant, last == 'search' || last == 'collection-details')
      @_toggleWithTimeout('collections', @page.collections.isRelevant, last == 'collections' || last == 'search')

    # The following two methods read a path from and write a path to the master overlay state, respectively
    #
    # Paths are as follows:
    #   /search - The search page with browse collections and collection list open
    #   /search/map - The search page with the overlays closed
    #   /search/collections - The search page with browse collections closed
    #   /search/project - The project page
    #   /search(/project)?/:id/granules - The granule results page for the given collection id
    #   /search(/project)?/:id(/granules)?/collection-details - The collection details page for the given collection id
    #   /search(/project)?/:id(/granules)?/granule-details - The granules details page for the given granule id
    #
    # Note this is not perfect serialization of the overlay state.  In particular, hiding the overlay and reloading
    # from a bookmark will not save information on the state of the hidden overlay.  This is fixable, but doesn't
    # seem worthwhile to fix.

    _readPath: ->
      state = @overlayState()
      path = @_pathForState(state)
      @_onPathChange(path)

      path

    _pathForState: (state) ->
      return urlUtil.cleanPath()?.split('?')[0] ? '/' if !state?

      root = '/search'

      return '/projects/new' if state.projects
      return root if state.parent && state.current != 'collection-details'

      return "#{root}/map" unless state.visible

      return "#{root}/collections" if state.current == 'collection-results'

      root += '/projects' if state.children.indexOf('project-overview') != -1
      return root if state.current == 'project-overview'

      root += "/granules" if state.children.indexOf('granule-list') != -1
      return root if state.current == 'granule-list'
      return "#{root}/collection-details" if state.current == 'collection-details'
      return "#{root}/granule-details" if state.current == 'granule-details'

      console.error "Unrecognized overlay state: #{JSON.stringify(state)}"
      root

    _writePath: (path) ->
      unless path.indexOf('/search') == 0
        return

      # Default state
      state = @overlayState.peek() ?
        visible: true
        parent: true
        secondary: false
        manualShowParent: true
        children: null
        current: 'collection-results'

      components = path[1...].split('/')

      children = ['collection-results']

      component = components.shift() # 'search'
      component = components.shift()

      state.visible = component != 'map'
      state.parent = !component
      state.current = 'collection-results' if component == 'collections' || state.parent

      if component == 'project'
        children.push('project-overview')
        state.current = 'project-overview'
        component = components.shift()

      collectionFocused = false
      collectionSelected = false
      granuleFocused = false
      granuleSelected = false
      components.unshift(component)
      if components.indexOf('granules') != -1
        children.push('granule-list')
        collectionFocused = true
        granuleFocused = true
        state.current = 'granule-list'
      if components.indexOf('granule-details') != -1
        granuleSelected = true
        state.current = 'granule-details'
      children.push('granule-details')
      if components.indexOf('collection-details') != -1
        collectionSelected = true
        state.current = 'collection-details'
        children.pop() # granule-details
      children.push('collection-details')

      state.children = children

      dsList = @page.ui.collectionsList
      dsList.state(collectionFocused, collectionSelected)
      if granuleFocused
        subscription = dsList.focused.subscribe (value) ->
          if value?
            dsList.focused().state(granuleSelected)
            subscription.dispose()
      @overlayState(state)

    _toggleWithTimeout: (key, observable, bool) ->
      current = observable.peek()
      @_timeouts ?= {}
      clearTimeout(@_timeouts[key])
      return if current == bool
      if bool || !current?
        observable(bool)
      else
        @_timeouts[key] = setTimeout((-> observable(false)), config.defaultAnimationDurationMs)

    _isValid: (path, serialized) ->
      # Perform validations to ensure that invalid or incomplete states (often caused by script errors)
      # don't get saved in the URL, destroying the user's project bookmark

      if path.indexOf('/granule-details') != -1 && !serialized.g
        # If the user is on the granule details page, but there is no selected selected granule
        false
      if path.indexOf('/granules') != -1 && (!serialized.p || serialized.p.indexOf('!') == 0)
        # If the user is viewing granules, but there is no selected collection
        false
      else
        true

    _persistStateInUrl: ->
      path = @path()
      serialized = @serialize()

      # EDSC-540: If the query string changes and we're not on the collections list, go to the
      #           collections list
      prevKeywords = @lastKeywords
      @lastKeywords = @_textQuery(serialized)
      refreshColList = false
      if (path != '/search' && path != '/search/collections' &&  # Not viewing collections
          prevKeywords? &&                                    # Not initial page load
          @lastKeywords != '' &&                              # Haven't cleared the query
          prevKeywords != @lastKeywords)                      # Query changed
        @_sendToCollectionList()
        path = @path()
        serialized = @serialize()
        refreshColList = true

      if @_isValid(path, serialized)
        changed = urlUtil.saveState(path, serialized, !@historyChanged, @page.workspaceNameField.peek())
        @historyChanged = true if changed
        if refreshColList || path == '/search/collection-details' || path == '/search/granules' || path == '/search/project'
          @page.collections.isRelevant(true)

    _textQuery: (serialized) ->
      (serialized.free_text || '') + (serialized.placename || '') + (serialized.q || '')

    _sendToCollectionList: ->
      ui = @page.ui
      {collectionsList, projectList} = ui
      projectList.hideFilters()
      collectionsList.hideCollectionDetails()
      collectionsList.focused()?.hideGranuleDetails()
      collectionsList.unfocusCollection()
      @overlay.level(0)

  exports = StateManager
