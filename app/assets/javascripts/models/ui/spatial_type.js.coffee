ns = @edsc.models.ui

ns.SpatialType = do (ko, $=jQuery) ->

  # Keeps track of the user's interface selections for the purpose of keeping buttons in sync
  class SpatialType
    constructor: (@query) ->
      @icon = ko.observable('fa-crop')
      @name = ko.observable('Spatial')
      @displaySpatial = ko.computed(read: @_getDisplaySpatialName, write: @_clearDisplaySpatialName, owner: this, deferEvaluation: true)
      @querySpatial = ko.computed(read: @_getQuerySpatial, owner: this, deferEvaluation: true)
      @mapControlTop = ko.computed(read: @_setMapControlPosition, owner: this)
      @manualEntryVisible = ko.computed(read: @_getManualEntryVisibility, owner: this, deferEvaluation: true)

    _getManualEntryVisibility: ->
      return true if @displaySpatial() == 'Point' || @displaySpatial() == 'Rectangle' || !!@query.spatial()?.split(':')[0]
      false

    clearManualEntry: =>
      @displaySpatial('')

    selectNone: =>
      @name('Spatial')
      @icon('fa-crop')

    selectPoint: =>
      @name('Point')
      @icon('fa-map-marker')

    selectRectangle: =>
      @name('Rectangle')
      @icon('edsc-icon-rect-open')

    selectPolygon: =>
      @name('Polygon')
      @icon('edsc-icon-poly-open')

    selectShapefile: =>
      @name('Shape File')
      @icon('fa-file-o')

    _toReadableName: (name)->
      return 'Point' if name == 'point'
      return 'Rectangle' if name == 'bounding_box'
      null

    _getDisplaySpatialName: =>
      spatialParam = @_toReadableName(@query.spatial()?.split(':')[0])
      if @name() == 'Spatial'
        return spatialParam if spatialParam?.length > 0
        return @displaySpatial() if @displaySpatial()
      if spatialParam != @name() then return @name() else return @name()

    _clearDisplaySpatialName: =>
      ''

    _getQuerySpatial: ->
      @query.spatial()?.split(':')[0]

    _setMapControlPosition: ->
      value = @displaySpatial()
      top = '85px'
      if value == 'Point'
        top = '160px'
      else if value == 'Rectangle'
        top = '230px'
      document.getElementsByClassName('leaflet-top leaflet-right')?[0]?.style.top = top

  exports = SpatialType
