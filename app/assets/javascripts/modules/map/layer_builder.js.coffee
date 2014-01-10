ns = window.edsc.map

ns.LayerBuilder = do (GibsTileLayer = ns.L.GibsTileLayer,
                      SedacTileLayer = ns.L.SedacTileLayer,
                      dateUtil = window.edsc.util.date) ->

  yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  gibsParams =
    blue_marble:
      name: 'Blue Marble'
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
      time: dateUtil.isoUtcDateString(yesterday)
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

  buildGibsLayer = (id, projection) ->
    params = gibsParams[id]
    new GibsTileLayer(params.name, params, projection)

  buildSedacLayer = (id, projection) ->
    params = sedacParams[id]
    new SedacTileLayer(params.name, params.wmsParams, projection)

  layerForProduct = (id, projection="geo") ->
    if gibsParams[id]?
      buildGibsLayer(id, projection)
    else if sedacParams[id]?
      buildSedacLayer(id, projection)
    else
      console.error("Unable to find product: #{id}")
      null

  exports =
    layerForProduct: layerForProduct
