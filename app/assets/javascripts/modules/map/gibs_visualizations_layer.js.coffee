ns = @edsc.map

ns.GibsVisualizationsLayer = do (L, dateUtil=@edsc.util.date) ->

  class GibsVisualizationsLayer
    constructor: ->
      @_datasetIdsToLayers = {}
      yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
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
        params = dataset.gibs()
        if params.format == 'jpeg'
          z = Math.max(baseZ++, 9)
        else
          z = Math.max(overlayZ++, 19)

        if datasetIdsToLayers[dataset.id]?
          layer = datasetIdsToLayers[dataset.id]
          layer.setZIndex(z)
        else
          layer = new GibsTileLayer(L.extend({}, params, time: @_visualizedDate, zIndex: z))
          map.addLayer(layer)

        newDatasetIdsToLayers[dataset.id] = layer

      for own id, layer of datasetIdsToLayers
        unless newDatasetIdsToLayers[id]?
          map.removeLayer(layer)

      datasetIdsToLayers = newDatasetIdsToLayers

      null

    _onVisualizedDateChange: (e) =>
      @_visualizedDate = date = dateUtil.isoUtcDateString(e.date)

      for own id, layer of @_datasetIdsToLayers
        layer.updateOptions(time: date)

  exports = GibsVisualizationsLayer
