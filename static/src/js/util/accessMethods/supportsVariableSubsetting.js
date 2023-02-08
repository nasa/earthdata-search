import { isEmpty } from 'lodash'

/**
 * Determine whether or not the provided UMM S record supports variable subsetting
 * @param {Object} service UMM S record to parse
 */
export const supportsVariableSubsetting = (service) => {
  const { serviceOptions = {} } = service

  // If there are no service options the record can not support variable subsetting
  if (serviceOptions == null) return false

  const { subset = {} } = serviceOptions
  const { variableSubset = {} } = subset

  return !isEmpty(variableSubset)
}
