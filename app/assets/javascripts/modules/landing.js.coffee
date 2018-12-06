do ($ = jQuery,
    urlUtil = @edsc.util.url,
    browser_detect = @edsc.util.browser_detect) ->

  $(document).ready ->
      isLandingPage = false

      if (browser_detect.browser == 'Explorer' && browser_detect.version <= 10)
        return

      $('.landing-hidden').toggle(!isLandingPage)
      $('.landing-visible').toggle(isLandingPage)
      $('.landing-toolbar-container').show()
      $('.landing-secondary-toolbar-container').show()
