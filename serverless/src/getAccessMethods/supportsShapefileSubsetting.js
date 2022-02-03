/**
 * Determine whether or not the provided UMM S record supports shapefile subsetting
 * @param {Object} service UMM S record to parse
 */
export const supportsShapefileSubsetting = (service) => {
  const { serviceOptions = {} } = service

  // If there are no service options the record can not support variable subsetting
  if (serviceOptions == null) return false

  const { subset = {} } = serviceOptions
  const { spatialSubset = {} } = subset
  const {
    shapefile = []
  } = spatialSubset

  return shapefile.find((shapefile) => shapefile.format === 'GeoJSON') != null
}
