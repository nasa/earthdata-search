ns = @edsc.map

ns.GibsVisualizationsLayer = do (L, dateUtil=@edsc.util.date, GibsGranuleLayer=ns.L.GibsGranuleLayer) ->

  class GibsVisualizationsLayer
    constructor: ->
      @_datasetIdsToLayers = {}

    onAdd: (map) ->
      @_map = map
      map.on 'gibs.visibledatasetschange', @_onVisibleDatasetsChange

    onRemove: (map) ->
      @_map = map
      map.off 'gibs.visibledatasetschange', @_onVisibleDatasetsChange

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
          layer = new GibsGranuleLayer(dataset.granulesModel, params)
          map.addLayer(layer)
        layer.setZIndex(z)

        newDatasetIdsToLayers[id] = layer

      for own id, layer of datasetIdsToLayers
        unless newDatasetIdsToLayers[id]?
          map.removeLayer(layer)

      @_datasetIdsToLayers = newDatasetIdsToLayers

      null

  exports = GibsVisualizationsLayer
