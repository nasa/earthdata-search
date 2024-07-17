import { uniq } from 'lodash'

import { getVariables } from '../getVariables'
import { supportsVariableSubsetting } from '../supportsVariableSubsetting'

export const buildOpendap = (serviceItem, associatedVariables) => {
  const accessMethods = {}

  const {
    conceptId: serviceConceptId,
    type: serviceType,
    longName,
    name,
    supportedReformattings
  } = serviceItem

  if (serviceType.toLowerCase() === 'opendap') {
    const {
      hierarchyMappings,
      keywordMappings,
      variables
    } = getVariables(associatedVariables)

    const outputFormats = []

    if (supportedReformattings) {
      supportedReformattings.forEach((reformatting) => {
        const { supportedOutputFormats } = reformatting

        // Collect all supported output formats from each mapping
        outputFormats.push(...supportedOutputFormats)
      })
    }

    accessMethods.opendap = {
      hierarchyMappings,
      id: serviceConceptId,
      isValid: true,
      keywordMappings,
      longName,
      name,
      supportedOutputFormats: uniq(outputFormats),
      supportsVariableSubsetting: supportsVariableSubsetting(serviceItem),
      type: serviceType,
      variables
    }
  }

  return accessMethods
}
