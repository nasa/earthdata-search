do (document, window, $=jQuery, config=@edsc.config, plugin=@edsc.util.plugin, page = edsc.models.page) ->

  class MasterOverlay extends plugin.Base
    constructor: (root, namespace, options={}) ->
      super(root, namespace, options)
      $(window).on 'load resize', @contentHeightChanged

    destroy: ->
      super()
      $(window).off 'load resize', @contentHeightChanged

    show: -> @toggle(true)

    hide: -> @toggle(false)

    toggle: (show = @root.hasClass('is-hidden'), event=true) ->
      @root.toggleClass('is-hidden', !show)
      @_triggerStateChange() if event

    showParent: -> @toggleParent(true)

    hideParent: -> @toggleParent(false)

    showSecondary: -> @toggleSecondary(true)

    hideSecondary: -> @toggleSecondary(false)

    hideLevel: (level) ->
      fn = =>
        @children().eq(level).hide()
        @_triggerStateChange()
      @_levelTimeout = window.setTimeout(fn, config.defaultAnimationDurationMs)

    showNext: ->
      clearTimeout(@_levelTimeout)
      @current().next().show()

    toggleParent: (show = @root.hasClass(@scope('is-parent-hidden')), event=true) ->
      @root.toggleClass(@scope('is-parent-hidden'), !show)
      @contentHeightChanged()
      @_triggerStateChange() if event

    toggleSecondary: (show = @root.hasClass(@scope('is-secondary-hidden')), event=true) ->
      @root.toggleClass(@scope('is-secondary-hidden'), !show)
      @contentHeightChanged()
      @_triggerStateChange() if event

    _triggerStateChange: ->
      @root.trigger('edsc.olstatechange')

    forward: (source) ->
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
          @hideLevel(currentLevel) if @current().hasClass(@scope('hide-self')) && currentLevel > value
          @_content().attr('data-level', value)
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
        children = arg.children
        for child in @_content().children()
          $child = $(child)
          id = $child.attr('id')
          $child.toggle(children.indexOf(id) != -1)
        @level(children.indexOf(arg.current), false)
      else
        children = ($(child).attr('id') for child in @children())
        {
          visible: !@root.hasClass('is-hidden')
          parent: !@root.hasClass(@scope('is-parent-hidden'))
          secondary: !@root.hasClass(@scope('is-secondary-hidden'))
          children: children
          current: children[@level()]
        }

    _content: ->
      @root.find(@scope('.main-content'))

    contentHeightChanged: =>
      # When the window is first loaded or later resized, update the master overlay content
      # boxes to have a height that stretches to the bottom of their parent.  It would
      # be awesome to do this in CSS, but I don't know that it's possible without
      # even uglier results
      # PQ: I still don't quite understand why we need to set the padding here as opposed to
      # using CSS.  It seems like box-sizing: border-box should allow us to use CSS-based padding
      # and have the height work, but it doesn't.
      clearTimeout(@_timeout) if @_timeout
      @_timeout = setTimeout((=>
        main = $('.main-content')
        windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        height = windowHeight - main.position().top - $('body > footer').outerHeight()
        main.height(height)

        for div in @root.find(@scope('.content'))
          $div = $(div)
          $div.height(height - $div.position().top - parseInt($div.data(@scope('pad')) ? 10, 10))

        tabPaneHeight = @root.find('.tab-pane.active').find(@scope('.content')).height()
        for div in @root.find('.tab-pane:not(.active)').find(@scope('.content'))
          $(div).height(tabPaneHeight)
        null), 0)

  $document = $(document)

  plugin.create('masterOverlay', MasterOverlay)

  $(document).ajaxComplete (event, xhr, settings) ->
    if settings.url.indexOf('/granules.json') != -1 || settings.url.indexOf('/data_quality_summary.json') != -1
      $('.master-overlay').masterOverlay('contentHeightChanged')
