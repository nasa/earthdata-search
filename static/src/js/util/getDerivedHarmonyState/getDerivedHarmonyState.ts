import {
  DerivedHarmonyState,
  HarmonyCapabilitiesDocument,
  HarmonyOutputFormat,
  HarmonyOutputFormatAvailability,
  HarmonyOutputProjectionAvailability,
  HarmonyService,
  SupportedProjection,
  UserSelections
} from './derivedHarmonyStateTypes'

/**
 * Derives the available capabilities and state based on a user's selections
 * and the available Harmony services as defined by the capabilities document.
 * @param userSelections - The active filters/selections chosen by the user.
 * @param harmonyCapabilitiesDocument - The document describing supported Harmony capabilities.
 * @returns A computed state object defining which capabilities are supported and disabled.
 */
export const getDerivedHarmonyState = (
  userSelections: UserSelections,
  harmonyCapabilitiesDocument: HarmonyCapabilitiesDocument
): DerivedHarmonyState | Record<string, never> => {
  const {
    conceptId,
    shortName,
    summary: {
      subsetting: {
        bbox: summaryBbox = false,
        shape: summaryShape = false,
        temporal: summaryTemporal = false,
        variable: summaryVariable = false
      },
      reprojection: {
        supportedProjections: summarySupportedProjections = []
      },
      concatenation: summaryConcatenation,
      outputFormats: summaryOutputFormats = []
    },
    services: summaryServices,
    variables: summaryVariables
  } = harmonyCapabilitiesDocument

  // If there are no services to parse though, then there will be no derived harmony state
  if (!summaryServices || summaryServices.length === 0) {
    return {}
  }

  // Helper function to determine if a service supports the user's selections (excluding output formats and projections, see below)
  const supportsUserSelections = (service: HarmonyService) => {
    const { capabilities: serviceCapabilities } = service
    const { subsetting: serviceSubsetting } = serviceCapabilities

    // If a user selected it, check that it's available in the service's subsetting.
    // If not, return false (the service does not support the user selections).
    if (
      userSelections.spatialSubset
      && (!serviceSubsetting.bbox
      && !serviceSubsetting.shape)
    ) return false
    if (userSelections.temporalSubset && !serviceSubsetting.temporal) return false
    // Provide a default of 0 to evaluate against if selectedVariables.length is undefined
    if (((userSelections.selectedVariables?.length ?? 0) > 0)
      && !serviceSubsetting.variable) return false
    if (userSelections.concatenate && !serviceCapabilities.concatenation) return false

    return true
  }

  // Base services that support the user's subsetting features (Ignores format AND projection)
  const baseValidServices = summaryServices.filter(supportsUserSelections)

  // Create helper boolean functions for format and projection matching
  const matchesFormat = (service: HarmonyService) => !userSelections.selectedOutputFormat
    || service.capabilities.outputFormats.some(
      (format) => format.mimeType === userSelections.selectedOutputFormat
    )

  const matchesProjection = (service: HarmonyService) => !userSelections.selectedOutputProjection
    || service.capabilities.reprojection.supportedProjections.some(
      (projection) => projection.crs === userSelections.selectedOutputProjection
    )

  // Create the specialized lists
  // Apply only the projection filter. Used to populate the Format dropdown.
  const validServicesIgnoringFormat = baseValidServices.filter(matchesProjection)

  // Apply only the format filter. Used to populate the Projection dropdown.
  const validServicesIgnoringProjection = baseValidServices.filter(matchesFormat)

  // Apply BOTH filters. Used for the rest of the capabilities checklist (bbox, shape, etc.)
  const validServices = baseValidServices.filter(
    (service: HarmonyService) => matchesFormat(service) && matchesProjection(service)
  )

  // Assume all capabilities are disabled unless proven otherwise below
  const disabledCapabilities = {
    variableSubset: true,
    spatialSubset: true,
    bbox: true,
    shape: true,
    temporalSubset: true,
    concatenate: true
  }

  // Assess whether a capability is enabled based on whether or not it's listed any of the valid services
  validServices.forEach((service: HarmonyService) => {
    const { capabilities: serviceCapabilities } = service
    const { subsetting: serviceSubsetting } = serviceCapabilities
    if (serviceSubsetting.variable) disabledCapabilities.variableSubset = false
    if (
      serviceSubsetting.bbox
      || serviceSubsetting.shape
    ) disabledCapabilities.spatialSubset = false
    if (serviceSubsetting.bbox) disabledCapabilities.bbox = false
    if (serviceSubsetting.shape) disabledCapabilities.shape = false
    if (serviceSubsetting.temporal) disabledCapabilities.temporalSubset = false
    if (serviceCapabilities.concatenation) disabledCapabilities.concatenate = false
  })

  // Calculate the set of all unique output formats that are currently available.
  // We use `validServicesIgnoringFormat` to prevent the dropdown from collapsing on itself.
  // (i.e., Selecting Format A shouldn't cause Formats B and C to disappear from the UI).
  const availableFormatNames = new Set<string>()
  validServicesIgnoringFormat.forEach((service: HarmonyService) => {
    const formats = service.capabilities.outputFormats
    formats.forEach((format) => availableFormatNames.add(format.name))
  })

  // Create a boolean lookup dictionary for the UI to easily enable/disable dropdown options.
  // Maps every format supported by the collection to true (available) or false (disabled).
  const outputFormatAvailability: HarmonyOutputFormatAvailability = {}
  summaryOutputFormats.forEach((supportedFormat: HarmonyOutputFormat) => {
    outputFormatAvailability[supportedFormat.name] = availableFormatNames.has(supportedFormat.name)
  })

  // Same logic above must be applied to output Projections
  const availableProjectionNames = new Set<string>()
  validServicesIgnoringProjection.forEach((service: HarmonyService) => {
    const projections = service.capabilities.reprojection.supportedProjections
    projections.forEach((projection) => availableProjectionNames.add(projection.name))
  })

  const outputProjectionAvailability: HarmonyOutputProjectionAvailability = {}
  summarySupportedProjections.forEach((supportedProjection: SupportedProjection) => {
    outputProjectionAvailability[supportedProjection.name] = availableProjectionNames.has(
      supportedProjection.name
    )
  })

  return {
    collectionId: conceptId,
    shortName,
    variables: summaryVariables,
    capabilities: {
      variableSubset: {
        supported: summaryVariable,
        disabled: disabledCapabilities.variableSubset
      },
      spatialSubset: {
        supported: summaryBbox || summaryShape,
        disabled: disabledCapabilities.spatialSubset,
        shapeDisabled: disabledCapabilities.shape,
        bboxDisabled: disabledCapabilities.bbox
      },
      temporalSubset: {
        supported: summaryTemporal,
        disabled: disabledCapabilities.temporalSubset
      },
      concatenate: {
        supported: summaryConcatenation,
        disabled: disabledCapabilities.concatenate
      },
      reproject: {
        supported: summarySupportedProjections,
        disabled: availableProjectionNames.size === 0,
        outputProjectionAvailability,
        value: userSelections.selectedOutputProjection || ''
      },
      outputFormats: {
        supported: summaryOutputFormats,
        disabled: availableFormatNames.size === 0,
        outputFormatAvailability,
        value: userSelections.selectedOutputFormat || ''
      }
    }
  }
}

export default getDerivedHarmonyState
