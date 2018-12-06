ns = @edsc.map

# Adds a hover event and wraps leaflet mouse events so they only fire over
# map elements rather than things like links, buttons, and dialogs
ns.MouseEventsLayer = do (L
                          $ = jQuery
                          config = @edsc.config
                          ) ->

  # The manhattan distance the mouse can move from the initial hover point
  # without canceling the hover
  HOVER_SENSITIVITY_PX = 10

  class MouseEventsLayer extends L.Layer
    constructor: ->
      @_hoverTimer = null
      @_hoverPoint = null
      @_disabled = 0

    onAdd: (map) ->
      @_map = map
      map.on 'mousemove', @_onMouseMove
      map.on 'mouseout', @_onMouseOut
      map.on 'draw:drawstart draw:editstart draw:deletestart shapefile:start', @disable
      map.on 'draw:drawstop draw:editstop draw:deletestop shapefile:stop', @enable

    onRemove: (map) ->
      @_clearHoverTimeout()
      @_map = null
      map.off 'mousemove', @_onMouseMove
      map.off 'mouseout', @_onMouseOut
      map.off 'draw:drawstart draw:editstart draw:deletestart shapefile:start', @disable
      map.off 'draw:drawstop draw:editstop draw:deletestop shapefile:stop', @enable

    enable: =>
      @_disabled -= 1

    disable: (e) =>
      @_disabled += 1
      @_onMouseOut(e)

    _onMouseMove: (e) =>
      return unless @_disabled == 0

      point = e.containerPoint
      hoverPoint = @_hoverPoint
      abs = Math.abs

      $target = $(e.originalEvent.target)
      if $target.closest('.geojson-help, .leaflet-popup-pane').length > 0
        @_clearHoverTimeout()
        @_map.fire('edsc.mouseout', e)
      else
        @_map.fire('edsc.mousemove', e)
        if !hoverPoint? || abs(point.x - hoverPoint.x) + abs(point.y - hoverPoint.y) > HOVER_SENSITIVITY_PX
          # Allow the mouse to move slightly without triggering another hover event
          @_hoverPoint = point
          @_setHoverTimeout(e)

    _onMouseOut: (e) =>
      @_map.fire('edsc.mouseout', e)
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

  exports = MouseEventsLayer
