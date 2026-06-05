/**
 * The active filters/selections chosen by the user.
 */
export interface UserSelections {
  /** Flag to indicate if spatial subsetting is selected */
  spatialSubset?: boolean
  /** Flag to indicate if temporal subsetting is selected */
  temporalSubset?: boolean
  /** Flag to indicate if concatenation is selected */
  concatenate?: boolean
  /** The selected output format in mimetype. IE "image/png" or "application/netcdf" */
  selectedOutputFormat?: string | ''
  /** The selected variables */
  selectedVariables?: string[]
  /** The selected output projection in crs. IE "EPSG:4312" */
  selectedOutputProjection?: string | ''
}

/**
 * Accepted fields in the subsetting object
 */
export interface HarmonySubsetting {
  /** Flag to indicate if variable subsetting is supported */
  variable?: boolean
  /** Flag to indicate if bounding box subsetting is supported */
  bbox?: boolean
  /** Flag to indicate if shapefile subsetting is supported */
  shape?: boolean
  /** Flag to indicate if temporal subsetting is supported */
  temporal?: boolean
}

/**
 * Represents a single map projection supported by the system.
 */
export interface SupportedProjection {
  /** The descriptive name of the projection. ie. "Geographic", "NSIDC Sea Ice Polar Stereographic North" */
  name: string
  /** The Coordinate Reference System (CRS) code. "EPSG:4326", "EPSG:3413" */
  crs: string
}

/**
 * Reprojection metadata supplied from the Harmony Capabilities Document
 */
export interface HarmonyReprojection {
  /** An array of supported projection objects */
  supportedProjections: SupportedProjection[]
}

export interface HarmonyOutputFormat {
  /** Human readable name of the format */
  name: string
  /** MimeType to be sent as value to Harmony */
  mimeType: string
}

/**
 * A service and all its capabilities
 */
export interface HarmonyService {
  /** The name of the variable */
  name: string
  /** The CMR href for the variable concept */
  href: string
  /** The capabilities supported by the service */
  capabilities: {
    /** The subsetting capabilities of the service */
    subsetting: HarmonySubsetting
    /** Flag to indicate if concatenation is supported */
    concatenation: boolean
    /** Flag to indicate if reprojection is supported */
    reprojection: HarmonyReprojection
    /** The supported output formats */
    outputFormats: HarmonyOutputFormat[]
  }
}

/**
 * Science Keywords of a Variable supplied from the Harmony Capabilities Document
 * Descends by specificity, not alphabetically
 */
export interface HarmonyScienceKeyword {
  /** The category of the science keyword */
  category: string
  /** The topic of the science keyword */
  topic?: string
  /** The term of the science keyword */
  term?: string
  /** The variable level 1 of the science keyword */
  variableLevel1?: string
  /** The variable level 2 of the science keyword */
  variableLevel2?: string
  /** The variable level 3 of the science keyword */
  variableLevel3?: string
}

/**
 * Variable metadata supplied from the Harmony Capabilities Document
 */
export interface HarmonyVariable {
  /** The name of the variable */
  name: string
  /** The longname of the variable */
  longName: string
  /** The CMR href for the variable concept */
  href: string
  /** The Science Keywords of the variable */
  scienceKeywords: HarmonyScienceKeyword[],
  /** The units of the variable */
  units: string
}

/**
  * An object mapping format names to their availability status.
*/
export type HarmonyOutputFormatAvailability = Record<string, boolean>

/**
  * An object mapping projection names to their availability status.
*/
export type HarmonyOutputProjectionAvailability = Record<string, boolean>

/**
 * Describes the top level capabilities of a collection
 * If one of the listed services supports a capability, it will show up as true in the summary
*/
export interface HarmonySummaryofTopLevelCapabilities {
  /** A summary of all available subsetting capabilities across all services. */
  subsetting: HarmonySubsetting
  /** A summary of all available reprojection capabilities across all services. */
  reprojection: HarmonyReprojection
  /** A boolean flag indicating if concatenation is supported by any service. */
  concatenation: boolean
  /** An aggregated list of all unique output formats available across all services. */
  outputFormats: HarmonyOutputFormat[]
}

/**
 * The document describing supported Harmony capabilities.
 * ie. https://harmony.earthdata.nasa.gov/capabilities?collectionId=<COLLECTION_ID>
 */
export interface HarmonyCapabilitiesDocument {
  /** The collection's concept ID */
  conceptId: string
  /** The collection's short name */
  shortName: string
  /** Summary of the collection's top level capabilities */
  summary: HarmonySummaryofTopLevelCapabilities
  /** Services supplied from the Harmony Capabilities Document */
  services: HarmonyService[]
  /** The collection's variables */
  variables: HarmonyVariable[]
}

/**
 * The returned object from this function.
 * Shows important information such as supported, disabled,
 * and value (if applicable) for each capability
 */
export interface DerivedHarmonyState {
  /** The collection's concept ID */
  collectionId: string
  /** The collection's short name */
  shortName: string
  /** The collection's variables */
  variables: HarmonyVariable[]
  /** The derived capabilities state */
  capabilities: {
    /** The derived state for variable subsetting */
    variableSubset: {
      /** Flag to indicate if variable subsetting is supported by the collection */
      supported: boolean
      /** Flag to indicate if variable subsetting is disabled based on current selections */
      disabled: boolean
    }
    /** The derived state for spatial subsetting */
    spatialSubset: {
      /** Flag to indicate if spatial subsetting. Based off of bbox as all capabilities that support spatial support bbox. */
      supported: boolean
      /** Flag to indicate if spatial subsetting is disabled based on current selections */
      disabled: boolean
      /** Flag to indicate services that support spatial do not support shape subsetting */
      shapeDisabled: boolean
      /** Flag to indicate services that support spatial do not support bounding box subsetting */
      bboxDisabled: boolean
    }
    /** The derived state for temporal subsetting */
    temporalSubset: {
      /** Flag to indicate if temporal subsetting is supported by the collection */
      supported: boolean
      /** Flag to indicate if temporal subsetting is disabled based on current selections */
      disabled: boolean
    }
    /** The derived state for concatenation */
    concatenate: {
      /** Flag to indicate if concatenation is supported by the collection */
      supported: boolean
      /** Flag to indicate if concatenation is disabled based on current selections */
      disabled: boolean
    }
    /** The derived state for reprojection */
    reproject: {
      /** Flag to indicate if reprojection is supported by the collection */
      supported: SupportedProjection[]
      /** Flag to indicate if reprojection is disabled based on current selections */
      disabled: boolean
      /** The list of output projections available based on current selections */
      outputProjectionAvailability: HarmonyOutputProjectionAvailability
      /** The value for reprojection in crs IE "EPSG:4313" */
      value: string
    }
    /** The derived state for output formats */
      outputFormats: {
      /** The full list of supported output formats across all services */
      supported: HarmonyOutputFormat[]
      /** Flag to indicate if output format selection is disabled */
      disabled: boolean
      /** The list of output formats available based on current selections */
      outputFormatAvailability: HarmonyOutputFormatAvailability
      /** The currently selected output format in mimetype IE "application/netcdf" */
      value: string
    }
  }
}

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
        supported: summaryBbox,
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
