import { getEnvironmentConfig } from '../../../../../../sharedUtils/config'

/**
 * Builds the Harmony access method
 * @param {object} harmonyCapabilites object that contains capabilites document from harmony endpoint
 * @returns {object} Access method for Harmony
 */
export const buildHarmony = (harmonyCapabilities) => {
  const {
    bboxSubset,
    concatenate,
    conceptId,
    outputFormats,
    services,
    shapeSubset,
    shortName,
    temporalSubset,
    variables,
    variableSubset
  } = harmonyCapabilities

  const url = getEnvironmentConfig().harmonyHost

  return {
    defaultConcatenation: false,
    enableConcatenateDownload: false,
    enableSpatialSubsetting: false,
    enableTemporalSubsetting: false,
    id: conceptId,
    isValid: true,
    services,
    shortName,
    supportedOutputFormats: outputFormats,
    supportedOutputProjections: [],
    supportsBoundingBoxSubsetting: bboxSubset,
    supportsConcatenation: concatenate,
    supportsShapefileSubsetting: shapeSubset,
    supportsTemporalSubsetting: temporalSubset,
    supportsVariableSubsetting: variableSubset,
    type: 'Harmony',
    url,
    variables
  }
}
