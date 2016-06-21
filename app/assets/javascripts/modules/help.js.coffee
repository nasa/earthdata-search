@edsc.help = do ($=jQuery, config=@edsc.config, wait = @edsc.util.xhr.wait, page=@edsc.page, preferences = @edsc.page.preferences) ->

  mapViewOptions =
    title: 'Map View'
    content: 'On the map view, you may select granules, select alternate base layers or projections
              and pan and zoom to an area of interest. Select the <strong>Land / Water Map</strong> base
              layer now to make the data stand out more and zoom or pan the map. Click
              <strong>Next</strong> when you are ready to continue.'
  landWaterSelector = '.leaflet-control-layers label:contains("Land / Water") input'

  tourOptions =
    shapefile_multiple:
      title: "Choose a Search Constraint"
      content: "The file you uploaded contains multiple shapes. Click on the shape you wish to
                use as your search constraint."
    shapefile_reduction:
      title: "Shape file has too many points"
      content: "The shape you selected is too complex to use for search. We've automatically reduced
                it to have an acceptable number of points.  You may edit the polygon to correct any problems
                by clicking on this button. <em>To avoid problems, please use areas with no
                more than #{config.maxPolygonSize} points.</em>"
    gibs_accuracy:
      once: true
      title: "Approximate Granule Imagery"
      content: 'This collection shows approximate full-resolution browse obtained from
                <a href="https://earthdata.nasa.gov/about-eosdis/system-description/global-imagery-browse-services-gibs" target="_blank">GIBS</a>.
                Imagery may not correspond to the indicated granule in the following circumstances:
                <ol>
                  <li>
                    When multiple granules collected the same day overlap.
                  </li>
                  <li>
                    When a granule is collected within a few minutes of midnight UTC.
                  </li>
                </ol>
                In either case, we may present imagery collected from an overlapping granule collected within
                approximately one day of the indicated granule.
                '
      placement: 'left'
      element: '#map-center'
    tour_end:
      title: 'Tour Ended'
      element: '#main-toolbar h1 a'
      placement: 'bottom'
      content: 'Your tour has ended.  At any point you may restart it by visiting the home page and clicking
                on the "Take a Tour" link.'


  tour = [{
      title: "Welcome to Earthdata Search"
      content: 'Enter your search terms or click <strong>Next</strong> to take an introductory tour.'
      element: '.landing-dialog'
      placement: 'right'
      showNext: true
      cleanup: (nextFn, closeFn) ->
        $(window).off 'statechange anchorchange', closeFn
      advanceHook: (nextFn, closeFn) ->
        $(window).one 'statechange anchorchange', closeFn
    }, {
      title: "Keyword Search"
      content: 'Here you can enter search terms to find relevant data. Search terms can be science
                terms, instrument names, or even collection IDs. Let\'s start by searching for
                <em>Snow Cover</em> to find snow cover data. Type <em>Snow Cover</em> in the
                keywords box and press <strong>Enter.</strong>'
      element: '#keywords'
      advanceHook: (nextFn, closeFn) ->
        $(window).one 'searchready', (e) ->
          if $.trim($('#keywords').val().toLowerCase()) == 'snow cover'
            nextFn()
          else
            closeFn()
    }, {
      title: "Browse Collections"
      content: 'In addition to searching for keywords, you can narrow your search through this list of
                terms. Click <strong>Near Real Time</strong> to show the list of NRT collections'
      wait: true
      element: ".facets-item:contains(Near Real Time)"
      top: null
      positionHook: (positionFn) ->
        positionFn("#master-overlay-parent .master-overlay-content")
    }, {
      title: "Browse Collections"
      content: 'Now click <strong>ATMOSPHERE</strong> to select the ATMOSPHERE science keyword'
      wait: true
      element: '.facets-item:contains(ATMOSPHERE)'
      top: null
      positionHook: (positionFn) ->
        positionFn("#master-overlay-parent .master-overlay-content")
    }, {
      title: 'Spatial Search'
      content: 'If you are not interested in data covering the whole Earth, you may restrict your search
               to a spatial area. Select this tool and draw a bounding box over an area where you would
               expect to find snow.'
      element: '.leaflet-draw-draw-rectangle:visible'
      advanceHook: (nextFn, closeFn) ->
        subscription = page.query.params.subscribe (p) ->
          if p['bounding_box']?
            nextFn()
          else
            closeFn()
          subscription.dispose()
    }, {
      title: 'Collection Results'
      content: 'Your collection results appear here.  This result has a "GIBS" badge, indicating that it
               has advanced visualizations. Click on the collection to preview its data.'
      wait: true
      element: '.panel-list-item:contains(MYD06_L2 v5NRT)'
      positionHook: (positionFn) ->
        positionFn("#collection-results .master-overlay-content")
    }, {
      title: 'Matching Granules'
      content: 'Here we see a list of data granules with corresponding imagery rendered drawn on the map.
                Click this granule to bring it to the top of the stack.'
      wait: true
      element: '#granule-list .panel-list-item:nth-child(2)'
      top: null
      positionHook: (positionFn) ->
        positionFn("#granule-list .master-overlay-content")
    }, $.extend({}, mapViewOptions,
        element: '.leaflet-control-layers-toggle'
        cleanup: (nextFn, closeFn) ->
          $('.leaflet-control-layers').off 'mouseover', nextFn
        advanceHook: (nextFn, closeFn) ->
          $('.leaflet-control-layers').one 'mouseover', nextFn

    ), $.extend({}, mapViewOptions,
        element: landWaterSelector,
        cleanup: (nextFn, closeFn) ->
          $(landWaterSelector).off 'mouseover', nextFn
        advanceHook: (nextFn, closeFn) ->
          $(landWaterSelector).one 'change', nextFn
      wait: true
    ), {
      title: 'Granule Timeline (Part 1)'
      content: 'Below the map there is a timeline view showing when this collection has data. You can pan
                and zoom this view to change the period of time and granularity of data it displays. Zoom
                into a particular day by scrolling over that day. Try panning and zooming the timeline now.'

      element: '#timeline'
      placement: 'top'
      cleanup: (nextFn, closeFn) ->
        $('#timeline').off 'rangechange.timeline', closeFn
      advanceHook: (nextFn, closeFn) ->
        $('#timeline').one 'rangechange.timeline', nextFn
    }, {
      title: 'Granule Timeline (Part 2)'
      content: 'You can click on a date on the timeline to focus on granules for that time span.  Note that this
                does not alter your download list.  Left and right arrow keys will take you to the previous and
                next time span.  Try clicking a date now.'
      element: '#timeline'
      placement: 'top'
      cleanup: (nextFn, closeFn) ->
        $('#timeline').off 'focusset.timeline', closeFn
      advanceHook: (nextFn, closeFn) ->
        $('#timeline').one 'focusset.timeline', nextFn
    }, {
      title: 'Granule Timeline (Part 3)'
      content: 'You may also restrict your search results to a temporal range by clicking and dragging across
                the top of the timeline.  Drag a temporal filter.'
      element: '#timeline'
      placement: 'top'
      cleanup: (nextFn, closeFn) ->
        $('#timeline').off 'temporalchange.timeline', closeFn
      advanceHook: (nextFn, closeFn) ->
        $('#timeline').one 'temporalchange.timeline', nextFn
    }, {
      title: 'Back to Collections'
      content: 'Let\'s go back to our collection results'
      element: '#granule-list .master-overlay-back'
    }, {
      title: 'Comparing Multiple Collections'
      content: 'Earthdata Search allows you to visualize and compare two or more collections using projects.
                Add this collection to your project now.'
      waitOnAnimate: true
      placement: 'right'
      element: '.panel-list-item:contains(MYD06_L2 v6NRT) .add-to-project'
    }, {
      title: 'Projects'
      content: 'From here, you can start a new search to find additional collections to compare. You may add
                more collections to your project now. Click <strong>View Project</strong> when you are ready to continue.'
      element: '#view-project'
    }, {
      title: 'Project (cont.)'
      content: 'From the project list, you may visualize multiple collections using the <i class="fa fa-eye"></i>
                button, view their granule results by clicking on them, set advanced filters using the
                <i class="fa fa-edit"></i> button or compare collections on the timeline.
                When you are satisfied with the data you have selected, you
                may access the underlying data by clicking on the <i class="fa fa-download"></i>
                button. For this tour, though, we will stop here. Feel free to keep exploring, or
                <a href="/">start a new search</a> on your own.'
      element: '.master-overlay-main'
    }]

  template = "<div class='popover tour'>
                <div class='arrow'></div>
                <h3 class='popover-title'></h3>
                <div class='popover-content'></div>
                <div class='popover-navigation'>
                  <div class='btn-group'>
                    <button class='button-small button-outline' data-role='prev'>« Prev</button>
                    <button class='button-small' data-role='next'>Next <i class='fa fa-arrow-circle-right'></i></button>
                  </div>
                  <button class='button-small button-outline' data-role='end'>Close</button>
                </div>
              </div>"

  defaultHelpOptions =
    placement: 'auto left'
    html: true
    trigger: 'manual'
    template: template
    container: 'body'

  defaultTourOptions =
    reflex: true
    placement: 'left'

  queue = []
  shown = {}
  index = 0
  next = null
  close = null

  tourRunning = false

  hideCurrent = ->
    if queue[index]?
      queue[index].cleanup?(next, close)
      $(queue[index].element).popover('destroy')
      $('.popover-advance').removeClass('popover-advance')

  close = ->
    hideCurrent()
    queue = []
    index = 0
    tourRunning = false

  prev = ->
    if index > 0
      hideCurrent()
      index--
      showCurrent()

  next = ->
    if index < queue.length - 1
      hideCurrent()
      index++
      showCurrent()
    else
      close()

  position = (selector)->
    $(selector).on 'scroll', (e) ->
      if index == 2 || index == 3 || index == 5 || index == 6 || index == 13
        $container = $(this)
        $tour_popover = $('.popover.tour')
        queue[index].top = $tour_popover.offset().top unless queue[index].top?
        $tour_popover.css({top: queue[index].top - $(this).scrollTop()})

  showCurrentImmediate = ->
    $('.popover-advance').removeClass('popover-advance')

    $el = $(queue[index].element)

    if $el.length > 1
      console.error "Too many elements matched selector #{queue[index].element}.  Showing the first.", $el
      $el = $el.first()

    $el.popover(queue[index])
    $el.attr('data-original-title', '')
    $el.popover('show')
    shown[queue[index].key] = true

    unless queue[index].advanceHook
      $(queue[index].target ? $el).addClass('popover-advance')

    # console.log "Popover: #{queue[index].element} -> #{$el.length}"
    $tip = $el.data('bs.popover').$tip
    $tip.toggleClass('is-popover-single', queue.length == 1)

    queue[index].advanceHook?(next, close)
    queue[index].closeHook?(close)
    queue[index].positionHook?(position)

    if tourRunning
      $tip.find('[data-role=end]').text('End Tour')
      $tip.find('[data-role=prev]').hide()
      $tip.find('[data-role=next]').toggle(queue[index].showNext)
    else
      $tip.find('[data-role=end]').text('Close')
      $tip.find('[data-role=prev]').toggle(index != 0)
      $tip.find('[data-role=next]').toggle(index != queue.length - 1)

  showCurrent = ->
    if queue[index].wait
      wait(showCurrentImmediate)
    else if queue[index].waitOnAnimate
      setTimeout((-> wait(showCurrentImmediate)), config.defaultAnimationDurationMs + 200)
    else
      showCurrentImmediate()

  $(document).on 'click', '.popover [data-role=prev]', prev
  $(document).on 'click', '.popover [data-role=next], .popover-advance', next
  $(document).on 'click', '.popover [data-role=end]', ->
    if tourRunning
      preferences.showTour(false)
      preferences.save()
      close()
      add('tour_end')
    else
      close()

  $(document).on 'click', '.show-tour', (e) ->
    unless window.edscportal
      e.preventDefault()
      startTour()

  add = (key, options={}) ->
    unless tourRunning
      options = $.extend({}, defaultHelpOptions, tourOptions[key], options, key: key)
      for item in queue
        return if item.key == key
      unless options.once && shown[key]
        queue.push(options)
        showCurrent()

  remove = (key) ->
    if queue[0]?.key == key
      next()
    else
      queue = (item for item in queue when item.key != key)

  current = ->
    if tourRunning then nil else queue[index]

  startTour = ->
    close()
    tourRunning = true

    for stop, i in tour
      options = $.extend({}, defaultHelpOptions, stop, key: "tour_#{i}")
      queue.push(options)

    showCurrent()

  exports =
    add: add
    remove: remove
    current: current
    next: next
    prev: prev
    close: close
    startTour: startTour
