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
}

/**
 * The service and all its capabilities
 */
export interface HarmonyService {
  /** The name of the variable */
  name: string
  /** The CMR href for the variable concept */
  href: string
  /** The capabilities supported by the service */
  capabilities: {
    /** The subsetting capabilities of the service */
    subsetting?: {
      /** Flag to indicate if variable subsetting is supported */
      variable?: boolean
      /** Flag to indicate if bounding box subsetting is supported */
      bbox?: boolean
      /** Flag to indicate if shapefile subsetting is supported */
      shape?: boolean
      /** Flag to indicate if temporal subsetting is supported */
      temporal?: boolean
    };
    /** Flag to indicate if concatenation is supported */
    concatenation?: boolean
    /** Flag to indicate if reprojection is supported */
    reprojection?: boolean
    /** The supported output formats */
    output_formats?: string[]
  };
}

/**
 * Variable metadata supplied from the Harmony Capabilities Document
 */
export interface HarmonyVariable {
  /** The name of the variable */
  name: string
  /** The CMR href for the variable concept */
  href: string
}
/**
 * The document describing supported Harmony capabilities.
 * ie. https://harmony.earthdata.nasa.gov/capabilities?collectionId=<COLLECTION_ID>
 */
export interface HarmonyCapabilitiesDocument {
  /** Flag to indicate if bounding box subsetting is supported */
  bboxSubset: boolean
  /** Flag to indicate if concatenation is supported */
  concatenate: boolean
  /** The collection's concept ID */
  conceptId: string
  /** Flag to indicate if reprojection is supported */
  reproject: boolean
  /** An array of all available output formats */
  outputFormats: string[]
  /** Services supplied from the Harmony Capabilities Document */
  services: HarmonyService[]
  /** Flag to indicate if shapefile subsetting is supported */
  shapeSubset: boolean
  /** The collection's short name */
  shortName: string
  /** Flag to indicate if temporal subsetting is supported */
  temporalSubset: boolean
  /** The collection's variables */
  variables: HarmonyVariable[]
  /** Flag to indicate if variable subsetting is supported */
  variableSubset: boolean
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
    };
    /** The derived state for spatial subsetting */
      spatialSubset: {
      /** Flag to indicate if spatial subsetting (bbox or shape) is supported by the collection */
      supported: boolean
      /** Flag to indicate if spatial subsetting is disabled based on current selections */
      disabled: boolean
      /** Flag to indicate if bounding box subsetting is supported by the collection */
      bboxSupported?: boolean
      /** Flag to indicate if bounding box subsetting is disabled based on current selections */
      bboxDisabled: boolean
      /** Flag to indicate if shapefile subsetting is supported by the collection */
      shapeSupported: boolean
      /** Flag to indicate if shapefile subsetting is disabled based on current selections */
      shapeDisabled: boolean
      /** The value for spatial subsetting (currently always null) */
      value: null
    };
    /** The derived state for temporal subsetting */
      temporalSubset: {
      /** Flag to indicate if temporal subsetting is supported by the collection */
      supported: boolean
      /** Flag to indicate if temporal subsetting is disabled based on current selections */
      disabled: boolean
      /** The value for temporal subsetting (currently always null) */
      value: null
    };
    /** The derived state for concatenation */
      concatenate: {
      /** Flag to indicate if concatenation is supported by the collection */
      supported: boolean
      /** Flag to indicate if concatenation is disabled based on current selections */
      disabled: boolean
      /** The value for concatenation (currently always null) */
      value: null
    };
    /** The derived state for reprojection */
      reproject: {
      /** Flag to indicate if reprojection is supported by the collection */
      supported: boolean
      /** Flag to indicate if reprojection is disabled based on current selections */
      disabled: boolean
      /** The value for reprojection (currently always null) */
      value: null
    };
    /** The derived state for output formats */
      outputFormats: {
      /** The full list of supported output formats across all services */
      supported: string[]
      /** Flag to indicate if output format selection is disabled */
      disabled: boolean
      /** The list of output formats available based on current selections */
      availableOutputFormats: string[]
      /** The currently selected output format */
      value: string | undefined
    };
  };
}

/**
 * Derives the available capabilities and state based on a user's selections
 * and the available Harmony services.
 * @param userSelections - The active filters/selections chosen by the user.
 * @param harmonyCapabilitiesDocument - The document describing supported Harmony capabilities.
 * @returns A computed state object defining which capabilities are supported and disabled.
 */
