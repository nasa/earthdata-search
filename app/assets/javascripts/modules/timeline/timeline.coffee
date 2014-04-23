do (document, $=jQuery, config=@edsc.config, plugin=@edsc.util.plugin, string=@edsc.util.string, dateUtil=@edsc.util.date) ->
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

  MIN_X = -1000000
  MIN_Y = -1000000
  MAX_X = 1000000
  MAX_Y = 1000000

  formatTime = (date) -> string.padLeft(date.getUTCHours(), '0', 2) + ':' + string.padLeft(date.getUTCMinutes(), '0', 2)
  formatDay = (date) -> string.padLeft(date.getUTCDate(), '0', 2)
  formatMonth = (date) -> MONTHS[date.getUTCMonth()]
  formatDate = (date) -> formatMonth(date) + ' ' + formatDay(date)
  formatYear = (date) -> date.getUTCFullYear()

  LABELS = [
    ((date) -> [formatTime(date), formatDate(date)]),
    ((date) -> [formatTime(date), formatDate(date)]),
    ((date) -> [formatDay(date), formatMonth(date)]),
    ((date) -> [formatMonth(date), formatYear(date)]),
    ((date) -> [formatYear(date)]),
    ((date) -> [formatYear(date)])
  ]

  RESOLUTIONS = [
    'minute',
    'hour',
    'day',
    'month',
    'year',
    'decade'
  ]

  ZOOM_LEVELS = [
    MS_PER_MINUTE,
    MS_PER_HOUR,
    MS_PER_DAY,
    MS_PER_MONTH,
    MS_PER_YEAR,
    MS_PER_DECADE
  ]


  updateSvgElement = (el, attrs={}) ->
    for own attr, value of attrs
      el.setAttribute(attr, value) if value?
    el

  buildSvgElement = (name, attrs={}) ->
    updateSvgElement(document.createElementNS(SVG_NS, name), attrs)


  getTransformX = (el, defaultValue=0) ->
    return defaultValue unless el
    re = /^[^\d\-]*(-?[\d\.]+),/
    transform = el.getAttribute('transform') ? el.parentNode.getAttribute('transform')
    parseFloat(re.exec(transform)?[1] ? defaultValue)

  TimelineDraggable = L.Draggable.extend
    initialize: (element, dragStartTarget) ->
      @on 'dragstart predrag drag dragend', ((e) -> L.Util.extend(e, @state())), this

      L.DomUtil.setPosition(element, L.point(0, 0), true)
      L.Draggable.prototype.initialize.call(this, element, dragStartTarget)

      @enable()

    state: ->
      offset = getTransformX(@_element)
      {dx: @_newPos.x - @_startPos.x, start: @_startPoint.x - offset, end: @_startPoint.x + @_newPos.x - offset}

    _updatePosition: ->
      @fire('predrag')
      @fire('drag')

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

      @root.append(@_createDisplay())

      @_data = {}

      @zoom = 3
      @end = config.present()
      @start = @end - MS_PER_MONTH
      @originPx = 0

      @_loadedRange = []

      @_updateTimeline()

      @root.on 'click', @scope('.date-label'), @_onLabelClick
      @root.on 'keydown', @_onKeydown

    destroy: ->
      @root.find('svg').remove()
      super()

    range: ->
      # Query and draw bounds that are 3x wider than needed, centered on the visible range.
      # This prevents an in-progress drag from needing to redraw or re-query
      {start, end, zoom} = this
      span = end - start
      [start - span, end + span, RESOLUTIONS[zoom - 2]]

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
      @root.find(@scope('.tools')).addClass('busy')
      match = @svg.getElementsByClassName(id)
      if match.length > 0
        match[0].setAttribute('class', "#{match[0].getAttribute('class')} #{@scope('loading')}")
        @_empty(match[0])

    data: (id, start, end, resolution, intervals) =>
      @_loadedRange = [start, end, resolution]
      @_data[id] = [start, end, resolution, intervals]
      @_drawData(id)

    _drawData: (id) ->
      index = -1
      for dataset, i in @_datasets
        if dataset.id() == id
          index = i
          break
      return if index == -1

      zoom = @zoom

      [start, end, resolution, intervals] = @_data[id] ? [@start - 1 , @end + 1, RESOLUTIONS[zoom - 2], []]

      match = @svg.getElementsByClassName(id)
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
        rect = @_buildSvgElement 'rect',
          class: @scope('imprecise') if resolution != RESOLUTIONS[zoom - 2]
          x: startPos
          y: 5
          width: endPos - startPos
          height: DATASET_HEIGHT - 7
          rx: 10
          ry: 10
        el.appendChild(rect)

      # Remove 'timeline-loading' class
      el.setAttribute('class', "#{id} #{@scope('data')}")

      @tlDatasets.appendChild(el)
      children = @tlDatasets.childNodes
      loading = @tlDatasets.getElementsByClassName(@scope('loading'))

      if children.length == @_datasets.length && loading.length == 0 && @_contains(start, end, @start, @end)
        @root.find(@scope('.tools')).removeClass('busy')
      null

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
     @_zoom(-1)

    zoomOut: ->
     @_zoom(1)

    _zoom: (levels, center_t=(@end + @start) / 2) ->
      @zoom = Math.min(Math.max(@zoom + levels, 2), ZOOM_LEVELS.length - 1)

      @root.toggleClass(@scope('max-zoom'), @zoom == ZOOM_LEVELS.length - 1)
      @root.toggleClass(@scope('min-zoom'), @zoom == 2)

      # We want to zoom in a way that keeps the center_t at the same pixel so you
      # can double-click or scoll-wheel to zoom and your mouse stays over the same time

      x = @timeToPosition(center_t)

      timeSpan = ZOOM_LEVELS[@zoom]

      scale = timeSpan / @width

      @start = center_t - (scale * (x - @originPx))
      @end = @start + timeSpan

      present = config.present()

      if @end > present
        @end = present
        @start = @end - timeSpan

      @scale = scale

      @focus()
      @_updateTimeline()
      #console.log 'zoom', @zoom, x, new Date(@start).toISOString(), new Date(@end).toISOString(), new Date(center_t).toISOString()

    focus: (t0, t1) ->
      root = @root
      overlay = @focusOverlay
      @_empty(overlay)

      console.log "t0: #{t0}, @_focus: #{@_focus}"
      t0 = null if Math.abs(t0 - @_focus) < 1000
      @_focus = t0

      if t0?
        root.trigger(@scopedEventName('focusset'), [t0, t1, RESOLUTIONS[@zoom - 1]])
        startPt = @timeToPosition(t0)
        stopPt = @timeToPosition(t1)

        left = @_buildRect(class: @scope('unfocused'), x1: startPt)
        overlay.appendChild(left)

        right = @_buildRect(class: @scope('unfocused'), x: stopPt)
        overlay.appendChild(right)
      else
        root.trigger(@scopedEventName('focusremove'))

      null

    _getTransformX: getTransformX

    _onKeydown: (e) =>
      focus = @_focus
      key = e.keyCode
      left = 37
      up = 38
      right = 39
      down = 40
      if focus && (key == left || key == right)
        zoom = @zoom - 1

        focusEnd = @_roundTime(focus, zoom, 1)

        if key == left
          t0 = @_roundTime(focus, zoom, -1)
          t1 = focus
          dx = @timeSpanToPx(focusEnd - focus)
        else
          t0 = focusEnd
          t1 = @_roundTime(focus, zoom, 2)
          dx = -@timeSpanToPx(t1 - t0)

        @_pan(dx)
        @focus(t0, t1)


    _onLabelClick: (e) =>
      group = e.currentTarget
      next = group.nextSibling

      x0 = @_getTransformX(group)
      x1 = @_getTransformX(next, x0)

      @focus(@positionToTime(x0), @positionToTime(x1))

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
      draggable = new TimelineDraggable(el)

      left = null
      right = null

      draggable.on 'dragstart', ({end}) =>
        overlay = @selectionOverlay
        @_empty(overlay)
        [left, right] = @_createSelectionRegion(overlay, end, end, @globalTemporal, [0...@_datasets.length])

      draggable.on 'drag', (e) -> right._onUpdate(e)
      draggable.on 'dragend', (e) -> right._onEnd(e)

    _setupScrollBehavior: (svg) ->
      allowWheel = true

      rateLimit = ->
        allowWheel = false
        setTimeout((-> allowWheel = true), 100)

      L.DomEvent.on svg, 'mousewheel', (e) =>
        return unless allowWheel

        draggable = @root.find(@scope('.draggable'))[0]
        origin = @_getTransformX(draggable)

        x = e.clientX - svg.clientLeft - origin
        time = @positionToTime(x)
        deltaX = e.wheelDeltaX
        deltaY = e.wheelDeltaY
        if Math.abs(deltaY) > Math.abs(deltaX)
          levels = if deltaY > 0 then -1 else 1
          @_zoom(levels, time)
          rateLimit()
        else if deltaX != 0
          @_pan(deltaX)

        e.preventDefault()

    _setupDragBehavior: (svg) ->
      self = this
      draggable = new TimelineDraggable(svg)
      draggable.on 'drag', ({dx}) =>
        @_pan(dx, false)
      draggable.on 'dragend', ({dx}) =>
        @_pan(dx)

    _pan: (dx, commit=true) ->
      @_startPan() unless @_panStart?

      start = @_panStart
      end = @_panEnd
      present = config.present()

      span = end - start
      @start = start - dx * @scale
      @end = @start + span

      if @end > present
        @end = present
        @start = present - span
        dx = -Math.floor((@start - start) / @scale)
      @originPx = -(@_panStartX + dx) # x offset from its original position

      draggables = @root.find([@scope('.draggable'), @scope('.selection'), @scope('.display-top'), @scope('.focus')].join(', '))
      draggables.attr('transform', "translate(#{-@originPx + OFFSET_X},0)")

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

    _updateDatasetNames: ->
      datasets = @_datasets
      overlay = @olDatasets
      @_empty(overlay)
      y = 0
      for dataset in datasets
        txt = @_buildSvgElement('text', y: y)
        txt.textContent = dataset.title()
        overlay.appendChild(txt)
        y += DATASET_HEIGHT
      null

    _updateTimeline: ->
      {axis, timeline, start, end, root, zoom} = this

      @_empty(axis)

      @root.find('h1').text(RESOLUTIONS[zoom - 1])

      line = @_buildSvgElement('line', class: @scope('timeline'), x1: MIN_X, y1: 0, x2: MAX_X, y2: 0)
      axis.appendChild(line)

      @width = width = @root.width() - @root.find(@scope('.tools')).width()
      @scale = (end - start) / width # ms per pixel

      range = @range()

      @_drawIntervals(range[0], range[1], zoom - 1)
      for own k, _ of @_data
        @_drawData(k)

      resolution = range[2]
      [loadedStart, loadedEnd, loadedResolution] = @_loadedRange
      unless loadedResolution == resolution && @_contains(loadedStart, loadedEnd, start, end)
        @root.find(@scope('.tools')).addClass('busy')
        for node in @tlDatasets.childNodes
          node.setAttribute('class', "#{node.getAttribute('class')} #{@scope('loading')}")

      @root.trigger(@scopedEventName('rangechange'), range)

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

      @globalTemporal = datasets[0].query.temporal()
      @_createTemporalRegion(overlay, @globalTemporal, globalIndexes)

    _createSelectionRegion: (overlay, x0, x1, temporal, indexes) ->
      left = new TemporalFencepost(overlay, x0)
      right = new TemporalFencepost(overlay, x1)

      update = ->
        leftX = Math.min(left.x, right.x)
        rightX = Math.max(left.x, right.x)
        temporal.start.date(new Date(@positionToTime(leftX)))
        temporal.stop.date(new Date(@positionToTime(rightX)))
        null

      left.on 'commit', update, this
      right.on 'commit', update, this

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
      attrs['width'] ?= attrs.x1 - attrs.x
      attrs['height'] ?= attrs.y1 - attrs.y
      delete attrs.x1
      delete attrs.y1
      @_buildSvgElement 'rect', attrs

    _roundTime: (time, zoom, increment=0) ->
      date = new Date(time)
      components = (date["getUTC#{c}"]() for c in ['FullYear', 'Month', 'Date', 'Hours', 'Minutes'])
      components = components.slice(0, components.length - zoom)
      components[components.length - 1] += increment
      components.push(0) if components.length == 1
      Date.UTC(components...)

    _drawIntervals: (start, end, zoom) ->
      axis = @axis

      start = @_roundTime(start, zoom)
      end = @_roundTime(end, zoom)

      time = start

      while time <= end
        date = new Date(time)
        next = @_roundTime(time, zoom, 1)
        interval = @_buildIntervalDisplay(@timeToPosition(time), @timeToPosition(next), LABELS[zoom](date)...)
        axis.appendChild(interval)
        time = next

    _buildIntervalDisplay: (x0, x1, text, subText) ->
      g = @_buildSvgElement('g', class: @scope('date-label'))
      @_translate(g, x0, 0)

      if x1?
        # Something to click on
        bg = @_buildSvgElement 'rect',
          x: 0
          y: 0
          width: x1 - x0
          height: MAX_Y - MIN_Y
        g.appendChild(bg)

      label = @_buildSvgElement('text', x: 5, y: 20, class: "#{@scope('axis-label')} #{@scope('axis-super-label')}")
      label.textContent = text

      line = @_buildSvgElement('line', class: @scope('tick'), x1: 0, y1: MIN_Y, x2: 0, y2: MAX_Y)

      circle = @_buildSvgElement('circle', class: @scope('tick-crossing'), r: 6)

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
