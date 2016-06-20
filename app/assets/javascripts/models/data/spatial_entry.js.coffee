ns = @edsc.models.data

ns.SpatialEntry = do (ko,
                      KnockoutModel=@edsc.models.KnockoutModel) ->

  class SpatialEntry extends KnockoutModel
    constructor: (_spatial) ->
      @_loadMap()
      @coordinates = ko.computed(read: @_getCoordinates, write: @_setCoordinates, owner: this, deferEvaluation: true)
      @swPoint = ko.computed(read: @_getSwPoint, write: @_setSwPoint, owner: this, deferEvaluation: true)
      @nePoint = ko.computed(read: @_getNePoint, write: @_setNePoint, owner: this, deferEvaluation: true)
      @querySpatial = _spatial
      @spatialName = ko.computed(read: @_getSpatialName, owner: this)
      @inputWidth = ko.observable(0)
      @point = ko.computed(read: @_getPoint, write: @_setPoint, owner: this, deferEvaluation: true)
      @error = ko.observable('')

    clearError: ->
      @error('')

    _validateCoordinate: (value) ->
      msg = ''
      if !value || (@spatialName() && @spatialName() != @_toReadableName(@querySpatial()?.split(':')[0]))
        @error('')
        return ''
      unless value.trim().match(/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/)
        msg += "Invalid coordinates: #{value}. Please enter a point using 'lat,lon' format.\n"
        @error(msg)
        return msg
      lat = value.split(/,\s*/)[0]
      lon = value.split(/,\s*/)[1]
      msg += "Lat [#{lat}] must be between -90 and 90.\n" if lat < -90 || lat > 90
      msg += "Lon [#{lon}] must be between -180 and 180.\n" if lon < -180 || lon > 180
      @error(msg)
      return msg

    _loadMap: =>
      state = document.readyState
      unless state == 'complete'
        setTimeout(@_loadMap, 0)
        return
      @_map = $('#map')
      @_map.data('map')?.map.on 'spatialtoolchange', (e) => @error('')
      @_map = @_map[0]

    _getSpatialName: ->
      @_toReadableName(@querySpatial().split(':')[0]) if @querySpatial()?.length > 0

    _toReadableName: (name) ->
      return 'Point' if name == 'point'
      return 'Bounding Box' if name == 'bounding_box'
      null

    _getCoordinates: ->
      if @spatialName() == 'Point'
        @_reverseLonLat(@querySpatial?().split(':')[1])
      else if @spatialName() == 'Bounding Box'
        splits = @querySpatial?().split(':')
        splits.shift()
        [sw, ne] = splits
        [@_reverseLonLat(sw), @_reverseLonLat(ne)]

    _setCoordinates: (value) ->
      if value == null || value == ''
        @querySpatial(null)
      else if typeof(value) == 'string'
        @querySpatial('point:' + @_reverseLonLat(value))
      else
        if !!value[0] || !!value[1]
          @querySpatial('bounding_box:' + @_reverseLonLat(value[0]) + ':' + @_reverseLonLat(value[1]))
        else
          null

    _getPoint: ->
      @_reverseLonLat(@querySpatial?().split(':')[1]) if @spatialName?() == 'Point'

    _setPoint: (value) ->
      @_cancelDrawing()
      return if @_validateCoordinate(value).length > 0

      if value == null || value == ''
        @querySpatial(null)
      else
        @querySpatial("point:" + @_reverseLonLat(value))

    _getSwPoint: ->
      if @spatialName?() == 'Bounding Box'
        if @coordinates() == null then null else @coordinates()?[0]

    _setSwPoint: (value) ->
      return if @_validateCoordinate(value).length > 0

      if !!value
        @coordinates = ko.observableArray([]) if !@coordinates()? || typeof(@coordinates()) == 'string'
        @coordinates()[0] = value
      else
        @coordinates(null)

      if @coordinates()?.length == 2
        @querySpatial('bounding_box:' + @_reverseLonLat(@coordinates()[0]) + ':' + @_reverseLonLat(@coordinates()[1]))

    _getNePoint: ->
      if @spatialName?() == 'Bounding Box'
        if @coordinates() == null then null else @coordinates()?[1]

    _setNePoint: (value) ->
      @_cancelDrawing()
      return if @_validateCoordinate(value).length > 0

      if !!value
        @coordinates = ko.observableArray([]) if !@coordinates()? || typeof(@coordinates()) == 'string'
        @coordinates()[1] = value
      else
        if !@coordinates()? || typeof(@coordinates()) == 'string'
          @coordinates(null)

      if @coordinates()?.length == 2
        @querySpatial('bounding_box:' + @_reverseLonLat(@coordinates()[0]) + ':' + @_reverseLonLat(@coordinates()[1]))

    _reverseLonLat: (point) ->
      [lon, lat] = point.split(/,\s*/)
      "#{lat},#{lon}"

    # 'cancel' the draw action if user elects to type it manually
    _cancelDrawing: ->
      cancelLink = @_map?.querySelectorAll('.leaflet-draw-section a[title="Cancel drawing"]')[0]
      event = document.createEvent("MouseEvents")
      event.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
      cancelLink?.dispatchEvent(event)

  exports = SpatialEntry
