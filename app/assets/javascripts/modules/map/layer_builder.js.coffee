ns = @edsc.map

ns.LayerBuilder = do (GibsTileLayer = ns.L.GibsTileLayer,
                      SedacTileLayer = ns.L.SedacTileLayer) ->

  gibsParams =
    blue_marble:
      name: 'Blue Marble'
      product: 'blue_marble'
      product_arctic: 'blue_marble_arctic'
      product_antarctic: 'blue_marble_antarctic'
      product_geo: 'blue_marble'
      product: 'blue_marble'
      resolution: '500m'
      format: 'jpeg'
      arctic: false
      antarctic: false
    MODIS_Terra_CorrectedReflectance_TrueColor:
      name: 'Corrected Reflectance (True Color)'
      source: 'Terra / MODIS'
      product: 'MODIS_Terra_CorrectedReflectance_TrueColor'
      resolution: '250m'
      format: 'jpeg'
      syncTime: true
    land_water_map:
      name: 'Land / Water Map'
      source: 'OpenStreetMap / Coastlines'
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      product: 'land_water_map'
      resolution: '250m'
      format: 'png'

  sedacParams =
    administrative_boundaries:
      name: 'Administrative Boundaries'
      source: 'SEDAC / L1 Admin Boundaries'
      wmsParams:
        layers: 'cartographic:esri-administrative-boundaries_level-1'
    coastlines:
      name: 'Coastlines'
      source: 'SEDAC / Coastlines v3'
      wmsParams:
        layers: 'gpw-v3-coastlines'

  layerForProduct = (id) ->
    return new GibsTileLayer(gibsParams[id]) if gibsParams[id]?
    return new SedacTileLayer(sedacParams[id]) if sedacParams[id]?

    console.error("Unable to find product: #{id}")

  exports =
    layerForProduct: layerForProduct
