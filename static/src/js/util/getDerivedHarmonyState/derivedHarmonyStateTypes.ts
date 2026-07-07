/**
 * The active filters/selections chosen by the user.
 */
export type UserSelections = {
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
export type HarmonySubsetting = {
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
export type SupportedProjection = {
  /** The descriptive name of the projection. ie. "Geographic", "NSIDC Sea Ice Polar Stereographic North" */
  name: string
  /** The Coordinate Reference System (CRS) code. "EPSG:4326", "EPSG:3413" */
  crs: string
}

/**
 * Reprojection metadata supplied from the Harmony Capabilities Document
 * At this time, we do not support Interpolation Methods
 */
export type HarmonyReprojection = {
  /** An array of supported projection objects */
  supportedProjections: SupportedProjection[]
}

export type HarmonyOutputFormat = {
  /** Human readable name of the format */
  name: string
  /** MimeType to be sent as value to Harmony */
  mimeType: string
}

/**
 * A service and all its capabilities
 */
export type HarmonyService = {
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
export type HarmonyScienceKeyword = {
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
export type HarmonyVariable = {
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
export type HarmonySummaryofTopLevelCapabilities = {
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
export type HarmonyCapabilitiesDocument = {
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
export type DerivedHarmonyState = {
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
      /** Flag to indicate services that support spatial but do not support shape subsetting */
      shapeDisabled: boolean
      /** Flag to indicate services that support spatial but do not support bounding box subsetting */
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
