ns = @edsc.map

ns.GibsVisualizationsLayer = do (L, dateUtil=@edsc.util.date, GibsGranuleLayer=ns.L.GibsGranuleLayer) ->
  MIN_PAGE_SIZE = 200

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

      baseZ = 6
      overlayZ = 16

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
          # Ensure enough granules are loaded.  Once we have granule list views, we may
          # want this to use a separate model instance so that we can set different desired
          # page sizes and sort orders.  For now, that has very undesirable performance
          # implications (running 2 granule queries when we really only need one), so we
          # should wait for faster searches from the CMR before considering a change.
          #
          # Note: our algorithms rely on sort order being [-end_date, -start_date]
          granules = dataset.granulesModel
          pageSize = Math.max(MIN_PAGE_SIZE, granules.query.pageSize())
          granules.query.pageSize(pageSize)
          layer = new GibsGranuleLayer(granules, params)
          map.addLayer(layer)

        layer.setZIndex(z)

        newDatasetIdsToLayers[id] = layer

      for own id, layer of datasetIdsToLayers
        unless newDatasetIdsToLayers[id]?
          map.removeLayer(layer)

      @_datasetIdsToLayers = newDatasetIdsToLayers

      null

  exports = GibsVisualizationsLayer
