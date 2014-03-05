ns = @edsc.map

ns.GranulesLayer = do (L
                       ko
                       document
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
      if $target.closest('.leaflet-control-container, .geojson-help, .leaflet-popup-pane').length > 0
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
      @_paused = false
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
      if $target.closest('.leaflet-control-container, .geojson-help, .leaflet-popup-pane').length > 0
        @_point = null
      @_updateDisplay()

    _onMouseOut: (e) =>
      @_point = null
      @_updateDisplay()

    _updateDisplay: ->
      container = @_container
      point = @_point
      if @_enabled && !@_paused && point?
        container.style.display = 'block'
        container.style.top = (point.y + 5) + 'px'
        container.style.left = (point.x + 5) + 'px'
      else
        container.style.display = 'none'

    isEnabled: ->
      @_enabled && @_point?

    isPaused: ->
      !@isEnabled() || @_paused

    enable: =>
      unless @_enabled
        @_enabled = true
        @_updateDisplay()

    disable: =>
      if @_enabled
        @_enabled = false
        @_updateDisplay()

    pause: =>
      unless @_paused
        @_paused = true
        @_updateDisplay()

    resume: =>
      if @_paused
        @_paused = false
        @_updateDisplay()

  class GranuleInfo
    constructor: (project) ->
      @_granulesModel = null
      @isCurrent = ko.observable(false)
      @granules = ko.computed =>
        @_granulesModel?.dispose()
        @_granulesModel = null
        @_granulesModel = project.selectedDataset()?.createGranulesModel()

    point: (latLng, callback) ->
      if latLng?
        @_point = latLng
        granules = @granules()
        if granules?
          granules.query.spatial("point:#{latLng.lng},#{latLng.lat}")
          granules.results() # Force evaluation
      @_point

    scrolled: (data, event) =>
      granules = @granules()
      elem = event.target
      if granules? && elem.scrollLeft > (elem.scrollWidth - elem.offsetWidth - 200)
        granules.loadNextPage(granules.params())

    dispose: ->
      @granules.dispose()

  class GranulesLayer
    constructor: ->

    onAdd: (map) ->
      @_map = map

      @_granuleInfo = new GranuleInfo(project)
      @_granuleDetails = new GranuleInfo(project)

      ko.applyBindings(@_granuleInfo, @_getMapElement('info'))

      @_selectionChangeSubscription = @_granuleDetails.granules.subscribe(@_onSelectionChange)

      @_hoverLayer = new HoverLayer()
      map.addLayer(@_hoverLayer)

      @_tooltipLayer = new TooltipLayer(@_getMapElement('info'))
      map.addLayer(@_tooltipLayer)

      map.on 'click', @_onClick
      map.on 'popupclose', @_onPopupClose
      map.on 'edsc.hover', @_onHover
      map.on 'edsc.hoverout', @_onHoverOut
      map.on 'mousedown', @_onMouseDown

    onRemove: (map) ->
      @_map = map

      @_granuleInfo.dispose()
      @_granuleDetails.dispose()

      ko.cleanNode(@_getMapElement('info'))
      ko.cleanNode(@_getMapElement('details'))

      @_granuleChangeSubscription.dispose()
      @_granuleResultsSubscription?.dispose()

      map.removeLayer(@_hoverLayer) if @_hoverLayer?
      map.removeLayer(@_tooltipLayer) if @_tooltipLayer?

      map.off 'click', @_onClick
      map.off 'popupclose', @_onPopupClose
      map.off 'edsc.hover', @_onHover
      map.off 'edsc.hoverout', @_onHoverOut
      map.off 'mousedown', @_onMouseDown

      @_map = null

    _getMapElement: (className) ->
      @_map.getContainer().getElementsByClassName('granule-' + className)[0]

    _onMouseDown: =>
      @_clickStart = new Date()

    _onSelectionChange: (newValue) =>
      try
        @_map.closePopup(@_popup)
        @_granuleResultsSubscription?.dispose()
        @_granuleResultsSubscription = newValue?.results.subscribe(@_onGranuleResultsChange)
      catch e

    _onGranuleResultsChange: (newValue) =>
      # Update the popup after this change finishes, preserving its scroll position
      fn = =>
        popup = @_popup
        if popup?
          scroll = popup.getContent().getElementsByClassName('map-popup-pane-x')?[0]
          scrollLeft = scroll?.scrollLeft
          popup.update()
          scroll.scrollLeft = scrollLeft if scrollLeft?
      setTimeout(fn, 0)

    _onClick: (e) =>
      duration = 0
      duration = new Date() - @_clickStart if @_clickStart?
      @_clickStart = null
      if duration < 200 && @_tooltipLayer.isEnabled() && @_granuleDetails.granules()?
        map = @_map

        unless @_popup?
          popupContent = '<div class="map-popover granule-details-container" data-bind="stopBinding: true">
                            <div data-bind="template: {name: \'granule-details-template\'}"/>
                          </div>'
          @_popup = L.popup(
            maxWidth: 1500
            closeOnClick: false
            autoPanPaddingTopLeft: [document.body.clientWidth / 2, 100]
            autoPanPaddingBottomRight: [100, 100]
            ).setContent($(popupContent)[0])

        @_popup = @_popup
          .setLatLng(e.latlng)
          .openOn(map)

        details = @_popup.getContent().firstElementChild
        ko.applyBindings(@_granuleDetails, details)

        @_stopLoading(@_granuleDetails)
        @_load(@_granuleDetails, e.latlng)
        @_tooltipLayer.pause()

        @_popup.update()

    _onPopupClose: (e) =>
      if e.popup == @_popup
        ko.cleanNode(@_popup.getContent().firstElementChild)
        @_popup = null

    _onHoverOut: (e) =>
      @_tooltipLayer.resume()
      @_stopLoading(@_granuleInfo)

    _onHover: (e) =>
      # Disabled for now
      #unless @_tooltipLayer.isPaused()
      #  @_load(@_granuleInfo, e.latlng)

    _stopLoading: (info) ->
      info.granules()?.abort()
      info.granules()?.isLoaded(false)
      info.isCurrent(false)

    _load: (info, point) ->
      info.isCurrent(true)
      info.point(point)

  exports = GranulesLayer