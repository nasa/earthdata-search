import { getVariables } from '../getVariables'

import { getApplicationConfig, getEarthdataConfig } from '../../../../../../sharedUtils/config'

import getDerivedHarmonyState from '../../getDerivedHarmonyState/getDerivedHarmonyState'

/**
 * Builds the Harmony access method
 * @param {object} harmonyCapabilitiesDocument object that contains capabilities document from harmony endpoint
 * @returns {object} Access method for Harmony
 */
export const buildHarmony = (harmonyCapabilitiesDocument, userSelections) => {
  const derivedHarmonyState = getDerivedHarmonyState(userSelections, harmonyCapabilitiesDocument)

  const {
    collectionId, shortName, variables: derivedVariables, capabilities
  } = derivedHarmonyState

  const {
    concatenate,
    outputFormats,
    temporalSubset,
    spatialSubset,
    variableSubset
  } = capabilities

  const { env } = getApplicationConfig()

  const url = getEarthdataConfig(env).harmonyHost

  const {
    hierarchyMappings,
    keywordMappings,
    variables
  } = getVariables(derivedVariables)

  // This is the initial structure that is supplied to accessMethods.
  // Supported means that it is supported in the top level of the capabilities document,
  // Enabled means that a user has enabled (selected) it
  // isDisabled is derived from harmony state after users make their selections
  return {
    outputFormatAvailability: outputFormats.outputFormatAvailability,
    enableConcatenateDownload: userSelections.concatenate || false,
    enableSpatialSubsetting: userSelections.spatialSubset || false,
    enableTemporalSubsetting: userSelections.temporalSubset || false,
    harmonyCapabilitiesDocument,
    hierarchyMappings,
    id: collectionId,
    isOutputFormatsDisabled: outputFormats.disabled,
    isShapeSubsettingDisabled: spatialSubset.shapeDisabled,
    isSpatialSubsettingDisabled: spatialSubset.disabled,
    isTemporalSubsettingDisabled: temporalSubset.disabled,
    isValid: true,
    isVariableSubsettingDisabled: variableSubset.disabled,
    keywordMappings,
    selectedOutputFormat: userSelections.outputFormat,
    selectedVariables: userSelections.selectedVariables || [],
    shortName,
    supportedOutputFormats: outputFormats.supported,
    supportedOutputProjections: outputFormats.supported,
    supportsBoundingBoxSubsetting: spatialSubset.bboxSupported,
    supportsConcatenation: concatenate.supported,
    supportsShapefileSubsetting: spatialSubset.shapeSupported,
    supportsTemporalSubsetting: temporalSubset.supported,
    supportsVariableSubsetting: variableSubset.supported,
    type: 'Harmony',
    url,
    variables
  }
}
