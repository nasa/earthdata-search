ns = window.edsc.map

ns.GibsParams = do ->

  params =
    MODIS_Terra_CorrectedReflectance_TrueColor:
      name: 'Corrected Reflectance (True Color)'
      source: 'Terra / MODIS'
      product: 'MODIS_Terra_CorrectedReflectance_TrueColor'
      resolution: '250m'
      format: 'jpeg'
    land_water_map:
      name: 'Land / Water Map'
      source: 'OpenStreetMap / Coastlines'
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      product: 'land_water_map'
      resolution: '250m'
      format: 'png'
    national_boundaries:
      name: 'National Boundaries'
      source: 'SEDAC / National Boundaries'
    administrative_boundaries:
      name: 'Administrative Boundaries'
      source: 'SEDAC / L1 Admin Boundaries'
    coastlines:
      name: 'Coastlines'
      source: 'SEDAC / Coastlines v3'
    graticule:
      name: 'Latitude-Longitude Lines'
      source: 'Polarview / Graticule'

  class GibsParams
    @findByProductId = (id) ->
      params[id]

  exports = GibsParams