export const getDerivedHarmonyState = (
  userSelections: UserSelections = {},
  harmonyCapabilitiesDocument: HarmonyCapabilitiesDocument = {
    bboxSubset: false,
    concatenate: false,
    conceptId: '',
    reproject: false,
    outputFormats: [],
    services: [],
    shapeSubset: false,
    shortName: '',
    temporalSubset: false,
    variables: [],
    variableSubset: false
  }
): DerivedHarmonyState | Record<string, never> => {
  const {
    bboxSubset,
    concatenate,
    conceptId,
    outputFormats = [],
    reproject,
    services = [],
    shapeSubset,
    shortName,
    temporalSubset,
    variables = [],
    variableSubset
  } = harmonyCapabilitiesDocument

  // If there are no services to parse though, then there will be no derived harmony state
  if (!services || services.length === 0) {
    return {}
  }

  // Helper function to determine if a service supports the user's selections (excluding output formats, see below)
  const supportsUserSelections = (service: HarmonyService) => {
    const { subsetting } = service.capabilities || {}
    if (!subsetting) return false

    // If a user selected it, check that it's availabele in the service's subsetting.
    // If not return false (the service does not support the user selections).
    if (userSelections.variableSubset && !subsetting.variable) return false
    if (userSelections.spatialSubset && (!subsetting.bbox && !subsetting.shape)) return false
    if (userSelections.temporalSubset && !subsetting.temporal) return false
    if (userSelections.concatenate && !service.capabilities?.concatenation) return false
    if (userSelections.reproject && !service.capabilities?.reprojection) return false

    return true
  }

  // Filter services based on ALL user selections
  // This is used for determining which capabilities are disabled
  const validServices = services.filter((service) => {
    if (!supportsUserSelections(service)) return false

    if (userSelections.selectedOutputFormat) {
      if (service.capabilities?.output_formats
        && !service.capabilities.output_formats.includes(userSelections.selectedOutputFormat)) {
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
    const { subsetting } = service.capabilities || {}
    if (subsetting?.variable) disabledCapabilities.variableSubset = false
    if (subsetting?.bbox || subsetting?.shape) disabledCapabilities.spatialSubset = false
    if (subsetting?.bbox) disabledCapabilities.bbox = false
    if (subsetting?.shape) disabledCapabilities.shape = false
    if (subsetting?.temporal) disabledCapabilities.temporalSubset = false
    if (service.capabilities?.concatenation) disabledCapabilities.concatenate = false
    if (service.capabilities?.reprojection) disabledCapabilities.reproject = false
  })

  // To prevent the output format list from collapsing down to just what's availabe to us in the current valid service,
  // we come up with our outputFormats based on validServicesIgnoringFormat.
  // For exmaple, if I select X-NETCDF04 (OPeNDAP URL), then that would mean my only valid service is sds/hoss-opendap-url
  // which has only one outputFormat. A user should still be able to choose from other outputFormats in this scenario.
  const formatsAvailableForDropdown = new Set<string>()
  validServicesIgnoringFormat.forEach((service) => {
    const formats = service.capabilities?.output_formats || []
    formats.forEach((format) => formatsAvailableForDropdown.add(format))
  })

  return {
    collectionId: conceptId,
    shortName,
    variables,
    capabilities: {
      variableSubset: {
        supported: variableSubset,
        disabled: disabledCapabilities.variableSubset,
        value: null
      },
      spatialSubset: {
        supported: bboxSubset || shapeSubset,
        disabled: disabledCapabilities.spatialSubset,
        bboxSupported: bboxSubset,
        bboxDisabled: disabledCapabilities.bbox,
        shapeSupported: shapeSubset,
        shapeDisabled: disabledCapabilities.shape,
        value: null
      },
      temporalSubset: {
        supported: temporalSubset,
        disabled: disabledCapabilities.temporalSubset,
        value: null
      },
      concatenate: {
        supported: concatenate,
        disabled: disabledCapabilities.concatenate,
        value: null
      },
      reproject: {
        supported: reproject,
        disabled: disabledCapabilities.reproject,
        value: null
      },
      outputFormats: {
        supported: outputFormats,
        disabled: !(validServices.length > 0) && !(formatsAvailableForDropdown.size > 0),
        availableOutputFormats: Array.from(formatsAvailableForDropdown),
        value: userSelections.selectedOutputFormat || undefined
      }
    }
  }
}

export default getDerivedHarmonyState
