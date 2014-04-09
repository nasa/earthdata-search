do (document, $=jQuery, config=@edsc.config, plugin=@edsc.util.plugin, string=@edsc.util.string, dateUtil=@edsc.util.date) ->
  # Height for the top area, where arrows are drawn for date selection
  TOP_HEIGHT = 19

  # Height for each dataset, including any necessary margins
  DATASET_HEIGHT = 26

  DATASET_FONT_HEIGHT = 14

  DATASET_PADDING = 5

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

      @_updateTimeline()
      #console.log 'zoom', @zoom, x, new Date(@start).toISOString(), new Date(@end).toISOString(), new Date(center_t).toISOString()

    #_overlaps: (start0, end0, start1, end1) ->
    #  start0 < start1 < end0 || start0 < end1 < end0 || (start1 < start0 && end0 < end1)

    _contains: (start0, end0, start1, end1) ->
      start0 < start1 < end0 && start0 < end1 < end0

    _empty: (node) ->
      $(node).empty()
      # node.innerHTML = '' # Works for browsers but not capybara-webkit

    _buildSvgElement: (name, attrs={}) ->
      el = document.createElementNS(SVG_NS, name)
      for own attr, value of attrs
        el.setAttribute(attr, value) if value?
      el

    _translate: (el, x, y) ->
      el.setAttribute('transform', "translate(#{x}, #{y})")
      el

    _createDisplay: ->
      @svg = svg = @_buildSvgElement('svg', class: @scope('display'))

      offset = @root.find(@scope('.tools')).width()

      selection = @_createSelectionOverlay(svg)
      @_translate(selection, offset, 0)

      overlay = @_createFixedOverlay(svg)
      @_translate(overlay, offset, 0)

      timeline = @_createTimeline(svg)
      @_translate(timeline, offset, 0)

      svg.appendChild(timeline)
      svg.appendChild(overlay)
      svg.appendChild(selection)

      @_setupDragBehavior(svg)
      @_setupScrollBehavior(svg)

      svg

    _setupScrollBehavior: (svg) ->
      allowWheel = true

      rateLimit = ->
        allowWheel = false
        setTimeout((-> allowWheel = true), 100)

      L.DomEvent.on svg, 'mousewheel', (e) =>
        return unless allowWheel

        transform = @root.find(@scope('.draggable')).attr('transform')
        origin = parseInt(/^[^\d]*(\d+),/.exec(transform)?[1] ? 0, 10)

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
      L.DomUtil.setPosition(svg, L.point(0, 0), true)

      self = this
      draggable = new L.Draggable(svg)
      draggable._updatePosition = ->
        @fire('predrag')
        self._pan(@_newPos.x, false)
        @fire('drag')
      draggable.on 'dragend', (e) ->
        self._pan(@_newPos.x - @_startPos.x)

      draggable.enable()

    _pan: (dx, commit=true) ->
      @_startPan() unless @_panTransform

      start = @_panStart
      end = @_panEnd
      originalTransform = @_panTransform
      present = config.present()

      span = end - start
      @start = start - dx * @scale
      @end = @start + span

      if @end > present
        @end = present
        @start = present - span
        dx = -Math.floor((@start - start) / @scale)
      @originPx = -(@_panStartX + dx) # x offset from its original position

      t = if originalTransform?.length > 0 then 'T' else 't'

      draggables = @root.find([@scope('.draggable'), @scope('.selection')].join(', '))
      draggables.attr('transform', "translate(#{-@originPx + @_panX0},0)")

      @_finishPan() if commit

    _startPan: ->
      @_panTransform = @root.find(@scope('.draggable')).attr('transform')

      xRe = /^[^\d]*(\d+),/
      match = xRe.exec(@_panTransform)
      @_panX0 = 64
      @_panStartX = parseInt(match?[1] ? @_panX0, 10) - @_panX0
      @_panStart = @start
      @_panEnd = @end

    _finishPan: =>
      @_updateTimeline()
      @_panTransform = @_panStart = @_panEnd = null

    _createSelectionOverlay: (svg) ->

      @selectionOverlay = selection = @_buildSvgElement('g', class: @scope('selection'))
      selection

    _createFixedOverlay: (svg) ->
      @overlay = overlay = @_buildSvgElement('g', class: @scope('overlay'))

      rect = @_buildSvgElement('rect', class: @scope('display-top'), width: 10000, height: TOP_HEIGHT)

      @olDatasets = datasets = @_buildSvgElement('g', class: @scope('dataset'))
      @_translate(datasets, 5, DATASET_TEXT_OFFSET)

      overlay.appendChild(rect)
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
        txt.innerHTML = dataset.title()
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

      global = datasets[0].query.temporal().ranges()

      fenceposts = []

      for [start, stop] in global
        fenceposts.push(start)
        fenceposts.push(stop)

      if datasets.length > 0
        # TODO: It's kind of a mess the way temporal is specified differently between datasets
        #       and granules.  For datasets, there's an observable TemporalCondition in the query.
        #       For granules, there's a non-observable Temporal on the object itself which has a
        #       query.
        for dataset, index in datasets
          # OMG law of demeter
          ranges = dataset.granulesModel.temporal.applied.ranges()
          isGlobal = ranges.length == 0
          if isGlobal
            ranges = global
          for range in ranges
            @_drawSelectionArea(overlay, range, TOP_HEIGHT + DATASET_HEIGHT * index, DATASET_HEIGHT)
            unless isGlobal
              fenceposts.push(range[0])
              fenceposts.push(range[1])

      for time in fenceposts
        @_drawFencepost(overlay, time)

      null

    _drawFencepost: (parent, time) ->
      timePt = @timeToPosition(time)
      offsetTop = 0
      halfwidth = 10
      height = 10
      line = @_buildSvgElement('line', x1: timePt, y1: offsetTop + height, x2: timePt, y2: MAX_Y)
      triangle = @_buildSvgElement 'path', d: "m#{timePt-halfwidth} #{offsetTop} l #{halfwidth} #{height} l #{halfwidth} #{-height} z"

      parent.appendChild(line)
      parent.appendChild(triangle)

    _drawSelectionArea: (parent, range, offset, height) ->
      startPt = @timeToPosition(range[0])
      stopPt = @timeToPosition(range[1])

      rect = @_buildSvgElement 'rect',
        class: @scope('selection-region')
        x: startPt
        y: offset
        width: stopPt - startPt
        height: height
      parent.appendChild(rect)
      rect

    _roundTime: (time, zoom, decrement=false) ->
      date = new Date(time)
      components = (date["getUTC#{c}"]() for c in ['FullYear', 'Month', 'Date', 'Hours', 'Minutes'])
      components = components.slice(0, components.length - zoom)
      components[components.length - 1]-- if decrement
      components.push(0) if components.length == 1
      Date.UTC(components...)

    _drawIntervals: (start, end, zoom) ->
      axis = @axis

      start = @_roundTime(start, zoom)
      end = @_roundTime(end, zoom)

      # Wrong for months and leap years
      timespan = ZOOM_LEVELS[zoom]

      time = end

      while time >= start
        date = new Date(time)
        interval = @_buildIntervalDisplay(@timeToPosition(time), 0, LABELS[zoom](date)...)
        axis.appendChild(interval)
        time = @_roundTime(time, zoom, true)

    _buildIntervalDisplay: (x, y, text, subText) ->
      g = @_buildSvgElement('g', class: @scope('date-label'))
      @_translate(g, x, y)

      label = @_buildSvgElement('text', x: 5, y: y + 20, class: "#{@scope('axis-label')} #{@scope('axis-super-label')}")
      label.innerHTML = text

      line = @_buildSvgElement('line', class: @scope('tick'), x1: 0, y1: MIN_Y, x2: 0, y2: MAX_Y)

      circle = @_buildSvgElement('circle', class: @scope('tick-crossing'), r: 6)

      g.appendChild(line)
      g.appendChild(circle)
      g.appendChild(label)

      if subText
        subLabel = @_buildSvgElement('text', x: 5, y: y + 34, class: "#{@scope('axis-label')} #{@scope('axis-sub-label')}")
        subLabel.innerHTML = subText
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
