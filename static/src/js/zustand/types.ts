import { StateCreator } from 'zustand'

import {
  PortalConfig,
  ProjectionCode,
  ScienceKeyword,
  ShapefileFile,
  TimelineIntervals,
  VariableMetadata
} from '../types/sharedTypes'

export type EarthdataDownloadRedirectSlice = {
  /** The Earthdata Download Redirect Slice of the store */
  earthdataDownloadRedirect: {
    /** The redirect URL for earthdata download */
    redirectUrl: string
    /** Function to set the redirect URL */
    setRedirectUrl: (redirect: string) => void
  }
}

type FeatureFacets = {
  /** Flag if the facet is available in Earthdata Cloud */
  availableInEarthdataCloud: boolean
  /** Flag if the facet is customizable */
  customizable: boolean
  /** Flag if the facet is a map imagery */
  mapImagery: boolean
}

/** Keys used for CMR Facets */
export type FacetKeys = 'science_keywords_h'
  | 'platforms_h'
  | 'instrument_h'
  | 'data_center_h'
  | 'project_h'
  | 'processing_level_id_h'
  | 'granule_data_format_h'
  | 'two_d_coordinate_system_name'
  | 'horizontal_data_resolution_range'
  | 'latency'

/** The Platform Facet */
type PlatformFacet = {
  basis?: string
  category?: string
  short_name?: string
  sub_category?: string
}

/** The Science Keyword Facet */
export type ScienceKeywordFacet = ScienceKeyword

/** The CMR Facets */
export type CMRFacets = {
  data_center_h?: string[]
  granule_data_format_h?: string[]
  horizontal_data_resolution_range?: string[]
  instrument_h?: string[]
  latency?: string[]
  platforms_h?: PlatformFacet[]
  processing_level_id_h?: string[]
  project_h?: string[]
  science_keywords_h?: ScienceKeywordFacet[] | ScienceKeywordFacet
  two_d_coordinate_system_name?: string[]
}

/** The View All Facets */
type ViewAllFacets = {
  data_center_h?: string[]
  granule_data_format_h?: string[]
  instrument_h?: string[]
  project_h?: string[]
}

export type FacetParamsSlice = {
  /** The Facets Slice of the store */
  facetParams: {
    /** The feature facets */
    featureFacets: FeatureFacets
    /** The CMR facets */
    cmrFacets: CMRFacets
    /** The view all facets */
    viewAllFacets: ViewAllFacets
    /** Function to add a CMR facet from an autocomplete suggestion */
    addCmrFacetFromAutocomplete: (facet: CMRFacets) => void
    /** Function to apply the viewAllFacets params */
    applyViewAllFacets: () => void
    /** Function to reset the facet params */
    resetFacetParams: () => void
    /** Function to set the feature facets */
    setFeatureFacets: (featureFacets: Partial<FeatureFacets>) => void
    /** Function to set the CMR facets */
    setCmrFacets: (cmrFacets: CMRFacets) => void
    /** Function to set the view all facets */
    setViewAllFacets: (viewAllFacets: ViewAllFacets, category: keyof ViewAllFacets) => void
    /** Function to trigger the View All Facets modal */
    triggerViewAllFacets: (category: string) => void
  }
}

export type HomeSlice = {
  /** The Home Slice of the store */
  home: {
    /** When redirecting from the Home page, startDrawing is set if the user selected a spatial type to start drawing. */
    startDrawing: boolean | string
    /** Function to set the startDrawing value */
    setStartDrawing: (startDrawing: boolean | string) => void
    /** Flag if a facet group should be opened */
    openFacetGroup: string | null
    /** Function to set the setOpenFacetGroup value */
    setOpenFacetGroup: (groupName: string | null) => void
  }
}

export type MapView = {
  /** The base layer of the map */
  base: {
    /** Is the World Imagery base layer applied */
    worldImagery: boolean
    /** Is the True Color base layer applied */
    trueColor: boolean
    /** Is the Land Water Map base layer applied */
    landWaterMap: boolean
  }
  /** The latitude of the map */
  latitude: number
  /** The longitude of the map */
  longitude: number
  /** The overlays of the map */
  overlays: {
    /** Is the borders and roads overlay applied */
    bordersRoads: boolean
    /** Is the coastlines overlay applied */
    coastlines: boolean
    /** Is the place labels overlay applied */
    placeLabels: boolean
  }
  /** The projection of the map */
  projection: ProjectionCode
  /** The rotation of the map */
  rotation: number
  /** The zoom level of the map */
  zoom: number
}

