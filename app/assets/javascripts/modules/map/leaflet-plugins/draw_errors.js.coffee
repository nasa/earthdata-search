# This module overrides default Leaflet.draw methods for supported
# shapes to perform the validations we need. before allowing the user
# to complete a shape
do (L) ->

  # Append coordinate information to tooltips
  originalUpdateContent = L.Draw.Tooltip.prototype.updateContent
  L.Draw.Tooltip.prototype.updateContent = (content) ->
    @_content = content
    if @_point
      content =
        text: "#{content.text}<br>#{@_point}"
        subtext: content.subtext
    originalUpdateContent.call(this, content)

  originalUpdatePosition = L.Draw.Tooltip.prototype.updatePosition

  L.Draw.Tooltip.prototype.updatePosition = (latlng) ->
    @_point = "(#{latlng.lat.toFixed(5)}, #{latlng.lng.toFixed(5)})"
    if @_content?
      @updateContent(@_content)

    originalUpdatePosition.call(this, latlng)


  # Validates a polygon that the user has not yet closed.
  validateIncompletePolygon = (latLngs) ->
    return if latLngs.length < 2

    last = latLngs[latLngs.length - 1]
    prev = latLngs[latLngs.length - 2]

    null

  # Validates a polygon that the user has finished.
  validateCompletePolygon = (latLngs) ->
    null

  # Overrides _onClick to check for errors before passing to the original handler
  L.Draw.Polygon.prototype._onClick = (e) ->
    ll = e.target.getLatLng()

    error = validateIncompletePolygon(@_poly.getLatLngs().concat(ll))
    if error?
      @_showErrorTooltip(error)
      return

    L.Draw.Polyline.prototype._onClick.call(this, e)

  # Overrides _finishShape to check for errors before passing to the original handler
  L.Draw.Polygon.prototype._finishShape = ->
    error = validateCompletePolygon(@_poly.getLatLngs())
    if error?
      @_showErrorTooltip(error)
      return

    L.Draw.Polyline.prototype._finishShape.call(this)

  # Overrides _showErrorTooltip to accept a message parameter.  The default
  # only allows one error to be displayed
  L.Draw.Polygon.prototype._showErrorTooltip = (message) ->
    message = L.drawLocal.draw.handlers.polyline.error unless message?

    @options.drawError.message = message
    L.Draw.Polyline.prototype._showErrorTooltip.call(this)

  # Given a rectangle's bounds, returns either an error message for
  # those bounds or null, indicating no error
  validateRectangle = (bounds) ->
    if Math.abs(bounds.getEast() - bounds.getWest()) >= 360
      return "Bounds cannot span more than 360 degrees latitude"
    null

  # Overrides _onMouseUp to validate before finishing the rectangle
  L.Draw.Rectangle.prototype._onMouseUp = ->
    if @_shape?
      error = validateRectangle(@_shape.getBounds())
      if error?
        @_showErrorTooltip(error)
        return

    L.Draw.SimpleShape.prototype._onMouseUp.call(this)

  # The following four methods are nearly-identical to the L.Draw.Polyline
  # implementation of error tooltips.  They add error tooltips to
  # L.Draw.Rectangle

  L.Draw.Rectangle.prototype._showErrorTooltip = (message) ->
    @_errorShown = true

    @_tooltip.showAsError().updateContent(text: message)
    @_shape.setStyle(color: '#b00b00')

    @_clearHideErrorTimeout()
    @_hideErrorTimeout = setTimeout(@_hideErrorTooltip.bind(this), 2500)

  L.Draw.Rectangle.prototype._hideErrorTooltip = ->
    @_errorShown = false

    @_clearHideErrorTimeout()

    @_tooltip.removeError().updateContent(text: @_endLabelText)
    @_shape.setStyle(color: this.options.shapeOptions.color)

  L.Draw.Rectangle.prototype._clearHideErrorTimeout = ->
    if @_hideErrorTimeout
      clearTimeout(@_hideErrorTimeout)
      @_hideErrorTimeout = null

  L.Draw.Rectangle.prototype.removeHooks = ->
    @_clearHideErrorTimeout()
    L.Draw.SimpleShape.prototype.removeHooks.call(this)
