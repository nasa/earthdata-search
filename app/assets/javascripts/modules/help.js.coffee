
#= require models/data/preferences

data = @edsc.models.data
ui = @edsc.models.ui
ns = @edsc.models.page

@edsc.help = do ($=jQuery, config=@edsc.config, wait = @edsc.util.xhr.wait, page=@edsc.page, PreferencesModel = data.Preferences, urlUtil=@edsc.util.url) ->


  tourOptions =
    tour_end:
      title: 'Tour Ended'
      element: '#main-toolbar h1 a'
      placement: 'bottom'
      content: 'Your tour has ended.  At any point you may restart it by visiting the home page and clicking
                on the "Take a Tour" link.'

  defaultTemplate = "<div class='popover tour'>
                <div class='arrow'></div>
                <h3 class='popover-title'></h3>
                <div class='popover-content'></div>
                <div class='popover-navigation'>
                  <div class='btn-group'>
                    <button class='button-small secondary' data-role='prev'><i class='fa fa-arrow-circle-left'></i> Prev</button>
                    <button class='button-small' data-role='next'>Next <i class='fa fa-arrow-circle-right'></i></button>
                  </div>
                  <button class='button-small pull-left' data-role='end'>End Tour</button>
                  <label class='pull-left'>
                    <input data-role='toggleHideTour' class='toggleHideTour' type='checkbox' />
                    <small>Do not show again</small>
                  </label>
                </div>
              </div>"

  tour = [{
      title: "Search"
      content: '<p>Use Earthdata Search\'s natural language processing-enabled search tool to quickly narrow
                down to relevant collections.  An example search phrase could be <em>Land Surface Temperature over
                Texas last month</em>. Results will be displayed in the collection panel below.</p>
                <p>You can also add filters to refine your search:</p>
                <ul>
                  <li><i class="fa fa-fw fa-clock-o"></i> Pick a temporal range from a calendar</li>
                  <li><i class="fa fa-fw fa-crop"></i> Manually set spatial boundaries</li>
                  <li><i class="fa fa-fw fa-eraser"></i> Clear all of your filters</li>
                </ul>'
      element: '#keywords'
      placement: 'bottom'
      showNext: true
      },{
      title: "Search Results"
      content: '<p>Search results will be shown in the Matching Collections panel below. Each result will have summary
                information along with relevant badges to allow you to quickly scan your search results to find the
                right collection. The panel can be resized by clicking and dragging the bar above the <em>Matching
                Collections</em> tab.</p>
                <p>Collection options include:</p>
                  <ul>
                    <li><i class="fa fa-fw fa-info-circle"></i> View more information about a collection</li>
                    <li><i class="fa fa-fw fa-plus"></i> Add collections to your project to compare</li>
                  </ul>
                <p>Click anywhere on a collection to view granules available for download</p>'
      element: '#collection-results-list'
      placement: 'top'
      showNext: true
      },{
      title: "Facets"
      content: '<p>Refine your search further with available facets, such as:
                  <div class="tour-list">
                    <ul class="bullet-list">
                      <li>
                        <span class="tour-list-title">Features</span> - has map imagery, is near-real-time, or is subsettable
                      </li>
                      <li>
                        <span class="tour-list-title">Keywords</span> - science terms describing collections
                      </li>
                      <li>
                        <span class="tour-list-title">Platforms</span> - satellite, aircraft, etc. hosting Instruments
                      </li>
                      <li>
                        <span class="tour-list-title">Instruments</span> - devices that make measurements
                      </li>
                      <li>
                        <span class="tour-list-title">Organizations</span> - responsible for archiving and/or producing data
                      </li>
                      <li>
                        <span class="tour-list-title">Projects</span> - mission or science project
                      </li>
                      <li>
                        <span class="tour-list-title">Processing Levels</span> - raw, geophysical variables, grid, or model
                      </li>
                    </ul>
                  </div>
                </p>'
      element: "#master-overlay-parent"
      placement: 'right'
      showNext: true
      top: null
    }, {

      title: "Map Tools"
      content: '<p>Use these map tools to configure and position the map as well as enable certain spatial tools.
                  <table><tr>
                    <td>
                      <ul class="icon-list">
                        <li class="leaflet-draw-list"><i class="icon-leaflet-draw-edit-remove"></i> Delete a layer</li>
                        <li class="leaflet-draw-list"><i class="icon-leaflet-draw-edit-edit"></i> Edit a layer</li>
                        <li class="leaflet-draw-list"><i class="icon-leaflet-draw-draw-marker"></i> Spatial coordinate search </li>
                        <li class="leaflet-draw-list"><i class="icon-leaflet-draw-draw-rectangle"></i> Bounding box search</li>
                        <li class="leaflet-draw-list"><i class="icon-leaflet-draw-draw-polygon"></i> Polygon search</li>
                      </ul>
                    </td>
                    <td>
                      <ul class="icon-list">
                        <li class="projection-draw-list"><i class="icon-projection-draw-arctic"></i> North Polar projection</li>
                        <li class="projection-draw-list"><i class="icon-projection-draw-geographic"></i> Geographic projection</li>
                        <li class="projection-draw-list"><i class="icon-projection-draw-antarctic"></i> South Polar projection</li>
                        <li class="zoom-draw-list"><i class="fa fa-fw fa-plus"></i> Zoom in </li>
                        <li class="zoom-draw-list"><i class="fa fa-fw fa-home"></i> Reset zoom </li>
                        <li class="zoom-draw-list"><i class="fa fa-fw fa-minus"></i> Zoom out </li>
                        <li><i class="icon-map-layers"></i> Map layers</li></ul>
                    </td>
                  </tr></table>
                </p>'
      placement: 'top'
      element: '.projection-switcher-arctic'
      showNext: true
    }, {
      title: 'Toolbar'
      content: '<p>This is the end of the tour. Using this toolbar, you can:
                  <div class="tour-list">
                    <ul>
                      <li class="toolbar-draw-list"><i class="fa fa-bullhorn"></i> Provide feedback</li>
                      <li class="toolbar-draw-list"><i class="fa fa-lock"></i> Login to Earthdata for more user tools</li>
                    </ul>
                  </div>
                </p>
                <p>When logged in, you can also:
                  <div class="tour-list">
                    <ul class="bullet-list">
                      <li> Save your current project</li>
                      <li> View profile information, recent downloads, saved projects, or show this tour again</li>
                    </ul>
                  </div>
                </p>'
      element: '.user-info'
      placement: 'bottom'
    }]

  defaultHelpOptions =
    placement: 'auto left'
    html: true
    wait: true
    trigger: 'manual'
    template: defaultTemplate
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

  doNotShowTourAgain = false

  toggleHideTour = ->
    doNotShowTourAgain = if doNotShowTourAgain then false else true
    $('input:checkbox.toggleHideTour').prop 'checked', doNotShowTourAgain

  hideCurrent = ->
    if queue[index]?
      queue[index].cleanup?(next, close)
      $(queue[index].element).popover('destroy')
      $('.popover-advance').removeClass('popover-advance')

  close = ->
    $('#sitetourModal').modal('hide')
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
    $el.popover({ html : true })

    shown[queue[index].key] = true

    unless queue[index].advanceHook
      $(queue[index].target ? $el).addClass('popover-advance')

    # console.log "Popover: #{queue[index].element} -> #{$el.length}"

    queue[index].advanceHook?(next, close)
    queue[index].closeHook?(close)
    $('input:checkbox.toggleHideTour').prop 'checked', doNotShowTourAgain
    if $el.data('bs.popover')?
      $tip = $el.data('bs.popover').$tip
      $tip.toggleClass('is-popover-single', queue.length == 1)
      if tourRunning
        if index == 0
          $tip.find('[data-role=prev]').hide()
        if index < queue.length - 1
          $tip.find('[data-role=end]').addClass('secondary')

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
  $(document).on 'click', '.popover [data-role=toggleHideTour]', toggleHideTour
  $(document).on 'click', '.popover [data-role=end]', ->
    if tourRunning
      preferences = new PreferencesModel()
      preferences.showTour(false)
      preferences.doNotShowTourAgain(doNotShowTourAgain.toString())
      preferences.save()
      close()
      add('tour_end')
    else
      close()

  $(document).on 'click', '.show-tour', (e) ->
    unless window.edscportal
      e.preventDefault()
      startTour()

  $(window).on 'statechange', ->
    $('[id^="show-tour-"]').toggle(urlUtil.cleanPath()?.split('?')[0] in ["/search", "/", ""])
  $(document).on 'ready', ->
    $('[id^="show-tour-"]').toggle(urlUtil.cleanPath()?.split('?')[0] in ["/search", "/", ""])

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