export type MapSlice = {
  /** The Map Slice of the store */
  map: {
    /** The map view */
    mapView: MapView
    /** Function to set the map view */
    setMapView: (mapView: Partial<MapView>) => void
    /** Flag to show the MBR (Minimum Bounding Rectangle) of the applied spatial search */
    showMbr: boolean
    /** Function to set the showMbr value */
    setShowMbr: (showMbr: boolean) => void
  }
}

export type PreferencesData = {
  /** The state of the panels */
  panelState: string
  /** The view mode for collection lists */
  collectionListView: string
  /** The view mode for granule lists */
  granuleListView: string
  /** The sort preference for collections */
  collectionSort: string
  /** The sort preference for granules */
  granuleSort: string
  /** The map view preferences */
  mapView: {
    /** The zoom level of the map */
    zoom: number
    /** The latitude center of the map */
    latitude: number
    /** The base layer identifier for the map */
    baseLayer: string
    /** The longitude center of the map */
    longitude: number
    /** The projection code for the map */
    projection: string
    /** Array of overlay layer identifiers */
    overlayLayers: string[]
    /** The rotation of the map in degrees */
    rotation: number
  }
}

export type PreferencesSlice = {
  /** The Preferences Slice of the store */
  preferences: {
    /** The preference settings values */
    preferences: PreferencesData
    /** Flag indicating if preferences are currently being submitted */
    isSubmitting: boolean
    /** Flag indicating if preferences have been submitted */
    isSubmitted: boolean
    /** Function to set preferences */
    setPreferences: (preferences: Partial<PreferencesData>) => void
    /** Function to set preferences from JWT token */
    setPreferencesFromJwt: (jwtToken: string) => void
    /** Function to submit preference form data and save to the server */
    submitAndUpdatePreferences: (data: { formData: PreferencesData }) => Promise<void>
  }
}

export type PortalSlice = {
  /** The Portal Slice of the store */
  portal: PortalConfig
}

/** Project Granules */
export type ProjectGranules = {
  /** The granule IDs that have been added to the project */
  addedGranuleIds: string[]
  /** All granule IDs in the project */
  allIds: string[]
  /** The granules in the project */
  byId: {
    /** The granule concept ID */
    [key: string]: {
      id: string
    }
  }
  /** The number of granules in the project */
  hits: number
  /** Flag to indicate if the granules are errored */
  isErrored: boolean
  /** Flag to indicate if the granules are loaded */
  isLoaded: boolean
  /** Flag to indicate if the granules are loading */
  isLoading: boolean
  /** Flag to indicate if the granules are OpenSearch granules */
  isOpenSearch: boolean
  /** The granule request parameters */
  params: {
    /** The page number */
    pageNum: number
  }
  /** The start time of the granules request timer */
  timerStart: number | null
  /** The total size of the granules */
  totalSize?: {
    /** The total size of the granules */
    size: string
    /** The units of the total size */
    units: string
  }
  /** The single granule size */
  singleGranuleSize: number
  /** The total load time of the granules request */
  loadTime: number | null
  /** The granule IDs that have been removed from the project */
  removedGranuleIds: string[]
}

/** The download access method */
type DownloadAccessMethod = {
  /** Is the access method valid */
  isValid: boolean
  /** The type of access method */
  type: 'download'
}

type OptionDefinition = {
  /** The option name */
  name: string
  /** The option concept ID */
  conceptId: string
  /** The option revision ID */
  revisionId: string
}

/** The ESI access method */
type EsiAccessMethod = {
  /** The ECHO Form XML */
  form: string
  /** A hash of the form */
  formDigest: string
  /** Has the access method changed */
  hasChanged: boolean
  /** Is the access method valid */
  isValid: boolean
  /** The maximum number of items per order */
  maxItemsPerOrder: number
  /** The ECHO Form model */
  model: string
  /** The option definition for the ESI access method */
  optionDefinition: OptionDefinition
  /** The ECHO Form raw model */
  rawModel: string
  /** The type of access method */
  type: 'ESI'
  /** The ESI access method URL */
  url: string
}

