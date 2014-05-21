@edsc.banner = do (config = @edsc.config, date = @edsc.util.date, $=jQuery, preferences = @edsc.page.preferences) ->
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
      if $banner.data('banner.key')?
        preferences.dismissedEvents.push($banner.data('banner.key'))
        preferences.save()
      $banner.addClass('banner-hidden')
      setTimeout(removeBannerAndOpenNext, config.defaultAnimationDurationMs)

  allEvents = []

  showAllEvents = ->
    dismissed = preferences.dismissedEvents()
    # For pruning dismissed events that are no longer relevant
    pruned = []
    for event in allEvents
      start = event.start_date
      end = event.end_date
      if dismissed.indexOf(event.id) == -1
        showBanner(event.id, "#{event.title} (#{date.timeSpanToHuman(start, end)})", event.message)
      else
        pruned.push(event.id)
    preferences.dismissedEvents(pruned)
    null

  # DELETE BEFORE 1.0 RELEASE
  $(document).ready ->
    isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);

    if !isChrome && !isSafari
      showBanner(
        'unsupportedbrowser',
        'Your browser is not yet supported',
        'The Earthdata Search Alpha Preview is designed to work best in Chrome and Safari browsers.')
  # END DELETE


  $(document).on 'click', '.banner-show-events', (e) ->
    e.preventDefault()
    banners = []
    $banner?.remove()
    $banner = null
    preferences.dismissedEvents([])
    preferences.save()
    showAllEvents()

  $(document).on 'searchready', ->
    preferences.onload ->
      $.getJSON '/events', (data, status, xhr) ->
        allEvents = data
        if data.length > 0
          $('.toolbar-secondary').prepend('<a href="#" class="banner-show-events" title="Show Outage Notices"><i class="fa fa-warning"></i></a>')
          showAllEvents()

  exports = showBanner
