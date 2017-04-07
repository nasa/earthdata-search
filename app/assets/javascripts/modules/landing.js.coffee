do ($ = jQuery
    urlUtil = @edsc.util.url) ->

  $(document).ready ->
      isLandingPage = false
      $('.landing-hidden').toggle(!isLandingPage)
      $('.landing-visible').toggle(isLandingPage)
      $('.landing-toolbar-container').show()
