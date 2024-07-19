import { uniq } from 'lodash-es'

import { getVariables } from '../getVariables'
import { supportsVariableSubsetting } from '../supportsVariableSubsetting'

/**
 * Builds the oPeNDAP access method
 * @param {object} serviceItem serviceItem in the Collection Metadata
 * @param {object} associatedVariables variables that are either in the serviceItem or collectionMetadata (prioritizes the serviceItem variables)
 * @returns {object} Access method for oPeNDAP
 */
export const buildOpendap = (serviceItem, associatedVariables) => {
  const accessMethods = {}

  const {
    conceptId: serviceConceptId,
    type: serviceType,
    longName,
    name,
    supportedReformattings
  } = serviceItem

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

  return accessMethods
}
