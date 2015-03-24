ns = window.edsc.map.L

ns.ZoomHome = do (L, currentPage = window.edsc.models.page.current) ->
  DomUtil = L.DomUtil

  ZoomHome = L.Control.extend
    options:
      position: 'topright'
      zoomInText: '+'
      zoomInTitle: 'Zoom in'
      zoomOutText: '-'
      zoomOutTitle: 'Zoom out'
      zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>'
      zoomHomeTitle: 'Zome home'

    onAdd: (map) ->
      controlName = 'leaflet-control-zoom'
      container = DomUtil.create('div', controlName + ' leaflet-bar')
      options = @options
      @_zoomInButton = @_createButton(options.zoomInText, options.zoomInTitle, controlName + '-in', container, @_zoomIn)
      @_zoomHomeButton = @_createButton(options.zoomHomeText, options.zoomHomeTitle, controlName + '-home', container, @_zoomHome)
      @_zoomOutButton = @_createButton(options.zoomOutText, options.zoomOutTitle, controlName + '-out', container, @_zoomOut)

      @_updateDisabled()
      map.on('zoomend zoomlevelschange', @_updateDisabled, this)

      container

    onRemove: (map) ->
      map.off('zoomend zoomlevelschange', @_updateDisabled, this)

    _zoomIn: (e) ->
      @_map.zoomIn(e.shiftKey ? 3 : 1)

    _zoomOut: (e) ->
      @_map.zoomOut(e.shiftKey ? 3 : 1)

    _zoomHome: (e) ->
      spatial = currentPage.query.spatial()
      if spatial?
        points = spatial.split(':')
        if points[0] == 'point'
          p1 = points[1].split(',').reverse()
          p2 = p1
        else if points[0] == 'bounding_box'
          p1 = points[1].split(',').reverse()
          p2 = points[2].split(',').reverse()
        @_map.fitBounds([p1, p2])
      else
        @_map.setView([0, 0], 2)

    _createButton: (html, title, className, container, fn) ->
      link = DomUtil.create('a', className, container)
      link.innerHTML = html
      link.href = '#'
      link.title = title

      L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
        .on(link, 'click', L.DomEvent.stop)
        .on(link, 'click', fn, this)
        .on(link, 'click', @_refocusOnMap, this)

      link

    _updateDisabled: ->
      map = @_map
      className = 'leaflet-disabled'

      DomUtil.removeClass(@_zoomInButton, className)
      DomUtil.removeClass(@_zoomOutButton, className)

      if map._zoom == map.getMinZoom()
        DomUtil.addClass(@_zoomOutButton, className)
      if map._zoom == map.getMaxZoom()
        DomUtil.addClass(@_zoomInButton, className)

  exports = ZoomHome
