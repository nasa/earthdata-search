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

    toggleParent: (show = @root.hasClass(@scope('is-parent-hidden')), event=true) ->
      @root.toggleClass(@scope('is-parent-hidden'), !show)
      @contentHeightChanged()
      @_triggerStateChange() if event

    toggleSecondary: (show = @root.hasClass(@scope('is-secondary-hidden')), event=true) ->
      @root.toggleClass(@scope('is-secondary-hidden'), !show)
      @contentHeightChanged()
      @root.trigger('edsc.hidden')
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
          @_content().attr('data-level', value)
          @current().trigger('edsc.navigate')
        @_setBreadcrumbs()
        @contentHeightChanged()
        @_triggerStateChange() if event
      else
        # getter
        parseInt(@_content().attr('data-level'), 10)

    state: (arg) ->
      if arg?
        i = 0
        @toggle(arg[i++] == 't', false)
        @toggleParent(arg[i++] == 't', false)
        @toggleSecondary(arg[i++] == 't', false)
        for child in @_content().children()
          $(child).toggle(arg[i++] == 't')
        @level(parseInt(arg[i++], 10), false)
      else
        bool = (v) -> if v then 't' else 'f'
        res = ''
        res += bool(!@root.hasClass('is-hidden'))
        res += bool(!@root.hasClass(@scope('is-parent-hidden')))
        res += bool(!@root.hasClass(@scope('is-secondary-hidden')))
        res += bool(($(child).is(':visible'))) for child in @_content().children()
        res += @level()
        res

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

  # Hide the project list after the back animation completes
  timeout = null
  $document.on 'edsc.navigate', '#dataset-results', ->
    window.setTimeout(page.current.ui.projectList.hideProject, config.defaultAnimationDurationMs)

  $document.on 'edsc.navigate', '#project-overview', ->
    window.clearTimeout(timeout)

  plugin.create('masterOverlay', MasterOverlay)

  $(document).ajaxComplete (event, xhr, settings) ->
    if settings.url.indexOf('/granules.json') != -1 || settings.url.indexOf('/data_quality_summary.json') != -1
      $('.master-overlay').masterOverlay('contentHeightChanged')
