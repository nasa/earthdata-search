do (document, window, $=jQuery, plugin=@edsc.util.plugin, string=@edsc.util.string, dateUtil=@edsc.util.date) ->
  # Height for the top area, where arrows are drawn for date selection
  TOP_HEIGHT = 26

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

      @end = new Date() - 0
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
        el.innerHTML = ''
        el.parentNode.removeChild(el)
      else
        el = document.createElementNS(SVG_NS, 'g')
        el.setAttribute('class', "#{id} #{@scope('data')}")
        @_translate(el, 0, DATASET_HEIGHT * index) if index > 0

      for [start, end, _] in intervals
        startPos = @timeToPosition(start * 1000)
        endPos = @timeToPosition(end * 1000)
        rect = document.createElementNS(SVG_NS, 'rect')
        rect.setAttribute('x', startPos)
        rect.setAttribute('y', 5)
        rect.setAttribute('width', endPos - startPos)
        rect.setAttribute('height', DATASET_HEIGHT - 7)
        rect.setAttribute('rx', 10)
        rect.setAttribute('ry', 10)
        el.appendChild(rect)

      @tlDatasets.appendChild(el)
      null


    datasets: (datasets) ->
      datasets = (dataset for dataset in datasets when dataset.has_granules())
      if datasets?.length > 0
        @_datasets = datasets[0...3]
        @_updateDatasetNames()
        @show()
      else
        @hide()

      @_datasets

    _translate: (el, x, y) ->
      el.setAttribute('transform', "translate(#{x}, #{y})")
      el

    _createDisplay: ->
      @svg = svg = document.createElementNS(SVG_NS, 'svg')
      svg.setAttribute('class', @scope('display'))

      offset = @root.find(@scope('.tools')).width()

      overlay = @_createFixedOverlay(svg)
      @_translate(overlay, offset, 0)

      timeline = @_createTimeline(svg)
      @_translate(timeline, offset, 0)

      svg.appendChild(timeline)
      svg.appendChild(overlay)

      svg

    _createFixedOverlay: (svg) ->
      @overlay = overlay = document.createElementNS(SVG_NS, 'g')

      rect = document.createElementNS(SVG_NS, 'rect')
      rect.setAttribute('class', @scope('display-top'))
      rect.setAttribute('width', 10000)
      rect.setAttribute('height', TOP_HEIGHT)

      @olDatasets = datasets = document.createElementNS(SVG_NS, 'g')
      datasets.setAttribute('class', @scope('dataset'))
      @_translate(datasets, 5, DATASET_TEXT_OFFSET)

      overlay.appendChild(rect)
      overlay.appendChild(datasets)

      overlay

    _createTimeline: (svg) ->
      @timeline = timeline = document.createElementNS(SVG_NS, 'g')

      @tlDatasets = datasets = document.createElementNS(SVG_NS, 'g')
      @_translate(datasets, 0, TOP_HEIGHT)

      @axis = axis = document.createElementNS(SVG_NS, 'g')
      @_translate(axis, 0, TOP_HEIGHT)

      line = @_createLine(-1000000, 0, 1000000, 0)
      line.setAttribute('class', @scope('timeline'))
      axis.appendChild(line)

      timeline.appendChild(axis)
      timeline.appendChild(datasets)

      timeline

    _createLine: (x1, y1, x2, y2) ->
      line = document.createElementNS(SVG_NS, 'line')
      line.setAttribute('x1', x1)
      line.setAttribute('y1', y1)
      line.setAttribute('x2', x2)
      line.setAttribute('y2', y2)
      line

    _updateDatasetNames: ->
      datasets = @_datasets
      overlay = @olDatasets
      overlay.innerHTML = ''
      y = 0
      for dataset in datasets
        txt = document.createElementNS(SVG_NS, 'text')
        txt.setAttribute('y', y)
        txt.innerHTML = dataset.title()
        overlay.appendChild(txt)
        y += DATASET_HEIGHT
      null

    _updateTimeline: ->
      {timeline, start, end, root} = this

      @width = width = @root.width()
      @originPx = 0
      @scale = (end - start) / width # ms per pixel

      @_drawDayIntervals()

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
      g = document.createElementNS(SVG_NS, 'g')
      @_translate(g, x, y)

      label = document.createElementNS(SVG_NS, 'text')
      label.setAttribute('x', 5)
      label.setAttribute('y', y + 20)
      label.setAttribute('class', "#{@scope('axis-label')} #{@scope('axis-super-label')}")
      label.innerHTML = text

      subLabel = document.createElementNS(SVG_NS, 'text')
      subLabel.setAttribute('class', "#{@scope('axis-label')} #{@scope('axis-sub-label')}")
      subLabel.setAttribute('x', 5)
      subLabel.setAttribute('y', y + 34)
      subLabel.innerHTML = subText

      line = @_createLine(0, -100000, 0, 100000)
      line.setAttribute('class', @scope('tick'))

      circle = document.createElementNS(SVG_NS, 'circle')
      circle.setAttribute('class', @scope('tick-crossing'))
      circle.setAttribute('r', 6)

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

      $('.master-overlay').masterOverlay('contentHeightChanged')




  plugin.create('timeline', Timeline)
