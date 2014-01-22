do (document, window, $=jQuery) ->

  $overlayFor = (descendant) ->
    $descendant = $(descendant)
    $overlay = $descendant.closest('.master-overlay')
    return $overlay if $overlay.length > 0
    href = $descendant.attr('href')
    return $(href) if href
    $()

  $contentFor = (node) ->
    $overlayFor(node).find('.master-overlay-main-content')

  getLevel = ($content) ->
    parseInt($content.attr('data-level'), 10)

  setLevel = ($content, level) ->
    currentLevel = getLevel($content)
    if currentLevel != level
      $content.attr('data-level', level)
      target = $content.children()[level]
      $(target).trigger('edsc.navigate')

  moveForward = ($content) ->
    level = Math.min(getLevel($content) + 1, $content.children(':visible').length)
    setLevel($content, level)

  moveBack = ($content) ->
    level = Math.max(getLevel($content) - 1, 0)
    setLevel($content, level)

  fixContentHeight = ->
    # When the window is first loaded or later resized, update the master overlay content
    # boxes to have a height that stretches to the bottom of their parent.  It would
    # be awesome to do this in CSS, but I don't know that it's possible without
    # even uglier results
    $('.master-overlay-content').each ->
      $this = $ this
      $this.height($this.parents('.main-content').height() - $this.offset().top - 40)

  $document = $(document)

  $document.on 'click', '.master-overlay-forward', (e) ->
    if $(this).is('a') || $(e.target).closest('a').length == 0
      moveForward($contentFor(this))
    false

  $document.on 'click', '.master-overlay-back', ->
    moveBack($contentFor(this))
    false

  $document.on 'click', '.master-overlay-navigate', ->
    level = parseInt($(this).attr('data-level'), 10)
    setLevel($contentFor(this), level)
    false

  $document.on 'click', '.master-overlay-main .master-overlay-close', ->
    $overlayFor(this).toggleClass('is-hidden')
    false

  $document.on 'click', '.master-overlay-show-parent', ->
    $overlayFor(this).removeClass('is-master-overlay-parent-hidden')
    fixContentHeight()
    false

  $document.on 'click', '.master-overlay-hide-parent, .master-overlay-parent .master-overlay-close', ->
    $overlayFor(this).addClass('is-master-overlay-parent-hidden')
    fixContentHeight()
    false

  $document.on 'click', '.master-overlay-show', ->
    id = this.href.split('#')[1]
    $('#' + id).removeClass('is-hidden')
    false


  $(window).on 'load resize', fixContentHeight
