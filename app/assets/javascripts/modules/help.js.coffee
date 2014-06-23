@edsc.help = do ($=jQuery, config=@edsc.config, wait = @edsc.util.xhr.wait, page=@edsc.page, preferences = @edsc.page.preferences) ->

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
      content: 'This dataset shows approximate full-resolution browse obtained from
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
                terms, instrument names, or even dataset IDs. Let\'s start by searching for
                <em>Snow Cover NRT</em> to find near real-time snow cover data. Type <em>Snow Cover NRT</em> in the
                keywords box and press <strong>Enter.</strong>'
      element: '#keywords'
      advanceHook: (nextFn, closeFn) ->
        $(window).one 'searchready', (e) ->
          if $.trim($('#keywords').val().toLowerCase()) == 'snow cover nrt'
            nextFn()
          else
            closeFn()
    }, {
      title: "Browse Datasets"
      content: 'In addition to searching for keywords, you can narrow your search through this list of
                terms. Click <strong>Platforms</strong> to expand the list of platforms'
      wait: true
      element: '.facet-title a:contains(Platforms)'
    }, {
      title: "Browse Datasets"
      content: 'Now click <strong>Terra</strong> to select the Terra satellite'
      wait: true
      element: '.facets-item:contains(Terra)'
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
      title: 'Dataset Results'
      content: 'Your dataset results appear here.  This result has a "GIBS" badge, indicating that it
               has advanced visualizations. Click on the dataset to preview its data.'
      wait: true
      element: '.panel-list-item:contains(MOD10_L2)'
    }, {
      title: 'Matching Granules'
      content: 'Here we see a list of data granules with corresponding imagery rendered drawn on the map.
                Click a granule to bring it to the top of the stack.'
      wait: true
      element: '#granule-list .panel-list-item:nth-child(2)'
    }, {
      title: 'Map View'
      content: 'On the map view, you may select granules, select alternate base layers or projections, and pan and zoom to
                an area of interest. Select the <strong>Land / Water Map</strong> base layer now to make the data stand
                out more and zoom or pan the map. Click <strong>Next</strong> when you are ready to continue.'
      showNext: true
      element: '#map-center'
    }, {
      title: 'Granule Timeline'
      content: 'Below the map there is a timeline view showing when this dataset has data. You can pan
                and zoom this view to change the period of time and granularity of data it displays. Zoom
                into a particular day by scrolling over that day. Try panning and zooming the timeline now.'

      element: '#timeline'
      placement: 'top'
      cleanup: (nextFn, closeFn) ->
        $('#timeline').off 'timeline.rangechange', closeFn
      advanceHook: (nextFn, closeFn) ->
        $('#timeline').one 'timeline.rangechange', nextFn
    # TODO: Temporal extents here when available
    # TODO: Temporal focus on a single day when available
    }, {
      title: 'Back to Datasets'
      content: 'Let\'s go back to our dataset results'
      element: '#granule-list .master-overlay-back'
    }, {
      title: 'Comparing Multiple Datasets'
      content: 'Earthdata Search allows you to visualize and compare two or more datasets using projects.
                Add this dataset to your project now.'
      waitOnAnimate: true
      placement: 'right'
      element: '.panel-list-item:contains(MOD10_L2) .add-to-project'
    }, {
      title: 'Projects'
      content: 'From here, you can start a new search to find additional datasets to compare. You may add
                more datasets to your project now. Click <strong>View Project</strong> when you are ready to continue.'
      element: '#view-project'
    }, {
      title: 'Project (cont.)'
      content: 'From the project list, you may visualize multiple datasets using the <i class="edsc-icon-eye"></i>
                button, view their granule results by clicking on them, set advanced filters using the
                <i class="edsc-icon-compose"></i> button or compare datasets on the timeline.
                When you are satisfied with the data you have selected, you
                may access the underlying data by clicking on the <i class="edsc-icon-download"></i>
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

    $tip = $el.data('bs.popover').$tip
    $tip.toggleClass('is-popover-single', queue.length == 1)

    queue[index].advanceHook?(next, close)
    queue[index].closeHook?(close)

    if tourRunning
      $tip.find('[data-role=prev]').hide()
      $tip.find('[data-role=next]').toggle(queue[index].showNext)
    else
      $tip.find('[data-role=prev]').toggle(index != 0)
      $tip.find('[data-role=next]').toggle(index != queue.length - 1)

  showCurrent = ->
    if queue[index].wait
      wait(showCurrentImmediate)
    else if queue[index].waitOnAnimate
      setTimeout(showCurrentImmediate, 500)
    else
      showCurrentImmediate()

  $(document).on 'click', '.popover [data-role=prev]', prev
  $(document).on 'click', '.popover [data-role=next], .popover-advance', next
  $(document).on 'click', '.popover [data-role=end]', ->
    if tourRunning
      preferences.showTour(false)
      preferences.save()
    close()

  $(document).on 'click', '.show-tour', (e) ->
    e.preventDefault()
    startTour()

  add = (key, options={}) ->
    unless tourRunning
      options = $.extend({}, defaultHelpOptions, tourOptions[key], options, key: key)
      unless options.once && shown[key]
        queue.push(options)
        showCurrent()

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
    current: current
    next: next
    prev: prev
    close: close
    startTour: startTour
