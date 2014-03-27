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

  class Timeline extends plugin.Base
    constructor: (root, namespace, options={}) ->
      super(root, namespace, options)

      @root.append(@_createDisplay())

      @end = config.present()
      @start = @end - MS_PER_MONTH
      @_updateTimeline()

    destroy: ->
      @root.find('svg').remove()
      super()

    show: ->
      @root.show()
      @_setHeight()
      null

    hide: ->
      @root.hide()
      @_setHeight()
      null

    params: ->
      start_date: new Date(@start).toISOString()
      end_date: new Date(@end).toISOString()
      interval: 'hour'


    loadstart: (id) ->
      @root.find(@scope('.tools')).addClass('busy')
      match = @svg.getElementsByClassName(id)
      if match.length > 0
        @_empty(match[0])

    data: (id, intervals) ->
      index = -1
      for dataset, i in @_datasets
        if dataset.id() == id
          index = i
          break
      return if index == -1

      match = @svg.getElementsByClassName(id)
      el = null
      if match.length > 0
        el = match[0]
        @_empty(el)
        el.parentNode.removeChild(el)
      else
        el = @_buildSvgElement('g', class: "#{id} #{@scope('data')}")
        @_translate(el, 0, DATASET_HEIGHT * index) if index > 0

      for [start, end, _] in intervals
        startPos = @timeToPosition(start * 1000)
        endPos = @timeToPosition(end * 1000)
        rect = @_buildSvgElement 'rect',
          x: startPos
          y: 5
          width: endPos - startPos
          height: DATASET_HEIGHT - 7
          rx: 10
          ry: 10
        el.appendChild(rect)

      @tlDatasets.appendChild(el)

      if @tlDatasets.childNodes.length == @_datasets.length
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

      svg

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
      @timeline = timeline = @_buildSvgElement('g')

      @tlDatasets = datasets = @_buildSvgElement('g')
      @_translate(datasets, 0, TOP_HEIGHT)

      @axis = axis = @_buildSvgElement('g')
      @_translate(axis, 0, TOP_HEIGHT)

      line = @_buildSvgElement('line', class: @scope('timeline'), x1: -1000000, y1: 0, x2: 1000000, y2: 0)
      axis.appendChild(line)

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
      {timeline, start, end, root} = this

      @width = width = @root.width() - @root.find(@scope('.tools')).width()
      @originPx = 0
      @scale = (end - start) / width # ms per pixel

      @_drawDayIntervals()

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
      line = @_buildSvgElement('line', x1: timePt, y1: offsetTop + height, x2: timePt, y2: 1000000)
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

    timeToPosition: (t) ->
      {originPx, start, scale} = this
      originPx + (t - start) / scale

    positionToTime: (p) ->
      {originPx, start, scale} = this
      (p - originPx) * scale + start

    _drawDayIntervals: () ->
      {start, end, axis} = this

      time = new Date(Math.floor(end / MS_PER_DAY) * MS_PER_DAY)

      for i in [0...35]
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

      line = @_buildSvgElement('line', class: @scope('tick'), x1: 0, y1: -1000000, x2: 0, y2: 1000000)

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
