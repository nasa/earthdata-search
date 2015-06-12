ns = window.edsc.map.L

ns.ZoomHome = do (L, currentPage = window.edsc.models.page.current) ->
  DomUtil = L.DomUtil

  ZoomHome = L.Control.Zoom.extend
    options:
      position: 'topright'
      zoomInText: '+'
      zoomInTitle: 'Zoom in'
      zoomOutText: '-'
      zoomOutTitle: 'Zoom out'
      zoomHomeText: '<i class="fa fa-home" style="line-height:1.65;"></i>'
      zoomHomeTitle: 'Zoom home'

    onAdd: (map) ->
      container = L.Control.Zoom.prototype.onAdd.call(this, map)

      options = @options

      home = @_createButton(options.zoomHomeText, options.zoomHomeTitle, 'leaflet-control-zoom-home', container, (e) => @_zoomHome(e))
      container.insertBefore(home, @_zoomOutButton)

      container

    _zoomHome: (e) ->
      spatial = currentPage.query.spatial()
      if spatial?.length > 0
        points = spatial.split(':')
        points.shift()
        bounds = new L.LatLngBounds()
        for point in points
          bounds.extend(point.split(',').reverse())
        @_map.fitBounds(bounds)
      else
        if @_map.projection == 'geo'
          @_map.setView([0, 0], 2)
        else if @_map.projection == 'arctic'
          @_map.setView([90, 0], 0)
        else
          @_map.setView([-90, 0], 0)

  exports = ZoomHome
