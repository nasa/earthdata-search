do ($=jQuery
    uiModel = @edsc.models.page.current.ui
    urlUtil = @edsc.util.url
    help = @edsc.help
    preferences = @edsc.page.preferences) ->

  updateLandingPageState = ->
    re = /[^\/]\/search/
    uiModel.isLandingPage(!History.getState().cleanUrl.match(re)?)

  hasLeftLandingPage = false
  updateLandingPage = (isLandingPage) ->
    if !isLandingPage && !hasLeftLandingPage
      $(document).trigger('searchready')
      hasLeftLandingPage = true
    $content = $('.landing-toolbar-content')
    $('.landing-hidden').toggle(!isLandingPage)
    $('.landing-visible').toggle(isLandingPage)
    hasTimeline = $('#timeline').data('timeline')?
    if isLandingPage
      $('#timeline').timeline('hide') if hasTimeline
      $('.landing-dialog-toolbar').append($content)
      $('#keywords').focus()
    else
      $('#timeline').timeline('refresh') if hasTimeline
      $('.landing-toolbar-container').append($content)
    $content.css(top: 0, left: 0, position: 'static')

  updateLandingPageAnimated = (isLandingPage) ->
    $content = $('.landing-toolbar-content')
    startOffset = $content.offset()
    $content.css(position: 'absolute', zIndex: 81, left: startOffset.left, top: startOffset.top)
    $('.landing-toolbar-container').append($content)

    if isLandingPage
      hasTimeline = $('#timeline').data('timeline')?
      $('#timeline').timeline('hide') if hasTimeline
      $('.landing-hidden').fadeOut()
      $('.landing-visible').fadeIn
        complete: ->
          endOffset = $('.landing-dialog-toolbar').offset()
          $content.animate(endOffset, duration: 200, complete: -> updateLandingPage(isLandingPage))
    else
      endOffset = $('.landing-toolbar-container').offset()
      endOffset.top += 8
      endOffset.left += 0
      $content.animate(endOffset,
        complete: ->
          $('.landing-visible').fadeOut()
          $('.landing-hidden').fadeIn(complete: -> updateLandingPage(isLandingPage))
        duration: 200)

  $(document).ready ->
    isFirstUpdate = true

    uiModel.isLandingPage.subscribe (isLandingPage) ->
      # Avoid doing animations when the screen first shows
      if isFirstUpdate
        isFirstUpdate = false
        updateLandingPage(isLandingPage)
      else
        updateLandingPageAnimated(isLandingPage)

    $(window).on 'resize', ->
      if $('body').hasClass('is-landing')
        $('.landing-toolbar-content').offset($('.landing-dialog-toolbar').offset())

    updateLandingPageState()

    $(window).on 'edsc.pagechange', updateLandingPageState

    goToSearch = ->
      urlUtil.pushPath("/search")

    startTourDefault = ->
      help.startTour() if !window.edscportal && uiModel.isLandingPage()

    preferences.onload ->
      if preferences.showTour() || window.location.href.indexOf('?tour=true') != -1
        # Let the DOM finish any refresh operations before showing the tour
        setTimeout(startTourDefault, 0)

    $('.landing-area').on 'keypress', '#keywords', (e) ->
      goToSearch() if e.which == 13
    $('.landing-area').on 'submit', 'form', goToSearch
    $('.landing-area').on 'click', '.submit, .master-overlay-show', goToSearch
    $('.landing-area').on 'click', '.spatial-selection a', goToSearch
