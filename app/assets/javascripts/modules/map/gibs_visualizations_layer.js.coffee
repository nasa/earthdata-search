ns = @edsc.map

ns.GibsVisualizationsLayer = do (L, dateUtil=@edsc.util.date, GibsTileLayer=ns.L.GibsTileLayer) ->

  yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  class GibsVisualizationsLayer
    constructor: ->
      @_datasetIdsToLayers = {}
      @_visualizedDate = dateUtil.isoUtcDateString(yesterday)

    onAdd: (map) ->
      @_map = map
      map.on 'gibs.visibledatasetschange', @_onVisibleDatasetsChange
      map.on 'visualizeddatechange', @_onVisualizedDateChange

    onRemove: (map) ->
      @_map = map
      map.off 'gibs.visibledatasetschange', @_onVisibleDatasetsChange
      map.off 'visualizeddatechange', @_onVisualizedDateChange

    _onVisibleDatasetsChange: (e) =>
      @setVisibleDatasets(e.datasets)

    setVisibleDatasets: (datasets) =>
      map = @_map

      datasetIdsToLayers = @_datasetIdsToLayers
      newDatasetIdsToLayers = {}

      baseZ = 1
      overlayZ = 11

      for dataset in datasets
        id = dataset.id()
        params = dataset.gibs()
        if params.format == 'jpeg'
          z = Math.min(baseZ++, 9)
        else
          z = Math.min(overlayZ++, 19)

        if datasetIdsToLayers[id]?
          layer = datasetIdsToLayers[id]
        else
          layer = new GibsTileLayer(L.extend({}, params, time: @_visualizedDate))
          map.addLayer(layer)
        layer.setZIndex(z)

        newDatasetIdsToLayers[id] = layer

      for own id, layer of datasetIdsToLayers
        unless newDatasetIdsToLayers[id]?
          map.removeLayer(layer)

      @_datasetIdsToLayers = newDatasetIdsToLayers

      null

    _onVisualizedDateChange: (e) =>
      @_visualizedDate = date = dateUtil.isoUtcDateString(e.date || yesterday)

      for own id, layer of @_datasetIdsToLayers
        layer.updateOptions(time: date)

  exports = GibsVisualizationsLayer
