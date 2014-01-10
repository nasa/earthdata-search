LExt = window.edsc.map.L

L.DrawToolbar = do (L, Proj = LExt.Proj) ->

  # Extends L.Draw.Rectangle to allow drawing polar rectangles
  DrawPolarRectangle = L.Draw.Rectangle.extend
    initialize: (map, options, @proj, proj_name) ->
      L.Draw.Rectangle.prototype.initialize.call(this, map, options)
      # Custom type
      @type = "#{proj_name}-rectangle"

    _drawShape: (latlng) ->
      # Draw a polar rectangle instead of a normal one
      start = @_startLatLng
      if @_shape?
        @_shape.setBounds(L.latLngBounds(start, latlng))
      else
        @_shape = new L.PolarRectangle([], @options.shapeOptions, @proj)
        @_shape.setBounds(L.latLngBounds(start, latlng))
        @_map.addLayer(@_shape)

    _fireCreatedEvent: ->
      # Fire events with polar rectangles instead of normal ones
      shape = new L.PolarRectangle(@_shape.getLatLngs(), @options.shapeOptions, @proj)
      L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, shape)

  # Extends L.Edit.Rectangle to allow editing polar rectangles
  EditPolarRectangle = L.Edit.Rectangle.extend
    # Disable the move marker for now because it's pretty screwy
    _createMoveMarker: ->
      @_moveMarker =
        setLatLng: () ->
        off: () -> this

  # There's a corresponding init hook that sets L.Edit.Poly as the editor
  # for all polygons (a PolarRectangle is a polygon).  This removes that
  # editor for PolarRectangles and adds EditPolarRectangle as the editor
  L.PolarRectangle.addInitHook ->
    enabled = @editing?.enabled()
    @editing.disable() if enabled
    @editing = new EditPolarRectangle(this)
    @editing.enable() if enabled

  # Extensions to L.Draw.Toolbar.  We need to monkeypatch this because the
  # creation the toolbar is buried in a fairly long function in L.Control.Draw
  # This module is set up to avoid monkeypatching should it ever become easier
  originalClass = L.DrawToolbar
  original = L.DrawToolbar.prototype

  DrawToolbar = L.DrawToolbar.extend

    addToolbar: (map) ->
      result = original.addToolbar.call(this, map)

      # Add polar rectangle selection
      prefix = 'leaflet-draw-draw'
      @_initModeHandler(
        new DrawPolarRectangle(map, @options.rectangle, Proj.epsg3413.projection, 'arctic'),
        @_toolbarContainer,
        ++@_lastButtonIndex,
        "#{prefix}-rectangle projection-only-arctic #{prefix}"
        L.drawLocal.draw.toolbar.buttons.rectangle
      )
      @_initModeHandler(
        new DrawPolarRectangle(map, @options.rectangle, Proj.epsg3031.projection, 'antarctic'),
        @_toolbarContainer,
        ++@_lastButtonIndex,
        "#{prefix}-rectangle projection-only-antarctic #{prefix}"
        L.drawLocal.draw.toolbar.buttons.rectangle
      )

      # Ensure all the tools are there in the order we expect
      mode_order = ['marker', 'rectangle', 'arctic-rectangle', 'antarctic-rectangle', 'polygon']

      for mode_name, i in mode_order
        mode = @_modes[mode_name]
        mode.buttonIndex = i
        mode.button.parentNode.appendChild(mode.button)
        if mode_name == 'rectangle'
          # Hide the normal bounding box outside of the geo view
          mode.button.className += " projection-only-geo"

      result

    # Set the appropriate button index based on the number of visible tools
    _handlerActivated: (e) ->
      mode = @_modes[e.handler]
      button = $(mode.button)
      mode.buttonIndex = button.prevAll('a:visible').size()
      @_lastButtonIndex = button.parent().children('a:visible').size() - 1

      original._handlerActivated.call(this, e)

  exports = DrawToolbar
