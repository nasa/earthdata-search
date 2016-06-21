ns = @edsc.models.ui

ns.SpatialType = do (ko, $=jQuery) ->

  # Keeps track of the user's interface selections for the purpose of keeping buttons in sync
  class SpatialType
    constructor: (@query) ->
      @icon = ko.observable('fa-crop')
      @name = ko.observable('Spatial')
      @displaySpatial = ko.computed(read: @_computeDisplaySpatialName, owner: this, deferEvaluation: true)
      @querySpatial = ko.computed(read: @_computeQuerySpatial, owner: this, deferEvaluation: true)
      @mapControlTop = ko.computed(read: @_computeMapControlPosition, owner: this)
      @manualEntryVisible = ko.observable(false)

    clearManualEntry: =>
      @manualEntryVisible(false)

    selectNone: =>
      @name('Spatial')
      @icon('fa-crop')
      if @displaySpatial() == 'Point' || @displaySpatial() == 'Rectangle' then @manualEntryVisible(true) else @manualEntryVisible(false)

    selectPoint: =>
      @name('Point')
      @icon('fa-map-marker')
      @manualEntryVisible(true)

    selectRectangle: =>
      @name('Rectangle')
      @icon('edsc-icon-rect-open')
      @manualEntryVisible(true)

    selectPolygon: =>
      @name('Polygon')
      @icon('edsc-icon-poly-open')
      @manualEntryVisible(false)

    selectShapefile: =>
      @name('Shape File')
      @icon('fa-file-o')
      @manualEntryVisible(false)

    _toReadableName: (name)->
      return 'Point' if name == 'point'
      return 'Rectangle' if name == 'bounding_box'
      null

    _computeDisplaySpatialName: =>
      spatialParam = @_toReadableName(@query.spatial()?.split(':')[0])
      if @name() == 'Spatial'
        # Order matters
        if spatialParam && @name() != spatialParam && @displaySpatial() != spatialParam && @name() != @displaySpatial()
          # on spatial type changes from one (e.g. point) to another (e.g. rectangle).
          return @displaySpatial() if $('#manual-coord-entry-container').find('.error')
          return spatialParam
        if spatialParam?.length > 0
          @manualEntryVisible(true)
          return spatialParam
        return @displaySpatial() if @displaySpatial()
#      if spatialParam then spatialParam else @name()
      @name()

    _computeQuerySpatial: ->
      @query.spatial()?.split(':')[0]

    _computeMapControlPosition: ->
      value = @displaySpatial()
      top = '85px'
      if value == 'Point'
        top = '90px'
      else if value == 'Rectangle'
        top = '178px'
      document.getElementsByClassName('leaflet-top leaflet-right')?[0]?.style.top = top

  exports = SpatialType
