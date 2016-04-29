@edsc.Legend = class
  constructor: ->
    @_build()

  appendTo: (parent) ->
    parent.appendChild(@container)
    @refresh()

  remove: (parent) ->
    @container.parentNode?.removeChild(@container)

  setData: (name, data) ->
    console.log "Set legend data: #{name} -> #{JSON.stringify(data)}"
    @scale = data.scale
    @label.innerText = name
    @refresh()

  refresh: ->
    scale = @scale
    @container.style.display = if scale? then '' else 'none'
    unless scale?
      console.log "No legend scale"
      return

    bar = @bar
    {labels, colors} = scale
    len = labels.length
    @minLabel.innerText = labels[0]
    @maxLabel.innerText = labels[len - 1]

    height = bar.height

    g = bar.getContext("2d")

    cellWidth = bar.width / len
    fillWidth = Math.ceil(cellWidth)
    x = 0
    for color in colors
      g.fillStyle = @_hexToRgba(color)
      g.fillRect(Math.floor(x), 0, fillWidth, height)
      x += cellWidth
    null

  _build: ->
    create = (parent, tag, className) ->
      el = document.createElement(tag)
      el.className = className
      parent?.appendChild(el)
      el

    @container = container = create(null, 'div', 'legend')
    container.style.display = 'none'

    @label = create(container, 'span', 'legend-name')
    @bar = bar = create(container, 'canvas', 'legend-bar')

    labels = create(container, 'div', 'legend-labels')
    @minLabel = create(labels, 'span', 'legend-label legend-label-min')
    @maxLabel = create(labels, 'span', 'legend-label legend-label-max')

    @focus = focus = create(labels, 'div', 'legend-focus')
    @focusColor = create(focus, 'span', 'legend-focus-color')
    @focusLabel = create(focus, 'span', 'legend-label legend-focus-label')
    @focus.style.display = 'none'

    bar.addEventListener('mousemove', @_mousemove, false)
    bar.addEventListener('mouseout', @_mouseout, false)

    null

  _mousemove: (e) =>
    @focus.style.display = ''
    x = e.offsetX
    {labels, colors} = @scale
    len = labels.length
    cellWidth = @bar.clientWidth / len
    i = Math.max(Math.min(Math.floor(x / cellWidth), len - 1), 0)
    @focusLabel.innerText = labels[i]
    @focusColor.style.backgroundColor = @_hexToRgba(colors[i])

  _mouseout: (e) =>
    @focus.style.display = 'none'

  _hexToRgba: (hex) ->
    hex = hex.substring(1) if hex[0] == '#'
    r = hex.substring(0, 2)
    g = hex.substring(2, 4)
    b = hex.substring(4, 6)
    a = hex.substring(6, 8)

    a = 'ff' if a.length == 0

    "rgba(#{parseInt(r, 16)}, #{parseInt(g, 16)}, #{parseInt(b, 16)}, #{parseInt(a, 16)})"
