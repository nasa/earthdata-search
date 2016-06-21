do (document
    window
    $ = jQuery
    config = @edsc.config
    metrics = @edsc.util.metrics
    ) ->

  $(document).on 'click', 'a[data-pulse]', ->
    $dest = $($(this).attr('data-pulse'))
    $dest.animate(color: '#00ffff').animate(color: 'inherit')

  # Remove buttons in tables remove their rows
  $(document).on 'click', 'tr a[title="remove"]', ->
    $(this).closest('tr').remove()

  $(document).on 'click', 'tr a[title="Remove Project"]', ->
    $(this).closest('tr').remove()
    if $('tbody tr').length == 0
      $('.data-access-content').html('<p>No saved projects</p>')

  $(document).on 'click', 'a, button', (e) ->
    metrics.createEvent(e)

  $(document).on 'click', 'a[href="#"]', (e) ->
    e.preventDefault()

  # flash the green save icon
  $(document).on 'edsc.saved', ->
    check = $('.save-success')
    check.show()
    setTimeout((-> check.fadeOut()), config.defaultAnimationDurationMs)

  $(document).on 'focusin.focushack', '*[tabIndex]', ->
    $(this).addClass('has-focus')

  $(document).on 'focusout.focushack', '*[tabIndex]', ->
    $(this).removeClass('has-focus')

  $(document).ready ->
    $(document.body).tooltip({ selector: '[data-tooltip="true"]', placement: 'auto left' });

  $(document).on 'click', 'a.sign-in', ->
    this.setAttribute('href',  "/login?next_point=#{encodeURIComponent(window.location.href)}")

  $(document).on 'pageview', (e, path, state) ->
    metrics.createPageView(path, state)

  $(document).on 'timingevent', (e, path, timing) ->
    metrics.createTiming(path, timing)

  $(document).on 'dataaccessevent', (e, collection, options=null) ->
    metrics.createDataAccessEvent(collection, options)

  $(document).on 'click', '.description-toggle', (e) ->
    e.preventDefault()
    $('.long-paragraph').toggleClass('expanded')
    $('.description-toggle').find('i').toggleClass('fa-chevron-down')
    $('.description-toggle').find('i').toggleClass('fa-chevron-up')

  $(document).ready ->
    map = $('#map').data('map')?.map
    if map?
      map.on 'projectionchange', (e) ->
        metrics.createMapEvent("Set Projection: #{e.projection}")

      map.on 'basemapchange', (e) ->
        metrics.createMapEvent("Set Base Map: #{e.name}")

      map.on 'overlayschange', (e) ->
        overlays = e.overlays
        names = (name.split('*')[0] for name in overlays)
        if names.length > 0
          metrics.createMapEvent("Set Overlays: #{names.join(', ')}")

      map.on 'spatialtoolchange', (e) ->
        metrics.createMapEvent("Spatial: #{e.name}")

      map.on 'edsc.stickygranule', (e) ->
        metrics.createMapEvent("Selected Granule")

      map.on 'shapefile:start', (e) ->
        metrics.createMapEvent("Added Shapefile")

      map.on 'spatialedit', (e) ->
        metrics.createMapEdit(e.preBounds, e.postBounds, e.spatial)

    timeline = $('#timeline')
    timeline.on 'buttonzoom', (e) ->
      metrics.createTimelineEvent("Button Zoom")

    timeline.on 'arrowpan', (e) ->
      metrics.createTimelineEvent("Left/Right Arrow Pan")

    timeline.on 'clicklabel', (e) ->
      metrics.createTimelineEvent("Click Label")

    timeline.on 'createdtemporal', (e) ->
      metrics.createTimelineEvent("Created Temporal")

    timeline.on 'scrollzoom', (e) ->
      metrics.createTimelineEvent("Scroll Zoom")

    panTimeout = null
    timeline.on 'scrollpan', (e) ->
      # Rate limit sending the scroll event to avoid trackpad momentum firing tons of events
      clearTimeout(panTimeout)
      sendPan = -> metrics.createTimelineEvent("Scroll Pan")
      panTimeout = setTimeout(sendPan, 200)

    timeline.on 'draggingpan', (e) ->
      metrics.createTimelineEvent("Dragging Pan")
