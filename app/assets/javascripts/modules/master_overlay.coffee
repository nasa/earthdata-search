do (document, window, $=jQuery, config=@edsc.config, plugin=@edsc.util.plugin, page = edsc.models.page) ->

  class MasterOverlay extends plugin.Base
    constructor: (root, namespace, options={}) ->
      super(root, namespace, options)
      $(window).on 'load resize', @contentHeightChanged
      @_minimized = false
      @_manualShowParent = true

    destroy: ->
      super()
      $(window).off 'load resize', @contentHeightChanged

    show: -> @toggle(true)

    hide: -> @toggle(false)

    toggle: (show = @root.hasClass('is-hidden'), event=true) ->
      @root.trigger('edsc.overlaychange')
      @root.toggleClass('is-hidden', !show)
      @_triggerStateChange() if event

    minimize: ->
      @_minimized = true
      @_updateMinMaxState()
      @contentHeightChanged()
      @_triggerStateChange()

    maximize: ->
      @_updateMinMaxState()
      @contentHeightChanged()
      # Temporarily store @_minimized value in a var because @_minimized value can be out of date: if it triggers the
      # state change before setting it to false, the state change will say that the overlay is still minimized.
      tmp = @_minimized
      @_minimized = false
      @_triggerStateChange() if tmp

    manualShowParent: ->
      @_manualShowParent = true

    manualHideParent: ->
      @_manualShowParent = false

    showParent: -> @toggleParent(true)

    hideParent: -> @toggleParent(false)

    showSecondary: -> @toggleSecondary(true)

    hideSecondary: -> @toggleSecondary(false)

    _updateMinMaxState: ->
      needsMin = @_minimized && !@current().is(@scope('.no-min'))
      @root
        .toggleClass(@scope('is-minimized-desired'), @_minimized)
        .toggleClass(@scope('is-minimized'), needsMin)
        .toggleClass(@scope('is-maximized'), !needsMin)

    _hideNodes: ($nodes) ->
      fn = =>
        $nodes.hide()
        $nodes.filter(@scope('plugin')).remove()
        @_triggerStateChange()
      @_levelTimeout = window.setTimeout(fn, config.defaultAnimationDurationMs) if $nodes.length > 0

    pluginPushMaster: (dom, options) ->
      $(dom).addClass(@scope('plugin')).addClass(@scope('hide-self'))
      @current().after(dom)
      @forward(title)

    pluginPopMaster: (dom, options) ->
      @back()

    hideLevel: (level) ->
      fn = =>
        @children().eq(level).hide()
        @_triggerStateChange()
      @_levelTimeout = window.setTimeout(fn, config.defaultAnimationDurationMs)

    showNext: ->
      clearTimeout(@_levelTimeout)
      @current().next().show()

    toggleParent: (show = @root.hasClass(@scope('is-parent-hidden')), event=true) ->
      $('body').toggleClass(@scope('no-facet'), !show)
      @root.toggleClass(@scope('is-parent-hidden'), !show)
      @contentHeightChanged()
      @_triggerStateChange() if event

    toggleSecondary: (show = @root.hasClass(@scope('is-secondary-hidden')), event=true) ->
      @root.toggleClass(@scope('is-secondary-hidden'), !show)
      @contentHeightChanged()
      @_triggerStateChange() if event

    _triggerStateChange: ->
      @root.trigger('edsc.olstatechange')

    forward: ->
      @level(Math.min(@level() + 1, @children().length))

    back: ->
      @level(Math.max(@level() - 1, 0))

    children: ->
      @_content().children(':visible')

    current: ->
      @children().eq(@level())

    _setBreadcrumbs: ->
      prev = @children().eq(Math.max(@level() - 1, 0))
      title = prev.data(@scope('title'))
      if title?
        @current().find(@scope(".breadcrumb")).text("Back to #{title}")

    level: (value=null, event=true) ->
      if value?
        # setter
        value = parseInt(value, 10)
        currentLevel = @level()
        if currentLevel != value
          if value < currentLevel
            toHide = @children().filter(":gt(#{Math.max(value, 0)})").filter(@scope('.hide-self'))
            @_hideNodes(toHide)
          @_content().attr('data-level', value)
          @_updateMinMaxState()
        @_setBreadcrumbs()
        @contentHeightChanged()
        @_triggerStateChange() if event
      else
        # getter
        parseInt(@_content().attr('data-level'), 10)

    state: (arg) ->
      if arg?
        @toggle(arg.visible, false)
        @toggleParent(arg.parent, false)
        @toggleSecondary(arg.secondary, false)
        if arg.minimized?
          if arg.minimized
            @minimize()
          else
            @maximize()
        children = arg.children
        for child in @_content().children()
          $child = $(child)
          id = $child.attr('id')
          $child.toggle(children.indexOf(id) != -1)
        @level(children.indexOf(arg.current), false)
      else
        children = ($(child).attr('id') for child in @children())
        {
          minimized: @_minimized
          visible: !@root.hasClass('is-hidden')
          parent: if children[@level()] == 'collection-results' || @root.hasClass('projects-overlay') then @_manualShowParent else false
          manualShowParent: @_manualShowParent
          secondary: !@root.hasClass(@scope('is-secondary-hidden'))
          children: children
          current: children[@level()]
          projects: @root.hasClass('projects-overlay')
        }

    _content: ->
      @root.find(@scope('.main-content'))

    updateControlContainer: (newHeight) ->
      masterOverlay = $('.master-overlay')
      masterOverlayMain = $('.master-overlay-main')
      leafletControlContainer = $('.leaflet-control-container')

      if newHeight
        leafletControlContainer.css({
            'height': newHeight
            'width': masterOverlayMain.width()
          })
        return

      leafletControlContainer.css({
          'height': masterOverlay.height() - masterOverlayMain.height()
          'width': masterOverlayMain.width()
        })

    contentHeightChanged: =>
      clearTimeout(@_timeout) if @_timeout
      @_timeout = setTimeout((=>

        @updateControlContainer()

        null), 0)

  $document = $(document)

  plugin.create('masterOverlay', MasterOverlay)

  $(document).ajaxComplete (event, xhr, settings) ->
    if settings.url.indexOf('/granules.json') != -1
      $('.master-overlay').masterOverlay('contentHeightChanged')
