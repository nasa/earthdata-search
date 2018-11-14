ns = @edsc.map

ns.LayerBuilder = do (L,
                      gibsUrl = @edsc.config.gibsUrl,
                      GibsTileLayer = ns.L.GibsTileLayer
                     ) ->

  osmAttribution = '<span class="map-attribution">* &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors</span>'

  defaultOptions =
    tileSize: 512
    bounds: [
      [-89.9999, -179.9999],
      [89.9999, 179.9999]
    ]

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

  projectionOptions =
    arctic:
      projection: 'EPSG3413'
      lprojection: 'epsg3413'
      endpoint: 'arctic'
    antarctic:
      projection: 'EPSG3031'
      lprojection: 'epsg3031'
      endpoint: 'antarctic'
    geo:
      projection: 'EPSG4326'
      lprojection: 'epsg4326'
      endpoint: 'geo'

  layerForProduct = (id, projection) ->
    return new GibsTileLayer(gibsUrl, L.extend({}, defaultOptions, gibsParams[id], projectionOptions[projection], time: ''))
    console.error("Unable to find product: #{id}")

  exports =
    layerForProduct: layerForProduct
