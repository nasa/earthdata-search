import { uniq } from 'lodash-es'

import { getVariables } from '../getVariables'

import { supportsBoundingBoxSubsetting } from '../supportsBoundingBoxSubsetting'
import { supportsConcatenation } from '../supportsConcatenation'
import { defaultConcatenation } from '../defaultConcatenation'
import { supportsShapefileSubsetting } from '../supportsShapefileSubsetting'
import { supportsTemporalSubsetting } from '../supportsTemporalSubsetting'
import { supportsVariableSubsetting } from '../supportsVariableSubsetting'

/**
 * Builds the Harmony access method
 * @param {object} serviceItem serviceItem in the Collection Metadata
 * @param {object} associatedVariables variables that are either in the serviceItem or collectionMetadata (prioritizes the serviceItem variables)
 * @param {integer} index the harmony index for this harmony service item
 * @returns {object} Access method for Harmony
 */
export const buildHarmony = (serviceItem, params) => {
  const { associatedVariables } = params

  const {
    description,
    conceptId: serviceConceptId,
    type: serviceType,
    longName,
    name,
    url,
    supportedReformattings
  } = serviceItem

  const { urlValue } = url

  const {
    hierarchyMappings,
    keywordMappings,
    variables
  } = getVariables(associatedVariables)

  const {
    supportedOutputProjections
  } = serviceItem

  const outputFormats = []
  const inputFormats = []

  // Extract input and output formats from supportedReformattings metadata
  // This allows us to determine if the service can return the original/native format
  if (supportedReformattings) {
    supportedReformattings.forEach((reformatting) => {
      const { supportedOutputFormats, supportedInputFormat } = reformatting

      // Collect all supported output formats from each mapping
      outputFormats.push(...supportedOutputFormats)

      // Collect all supported input formats from each mapping
      // These represent the native formats that the service can accept
      if (supportedInputFormat) {
        inputFormats.push(supportedInputFormat)
      }
    })
  }

  let outputProjections = []
  if (supportedOutputProjections) {
    outputProjections = supportedOutputProjections.filter((projection) => {
      const { projectionAuthority } = projection

      return projectionAuthority != null
    }).map((projection) => {
      const { projectionAuthority } = projection

      return projectionAuthority
    })
  }

  return [
    {
      description,
      enableTemporalSubsetting: true,
      enableSpatialSubsetting: true,
      hierarchyMappings,
      id: serviceConceptId,
      isValid: true,
      keywordMappings,
      longName,
      name,
      supportedInputFormats: uniq(inputFormats),
      supportedOutputFormats: uniq(outputFormats),
      supportedOutputProjections: outputProjections,
      supportsBoundingBoxSubsetting: supportsBoundingBoxSubsetting(serviceItem),
      supportsShapefileSubsetting: supportsShapefileSubsetting(serviceItem),
      supportsTemporalSubsetting: supportsTemporalSubsetting(serviceItem),
      supportsVariableSubsetting: supportsVariableSubsetting(serviceItem),
      supportsConcatenation: supportsConcatenation(serviceItem),
      defaultConcatenation: defaultConcatenation(serviceItem),
      enableConcatenateDownload: defaultConcatenation(serviceItem),
      type: serviceType,
      url: urlValue,
      variables
    }
  ]
}
