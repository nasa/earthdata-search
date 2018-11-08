ns = @edsc.map

# Meta-layer for managing granule visualizations
ns.GranuleVisualizationsLayer = do (L, dateUtil=@edsc.util.date, extend = $.extend, GranuleGridLayer = ns.L.GranuleGridLayer, project = if @edsc.page? then @edsc.page.project else false) ->
  #MIN_PAGE_SIZE = 100

  class GranuleVisualizationsLayer extends L.Layer
    constructor: ->
      @_collectionIdsToLayers = {}

    onAdd: (map) ->
      @_map = map
      map.on 'edsc.visiblecollectionschange', @_onVisibleCollectionsChange

    onRemove: (map) ->
      @_map = map
      map.off 'edsc.visiblecollectionschange', @_onVisibleCollectionsChange

    _onVisibleCollectionsChange: (e) =>
      @setVisibleCollections(e.collections)

    setVisibleCollections: (collections) =>
      map = @_map

      collectionIdsToLayers = @_collectionIdsToLayers
      newCollectionIdsToLayers = {}

      baseZ = 6
      overlayZ = 16

      for collection in collections
        id = collection.id
        options = collection.gibs()
        if options?[0].format == 'jpeg'
          z = Math.min(baseZ++, 9)
        else
          z = Math.min(overlayZ++, 19)

        if collectionIdsToLayers[id]?
          layer = collectionIdsToLayers[id]
        else
          color = project.colorForCollection(collection)
          # Note: our algorithms rely on sort order being [-start_date]
          layer = new GranuleGridLayer(collection, color, options)
          map.addLayer(layer)

          if collection.boxes?.length > 0
            [lat1, lon1, lat2, lon2] = collection.boxes[0].split(' ').map((item) ->
              parseFloat item)
            southWest = L.latLng(lat1, lon1)
            northEast = L.latLng(lat2, lon2)
            bounds = L.latLngBounds(southWest, northEast);
            if bounds.getNorth() - bounds.getSouth() < .5 && bounds.getWest() - bounds.getEast() < .5
              marker = L.featureGroup().addLayer(L.marker(bounds.getCenter()))
              map.addLayer(marker)
              newCollectionIdsToLayers[id + '-marker'] = marker

        layer.setZIndex(z)
        newCollectionIdsToLayers[id] = layer

      for own id, layer of collectionIdsToLayers
        unless newCollectionIdsToLayers[id]?
          map.removeLayer(layer)
          if newCollectionIdsToLayers[id+'-marker']?
            map.removeLayer(newCollectionIdsToLayers[id+'-marker'])

      @_collectionIdsToLayers = newCollectionIdsToLayers

      null

  exports = GranuleVisualizationsLayer
