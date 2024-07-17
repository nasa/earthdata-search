import { uniq } from 'lodash'

import { getVariables } from '../getVariables'

import { supportsBoundingBoxSubsetting } from '../supportsBoundingBoxSubsetting'
import { supportsConcatenation } from '../supportsConcatenation'
import { defaultConcatenation } from '../defaultConcatenation'
import { supportsShapefileSubsetting } from '../supportsShapefileSubsetting'
import { supportsTemporalSubsetting } from '../supportsTemporalSubsetting'
import { supportsVariableSubsetting } from '../supportsVariableSubsetting'

export const buildHarmony = (serviceItem, associatedVariables, index) => {
  const accessMethods = {}

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

  if (serviceType.toLowerCase() === 'harmony') {
    const {
      hierarchyMappings,
      keywordMappings,
      variables
    } = getVariables(associatedVariables)
    const {
      supportedOutputProjections
    } = serviceItem

    const outputFormats = []

    if (supportedReformattings) {
      supportedReformattings.forEach((reformatting) => {
        const { supportedOutputFormats } = reformatting

        // Collect all supported output formats from each mapping
        outputFormats.push(...supportedOutputFormats)
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

    accessMethods[`harmony${index}`] = {
      description,
      enableTemporalSubsetting: true,
      enableSpatialSubsetting: true,
      hierarchyMappings,
      id: serviceConceptId,
      isValid: true,
      keywordMappings,
      longName,
      name,
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
  }

  return accessMethods
}
