ns = @edsc.map

ns.LayerBuilder = do (GibsTileLayer = ns.L.GibsTileLayer) ->

  osmAttribution = '<span class="map-attribution">* &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span>'

  gibsParams =
    blue_marble:
      name: 'Blue Marble'
      product: 'BlueMarble_ShadedRelief_Bathymetry'
      resolution: '500m'
      format: 'jpeg'
    MODIS_Terra_CorrectedReflectance_TrueColor:
      name: 'Corrected Reflectance (True Color)'
      product: 'MODIS_Terra_CorrectedReflectance_TrueColor'
      resolution: '250m'
      format: 'jpeg'
      syncTime: true
    land_water_map:
      name: 'Land / Water Map *'
      product: 'land_water_map'
      resolution: '250m'
      format: 'png'
    coastlines:
      name: 'Coastlines *'
      product: 'Coastlines'
      resolution: '250m'
      format: 'png'
    borders:
      name: 'Borders and Roads *'
      product: 'Reference_Features'
      resolution: '250m'
      format: 'png'
    labels:
      name: 'Place Labels *' + osmAttribution
      product: 'Reference_Labels'
      resolution: '250m'
      format: 'png'

  layerForProduct = (id) ->
    return new GibsTileLayer(gibsParams[id]) if gibsParams[id]?
    console.error("Unable to find product: #{id}")

  exports =
    layerForProduct: layerForProduct
