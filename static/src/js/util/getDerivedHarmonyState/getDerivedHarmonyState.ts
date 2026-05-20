/**
 * The active filters/selections chosen by the user.
 */
export interface UserSelections {
  /** Flag to indicate if variable subsetting is selected */
  variableSubset?: boolean
  /** Flag to indicate if spatial subsetting is selected */
  spatialSubset?: boolean
  /** Flag to indicate if temporal subsetting is selected */
  temporalSubset?: boolean
  /** Flag to indicate if concatenation is selected */
  concatenate?: boolean
  /** Flag to indicate if reprojection is selected */
  reproject?: boolean
  /** The selected output format */
  selectedOutputFormat?: string | undefined
  /** The selected variables */
  selectedVariables?: string[] | []
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
 * Reprojection metadata supplied from the Harmony Capabilities Document
 */
export interface HarmonyReprojection {
  /** Flag indicating if reprojection is supported for the collection */
  supported: boolean,
  /** An array of supported projection codes (e.g., 'EPSG:4326') */
  supportedProjections: string[],
  /** An array of supported interpolation methods (e.g., 'bilinear', 'nearest neighbor') */
  interpolationMethods: string[]
}

/**
 * Reprojection metadata supplied from the Harmony Capabilities Document
 */
export interface HarmonyOutputFormats {
  /** Human readable name of the format */
  name: string,
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
    concatenation?: boolean
    /** Flag to indicate if reprojection is supported */
    reprojection?: HarmonyReprojection
    /** The supported output formats */
    outputFormats?: HarmonyOutputFormats[]
  }
}

/**
 * Science Keywords of a Variable supplied from the Harmony Capabilities Document
 * Descends by specificity, not alphabetically
 */
export interface HarmonyScienceKeyword {
  /** The category of the science keyword */
  category: string,
  /** The topic of the science keyword */
  topic?: string,
  /** The term of the science keyword */
  term?: string,
  /** The variable level 1 of the science keyword */
  variableLevel1?: string,
  /** The variable level 2 of the science keyword */
  variableLevel2?: string,
  /** The variable level 2 of the science keyword */
  variableLevel3?: string
}

/**
 * Variable metadata supplied from the Harmony Capabilities Document
 */
export interface HarmonyVariable {
  /** The name of the variable */
  name: string
  /** The CMR href for the variable concept */
  href: string
  /** The Science Keywords of the variable */
  scienceKeywords: HarmonyScienceKeyword[]
}

/**
 * Describes the top level capabilities of a collection
 * If one of the listed services supports a capability, it will show up as true in the summary
*/
export interface HarmonySummaryofTopLevelCapabilities {
  /** A summary of all available subsetting capabilities across all services. */
  subsetting: HarmonySubsetting,
  /** A summary of all available reprojection capabilities across all services. */
  reprojection: HarmonyReprojection,
  /** A boolean flag indicating if concatenation is supported by any service. */
  concatenation: boolean,
  /** An aggregated list of all unique output formats available across all services. */
  outputFormats: HarmonyOutputFormats[]
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
 * The returned obejct from this function.
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
      /** The value for variable subsetting (currently always null) */
      value: null
    }
    /** The derived state for spatial subsetting */
      spatialSubset: {
      /** Flag to indicate if spatial subsetting (bbox or shape) is supported by the collection */
      supported: boolean
      /** Flag to indicate if spatial subsetting is disabled based on current selections */
      disabled: boolean
      /** Flag to indicate if bounding box subsetting is supported by the collection */
      bboxSupported: boolean
      /** Flag to indicate if bounding box subsetting is disabled based on current selections */
      bboxDisabled: boolean
      /** Flag to indicate if shapefile subsetting is supported by the collection */
      shapeSupported: boolean
      /** Flag to indicate if shapefile subsetting is disabled based on current selections */
      shapeDisabled: boolean
      /** The value for spatial subsetting (currently always null) */
      value: null
    }
    /** The derived state for temporal subsetting */
      temporalSubset: {
      /** Flag to indicate if temporal subsetting is supported by the collection */
      supported: boolean
      /** Flag to indicate if temporal subsetting is disabled based on current selections */
      disabled: boolean
      /** The value for temporal subsetting (currently always null) */
      value: null
    }
    /** The derived state for concatenation */
      concatenate: {
      /** Flag to indicate if concatenation is supported by the collection */
      supported: boolean
      /** Flag to indicate if concatenation is disabled based on current selections */
      disabled: boolean
      /** The value for concatenation (currently always null) */
      value: null
    }
    /** The derived state for reprojection */
      reproject: {
      /** Flag to indicate if reprojection is supported by the collection */
      supported: boolean
      /** Flag to indicate if reprojection is disabled based on current selections */
      disabled: boolean
      /** The value for reprojection (currently always null) */
      value: null
    }
    /** The derived state for output formats */
      outputFormats: {
      /** The full list of supported output formats across all services */
      supported: HarmonyOutputFormats[]
      /** Flag to indicate if output format selection is disabled */
      disabled: boolean
      /** The list of output formats available based on current selections */
      outputFormatAvailability: {
        [formatName: string]: boolean
      }
      /** The currently selected output format */
      value: string
    }
  }
}

