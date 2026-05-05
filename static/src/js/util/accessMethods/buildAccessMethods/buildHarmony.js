import { getEarthdataConfig } from '../../../../../../sharedUtils/config'
import getDerivedHarmonyState from '../../getDerivedHarmonyState/getDerivedHarmonyState'

/**
 * Builds the Harmony access method
 * @param {object} harmonyCapabilitiesDocument object that contains capabilities document from harmony endpoint
 * @returns {object} Access method for Harmony
 */
export const buildHarmony = (harmonyCapabilitiesDocument, earthdataEnvironment, userSelections) => {
  const derivedHarmonyState = getDerivedHarmonyState(userSelections, harmonyCapabilitiesDocument)

  const { collectionId, shortName, capabilities } = derivedHarmonyState

  const {
    concatenate,
    outputFormats,
    temporalSubset,
    spatialSubset,
    variableSubset,
    variables
  } = capabilities

  const url = getEarthdataConfig(earthdataEnvironment).harmonyHost

  // This is the initial structure that is supplied to accessMethods.
  // Supported means that it is supported in the top level of the capabilities document,
  // Enabled means that a user has enabled (selected) it
  // isDisabled is derived from harmony state after users make their selections
  return {
    availableOutputFormats: outputFormats.availableOutputFormats,
    harmonyCapabilitiesDocument,
    defaultConcatenation: false,
    enableConcatenateDownload: false,
    enableSpatialSubsetting: userSelections.spatialSubset,
    enableTemporalSubsetting: userSelections.temporalSubset,
    id: collectionId,
    isValid: true,
    shortName,
    supportedOutputFormats: outputFormats.supported,
    supportedOutputProjections: outputFormats.supported, // Will change
    supportsBoundingBoxSubsetting: spatialSubset.bboxSupported,
    supportsConcatenation: concatenate.supported,
    supportsShapefileSubsetting: spatialSubset.shapeSupported,
    supportsTemporalSubsetting: temporalSubset.supported,
    supportsVariableSubsetting: variableSubset.supported,
    isTemporalSubsettingDisabled: temporalSubset.disabled,
    isSpatialSubsettingDisabled: spatialSubset.disabled,
    isOutputFormatsDisabled: outputFormats.disabled,
    isShapeSubsettingDisabled: spatialSubset.shapeDisabled,
    selectedOutputFormat: userSelections.outputFormat,
    type: 'Harmony',
    url,
    variables
  }
}
