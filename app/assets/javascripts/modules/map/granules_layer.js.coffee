ns = @edsc.map

ns.GranulesLayer = do (L
                       ko
                       project = @edsc.page.project
                       extend = $.extend
                       ) ->

  class GranuleInfo
    constructor: (project) ->
      @_granulesModel = null
      @granules = ko.computed =>
        @_granulesModel?.dispose()
        @_granulesModel = null
        @_granulesModel = project.selectedDataset()?.createGranulesModel()

    point: (latLng) ->
      if latLng?
        @_point = latLng
        granules = @granules()
        if granules?
          granules.query.spatial("point:#{latLng.lng},#{latLng.lat}")
          granules.results() # Force evaluation
      @_point

    dispose: ->
      @granules.dispose()

  class GranulesLayer
    constructor: ->
      @_hoverTimer = null

    onAdd: (map) ->
      @_granuleInfo = new GranuleInfo(project)

      el = @_getInfoElement(map)
      ko.applyBindings(@_granuleInfo, el) if el?

      map.on 'mousemove', @_onMouseMove
      map.on 'mouseout', @_onMouseOut

    onRemove: (map) ->
      @_granuleInfo.dispose()

      el = @_getInfoElement(map)
      ko.cleanNode(el) if el?

      map.off 'mousemove', @_onMouseMove
      map.off 'mouseout', @_onMouseOut

    _getInfoElement: (map) ->
      map.getContainer().getElementsByClassName('granule-info')[0]

    _onMouseMove: (e) =>
      clearTimeout(@_hoverTimer)
      onHover = => @_onHover(e)
      @_hoverTimer = setTimeout(onHover, 500)

    _onMouseOut: (e) =>
      clearTimeout(@_hoverTimer)

    _onHover: (e) ->
      @_granuleInfo.point(e.latlng)

  exports = GranulesLayer