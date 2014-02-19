ns = @edsc.map

ns.GranulesLayer = do (L
                       ko
                       project = @edsc.page.project
                       extend = $.extend
                       $ = jQuery
                       config = @edsc.config
                       ) ->

  # The manhattan distance the mouse can move from the initial hover point
  # without canceling the hover
  HOVER_SENSITIVITY_PX = 10

  class HoverLayer
    constructor: ->
      @_hoverTimer = null
      @_hoverPoint = null

    onAdd: (map) ->
      @_map = map
      map.on 'mousemove', @_onMouseMove
      map.on 'mouseout', @_onMouseOut

    onRemove: (map) ->
      @_clearHoverTimeout()
      @_map = null
      map.off 'mousemove', @_onMouseMove
      map.off 'mouseout', @_onMouseOut

    _onMouseMove: (e) =>
      point = e.containerPoint
      hoverPoint = @_hoverPoint
      abs = Math.abs

      $target = $(e.originalEvent.target)
      if $target.closest('.leaflet-control-container, .geojson-help').length > 0
        @_clearHoverTimeout()
      else if !hoverPoint? || abs(point.x - hoverPoint.x) + abs(point.y - hoverPoint.y) > HOVER_SENSITIVITY_PX
        # Allow the mouse to move slightly without triggering another event
        @_hoverPoint = point
        @_setHoverTimeout(e)

    _onMouseOut: (e) =>
      @_hoverPoint = null
      @_clearHoverTimeout()

    _clearHoverTimeout: (e) ->
      clearTimeout(@_hoverTimer)

    _setHoverTimeout: (e) ->
      @_clearHoverTimeout()
      @_map.fire('edsc.hoverout', e) if @_isHovering
      @_isHovering = false
      onHover = =>
        @_isHovering = true
        @_map.fire('edsc.hover', e)
      @_hoverTimer = setTimeout(onHover, config.hoverTimeoutMs)

  class TooltipLayer
    constructor: (@_container) ->
      @_container.style.display = 'none'
      @_enabled = true
      @_point = null

    onAdd: (map) ->
      map.on 'mouseover', @_onMouseMove
      map.on 'mousemove', @_onMouseMove
      map.on 'mouseout', @_onMouseOut

      map.on 'draw:drawstart draw:editstart draw:deletestart', @disable
      map.on 'draw:drawstop draw:editstop draw:deletestop', @enable

    onRemove: (map) ->
      map.off 'mouseover', @_onMouseMove
      map.off 'mousemove', @_onMouseMove
      map.off 'mouseout', @_onMouseOut

      map.off 'draw:drawstart draw:editstart draw:deletestart', @disable
      map.off 'draw:drawstop draw:editstop draw:deletestop', @enable

    _onMouseMove: (e) =>
      @_point = e.containerPoint
      return unless @_enabled

      $target = $(e.originalEvent.target)
      if $target.closest('.leaflet-control-container, .geojson-help').length > 0
        @_point = null
      @_updateDisplay()

    _onMouseOut: (e) =>
      @_point = null
      @_updateDisplay()

    _updateDisplay: ->
      container = @_container
      point = @_point
      if @_enabled && point?
        container.style.display = 'block'
        container.style.top = (point.y + 5) + 'px'
        container.style.left = (point.x + 5) + 'px'
      else
        container.style.display = 'none'

    isEnabled: ->
      @_enabled

    enable: =>
      @_enabled = true
      @_updateDisplay()

    disable: =>
      @_enabled = false
      @_updateDisplay()

  class GranuleInfo
    constructor: (project) ->
      @_granulesModel = null
      @isCurrent = ko.observable(false)
      @granules = ko.computed =>
        @_granulesModel?.dispose()
        @_granulesModel = null
        @_granulesModel = project.selectedDataset()?.createGranulesModel()

    point: (latLng) ->
      if latLng?
        @_point = latLng
        granules = @granules()
        if granules?
          granules.query.spatial("point:#{latLng.lng},#{latLng.lat}")
          granules.results() # Force evaluation
      @_point

    dispose: ->
      @granules.dispose()

  class GranulesLayer
    constructor: ->

    onAdd: (map) ->
      @_granuleInfo = new GranuleInfo(project)

      el = @_getInfoElement(map)
      ko.applyBindings(@_granuleInfo, el) if el?

      @_hoverLayer = new HoverLayer()
      map.addLayer(@_hoverLayer)

      @_tooltipLayer = new TooltipLayer(el)
      map.addLayer(@_tooltipLayer)

      map.on 'edsc.hover', @_onHover
      map.on 'edsc.hoverout', @_onHoverOut

    onRemove: (map) ->
      @_granuleInfo.dispose()

      el = @_getInfoElement(map)
      ko.cleanNode(el) if el?

      map.removeLayer(@_hoverLayer) if @_hoverLayer?
      map.removeLayer(@_tooltipLayer) if @_tooltipLayer?

      map.off 'edsc.hover', @_onHover
      map.off 'edsc.hoverout', @_onHoverOut

    _getInfoElement: (map) ->
      map.getContainer().getElementsByClassName('granule-info')[0]

    _onHoverOut: (e) =>
      @_granuleInfo.isCurrent(false)
      @_granuleInfo.granules()?.abort()
      @_granuleInfo.granules()?.isLoaded(false)

    _onHover: (e) =>
      if @_tooltipLayer.isEnabled()
        @_granuleInfo.isCurrent(true)
        @_granuleInfo.point(e.latlng)

  exports = GranulesLayer