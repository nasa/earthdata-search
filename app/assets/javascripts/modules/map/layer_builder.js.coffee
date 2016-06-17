ns = @edsc.map

ns.LayerBuilder = do (GibsTileLayer = ns.L.GibsTileLayer) ->

  osmAttribution = '<span class="map-attribution">* &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span>'

  gibsParams =
    blue_marble:
      name: 'Blue Marble'
      product: 'BlueMarble_ShadedRelief_Bathymetry'
      resolution: '500m'
      format: 'jpeg'
      maxNativeZoom: 7
    MODIS_Terra_CorrectedReflectance_TrueColor:
      name: 'Corrected Reflectance (True Color)'
      product: 'MODIS_Terra_CorrectedReflectance_TrueColor'
      resolution: '250m'
      format: 'jpeg'
      maxNativeZoom: 7
      syncTime: true
    land_water_map:
      name: 'Land / Water Map *'
      product: 'OSM_Land_Water_Map'
      resolution: '250m'
      format: 'png'
      maxNativeZoom: 7
    coastlines:
      name: 'Coastlines *'
      product: 'Coastlines'
      resolution: '250m'
      format: 'png'
      maxNativeZoom: 7
    borders:
      name: 'Borders and Roads *'
      product: 'Reference_Features'
      resolution: '250m'
      format: 'png'
      maxNativeZoom: 7
    labels:
      name: 'Place Labels *' + osmAttribution
      product: 'Reference_Labels'
      resolution: '250m'
      format: 'png'
      maxNativeZoom: 7

  layerForProduct = (id) ->
    return new GibsTileLayer(gibsParams[id]) if gibsParams[id]?
    console.error("Unable to find product: #{id}")

  exports =
    layerForProduct: layerForProduct