/**
 * Derives the available capabilities and state based on a user's selections
 * and the available Harmony services.
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
        bbox = false,
        shape = false,
        temporal = false,
        variable = false
      },
      reprojection: {
        supported: reprojectionSupported
      },
      concatenation,
      outputFormats = []
    },
    services,
    variables
  } = harmonyCapabilitiesDocument

  // If there are no services to parse though, then there will be no derived harmony state
  if (!services || services.length === 0) {
    return {}
  }

  // Helper function to determine if a service supports the user's selections (excluding output formats, see below)
  const supportsUserSelections = (service: HarmonyService) => {
    const { capabilities: serviceCapabilities } = service
    const { subsetting: serviceSubsetting } = serviceCapabilities || {}
    if (!serviceSubsetting) return false

    // If a user selected it, check that it's availabele in the service's subsetting.
    // If not return false (the service does not support the user selections).
    if (userSelections.variableSubset && !serviceSubsetting.variable) return false
    if (
      userSelections.spatialSubset
      && (!serviceSubsetting.bbox
      && !serviceSubsetting.shape)
    ) return false
    if (userSelections.temporalSubset && !serviceSubsetting.temporal) return false
    // Provide a default of 0 if selectedVariables.length is undefined
    if (((userSelections.selectedVariables?.length ?? 0) > 0)
      && !serviceSubsetting.variable) return false
    if (userSelections.concatenate && !serviceCapabilities.concatenation) return false
    if (userSelections.reproject && !serviceCapabilities.reprojection) return false

    return true
  }

  // Filter services based on ALL user selections
  // This is used for determining which capabilities are disabled
  const validServices = services.filter((service) => {
    if (!supportsUserSelections(service)) return false

    if (userSelections.selectedOutputFormat) {
      if (service.capabilities?.outputFormats
        && !service.capabilities.outputFormats.some(
          (format) => format.mimeType === userSelections.selectedOutputFormat
        )
      ) {
        return false
      }
    }

    return true
  })

  // Used for determining which outputformats are still available
  const validServicesIgnoringFormat = services.filter(supportsUserSelections)

  const disabledCapabilities = {
    variableSubset: true,
    spatialSubset: true,
    bbox: true,
    shape: true,
    temporalSubset: true,
    concatenate: true,
    reproject: true
  }

  // Look at all valid services and determine which capbitlities have been disabled based on selections
  validServices.forEach((service) => {
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
    if (serviceCapabilities.reprojection) disabledCapabilities.reproject = false
  })

  // To prevent the output format list from collapsing down to just what's availabe to us in the current valid service,
  // we come up with our outputFormats based on validServicesIgnoringFormat.
  // For exmaple, if I select X-NETCDF04 (OPeNDAP URL), then that would mean my only valid service is sds/hoss-opendap-url
  // which has only one outputFormat. A user should still be able to choose from other outputFormats in this scenario.
  // Get a set of all AVAILABLE format names from the services that are still valid.
  const availableFormatNames = new Set<string>()
  validServicesIgnoringFormat.forEach((service) => {
    const formats = service.capabilities.outputFormats || []
    formats.forEach((format) => availableFormatNames.add(format.name))
  })

  // Build the new availability object by comparing against ALL supported formats.
  const outputFormatAvailability: { [formatName: string]: boolean } = {}
  outputFormats.forEach((supportedFormat) => {
    // Check if the supported format's name exists in our set of available names.
    outputFormatAvailability[supportedFormat.name] = availableFormatNames.has(supportedFormat.name)
  })

  return {
    collectionId: conceptId,
    shortName,
    variables,
    capabilities: {
      variableSubset: {
        supported: variable,
        disabled: disabledCapabilities.variableSubset,
        value: null
      },
      spatialSubset: {
        supported: bbox || shape,
        disabled: disabledCapabilities.spatialSubset,
        bboxSupported: bbox,
        bboxDisabled: disabledCapabilities.bbox,
        shapeSupported: shape,
        shapeDisabled: disabledCapabilities.shape,
        value: null
      },
      temporalSubset: {
        supported: temporal,
        disabled: disabledCapabilities.temporalSubset,
        value: null
      },
      concatenate: {
        supported: concatenation,
        disabled: disabledCapabilities.concatenate,
        value: null
      },
      reproject: {
        supported: reprojectionSupported,
        disabled: disabledCapabilities.reproject,
        value: null
      },
      outputFormats: {
        supported: outputFormats,
        disabled: !(validServices.length > 0) && !(availableFormatNames.size > 0),
        outputFormatAvailability,
        value: userSelections.selectedOutputFormat || ''
      }
    }
  }
}

export default getDerivedHarmonyState
