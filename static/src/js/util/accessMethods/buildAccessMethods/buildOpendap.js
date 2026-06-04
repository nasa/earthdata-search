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

  const formattedOutputFormats = outputFormats
    .filter((format) => ousFormatMapping[format] !== undefined)
    .map((format) => ({
      name: format,
      mimeType: ousFormatMapping[format]
    }))

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
