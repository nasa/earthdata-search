@edsc.banner = do (
                date = @edsc.util.date
                $=jQuery
                preferences = @edsc.page.preferences
                getJSON = @edsc.util.xhr.getJSON
              ) ->
  banners = []
  $banner = null

  template = "<div class=\"banner banner-hidden\">
      <a class=\"banner-close\" href=\"#\" title=\"close\"><i class=\"fa fa-times-circle\"></i></a>
      <h1 class=\"banner-title\"></h1>
      <p class=\"banner-message\"></p>
    </div>"

  displayBanner = (key, title, message, options={}) ->
    unless $banner
      $banner = $(template)
      $banner.addClass(options.className) if options.className?
      $banner.find('.banner-title').text(title)
      $message = $banner.find('.banner-message')
      if options.html
        $message.html(message)
      else
        $message.text(message)
      $banner.data('banner.key', key)
      $banner.data('banner.persist', options.persist)
      $('body').after($banner)
      # Do this in a timeout so the element has time to be placed in the DOM and animations can happen
      # $banner might be undefined. Keep an eye on this and file a bug if it happens again.
      setTimeout((-> $banner.removeClass('banner-hidden')), 0)
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

  removeBannersWithKey = (key) ->
    banners = (banner for banner in banners when banner[0] != key)
    if $banner?.data('banner.key') == key
      removeBannerAndOpenNext()

  onClickClose = ->
    if $banner?
      if $banner.data('banner.key')? && $banner.data('banner.persist')
        preferences.dismissedEvents.push($banner.data('banner.key'))
        preferences.save()
      banners.shift()
      removeBannerAndOpenNext()

  allEvents = []

  showAllEvents = ->
    dismissed = preferences.dismissedEvents()
    # For pruning dismissed events that are no longer relevant
    pruned = []
    for event in allEvents
      start = event.start_date
      end = event.end_date
      if dismissed.indexOf(event.id) == -1
        showBanner(event.id, "#{event.title} (#{date.timeSpanToHuman(start, end)})", event.message, persist: true)
      else
        pruned.push(event.id)
    preferences.dismissedEvents(pruned)
    null

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
      getJSON '/events', (data, status, xhr) ->
        allEvents = data
        if data.length > 0
          $('.toolbar-secondary').prepend('<a href="#" class="banner-show-events" title="Show Outage Notices"><i class="fa fa-warning"></i></a>')
          showAllEvents()

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
