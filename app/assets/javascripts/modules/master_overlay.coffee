do (document, window, $=jQuery, config=@edsc.config, plugin=@edsc.util.plugin, page = edsc.models.page) ->

  class MasterOverlay extends plugin.Base
    constructor: (root, namespace, options={}) ->
      super(root, namespace, options)
      $(window).on 'load resize', @_fixContentHeight

    destroy: ->
      super()
      $(window).off 'load resize', @_fixContentHeight

    show: -> @toggle(true)

    hide: -> @toggle(false)

    toggle: (show = @root.hasClass('is-hidden')) ->
      @root.toggleClass('is-hidden', !show)

    showParent: -> @toggleParent(true)

    hideParent: -> @toggleParent(false)

    showSecondary: -> @toggleSecondary(true)

    hideSecondary: -> @toggleSecondary(false)

    toggleParent: (show = @root.hasClass(@scope('is-parent-hidden'))) ->
      @root.toggleClass(@scope('is-parent-hidden'), !show)
      @_fixContentHeight()

    toggleSecondary: (show = @root.hasClass(@scope('is-secondary-hidden'))) ->
      @root.toggleClass(@scope('is-secondary-hidden'), !show)
      @_fixContentHeight()

    forward: (source) ->
      @level(Math.min(@level() + 1, @children().length))
      if source?
        @current().find(@scope(".breadcrumb")).text("Back to #{source}")

    back: ->
      @level(Math.max(@level() - 1, 0))

    children: ->
      @_content().children(':visible')

    current: ->
      @children().eq(@level())

    level: (value=null) ->
      if value?
        # setter
        value = parseInt(value, 10)
        currentLevel = @level()
        if currentLevel != value
          @_content().attr('data-level', value)
          @current().trigger('edsc.navigate')
        @_fixContentHeight()
      else
        # getter
        parseInt(@_content().attr('data-level'), 10)

    _content: ->
      @root.find(@scope('.main-content'))

    _fixContentHeight: =>
      content = @_content().find(@scope('.content'))
      # When the window is first loaded or later resized, update the master overlay content
      # boxes to have a height that stretches to the bottom of their parent.  It would
      # be awesome to do this in CSS, but I don't know that it's possible without
      # even uglier results
      content.height(content.parents('.main-content').height() - $(content[@level()]).offset().top - 40)

      secondary_content = @root.find('.master-overlay-secondary-content').find(".master-overlay-content")
      secondary_content.height(content.height() + 8)

  $document = $(document)

  # Hide the project list after the back animation completes
  timeout = null
  $document.on 'edsc.navigate', '#dataset-results', ->
    window.setTimeout(page.current.ui.projectList.hideProject, config.defaultAnimationDurationMs)

  $document.on 'edsc.navigate', '#project-overview', ->
    window.clearTimeout(timeout)

  plugin.create('masterOverlay', MasterOverlay)

  $document.ready ->
    $('.master-overlay').masterOverlay()