/** The Echo Orders access method */
export type EchoOrderAccessMethod = {
  /** The ECHO Form XML */
  form: string
  /** A hash of the form */
  formDigest: string
  /** Has the access method changed */
  hasChanged: boolean
  /** Is the access method valid */
  isValid: boolean
  /** The maximum number of items per order */
  maxItemsPerOrder: number
  /** The ECHO Form model */
  model: string
  /** The option definition for the ECHO Orders access method */
  optionDefinition: OptionDefinition
  /** The ECHO Form raw model */
  rawModel: string
  /** The type of access method */
  type: 'ECHO ORDERS'
  /** The ECHO Orders access method URL */
  url: string
}

type HierarchyMappings = {
  /** The variable concept IDs */
  children: {
    /** The variable concept id */
    id: string
  }[]
  /** The hierarchical name */
  label: string
}

type KeywordMapping = {
  /** The variable concept IDs */
  children: {
    /** The variable concept id */
    id: string
  }[]
  /** The science keyword name */
  label: string
}

/** The Harmony access method */
type HarmonyAccessMethod = {
  /** The default value for concatenation */
  defaultConcatenation: boolean
  /** The Harmony access method description */
  description: string
  /** Flag to indicate if concatenation download is enabled */
  enableConcatenateDownload: boolean
  /** Flag to indicate if spatial subsetting is enabled */
  enableSpatialSubsetting: boolean
  /** Flag to indicate if temporal subsetting is enabled */
  enableTemporalSubsetting: boolean
  /** Variable ids grouped by their hierarchical names */
  hierarchyMappings: HierarchyMappings[]
  /** The Harmony access method ID */
  id: string
  /** Is the access method valid */
  isValid: boolean
  /** Variable ids grouped by their scienceKeywords */
  keywordMappings: KeywordMapping[]
  /** The access method long name */
  longName: string
  /** The access method name */
  name: string
  /** The supported output formats */
  supportedOutputFormats: string[]
  /** The supported output projections */
  supportedOutputProjections: string[]
  /** Flag to indicate if bounding box subsetting is supported */
  supportsBoundingBoxSubsetting: boolean
  /** Flag to indicate if concatenation is supported */
  supportsConcatenation: boolean
  /** Flag to indicate if shapefile subsetting is supported */
  supportsShapefileSubsetting: boolean
  /** Flag to indicate if temporal subsetting is supported */
  supportsTemporalSubsetting: boolean
  /** Flag to indicate if variable subsetting is supported */
  supportsVariableSubsetting: boolean
  /** The type of access method */
  type: 'Harmony'
  /** The Harmony access method URL */
  url: string
  /** The Harmony access method variables */
  variables: {
    /** The variable ID */
    [variableId: string]: VariableMetadata
  }
}

/** The OPeNDAP access method */
type OpendapAccessMethod = {
  /** The OPeNDAP access method description */
  description?: string
  /** Variable ids grouped by their hierarchical names */
  hierarchyMappings: HierarchyMappings[]
  /** The OPeNDAP access method ID */
  id?: string
  /** Is the access method valid */
  isValid: boolean
  /** Variable ids grouped by their scienceKeywords */
  keywordMappings: KeywordMapping[]
  /** The OPeNDAP access method long name */
  longName?: string
  /** The OPeNDAP access method name */
  name?: string
  /** The selected output format */
  selectedOutputFormat?: string
  /** The supported output formats */
  supportedOutputFormats?: string[]
  /** Flag to indicate if variable subsetting is supported */
  supportsVariableSubsetting?: boolean
  /** The type of access method */
  type: string
  /** The OPeNDAP access method URL */
  url?: string
  /** The OPeNDAP access method variables */
  variables: {
    /** The variable ID */
    [variableId: string]: VariableMetadata
  }
}

