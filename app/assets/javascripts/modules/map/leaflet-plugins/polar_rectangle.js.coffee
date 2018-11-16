ns = window.edsc.map

do (L) ->
  # Extends LatLngBounds to assume it's dealing with a projected
  # rectangle, i.e. the given corners form a rectangle in the
  # given projection, not necessarily just in lat/lng range
  PolarLatLngBounds = (northWest, southEast, proj) ->
    @proj = proj
    p1 = proj.project(northWest)
    p2 = proj.project(southEast)

    x0 = Math.min(p1.x, p2.x)
    x1 = Math.max(p1.x, p2.x)
    y0 = Math.min(p1.y, p2.y)
    y1 = Math.max(p1.y, p2.y)

    @_points = (L.point(p) for p in [[x0, y0], [x0, y1], [x1, y1], [x1, y0]])
    @_southWest = L.latLng(proj.unproject(@_points[0]))
    @_northWest = L.latLng(proj.unproject(@_points[1]))
    @_northEast = L.latLng(proj.unproject(@_points[2]))
    @_southEast = L.latLng(proj.unproject(@_points[3]))
    this


  PolarLatLngBounds.prototype = L.extend({}, L.LatLngBounds.prototype,
    getCenter: ->
      corners = @_points
      x = (corners[0].x + corners[1].x + corners[2].x + corners[3].x) / 4
      y = (corners[1].y + corners[2].y + corners[2].y + corners[3].y) / 4
      @proj.unproject(L.point(x, y))

    getLatLngs: ->
      [@_southWest, @_northWest, @_northEast, @_southEast]

    getNorthWest: ->
      @_northWest

    getSouthEast: ->
      @_southEast
  )

  # Thin wrapper around SphericalPolygon to define a polygon that appears to
  # be roughly a rectangle in the given (polar) projection
  L.PolarRectangle = L.SphericalPolygon.extend
    initialize: (latlngs, options, @proj) ->
      L.SphericalPolygon.prototype.initialize.call(this, latlngs, options)

    setBounds: (bounds) ->
      @_bounds = new PolarLatLngBounds(bounds.getNorthEast(), bounds.getSouthWest(), @proj)
      @setLatLngs(@_bounds.getLatLngs())

    getBounds: ->
      if @_bounds and @_bounds instanceof PolarLatLngBounds
        @_bounds
      else if @_latlngs?.length == 4
        @_bounds = new PolarLatLngBounds(@_latlngs[0], @_latlngs[2], @proj)
      else
        console.warn("Unable to get polar rectangle bounds:", this)
        null

  L.polarRectangle = (latlngs, options, proj) -> new L.PolarRectangle(latlngs, options, proj)
