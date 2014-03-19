@edsc.help = do ($=jQuery, config=@edsc.config) ->

  tourOptions =
    shapefile_multiple:
      title: "Choose a Search Constraint"
      content: "The file you uploaded contains multiple shapes.  Click on the shape you wish to
                use as your search constraint."
    shapefile_reduction:
      title: "Shape File Too Large"
      content: "The shape you selected is too large to use for search.  We've automatically reduced
                it to have an appropriate number of points.  You may edit the polygon to correct any problems
                by clicking on this button.  <p>To avoid problems, please use areas with no
                more than #{config.maxPolygonSize} points."
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
      placement: 'top'
      element: '#map-center'

  template = "<div class='popover tour'>
                <div class='arrow'></div>
                <h3 class='popover-title'></h3>
                <div class='popover-content'></div>
                <div class='popover-navigation'>
                  <div class='btn-group'>
                    <button class='btn btn-sm btn-default' data-role='prev'>« Prev</button>
                    <button class='btn btn-sm btn-default' data-role='next'>Next »</button>
                  </div>
                  <button class='btn btn-sm btn-default' data-role='end'>Close</button>
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

  hideCurrent = ->
    if queue[index]?
      $(queue[index].element).popover('destroy')

  close = ->
    hideCurrent()
    queue = []
    index = 0

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

  showCurrent = ->
    $('.popover-advance').removeClass('popover-advance')

    $el = $(queue[index].element)
    $el.popover(queue[index])
    $el.attr('data-original-title', '')
    $el.popover('show')
    shown[queue[index].key] = true

    $(queue[index].target ? $el).addClass('popover-advance')

    $tip = $el.data('bs.popover').$tip
    $tip.toggleClass('is-popover-single', queue.length == 1)
    $tip.find('[data-role=prev]').toggleClass('disabled', index == 0)
    $tip.find('[data-role=next]').toggleClass('disabled', index == queue.length - 1)

  $(document).on 'click', '.popover [data-role=prev]', prev
  $(document).on 'click', '.popover [data-role=next], .popover-advance', next
  $(document).on 'click', '.popover [data-role=end]', close

  add = (key, options={}) ->
    options = $.extend({}, defaultHelpOptions, tourOptions[key], options, key: key)
    queue.push(options) unless options.once && shown[key]
    showCurrent()

  current = ->
    queue[index]

  exports =
    add: add
    current: current
    next: next
    prev: prev
    close: close
