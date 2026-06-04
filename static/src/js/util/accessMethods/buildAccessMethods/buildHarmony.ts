import { getVariables } from '../getVariables'
// @ts-expect-error This file does not have types
import { getApplicationConfig, getEarthdataConfig } from '../../../../../../sharedUtils/config'
import getDerivedHarmonyState, {
  HarmonyCapabilitiesDocument,
  UserSelections,
  DerivedHarmonyState,
  HarmonyVariable
} from '../../getDerivedHarmonyState/getDerivedHarmonyState'
import { HarmonyAccessMethod } from '../../../zustand/types'

/**
 * Builds the Harmony access method
 * @param harmonyCapabilitiesDocument - object that contains capabilities document from harmony endpoint
 * @param userSelections - The active filters/selections chosen by the user
 * @returns Access method configuration for Harmony, or null if no valid services exist
 */
export const buildHarmony = (
  harmonyCapabilitiesDocument: HarmonyCapabilitiesDocument | null,
  userSelections: UserSelections
): HarmonyAccessMethod | null => {
  // If there is no document, OR if there are no services, OR if the services length is 0, return null
  if (!harmonyCapabilitiesDocument?.services?.length) {
    return null
  }

  const derivedHarmonyState = getDerivedHarmonyState(userSelections, harmonyCapabilitiesDocument)

  const {
    collectionId,
    shortName,
    variables: derivedVariables,
    capabilities
  } = derivedHarmonyState as DerivedHarmonyState

  const {
    concatenate,
    outputFormats,
    temporalSubset,
    spatialSubset,
    variableSubset,
    reproject
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
    enableConcatenateDownload: userSelections.concatenate || false,
    enableSpatialSubsetting: userSelections.spatialSubset || false,
    enableTemporalSubsetting: userSelections.temporalSubset || false,
    harmonyCapabilitiesDocument,
    harmonyUserSelections: userSelections,
    derivedHarmonyState,
    hierarchyMappings,
    id: collectionId,
    isConcatenationDisabled: concatenate.disabled,
    isShapeSubsettingDisabled: spatialSubset.shapeDisabled,
    isSpatialSubsettingDisabled: spatialSubset.disabled,
    isTemporalSubsettingDisabled: temporalSubset.disabled,
    isValid: true,
    isVariableSubsettingDisabled: variableSubset.disabled,
    keywordMappings,
    outputFormatAvailability: outputFormats.outputFormatAvailability,
    outputProjectionAvailability: reproject.outputProjectionAvailability,
    selectedOutputFormat: userSelections.selectedOutputFormat,
    selectedOutputProjection: userSelections.selectedOutputProjection,
    selectedVariables: userSelections.selectedVariables || [],
    shortName,
    supportedOutputFormats: outputFormats.supported,
    supportedOutputProjections: reproject.supported,
    supportsConcatenation: concatenate.supported,
    // Some services support bbox, but not shapefile so we use this field to specify when that's the case
    supportsShapefileSubsetting: spatialSubset.shapeDisabled,
    supportsSpatialSubsetting: spatialSubset.supported,
    supportsTemporalSubsetting: temporalSubset.supported,
    supportsVariableSubsetting: variableSubset.supported,
    type: 'Harmony',
    url,
    variables: variables as Record<string, HarmonyVariable>
  }
}
