/**
 * Determine whether or not the provided UMM S record supports shapefile subsetting
 * @param {Object} service UMM S record to parse
 */
export const defaultConcatenation = (service) => {
  const { serviceOptions = {} } = service

  // If there are no service options the record can not support variable subsetting
  if (serviceOptions == null) return false

  const { aggregation = {} } = serviceOptions
  const { concatenate = {} } = aggregation

  const { concatenateDefault = false } = concatenate
  console.log(concatenateDefault)

  return concatenateDefault
}
