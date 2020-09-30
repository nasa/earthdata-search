import { isEmpty } from 'lodash'

/**
 * Determine whether or not the provided UMM S record supports bounding box subsetting
 * @param {Object} service UMM S record to parse
 */
export const supportsBoundingBoxSubsetting = (service) => {
  const { serviceOptions = {} } = service

  // If there are no service options the record can not support variable subsetting
  if (serviceOptions == null) return false

  const { subset = {} } = serviceOptions
  const { spatialSubset = {} } = subset
  const {
    boundingBox = {}
  } = spatialSubset

  return !isEmpty(boundingBox)
}
