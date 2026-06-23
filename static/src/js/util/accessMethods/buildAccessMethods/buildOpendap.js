import { getVariables } from '../getVariables'
import { supportsVariableSubsetting } from '../supportsVariableSubsetting'
import { ousFormatMapping } from '../../../../../../sharedUtils/outputFormatMaps'

/**
 * Builds the oPeNDAP access method
 * @param {object} serviceItem serviceItem in the Collection Metadata
 * @param {object} associatedVariables variables that are either in the serviceItem or collectionMetadata (prioritizes the serviceItem variables)
 * @returns {object} Access method for oPeNDAP
 */
export const buildOpendap = (serviceItem, params) => {
  const { associatedVariables } = params

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

  const formattedOutputFormats = Array.from(
    outputFormats.reduce((uniqueMap, format) => {
      const mimeType = ousFormatMapping[format]

      // If the mapping exists AND we haven't already added this mimeType
      if (mimeType !== undefined && !uniqueMap.has(mimeType)) {
        uniqueMap.set(mimeType, {
          name: format,
          mimeType
        })
      }

      return uniqueMap
    }, new Map()).values()
  )

  return [
    {
      hierarchyMappings,
      id: serviceConceptId,
      isValid: true,
      keywordMappings,
      longName,
      name,
      supportedOutputFormats: formattedOutputFormats,
      supportsVariableSubsetting: supportsVariableSubsetting(serviceItem),
      type: serviceType,
      variables
    }
  ]
}
