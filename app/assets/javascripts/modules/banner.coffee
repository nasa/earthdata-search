@edsc.banner = do (config = @edsc.config, $=jQuery) ->
  banners = []
  $banner = null

  template = "<div class=\"banner banner-hidden\">
      <a class=\"banner-close\" href=\"#\" title=\"close\"><i class=\"fa fa-times-circle\"></i></a>
      <h1 class=\"banner-title\"></h1>
      <p class=\"banner-message\"></p>
    </div>"

  showBanner = (key, title, message, options={}) ->
    if $banner
      banners.push([key, title, message, options])
    else
      $banner = $(template)
      $banner.find('.banner-title').text(title)
      $banner.find('.banner-message').text(message)
      $banner.data('banner.key', key)
      $('body').after($banner)
      # Do this in a timeout so the element has time to be placed in the DOM and animations can happen
      setTimeout((-> $banner.removeClass('banner-hidden')), 0)
      $banner.on 'click', '.banner-close', closeBanner

  removeBannerAndOpenNext = ->
    $banner?.remove()
    $banner = null
    if banners.length > 0
      showBanner(banners.shift()...)

  closeBanner = ->
    if $banner?
      $banner.addClass('banner-hidden')
      setTimeout(removeBannerAndOpenNext, config.defaultAnimationDurationMs)

  exports = showBanner
