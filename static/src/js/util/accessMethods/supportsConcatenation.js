/**
 * Determine whether or not the provided UMM S record supports Concatenation
 * @param {Object} service UMM S record to parse
 */
export const supportsConcatenation = (service) => {
  const { serviceOptions = {} } = service

  // If there are no service options the record can not support supports concatenation
  if (serviceOptions == null) return false

  const { aggregation = {} } = serviceOptions

  return 'concatenate' in aggregation
}