/** The SWODLR access method */
type SwodlrAccessMethod = {
  /** The SWODLR access method ID */
  id: string
  /** Is the access method valid */
  isValid: boolean
  /** The SWODLR access method long name */
  longName: string
  /** The SWODLR access method name */
  name: string
  /** Flag to indicate if SWODLR is supported */
  supportsSwodlr: boolean
  /** The SWODLR data */
  swodlrData: {
    /** The SWODLR data custom parameters */
    custom_params: {
      /** The granule ID */
      [granuleId: string]: {
        /** The MGRS band adjustment */
        mgrsBandAdjust: number
        /** The UTM zone adjustment */
        utmZoneAdjust: number
      }
    }
    /** The SWODLR data parameters */
    params: {
      /** The output granule extent flag */
      outputGranuleExtentFlag: boolean
      /** The output sampling grid type */
      outputSamplingGridType: string
      /** The output sampling grid resolution */
      rasterResolution: number
    }
  }
  /** The type of access method */
  type: 'SWODLR'
  /** The SWODLR access method URL */
  url: string
}

/** The access method types */
export type AccessMethodTypes = DownloadAccessMethod
  | EchoOrderAccessMethod
  | EsiAccessMethod
  | HarmonyAccessMethod
  | OpendapAccessMethod
  | SwodlrAccessMethod

/** The access methods for a project collection */
type AccessMethods = {
  [key: string]: AccessMethodTypes
}

/** The project collection */
export type ProjectCollection = {
  /** The access methods for the project collection */
  accessMethods?: AccessMethods
  /** The project collection's granules */
  granules: ProjectGranules
  /** Flag to indicate if the project collection is visible */
  isVisible: boolean
  /** The selected access method for the project collection */
  selectedAccessMethod?: string
}

/** The project collections */
export type ProjectCollections = {
  /** The project collection IDs */
  allIds: string[]
  /** The project collections by ID */
  byId: {
    /** The project collection ID */
    [key: string]: ProjectCollection
  }
}

/** The project granule results */
export type ProjectGranuleResults = {
  /** The collection ID */
  collectionId: string
  /** The number of granule results */
  hits: number
  /** Flag to indicate if the granules are OpenSearch */
  isOpenSearch: boolean
  /** The page number of the results */
  pageNum: number
  /** The granule results */
  results: {
    /** The granule concept ID */
    id: string
  }[]
  /** The single granule size */
  singleGranuleSize: number
  /** The total size of the granules */
  totalSize?: {
    /** The total size of the granules */
    size: string
    /** The units of the total size */
    units: string
  }
}

type AddRemoveGranuleToProjectCollectionParams = {
  /** The collection id */
  collectionId: string
  /** The granule id */
  granuleId: string
}

type SelectAccessMethodParams = {
  /** The collection id */
  collectionId: string
  /** The selected access method */
  selectedAccessMethod: string
}

/** The updated access method */
type UpdatedAccessMethod = {
  [key: string]: Partial<AccessMethodTypes>
}

type UpdateAccessMethodParams = {
  /** The collection id */
  collectionId: string
  /** The updated access method */
  method: UpdatedAccessMethod
}

type UpdateProjectGranuleParams = {
  /** The collection id */
  collectionId: string,
  /** The page number */
  pageNum: number
}

export type ProjectSlice = {
  /** The Project Slice of the store */
  project: {
    /** The project collections */
    collections: ProjectCollections
    /** Flag to indicate if the project is submitted */
    isSubmitted: boolean
    /** Flag to indicate if the project is submitting */
    isSubmitting: boolean
    /** Function to add a granule to the project collection */
    addGranuleToProjectCollection: (data: AddRemoveGranuleToProjectCollectionParams) => void
    /** Function to add a project collection */
    addProjectCollection: (collectionId: string) => void
    /** Function to set the errored state of granules for a project collection */
    erroredProjectGranules: (collectionId: string) => void
    /** Function to get project collections */
    getProjectCollections: () => Promise<void>
    /** Function to get project granules */
    getProjectGranules: () => Promise<void>
    /** Function to remove a granule from the project collection */
    removeGranuleFromProjectCollection: (data: AddRemoveGranuleToProjectCollectionParams) => void
    /** Function to remove a project collection */
    removeProjectCollection: (collectionId: string) => void
    /** Function to select an access method */
    selectAccessMethod: ({ collectionId, selectedAccessMethod }: SelectAccessMethodParams) => void
    /** Function to start the project granules timer */
    startProjectGranulesTimer: (collectionId: string) => void
    /** Function to stop the project granules timer */
    stopProjectGranulesTimer: (collectionId: string) => void
    /** Function to set the project as submitting */
    submittingProject: () => void
    /** Function to set the project as submitted */
    submittedProject: () => void
    /** Function to toggle the visibility of a project collection */
    toggleCollectionVisibility: (collectionId: string) => void
    /** Function to update the access method for a project collection */
    updateAccessMethod: ({ collectionId, method }: UpdateAccessMethodParams) => void
    /** Function to update the granule params for a project collection */
    updateProjectGranuleParams: ({ collectionId, pageNum }: UpdateProjectGranuleParams) => void
    /** Function to update the project granule results */
    updateProjectGranuleResults: (data: ProjectGranuleResults) => void
  }
}

