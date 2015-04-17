do (document, ko, $=jQuery, config=@edsc.config, plugin=@edsc.util.plugin, string=@edsc.util.string, dateUtil=@edsc.util.date) ->
  # Height for the top area, where arrows are drawn for date selection
  TOP_HEIGHT = 19

  # Height for each dataset, including any necessary margins
  DATASET_HEIGHT = 26

  DATASET_FONT_HEIGHT = 14

  DATASET_PADDING = 5

  OFFSET_X = 48

  DATASET_TEXT_OFFSET = TOP_HEIGHT + DATASET_FONT_HEIGHT + DATASET_PADDING

  # Height for the axis of the timeline, containing date displays
  AXIS_HEIGHT = 40

  SVG_NS = 'http://www.w3.org/2000/svg'

  MS_PER_MINUTE = 60000

  MS_PER_HOUR = MS_PER_MINUTE * 60

  MS_PER_DAY = MS_PER_HOUR * 24

  MS_PER_MONTH = MS_PER_DAY * 31

  MS_PER_YEAR = MS_PER_DAY * 366

  MS_PER_DECADE = MS_PER_YEAR * 10

  MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  MIN_X = -100000
  MIN_Y = -1000
  MAX_X = 100000
  MAX_Y = 1000

  formatTime = (date) -> string.padLeft(date.getUTCHours(), '0', 2) + ':' + string.padLeft(date.getUTCMinutes(), '0', 2)
  formatDay = (date) -> string.padLeft(date.getUTCDate(), '0', 2)
  formatMonth = (date) -> MONTHS[date.getUTCMonth()]
  formatDate = (date) -> formatMonth(date) + ' ' + formatDay(date)
  formatYear = (date) -> date.getUTCFullYear()
  addContext = (dateStr, contextMatch, contextFn) ->
    result = [dateStr]
    result.push(contextFn()) if dateStr == contextMatch
    result

  LABELS = [
    ((date) -> addContext(formatTime(date), '00:00', -> formatDate(date))),
    ((date) -> addContext(formatTime(date), '00:00', -> formatDay(date) + ' ' +formatMonth(date) + ' ' + formatYear(date))),
    ((date) -> addContext(formatDay(date), '01', -> formatMonth(date) + ' ' + formatYear(date))),
    ((date) -> addContext(formatMonth(date), 'Jan', -> formatYear(date))),
    ((date) -> [formatYear(date)]),
    ((date) -> [formatYear(date)]),
    ((date) -> [formatYear(date)])
  ]

  RESOLUTIONS = [
    'minute',
    'hour',
    'day',
    'month',
    'year',
    'year',
    'year'
  ]

  ZOOM_LEVELS = [
    MS_PER_MINUTE,
    MS_PER_HOUR,
    MS_PER_DAY,
    MS_PER_MONTH,
    MS_PER_YEAR,
    MS_PER_DECADE,
    MS_PER_DECADE * 5
  ]


  updateSvgElement = (el, attrs={}) ->
    for own attr, value of attrs
      el.setAttribute(attr, value) if value?
    el

  buildSvgElement = (name, attrs={}) ->
    updateSvgElement(document.createElementNS(SVG_NS, name), attrs)


  getTransformX = (el, defaultValue=0) ->
    return defaultValue unless el
    re = /^[^\d\-]*(-?[\d\.]+)/
    transform = el.getAttribute('transform') ? el.parentNode.getAttribute('transform')
    parseFloat(re.exec(transform)?[1] ? defaultValue)

  TimelineDraggable = L.Draggable.extend
    initialize: (element, @animate=config.defaultAnimationDurationMs > 0) ->
      @on 'dragstart predrag drag dragend', ((e) -> L.Util.extend(e, @state())), this
      @on 'dragstart', @_onDragStart, this

      L.DomUtil.setPosition(element, L.point(0, 0), true)
      L.Draggable.prototype.initialize.call(this, element, null)

      @enable()

    state: ->
      offset = getTransformX(@_element)
      {dx: @_newPos.x - @_startPos.x, start: @_startPoint.x - offset, end: @_startPoint.x + @_newPos.x - offset}

    _onDragStart: ->
      @_positions = []
      @_times = []

    _updatePosition: ->
      @fire('predrag')

      time = +new Date()
      @_positions.push(@_newPos.x)
      @_times.push(time)

      if time - @_times[0] > 200
        @_positions.shift()
        @_times.shift()

      @fire('drag')

    _onUp: (e) ->
      if @animate && @_positions?.length > 0
        dx = @_newPos.x - @_positions[0]
        dt = +new Date() - @_times[0]
        v = dx/dt
        @_animateFling(e.target || e.srcElement, v, .01, +new Date())
      else
        L.Draggable.prototype._onUp.call(this, e)

    _animateFling: (target, v, a, t) ->
      now = +new Date()
      dt = now - t
      dv = a*dt
      if v < 0
        v += dv
      else
        v -= dv

      if dv < Math.abs(v)
        @_newPos.x += v * dt
        @fire('drag')
        L.Util.requestAnimFrame =>
          @_animateFling(target, v, a, now)
      else
        L.Draggable.prototype._onUp.call(this, target: target)

  TimelineDraggable.prototype.addEventListener = TimelineDraggable.prototype.on

  TemporalFencepost = TimelineDraggable.extend
    initialize: (parent, x) ->
      @line = buildSvgElement('line')
      @triangle = buildSvgElement('path')

      @update(x)

      parent.appendChild(@line)
      parent.appendChild(@triangle)

      TimelineDraggable.prototype.initialize.call(this, @triangle)

      @on 'dragend', @_onEnd, this
      @on 'predrag', @_onUpdate, this


    dispose: ->
      {line, triangle} = this
      @line = @triangle = null

      line.parentNode.removeChild(line)
      triangle.parentNode.removeChild(triangle)
      @disable()

    update: (x) ->
      @x = x
      y = 0
      half_w = 10
      h = 10
      updateSvgElement(@line, x1: x, y1: y + h, x2: x, y2: MAX_Y)
      updateSvgElement(@triangle, d: "m#{x - half_w} #{y} l #{half_w} #{h} l #{half_w} #{-h} z")
      @fire('update', {x: x})
      this

    _onUpdate: ({dx}) ->
      @_startX ?= @x
      @update(@_startX + dx)

    _onEnd: ({dx}) ->
      @_onUpdate({dx: dx})
      @fire('commit', x: @x)
      @_startX = null

  class TemporalSelection
    constructor: (parent, @left, @right, attrs) ->
      @left.on 'update', @update, this
      @right.on 'update', @update, this

      @rect = buildSvgElement('rect', attrs)
      parent.appendChild(@rect)
      @update()

    dispose: ->
      {left, right, update, rect} = this
      left.off 'update', update, this
      right.off 'update', update, this

      rect.parentNode.removeChild(rect)
      @rect = null

    update: (attrs) ->
      x = Math.min(@left.x, @right.x)
      width = Math.abs(@right.x - @left.x)

      updateSvgElement @rect, $.extend({}, attrs, {x: x, width: width})
      this


  class Timeline extends plugin.Base
    constructor: (root, namespace, options={}) ->
      super(root, namespace, options)

      @_datasets = []

      @root.append(@_createDisplay())

      @_data = {}

      @_zoom = 4
      @end = config.present()
      @start = @end - ZOOM_LEVELS[@_zoom]
      @originPx = 0

      @_loadedRange = []

      @_updateTimeline()

      @root.on 'click.timeline', @scope('.date-label'), @_onLabelClick
      @root.on 'mouseover.timeline', @scope('.date-label'), @_onLabelMouseover
      @root.on 'mouseout.timeline', @scope('.date-label'), @_onLabelMouseout
      @root.on 'mouseover.timeline', @scope('.data'), @_onDataMouseover
      @root.on 'mouseout.timeline', @scope('.data'), @_onDataMouseout
      @root.on 'keydown.timeline', @_onKeydown

      @root.on 'focusout.timeline', (e) =>
        @root.removeClass('hasfocus')
        @_hasFocus = false
        @_forceRedraw()
      @root.on 'focusin.timeline', (e) =>
        hovered = document.querySelector("#{@scope('.date-label')}:hover")
        @_onLabelClick(currentTarget: hovered) if hovered?
        @root.addClass('hasfocus')
        @_forceRedraw()
        # We want click behavior when we have focus, but not when the focus came from the
        # click's mousedown.  Ugh.
        setTimeout((=> @_hasFocus = true), 500)

    destroy: ->
      @root.find('svg').remove()
      @root.off('.timeline')
      super()

    range: ->
      # Query and draw bounds that are 3x wider than needed, centered on the visible range.
      # This prevents an in-progress drag from needing to redraw or re-query
      {start, end} = this
      span = end - start
      [start - span, end + span, RESOLUTIONS[@_zoom - 2]]

    startTime: ->
      @start

    endTime: ->
      @end

    show: ->
      @root.show()
      @_setHeight()
      null

    hide: ->
      @root.hide()
      @_setHeight()
      @focus()
      null

    loadstart: (id, start, end, resolution) ->
      match = @root[0].getElementsByClassName(id)
      if match.length > 0
        match[0].setAttribute('class', "#{match[0].getAttribute('class')} #{@scope('loading')}")
        @_empty(match[0])

    data: (id, start, end, resolution, intervals, color) =>
      @_loadedRange = [start, end, resolution]
      @_data[id] = [start, end, resolution, intervals, color]
      @_drawData(id)
      @_drawIndicators(id)

    _drawIndicators: (id) =>
      dataset = null
      for dataset in @_datasets
        break if dataset.id == id
      return unless dataset?

      [_, _, _, intervals, color] = @_data[id]
      color = color ? '#25c85b'
      intervals = @_data[id][3]

      ds_start = if dataset.time_start then new Date(dataset.time_start) else new Date(0)
      ds_end = if dataset.time_end then new Date(dataset.time_end) else new Date()

      before_start =
        ds_end < @start ||
        intervals.length > 0 && intervals[intervals.length - 1][1] * 1000 < @start

      after_end =
        ds_start > @end ||
        intervals.length > 0 && intervals[0][0] * 1000 > @end

      before_color = if before_start then color else 'transparent'
      after_color = if after_end then color else 'transparent'
      document.getElementById("arrow-left-#{id}").setAttribute('style', "fill: #{before_color}")
      document.getElementById("arrow-right-#{id}").setAttribute('style', "fill: #{after_color}")
      null

    _drawData: (id) ->
      index = -1
      for dataset, i in @_datasets
        if dataset.id == id
          index = i
          break
      return if index == -1

      zoom = @_zoom

      [start, end, resolution, intervals, color] = @_data[id] ? [@start - 1 , @end + 1, RESOLUTIONS[zoom - 2], [], null]

      match = @root[0].getElementsByClassName(id)
      el = null
      if match.length > 0
        el = match[0]
        @_empty(el)
        el.parentNode.removeChild(el)
      else
        el = @_buildSvgElement('g')
        @_translate(el, 0, DATASET_HEIGHT * index) if index > 0

      for [startTime, endTime, _] in intervals
        startPos = @timeToPosition(startTime * 1000)
        endPos = @timeToPosition(endTime * 1000)
        attrs =
          x: startPos
          y: 5
          width: endPos - startPos
          height: DATASET_HEIGHT - 7
          rx: 10
          ry: 10
        attrs['class'] = @scope('imprecise') if resolution != RESOLUTIONS[zoom - 2]
        rect = @_buildSvgElement 'rect', attrs
        rect.setAttribute('style', "fill: #{color}") if color?
        el.appendChild(rect)

      # Remove 'timeline-loading' class
      el.setAttribute('class', "#{id} #{@scope('data')}")

      @tlDatasets.appendChild(el)

      @_drawIndicators(id)

      null

    _onDataMouseover: (e) =>
      tooltip = $('.timeline-tooltip')
      data = e.target

      id = data.parentNode.className.baseVal.split(' ')[0]
      intervals = @_data[id][3]
      nodes = $(e.currentTarget.childNodes)
      interval = intervals[nodes.index(data)]
      start = interval[0] * 1000
      stop = interval[1] * 1000
      tooltip.find('.inner').text(dateUtil.timeSpanToHumanUTC(start, stop))

      matrix = data.getScreenCTM()
      leftEdge = matrix.e + data.x.baseVal.value
      rightEdge = leftEdge + data.width.baseVal.value
      leftEdge = 0 if leftEdge < 0
      rightEdge = window.innerWidth if rightEdge > window.innerWidth
      tooltip.css("left", ((leftEdge + rightEdge)/2 - tooltip.width()/2) + "px")
      dataTop = matrix.f
      timelineTop = $('.timeline').offset().top
      tooltip.css("top", (dataTop - timelineTop  - 33) + "px")

      tooltip.show()

    _onDataMouseout: (e) =>
      $('.timeline-tooltip').hide()

    _forceRedraw: ->
      rect = @_buildRect(stroke: 'none', fill: 'none')
      svg = @svg
      svg.appendChild(rect)
      callback =  -> svg.removeChild(rect)
      if window.requestAnimationFrame
        window.requestAnimationFrame(callback)
      else
        setTimeout(callback)

    refresh: ->
      @datasets(@_datasets)

    datasets: (datasets) ->
      if datasets?.length > 0
        @_datasets = datasets
        @_updateDatasetNames()
        @_drawTemporalBounds()
        @_empty(@tlDatasets)
        @_data = {}
        @show()
      else
        @hide()

      @_datasets

    timeSpanToPx: (t) ->
      t / @scale

    pxToTimeSpan: (p) ->
      @scale / p

    timeToPosition: (t) ->
      {originPx, start, scale} = this
      originPx + (t - start) / scale

    positionToTime: (p) ->
      {originPx, start, scale} = this
      Math.floor((p - originPx) * scale + start)

    zoomIn: ->
      @root.trigger('buttonzoom')
      @_deltaZoom(-1)

    zoomOut: ->
      @root.trigger('buttonzoom')
      @_deltaZoom(1)

    zoom: (arg) ->
      if arg?
        @_deltaZoom(arg - @_zoom)
        null
      else
        @_zoom

    center: (arg) ->
      if arg?
        @panToTime(arg + (@end - @start) / 2)
        null
      else
        Math.round((@end + @start) / 2)

    _deltaZoom: (levels, center_t=@center()) ->
      @_zoom = Math.min(Math.max(@_zoom + levels, 2), ZOOM_LEVELS.length - 1)

      @root.toggleClass(@scope('max-zoom'), @_zoom == ZOOM_LEVELS.length - 1)
      @root.toggleClass(@scope('min-zoom'), @_zoom == 2)

      # We want to zoom in a way that keeps the center_t at the same pixel so you
      # can double-click or scoll-wheel to zoom and your mouse stays over the same time

      x = @timeToPosition(center_t)

      timeSpan = ZOOM_LEVELS[@_zoom]

      scale = timeSpan / @width

      @start = center_t - (scale * (x - @originPx))
      @end = @start + timeSpan

      @scale = scale

      @focus()
      @_updateTimeline()
      @_drawTemporalBounds()

    focus: (t0, t1) ->
      if  Math.abs(t0 - @_focus) < 1000
        return unless @_hasFocus # Regaining input focus, don't do anything (EDSC-323)
        t0 = null
      @_focus = t0

      root = @root
      overlay = @focusOverlay
      @_empty(overlay)

      if t0?
        root.trigger(@scopedEventName('focusset'), [t0, t1, RESOLUTIONS[@_zoom - 1]])
        startPt = @timeToPosition(t0)
        stopPt = @timeToPosition(t1)

        left = @_buildRect(class: @scope('unfocused'), x1: startPt)
        overlay.appendChild(left)

        right = @_buildRect(class: @scope('unfocused'), x: stopPt)
        overlay.appendChild(right)
      else
        root.trigger(@scopedEventName('focusremove'))
      @_forceRedraw()
      null

    panToTime: (time) ->
      @_pan(@timeSpanToPx(@end - time))

    _getTransformX: getTransformX

    _onKeydown: (e) =>
      focus = @_focus
      key = e.keyCode
      left = 37
      up = 38
      right = 39
      down = 40
      if focus && (key == left || key == right)
        @root.trigger('arrowpan')
        zoom = @_zoom - 1

        focusEnd = @_roundTime(focus, zoom, 1)

        if key == left
          t0 = @_roundTime(focus, zoom, -1)
          t1 = focus - 1
          dx = @timeSpanToPx(focusEnd - focus)
        else
          t0 = focusEnd
          t1 = @_roundTime(focus, zoom, 2) - 1
          dx = -@timeSpanToPx(t1 - t0)

        if @_canFocusTimespan(t0, t1)
          @_pan(dx)
          @focus(t0, t1)

    _canFocusTimespan: (start, stop) ->
      return true if @globalTemporal.intersect(start, stop)?
      for dataset in @_datasets
        dataset.granulesModel.temporal.applied.intersect(start, stop)?
      false

    _timespanForLabel: (group) ->
      next = group.previousSibling

      x0 = @_getTransformX(group)
      x1 = @_getTransformX(next, x0)

      [@positionToTime(x0), @positionToTime(x1) - 1]

    _onLabelClick: (e) =>
      return if @_dragging
      @root.trigger('clicklabel')
      label = e.currentTarget
      [start, stop] = @_timespanForLabel(label)
      if @_canFocusTimespan(start, stop)
        @focus(start, stop)

    _onLabelMouseover: (e) =>
      label = e.currentTarget
      [start, stop] = @_timespanForLabel(label)
      unless @_canFocusTimespan(start, stop)
        label.setAttribute('class', "#{@scope('date-label')} #{@scope('nofocus')}")

    _onLabelMouseout: (e) =>
      label = e.currentTarget
      label.setAttribute('class', @scope('date-label'))

    _contains: (start0, end0, start1, end1) ->
      start0 < start1 < end0 && start0 < end1 < end0

    _empty: (node) ->
      $(node).empty()
      # node.innerHTML = '' # Works for browsers but not capybara-webkit

    _buildSvgElement: buildSvgElement

    _translate: (el, x, y) ->
      el.setAttribute('transform', "translate(#{x}, #{y})")
      el

    _createDisplay: ->
      @svg = svg = @_buildSvgElement('svg', class: @scope('display'))

      offset = @root.find(@scope('.tools')).width()

      selection = @_createSelectionOverlay(svg)
      @_translate(selection, offset, 0)

      top = @_buildRect(class: @scope('display-top'), y: 0, y1: TOP_HEIGHT)
      @_setupTemporalSelection(top)
      @_translate(top, offset, 0)

      focus = @_createFocusOverlay(svg)
      @_translate(focus, offset, 0)

      overlay = @_createFixedOverlay(svg)
      @_translate(overlay, offset, 0)

      timeline = @_createTimeline(svg)
      @_translate(timeline, offset, 0)

      svg.appendChild(timeline)
      svg.appendChild(top)
      svg.appendChild(overlay)
      svg.appendChild(selection)
      svg.appendChild(focus)

      @_setupDragBehavior(svg)
      @_setupScrollBehavior(svg)

      svg

    _setupTemporalSelection: (el) ->
      self = this
      root = @root

      $(el).on 'click', =>
        for dataset in @_datasets
          dataset.granulesModel.temporal.applied.clear()
        @globalTemporal.clear()

      draggable = new TimelineDraggable(el)

      left = null
      right = null

      draggable.on 'dragstart', ({end}) =>
        overlay = @selectionOverlay
        @_empty(overlay)
        [left, right] = @_createSelectionRegion(overlay, end, end, @globalTemporal, [0...@_datasets.length])

      draggable.on 'drag', (e) -> right._onUpdate(e)
      draggable.on 'dragend', (e) ->
        root.trigger('createdtemporal')
        right._onEnd(e)

    _setupScrollBehavior: (svg) ->
      allowWheel = true

      rateLimit = ->
        allowWheel = false
        setTimeout((-> allowWheel = true), 300)

      getTime = (e) =>
        draggable = @root.find(@scope('.draggable'))[0]
        origin = @_getTransformX(draggable)

        x = e.clientX - svg.clientLeft - origin
        time = @positionToTime(x)

      doScroll = (deltaX, deltaY, time) =>
        return unless allowWheel
        if Math.abs(deltaY) > Math.abs(deltaX)
          levels = if deltaY > 0 then -1 else 1
          @root.trigger('scrollzoom')
          @_deltaZoom(levels, time)
          rateLimit()
        else if deltaX != 0
          @root.trigger('scrollpan')
          @_pan(deltaX)

      # Safari
      L.DomEvent.on svg, 'mousewheel', (e) ->
        deltaX = e.wheelDeltaX
        deltaY = e.wheelDeltaY
        doScroll(deltaX, deltaY, getTime(e))

        e.preventDefault()

      # Chrome/Firefox
      L.DomEvent.on svg, 'wheel', (e) ->
        return if e.type == "mousewheel"

        # 'wheel' deltas are opposite from 'mousewheel'
        deltaX = -e.deltaX
        deltaY = -e.deltaY
        doScroll(deltaX, deltaY, getTime(e))

        e.preventDefault()

      touchSeparation = 0
      touchCenter = 0
      L.DomEvent.on svg, 'touchstart', (e) ->
        return unless e.touches && e.touches.length == 2
        center = (e.touches[0].clientX + e.touches[1].clientX) / 2
        time = getTime(clientX: center)
        touchSeparation = Math.abs(e.touches[0].clientX - e.touches[1].clientX)
        e.preventDefault()

      L.DomEvent.on svg, 'touchmove', (e) ->
        return unless e.touches && e.touches.length == 2
        deltaY = Math.abs(e.touches[0].clientX - e.touches[1].clientX) - touchSeparation
        doScroll(0, -deltaY, touchCenter)

    _setupDragBehavior: (svg) ->
      self = this
      draggable = new TimelineDraggable(svg)
      draggable.on 'drag', ({dx}) =>
        @_dragging = true if Math.abs(dx) > 5
        @_pan(dx, false)
      draggable.on 'dragend', ({dx}) =>
        @root.trigger('draggingpan')
        @_dragging = false
        @_pan(dx)

    _pan: (dx, commit=true) ->
      @_startPan() unless @_panStart?

      start = @_panStart
      end = @_panEnd

      span = end - start
      @start = start - dx * @scale
      @end = @start + span

      @originPx = -(@_panStartX + dx) # x offset from its original position

      draggables = @root.find([@scope('.draggable'), @scope('.selection'), @scope('.display-top'), @scope('.focus')].join(', '))
      draggables.attr('transform', "translate(#{-@originPx + OFFSET_X},0)")
      @_forceRedraw()

      @_finishPan() if commit

    _startPan: ->
      draggable = @root.find(@scope('.draggable'))[0]
      @_panStartX = @_getTransformX(draggable, OFFSET_X) - OFFSET_X
      @_panStart = @start
      @_panEnd = @end

    _finishPan: =>
      @_updateTimeline()
      @_panStartX = @_panStart = @_panEnd = null

    _createSelectionOverlay: (svg) ->
      @selectionOverlay = @_buildSvgElement('g', class: @scope('selection'))

    _createFocusOverlay: (svg) ->
      @focusOverlay = @_buildSvgElement('g', class: @scope('focus'))

    _createFixedOverlay: (svg) ->
      @overlay = overlay = @_buildSvgElement('g', class: @scope('overlay'))

      @olDatasets = datasets = @_buildSvgElement('g', class: @scope('dataset'))
      @_translate(datasets, 5, DATASET_TEXT_OFFSET)

      overlay.appendChild(datasets)

      overlay

    _createTimeline: (svg) ->
      @timeline = timeline = @_buildSvgElement('g', class: @scope('draggable'))

      background = @_buildSvgElement 'rect',
        class: @scope('background')
        x: MIN_X
        y: MIN_Y
        width: MAX_X - MIN_X
        height: MAX_Y - MIN_Y

      @tlDatasets = datasets = @_buildSvgElement('g')
      @_translate(datasets, 0, TOP_HEIGHT)

      @axis = axis = @_buildSvgElement('g')
      @_translate(axis, 0, TOP_HEIGHT)

      timeline.appendChild(background)
      timeline.appendChild(axis)
      timeline.appendChild(datasets)

      timeline

    _buildIndicatorArrow: (id, transform) ->
      g = @_buildSvgElement('g',
        class: @scope('indicator'),
        id: id,
        transform: transform)
      g.appendChild(@_buildSvgElement('path', d: 'M 0 -5 L 6 1 L 8 -1 L 4 -5 L 8 -9 L 6 -11 z'))
      g.appendChild(@_buildSvgElement('path', d: 'M 5 -5 L 11 1 L 13 -1 L 9 -5 L 13 -9 L 11 -11 z'))
      g

    _updateDatasetNames: ->
      datasets = @_datasets
      overlay = @olDatasets
      @_empty(overlay)
      y = 0

      textGroup = @_buildSvgElement('g')

      for dataset in datasets
        overlay.appendChild(@_buildIndicatorArrow("arrow-left-#{dataset.id}", "translate(0, #{y})"))
        overlay.appendChild(@_buildIndicatorArrow("arrow-right-#{dataset.id}", "translate(#{@width - 10}, #{y - 10}) rotate(180)"))

        txt = @_buildSvgElement('text', x: 15, y: y)
        txt.textContent = dataset.title
        textGroup.appendChild(txt)
        y += DATASET_HEIGHT

      overlay.appendChild(textGroup)

      fn = =>
        bbox = textGroup.getBBox()
        rect = @_buildSvgElement('rect', x: bbox.x, y: -DATASET_FONT_HEIGHT - DATASET_PADDING, width: bbox.width, height: y, class: @scope('shadow'))
        overlay.insertBefore(rect, overlay.firstChild) if overlay.firstChild
      setTimeout(fn, 0)

      null

    _updateTimeline: ->
      {axis, timeline, start, end, root} = this
      zoom = @_zoom

      @_empty(axis)

      root.find('h1').text(RESOLUTIONS[zoom - 1])

      line = @_buildSvgElement('line', class: @scope('timeline'), x1: MIN_X, y1: 0, x2: MAX_X, y2: 0)
      axis.appendChild(line)

      elWidth = root.width()
      elWidth = $(window).width() if elWidth == 0

      @width = width = $(window).width() - root.find(@scope('.tools')).width()
      @scale = (end - start) / width # ms per pixel

      range = @range()

      @_drawIntervals(range[0], range[1], zoom - 1)

      for own k, _ of @_data
        @_drawData(k)

      resolution = range[2]
      [loadedStart, loadedEnd, loadedResolution] = @_loadedRange
      unless loadedResolution == resolution && @_contains(loadedStart, loadedEnd, start, end)
        for node in @tlDatasets.childNodes
          node.setAttribute('class', "#{node.getAttribute('class')} #{@scope('loading')}")

      root.trigger(@scopedEventName('rangechange'), range)

    _drawTemporalBounds: ->
      overlay = @selectionOverlay
      datasets = @_datasets
      @_empty(overlay)

      return unless datasets.length > 0

      globalIndexes = []
      for dataset, index in datasets
        temporal = dataset.granulesModel.temporal.applied
        if temporal.isSet()
          @_createTemporalRegion(overlay, temporal, [index])
        else
          globalIndexes.push(index)

      @globalTemporal = datasets[0].query.temporal.applied
      @_createTemporalRegion(overlay, @globalTemporal, globalIndexes)

    _createSelectionRegion: (overlay, x0, x1, temporal, indexes) ->
      left = new TemporalFencepost(overlay, x0)
      right = new TemporalFencepost(overlay, x1)

      update = ->
        leftX = Math.min(left.x, right.x)
        rightX = Math.max(left.x, right.x)
        temporal.start.date(new Date(@positionToTime(leftX)))
        temporal.stop.date(new Date(@positionToTime(rightX)))
        @root.trigger(@scopedEventName('temporalchange'))
        null

      left.on 'commit', update, this
      right.on 'commit', update, this
      left.on 'update', @_forceRedraw, this
      right.on 'update', @_forceRedraw, this

      for index in indexes
        new TemporalSelection overlay, left, right,
          class: @scope('selection-region')
          y: TOP_HEIGHT + DATASET_HEIGHT * index
          height: DATASET_HEIGHT
      [left, right]

    _createTemporalRegion: (overlay, temporal, indexes) ->
      for [start, stop] in temporal.ranges()
        @_createSelectionRegion(overlay, @timeToPosition(start), @timeToPosition(stop), temporal, indexes)

    _buildRect: (attrs) ->
      attrs = $.extend({x: MIN_X, x1: MAX_X, y: MIN_Y, y1: MAX_Y}, attrs)
      attrs['width'] ?= (attrs.x1 - attrs.x) | 0
      attrs['height'] ?= (attrs.y1 - attrs.y) | 0
      delete attrs.x1
      delete attrs.y1
      @_buildSvgElement 'rect', attrs

    _roundTime: (time, zoom, increment=0) ->
      time = Math.round(time / 1000) * 1000
      date = new Date(time)
      components = (date["getUTC#{c}"]() for c in ['FullYear', 'Month', 'Date', 'Hours', 'Minutes'])
      components = components.slice(0, Math.max(components.length - zoom, 1))
      # Zoom to decade
      if zoom == ZOOM_LEVELS.length - 2
        components[0] = Math.floor(components[0] / 10) * 10
        increment *= 10

      components[components.length - 1] += increment
      components.push(0) if components.length == 1
      Date.UTC(components...)

    _drawIntervals: (start, end, zoom) ->
      axis = @axis

      start = @_roundTime(start, zoom)
      end = @_roundTime(end, zoom)

      time = end

      while time >= start
        date = new Date(time)
        prev = @_roundTime(time, zoom, -1)
        next = @_roundTime(time, zoom, 1)
        interval = @_buildIntervalDisplay(@timeToPosition(time), @timeToPosition(next), LABELS[zoom](date)...)
        axis.appendChild(interval)
        time = prev

    _buildIntervalDisplay: (x0, x1, text, subText) ->
      g = @_buildSvgElement('g', class: @scope('date-label'))
      @_translate(g, x0, 0)
      width = x1 - x0

      if x1?
        # Something to click on
        bg = @_buildSvgElement 'rect',
          x: 0
          y: 0
          width: width
          height: MAX_Y - MIN_Y
        g.appendChild(bg)

      label = @_buildSvgElement('text', x: 5, y: 20, class: "#{@scope('axis-label')} #{@scope('axis-super-label')}")
      label.textContent = text

      lineClass = @scope('tick')
      lineClass += ' ' + @scope('interval-start') if subText
      line = @_buildSvgElement('line', class: lineClass, x1: 0, y1: MIN_Y, x2: 0, y2: MAX_Y)

      circle = @_buildSvgElement('circle', class: @scope('tick-crossing'), r: 6, cx: width)

      g.appendChild(line)
      g.appendChild(circle)
      g.appendChild(label)

      if subText
        subLabel = @_buildSvgElement('text', x: 5, y: 34, class: "#{@scope('axis-label')} #{@scope('axis-sub-label')}")
        subLabel.textContent = subText
        g.appendChild(subLabel)

      g

    _setHeight: ->
      if @_datasets?.length > 0
        datasetsHeight = @_datasets.length * DATASET_HEIGHT + 2 * DATASET_PADDING
        @_translate(@axis, 0, TOP_HEIGHT + datasetsHeight)
        totalHeight = Math.max(TOP_HEIGHT + datasetsHeight + AXIS_HEIGHT, 100)
        @root.height(totalHeight)
        $(@svg).height(totalHeight)

      $('.master-overlay').masterOverlay().masterOverlay('contentHeightChanged')

  plugin.create('timeline', Timeline)
