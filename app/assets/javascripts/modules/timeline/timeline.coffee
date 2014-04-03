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

  MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  MIN_X = -1000000
  MIN_Y = -1000000
  MAX_X = 1000000
  MAX_Y = 1000000


  class Timeline extends plugin.Base
    constructor: (root, namespace, options={}) ->
      super(root, namespace, options)

      @root.append(@_createDisplay())

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
      {start, end} = this
      span = end - start
      [start - span, end + span]

    show: ->
      @root.show()
      @_setHeight()
      null

    hide: ->
      @root.hide()
      @_setHeight()
      null

    loadstart: (id, start, end) ->
      @root.find(@scope('.tools')).addClass('busy')
      match = @svg.getElementsByClassName(id)
      if match.length > 0
        match[0].setAttribute('class', "#{match[0].getAttribute('class')} #{@scope('loading')}")
        @_empty(match[0])

    data: (id, start, end, intervals) =>
      index = -1
      for dataset, i in @_datasets
        if dataset.id() == id
          index = i
          break
      return if index == -1

      @_loadedRange = [start, end]

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

    datasets: (datasets) ->
      if datasets?.length > 0
        @_datasets = datasets
        @_updateDatasetNames()
        @_drawTemporalBounds()
        @_empty(@tlDatasets)
        @show()
      else
        @hide()

      @_datasets

    timeToPosition: (t) ->
      {originPx, start, scale} = this
      originPx + (t - start) / scale

    positionToTime: (p) ->
      {originPx, start, scale} = this
      (p - originPx) * scale + start

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
        el.setAttribute(attr, value)
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

      svg

    _setupDragBehavior: (svg) ->
      @snap = Snap(svg)

      draggable = @snap.select(@scope('.draggable'))
      selection = @snap.select(@scope('.selection'))
      labels = @snap.select(@scope('.dataset'))
      originalTransform = draggable.transform().local

      xRe = /^t(\d+),/
      match = xRe.exec(originalTransform)
      x0 = parseInt(match?[1] ? 0, 10)
      x = @originPx ?= 0
      start = @start
      end = @end
      present = config.present()

      onmove = (dx, dy) =>
        span = end - start
        @start = start - dx * @scale
        @end = @start + span

        if @end > present
          @end = present
          @start = present - span
          dx = -Math.floor((@start - start) / @scale)

        @originPx = -(x + dx) # x offset from its original position

        t = if originalTransform? then 'T' else 't'
        attrs = {transform: originalTransform + t + [dx, 0]}
        draggable.attr(attrs)
        selection.attr(attrs)

      onstart = =>
        originalTransform = draggable.transform().local
        x = parseInt(xRe.exec(originalTransform)?[1] ? 0, 10) - x0
        start = @start
        end = @end
        present = config.present()

      onend = =>
        @_updateTimeline()

      draggable.drag(onmove, onstart, onend)
      selection.drag(onmove, onstart, onend)
      labels.drag(onmove, onstart, onend)

    _createSelectionOverlay: (svg) ->

      @selectionOverlay = selection = @_buildSvgElement('g', class: @scope('selection'))
      selection

    _createFixedOverlay: (svg) ->
      @overlay = overlay = @_buildSvgElement('g')

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
      {axis, timeline, start, end, root} = this

      @_empty(axis)

      line = @_buildSvgElement('line', class: @scope('timeline'), x1: MIN_X, y1: 0, x2: MAX_X, y2: 0)
      axis.appendChild(line)

      @width = width = @root.width() - @root.find(@scope('.tools')).width()
      @scale = (end - start) / width # ms per pixel

      range = @range()
      @_drawDayIntervals(range[0], range[1])

      unless @_contains(@_loadedRange..., @start, @end)
        @root.find(@scope('.tools')).addClass('busy')
        for node in @tlDatasets.childNodes
          node.setAttribute('class', "#{match[0].getAttribute('class')} #{@scope('loading')}")

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

    _drawDayIntervals: (start, end) ->
      axis = @axis

      # Make this 3x as wide as it needs to be to allow dragging without redrawing
      start = new Date(Math.floor(start / MS_PER_DAY) * MS_PER_DAY)
      end = new Date(Math.floor(end / MS_PER_DAY) * MS_PER_DAY)
      time = end

      while time >= start
        date = new Date(time)
        day = string.padLeft(date.getUTCDate(), '0', 2)
        month = MONTHS[date.getUTCMonth()]
        interval = @_buildIntervalDisplay(@timeToPosition(time), 0, day, month)
        axis.appendChild(interval)
        time -= MS_PER_DAY

    _buildIntervalDisplay: (x, y, text, subText) ->
      g = @_buildSvgElement('g', class: @scope('date-label'))
      @_translate(g, x, y)

      label = @_buildSvgElement('text', x: 5, y: y + 20, class: "#{@scope('axis-label')} #{@scope('axis-super-label')}")
      label.innerHTML = text

      subLabel = @_buildSvgElement('text', x: 5, y: y + 34, class: "#{@scope('axis-label')} #{@scope('axis-sub-label')}")
      subLabel.innerHTML = subText

      line = @_buildSvgElement('line', class: @scope('tick'), x1: 0, y1: MIN_Y, x2: 0, y2: MAX_Y)

      circle = @_buildSvgElement('circle', class: @scope('tick-crossing'), r: 6)

      g.appendChild(line)
      g.appendChild(circle)
      g.appendChild(label)
      g.appendChild(subLabel)

      g

    _setHeight: ->
      if @_datasets?.length > 0
        datasetsHeight = @_datasets.length * DATASET_HEIGHT + 2 * DATASET_PADDING
        @_translate(@axis, 0, TOP_HEIGHT + datasetsHeight)
        @root.height(TOP_HEIGHT + datasetsHeight + AXIS_HEIGHT)

      $('.master-overlay').masterOverlay().masterOverlay('contentHeightChanged')

  plugin.create('timeline', Timeline)