type UpdateShapefileProps = {
  /** The shapefile id */
  shapefileId?: string
  /** The shapefile name */
  shapefileName?: string
  /** The shapefile size */
  shapefileSize?: string
  /** The selected features of the shapefile */
  selectedFeatures?: string[]
  /** The shapefile contents */
  file?: ShapefileFile
}

type SaveShapefileProps = {
  /** The user's authToken */
  authToken: string
  /** The shapefile filename */
  filename: string
  /** The shapefile size */
  size: string
  /** The shapefile contents */
  file: ShapefileFile
}

export type ShapefileSlice = {
  /** The Shapefile Slice of the store */
  shapefile: {
    /** Flag to show the shapefile loading */
    isLoading: boolean
    /** Flag to show the shapefile loaded */
    isLoaded: boolean
    /** Flag to show the shapefile errored */
    isErrored: boolean | { message: string }
    /** The shapefile contents */
    file?: ShapefileFile
    /** The selected features of the shapefile */
    selectedFeatures?: string[]
    /** The shapefile id */
    shapefileId?: string
    /** The shapefile name */
    shapefileName?: string
    /** The shapefile size */
    shapefileSize?: string
    /** Function to set the shapefile loading */
    setLoading: (shapefileName?: string) => void
    /** Function to set the shapefile errored */
    setErrored: (message: string) => void
    /** Function to update the shapefile */
    updateShapefile: (data: UpdateShapefileProps) => void
    /** Function to clear the shapefile */
    clearShapefile: () => void
    /** Function to save the shapefile */
    saveShapefile: (data: SaveShapefileProps) => Promise<void>
    /** Function to fetch the shapefile */
    fetchShapefile: (shapefileId: string) => Promise<void>
  }
}

/** The accepted timeline interval values in CMR */
export enum TimelineInterval {
  Decade = 'decade',
  Year = 'year',
  Month = 'month',
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
  Second = 'second'
}

type TimelineQuery = {
  /** The center timestamp of the timeline */
  center?: number
  /** The interval of the timeline */
  interval?: TimelineInterval
  /** The end date of the timeline */
  endDate?: string
  /** The start date of the timeline */
  startDate?: string
  /** The end of the focused timespan */
  end?: number
  /** The start of the focused timespan */
  start?: number
}

export type TimelineIntervalData = {
  /** The intervals of the timeline per concept-id */
  [key: string]: TimelineIntervals
}

export type TimelineSlice = {
  /** The Timeline Slice of the store */
  timeline: {
    /** The intervals of the timeline */
    intervals: TimelineIntervalData
    /** The query of the timeline */
    query: TimelineQuery
    /** Function to set the query value */
    setQuery: (query: TimelineQuery) => void
    /** Function to get the timeline */
    getTimeline: () => Promise<void>
  }
}

export type UiSlice = {
  /** The UI Slice of the store */
  ui: {
    panels: {
      /** Width of the panels */
      panelsWidth: number
      /** Function to set the panelsWidth value */
      setPanelsWidth: (panelsWidth: number) => void
    }
    tour: {
      /** Flag to show the tour */
      runTour: boolean
      /** Function to set the runTour value */
      setRunTour: (runTour: boolean) => void
      /** Callback function when the Search route is loaded */
      onSearchLoaded: () => void
    }
  }
}

export type EdscStore =
  EarthdataDownloadRedirectSlice
  & FacetParamsSlice
  & HomeSlice
  & MapSlice
  & PortalSlice
  & PreferencesSlice
  & ProjectSlice
  & ShapefileSlice
  & TimelineSlice
  & UiSlice

export type ImmerStateCreator<T> = StateCreator<EdscStore, [['zustand/immer', never], never], [], T>
