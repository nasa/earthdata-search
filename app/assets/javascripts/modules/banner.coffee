@edsc.banner = do (
                config = @edsc.config
                date = @edsc.util.date
                $=jQuery
              ) ->
  banners = []
  $banner = null

  template = "<div class=\"banner banner-hidden\">
      <a class=\"banner-close\" href=\"#\" title=\"close\"><i class=\"fa fa-times-circle\"></i></a>
      <h1 class=\"banner-title\"></h1>
      <p class=\"banner-text\"></p>
    </div>"

  displayBanner = (key, title, message, options={}) ->
    unless $banner
      $banner = $(template)
      $banner.addClass(options.className) if options.className?
      $banner.find('.banner-title').text(title) if title?
      $message = $banner.find('.banner-text')
      if options.html
        $message.html(message)
      else
        $message.text(message)
      $banner.data('banner.key', key)
      $('body').after($banner)
      # Do this in a timeout so the element has time to be placed in the DOM and animations can happen
      # $banner might be undefined. Keep an eye on this and file a bug if it happens again.
      setTimeout((->
        $banner.removeClass('banner-hidden')
        $('#main-toolbar').animate({paddingTop: 0, marginTop: $banner.outerHeight() + 22}, {duration: config.defaultAnimationDurationMs})
        setTimeout((->$('.master-overlay')?.masterOverlay?('contentHeightChanged')), config.defaultAnimationDurationMs * 1.05)
      ), 0)
      $banner.on 'click', '.banner-close', onClickClose

  showBanner = (args...) ->
    options = args[3] ? {}
    if options.immediate
      $banner?.remove()
      $banner = null
      banners.unshift(args)
    else
      banners.push(args)
    displayBanner(args...)

  removeBannerAndOpenNext = ->
    $banner?.remove()
    $banner = null
    if banners.length > 0
      displayBanner(banners[0]...)
    else
      $('#main-toolbar').animate({paddingTop: "25px", marginTop: 0}, {duration: config.defaultAnimationDurationMs})
      setTimeout((->$('.master-overlay')?.masterOverlay?('contentHeightChanged')), config.defaultAnimationDurationMs * 1.05)

  removeBannersWithKey = (key) ->
    banners = (banner for banner in banners when banner[0] != key)
    if $banner?.data('banner.key') == key
      removeBannerAndOpenNext()

  onClickClose = ->
    if $banner?
      banners.shift()
      removeBannerAndOpenNext()

  # Errors for XHRs
  $(document).ajaxSend (event, xhr, settings) ->
    removeBannersWithKey(settings.url.split('?')[0])


  $(document).on 'click', '.banner-ajax-retry', ->
    {retry} = banners[0][3] if banners.length > 0
    retry?()


  $(document).ajaxError (event, xhr, settings) ->
    if xhr.status? && (xhr.status >= 500 || xhr.status == 408 || xhr.status == 0) && xhr.statusText != 'abort'
      url = settings.url.split('?')[0]
      title = "An unexpected error occurred"
      resource = url.match(/([^\/\.]+)(?:\.[^\/]*)?$/)?[1]
      if resource?
        resource = resource.replace('_', ' ')
        title = "Error retrieving #{resource}"
      error = xhr.responseJSON?.errors?.error ? 'There was a problem completing the request'
      retry = settings.retry
      error += ' <a class="banner-ajax-retry" href="#">Retry</a>' if retry?

      showBanner(url, title, error, className: 'banner-error', immediate: true, html: true, retry: retry)

  exports = showBanner
