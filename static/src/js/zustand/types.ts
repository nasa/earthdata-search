import { StateCreator } from 'zustand'

import type {
  CollectionMetadata,
  CollectionsMetadata,
  GranuleMetadata,
  GranulesMetadata,
  PortalConfig,
  ProjectionCode,
  ScienceKeyword,
  ShapefileFile,
  Spatial,
  SubscriptionResponse,
  Temporal,
  TimelineIntervals,
  VariableMetadata,
  UrsProfile
} from '../types/sharedTypes'
import { ModalName } from '../constants/modalNames'

export type CollectionSlice = {
  /**
   * The Collection Slice of the store. This saves the focused collection ID and
   * collection metadata for any focused collection
   */
  collection: {
    /** The currently focused collection */
    collectionId: string | null
    /** The metadata of any fetched collections */
    collectionMetadata: CollectionsMetadata
    /** Function to get the focused collection metadata */
    getCollectionMetadata: () => void
    /** Function to set or remove the focused collection */
    setCollectionId: (collectionId: string | null) => void
    /** Function to update the granule subscriptions within the collectionMetadata store */
    updateGranuleSubscriptions: (collectionId: string, subscriptions: SubscriptionResponse) => void
    /** Function to set or remove the focused collection and navigate to the collection details page */
    viewCollectionDetails: (collectionId: string | null) => void
    /** Function to set or remove the focused collection and navigate to the collection granules page */
    viewCollectionGranules: (collectionId: string | null) => void
  }
}

export type CollectionsSlice = {
  /** The Collections Slice of the store. This stores the metadata for collection searches */
  collections: {
    /** The metadata for the collection searches */
    collections: {
      /** The total number of collections found */
      count: number | null
      /** Flag indicating if the collections are loaded */
      isLoaded: boolean
      /** Flag indicating if the collections are currently loading */
      isLoading: boolean
      /** The time taken to load the collections */
      loadTime: number | null
      /** The list of collection metadata */
      items: CollectionMetadata[]
    }
    /** Function to fetch the collections from CMR */
    getCollections: () => Promise<void>
    /** Function to perform NLP search and process results */
    getNlpCollections: (query: string) => Promise<void>
  }
}

/** Data Quality Summary item structure */
type DataQualitySummaryItem = {
  /** Unique identifier for the data quality summary */
  id: string
  /** HTML content of the summary */
  summary: string
}

export type DataQualitySummariesSlice = {
  /** The Data Quality Summaries Slice of the store */
  dataQualitySummaries: {
    /** Object storing data quality summaries by collection ID */
    byCollectionId: Record<string, DataQualitySummaryItem[]>
    /** Function to set data quality summaries for a collection */
    setDataQualitySummaries: (catalogItemId: string, summaries: DataQualitySummaryItem[]) => void
  }
}

export type EarthdataDownloadRedirectSlice = {
  /** The Earthdata Download Redirect Slice of the store */
  earthdataDownloadRedirect: {
    /** The redirect URL for earthdata download */
    redirectUrl: string
    /** Function to set the redirect URL */
    setRedirectUrl: (redirect: string) => void
  }
}

export type EarthdataEnvironmentSlice = {
  /** The Earthdata Environment Slice of the store */
  earthdataEnvironment: {
    /** The current Earthdata environment */
    currentEnvironment: 'prod' | 'uat' | 'sit'
  }
}

/** Error object structure */
type ErrorObject = {
  /** Unique identifier for the error */
  id: string
  /** The error message */
  message: string
  /** The notification type for the error */
  notificationType?: string
  /** Flag to show alert button in the error banner */
  showAlertButton?: boolean
  /** The error title */
  title?: string
}

/** Parameters for handleError action */
type HandleErrorParams = {
  /** The error object */
  error: Error
  /** The error message */
  message?: string
  /** The action that caused the error */
  action?: string
  /** The resource that caused the error */
  resource?: string
  /** The verb describing the action */
  verb?: string
  /** The notification type */
  notificationType?: string
  /** The request object */
  requestObject?: {
    /** The request ID */
    requestId?: string
  }
  /** Flag to show alert button */
  showAlertButton?: boolean
  /** The error title */
  title?: string
}

export type ErrorsSlice = {
  /** The Errors Slice of the store */
  errors: {
    /** The list of errors */
    errorsList: ErrorObject[]
    /** Function to remove an error */
    removeError: (id: string) => void
    /** Function to handle an error */
    handleError: (params: HandleErrorParams) => void
  }
}

export type Facet = {
  /** The facet title */
  title: string
  /** The facet type */
  type: string
  /** Whether the facet is applied */
  applied: boolean
  /** The count of items in the facet */
  count?: number
  /** Whether the facet has children */
  has_children: boolean
  /** The child facets */
  children?: Facet[]
  /** The number of selected items in the facet */
  totalSelected?: number
  /** The starting letters for the facet */
  startingLetters?: string[]
}

export type Facets = {
  [key: string]: Facet
}

export type FacetsSlice = {
  /** The Facets Slice of the store */
  facets: {
    facets: {
      /** The list of all facet IDs */
      allIds: string[]
      /** The facets object keyed by their ID */
      byId: Facets
      /** Whether the facets have been loaded */
      isLoaded: boolean
      /** Whether the facets are currently loading */
      isLoading: boolean
      /** Function to update the facets */
      updateFacets: (facets: Facet[]) => void
    }
    viewAllFacets: {
      /** The list of all facet IDs for view all facets */
      allIds: string[]
      /** The facets object for view all facets keyed by their ID */
      byId: Facets
      /** The total number of collections returned for the view all facets */
      collectionCount: number | null
      /** Whether the view all facets have been loaded */
      isLoaded: boolean
      /** Whether the view all facets are currently loading */
      isLoading: boolean
      /** The currently selected category for view all facets */
      selectedCategory: string | null
      /** Function to fetch the view all facets for a category */
      getViewAllFacets: (category: string) => Promise<void>
      /** Function to reset the view all facets state */
      resetState: () => void
    }
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
export type CMRFacetsParams = {
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
    cmrFacets: CMRFacetsParams
    /** The view all facets */
    viewAllFacets: ViewAllFacets
    /** Function to add a CMR facet from an autocomplete suggestion */
    addCmrFacetFromAutocomplete: (facet: CMRFacetsParams) => void
    /** Function to apply the viewAllFacets params */
    applyViewAllFacets: () => void
    /** Function to reset the facet params */
    resetFacetParams: () => void
    /** Function to set the feature facets */
    setFeatureFacets: (featureFacets: Partial<FeatureFacets>) => void
    /** Function to set the CMR facets */
    setCmrFacets: (cmrFacets: CMRFacetsParams) => void
    /** Function to set the view all facets */
    setViewAllFacets: (viewAllFacets: ViewAllFacets, category: keyof ViewAllFacets) => void
    /** Function to trigger the View All Facets modal */
    triggerViewAllFacets: (category: string) => void
  }
}

export type GranuleSlice = {
  /**
   * The Granule Slice of the store. This saves the focused granule ID and granule metadata
   * of any focused granules
   */
  granule: {
    /** The currently focused granule */
    granuleId: string | null
    /** The metadata of any fetched granules */
    granuleMetadata: GranulesMetadata
    /** Function to get the focused granule metadata */
    getGranuleMetadata: () => void
    /** Function to set or remove the focused granule */
    setGranuleId: (granuleId: string | null) => void
  }
}

export type GranulesSlice = {
  /** The Granules Slice of the store. This saves the metadata for granule searches */
  granules: {
    /** The metadata for the granule searches */
    granules: {
      /** The collection concept ID of the granules */
      collectionConceptId: string | null
      /** The total number of granules found */
      count: number | null
      /** Flag indicating if the granules are loaded */
      isLoaded: boolean
      /** Flag indicating if the granules are currently loading */
      isLoading: boolean
      /** The time taken to load the granules */
      loadTime: number | null
      /** The list of granule metadata */
      items: GranuleMetadata[]
    }
    /** Function to fetch the granules from CMR */
    getGranules: () => void
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

export type MapLayer = {
  /** The product identifier for the map layer */
  product: string
  /** The display title for the map layer */
  title?: string
  /** The image format of the layer (e.g., 'image/png', 'image/jpeg') */
  format?: string
  /** The temporal period of the layer (e.g., 'daily', 'monthly') */
  layerPeriod?: string
  /** Resolution for Antarctic projection */
  antarctic_resolution?: string
  /** Resolution for Arctic projection */
  arctic_resolution?: string
  /** Resolution for geographic projection */
  geographic_resolution?: string
  /** Whether the layer is available for Antarctic projection */
  antarctic?: boolean
  /** Whether the layer is available for Arctic projection */
  arctic?: boolean
  /** Whether the layer is available for geographic projection */
  geographic?: boolean
  /** Whether the layer is currently visible on the map */
  isVisible?: boolean
  /** The opacity of the layer (0-1) */
  opacity?: number
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
    /** Store layers for each collection */
    mapLayers: Record<string, MapLayer[]>
    /** Function to set layers for a collection */
    setMapLayers: (collectionId: string, layers: MapLayer[]) => void
    /** Function to toggle layer visibility for a collection */
    toggleLayerVisibility: (collectionId: string, productName: string) => void
    /** Function to set the order of layers when they are dragged and dropped */
    setMapLayersOrder: (collectionId: string, newOrder: MapLayer[]) => void
    /** Function to update the opacity of a specific layer */
    setLayerOpacity: (collectionId: string, productName: string, opacity: number) => void
  }
}

/** Represents the panel section (first part) in the activePanel string, e.g., '0' in '0.5.2' */
type PanelsPanel = `${number}`

/** Represents the group (middle part) in the activePanel string, e.g., '5' in '0.5.2' */
type PanelsGroup = `${number}`

/** Represents the section (last part) in the activePanel string, e.g., '2' in '0.5.2' */
type PanelsSection = `${number}`

/**
 * Holds project panel state
 * Example 0.5.2 is the 5th collection in the project and looking at the panel variable details
 * 1.3.0 is the granule list for the third collection in the project
 */
export type ActivePanelConfiguration = `${PanelsPanel}.${PanelsGroup}.${PanelsSection}`

export type panelsData = {
  /** Whether the project panels is open */
  isOpen: boolean
  /** The currently active project panel, e.g., '0.0.0' */
  activePanel: ActivePanelConfiguration
}

export type PanelsSlice = {
  /** The Panels Slice of the store */
  projectPanels: {
    /** The panels data */
    panels: panelsData
    /** Function to toggle the panels open/closed */
    setIsOpen: (isOpen: boolean) => void
    /** Function to set the active panel */
    setActivePanel: (activePanel: ActivePanelConfiguration) => void
    /** Function to set the panel group (updates the middle part of activePanel) */
    setPanelGroup: (group: PanelsGroup) => void
    /** Function to set the panel section (updates the first part of activePanel) */
    setPanelSection: (section: PanelsSection) => void
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
  count: number
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
export type EsiAccessMethod = {
  name?: string
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
export type HarmonyAccessMethod = {
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
  /** Loading state of project collections */
  isLoading: boolean
}

/** The project granule results */
export type ProjectGranuleResults = {
  /** The collection ID */
  collectionId: string
  /** The number of granule results */
  count: number
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

/** Granule query parameters */
export type GranuleQuery = {
  /** Flag to indicate if the granule is for browsing only */
  browseOnly?: boolean
  /** The day/night flag */
  dayNightFlag?: 'DAY' | 'NIGHT' | 'BOTH'
  /** The excluded granule IDs */
  excludedGranuleIds: string[]
  /** The grid coordinates */
  gridCoords?: string
  /** Flag to indicate if the granule is online only */
  onlineOnly?: boolean
  /** The page number */
  pageNum: number
  /** The sort key */
  sortKey: string
  /** The granule name */
  readableGranuleName?: string
  /** The temporal filter */
  temporal?: Temporal
}

/** Collection specific queries by Collection ID */
type CollectionQueryById = {
  [key: string]: {
    /** Granule query parameters for the collection */
    granules: GranuleQuery
  }
}

/** Region Query Parameters */
type RegionQuery = {
  /** The region endpoint */
  endpoint?: 'huc' | 'region' | 'rivers/reach'
  /** Should to search be an exact match */
  exact: boolean
  /** The keyword to search for */
  keyword?: string
}

/** Collection Query Parameters */
type CollectionQuery = {
  /** Collection specific queries by Collection ID */
  byId: CollectionQueryById
  /** Flag to indicate if the collection has granules or CWIC */
  hasGranulesOrCwic: boolean
  /** The keyword to search for */
  keyword: string
  /** Flag to indicate if only EOSDIS collections should be included */
  onlyEosdisCollections: boolean
  /** The temporal override */
  overrideTemporal: Temporal
  /** The page number */
  pageNum: number
  /** The sort key */
  sortKey: string
  /** The spatial filter */
  spatial: Spatial
  /** The tag key */
  tagKey: string
  /** The temporal filter */
  temporal: Temporal
}

type SelectedRegion = {
  /** The ID of the selected region */
  id?: string
  /** The name of the selected region */
  name?: string
  /** The spatial representation of the selected region */
  spatial?: string
  /** The type of the selected region */
  type?: 'huc' | 'reach'
}

/** Parameters for changing the query */
type ChangeQueryParams = {
  /** The collection query */
  collection?: Partial<CollectionQuery>
  /** The region query */
  region?: Partial<RegionQuery>
  /** The selected region query */
  selectedRegion?: Partial<SelectedRegion>
}

export type QuerySlice = {
  /** The Query Slice of the store */
  query: {
    /** The collection query */
    collection: CollectionQuery
    /** The selected region (to use as a spatial query to CMR) */
    selectedRegion: SelectedRegion
    /** Function to change the query */
    changeQuery: (query: ChangeQueryParams) => void
    /** Function to change the granule query */
    changeGranuleQuery: ({
      collectionId,
      query
    }: {
      /** The collection ID to update */
      collectionId: string
      /** The new query params */
      query: Partial<GranuleQuery>
    }) => void
    /** Function to clear all filters */
    clearFilters: () => void
    /** Function to exclude a granule from a collection */
    excludeGranule: ({
      collectionId,
      granuleId
    }: {
      /** The collection ID to update */
      collectionId: string;
      /** The granule ID to exclude */
      granuleId: string
    }) => void
    /** Initialize the granule query without fetching granules */
    initializeGranuleQuery: ({
      collectionId,
      query
    }: {
      /** The collection ID to update */
      collectionId: string
      /** The new query params */
      query: Partial<GranuleQuery>
    }) => void
    /** Function to remove the spatial filter */
    removeSpatialFilter: () => void
    /** Function to undo the last excluded granule */
    undoExcludeGranule: (collectionId: string) => void
  }
}

/** Represents a saved project */
type SavedProject = {
  /** The ID of the saved project */
  id?: string
  /** The name of the saved project */
  name?: string
  /** The path of the saved project */
  path?: string
}

export type SavedProjectSlice = {
  /** The Saved Project slice of the store */
  savedProject: {
    /** The saved project */
    project: SavedProject
    /** Function to set the saved project */
    setProject: (project: SavedProject) => void
    /** Function to set the saved project name */
    setProjectName: (name: string) => void
    /** Function to get the saved project */
    getProject: (projectId: string) => void
  }
}

type UpdateShapefileParams = {
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
    updateShapefile: (data: UpdateShapefileParams) => void
    /** Function to clear the shapefile */
    clearShapefile: () => void
    /** Function to save the shapefile */
    saveShapefile: (data: {
      /** The shapefile filename */
      filename: string
      /** The shapefile size */
      size: string
      /** The shapefile contents */
      file: ShapefileFile
    }) => Promise<void>
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

/** The modal data for the deprecate parameters modal */
type DeprecateParametersModalData = {
  /** The deprecated URL parameters */
  deprecatedUrlParams: string[]
}

/** The modal data for the edit subscription modal */
type EditSubscriptionModalData = {
  /** The subscription concept ID */
  subscriptionConceptId: string
  /** The subscription type */
  subscriptionType: string
}

/** The data associated with the currently open modal */
type ModalData = DeprecateParametersModalData | EditSubscriptionModalData

export type UiSlice = {
  /** The UI Slice of the store */
  ui: {
    map: {
      /** Flag to show the spatial mbr warning */
      displaySpatialMbrWarning: boolean
      /** Function to set the displaySpatialMbrWarning value */
      setDisplaySpatialMbrWarning: (displaySpatialMbrWarning: boolean) => void
      /** Flag to show the map drawing new layer */
      drawingNewLayer: string | boolean
      /** Function to set the mapDrawingNewLayer value */
      setDrawingNewLayer: (drawingNewLayer: string | boolean) => void
    }
    modals: {
      /** The currently open modal */
      openModal: ModalName | null
      /** The data associated with the currently open modal */
      modalData?: ModalData
      /** Function to set the currently open modal and its data */
      setOpenModal: (modalName: ModalName | null, modalData?: ModalData) => void
    }
    panels: {
      /** Width of the panels */
      panelsWidth: number
      /** Function to set the panelsWidth value */
      setPanelsWidth: (panelsWidth: number) => void
      /** Flag to show if the panels are loaded */
      panelsLoaded: boolean
      /** Function to set the panelsLoaded value */
      setPanelsLoaded: (panelsLoaded: boolean) => void
      /** The width of the sidebar */
      sidebarWidth: number
      /** Function to set the sidebarWidth value */
      setSidebarWidth: (sidebarWidth: number) => void
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

export type PanelState = 'default' | 'collapsed' | 'open' | 'fullWidth'
export type ListView = 'default' | 'list' | 'table'
export type CollectionSort = 'default' | '-score' | '-usage_score' | '-create-data-date' | 'start_date' | '-ongoing'
export type GranuleSort = 'default' | '-start_date' | 'start_date' | '-end_date' | 'end_date'
export type BaseLayer = 'worldImagery' | 'trueColor' | 'landWaterMap'
export type OverlayLayer = 'bordersRoads' | 'coastlines' | 'placeLabels'

export type PreferencesData = {
  /** The state of the panels */
  panelState: PanelState
  /** The view mode for collection lists */
  collectionListView: ListView
  /** The view mode for granule lists */
  granuleListView: ListView
  /** The sort preference for collections */
  collectionSort: CollectionSort
  /** The sort preference for granules */
  granuleSort: GranuleSort
  /** The map view preferences */
  mapView: {
    /** The zoom level of the map */
    zoom: number
    /** The latitude center of the map */
    latitude: number
    /** The base layer identifier for the map */
    baseLayer: BaseLayer
    /** The longitude center of the map */
    longitude: number
    /** The projection code for the map */
    projection: ProjectionCode
    /** Array of overlay layer identifiers */
    overlayLayers: OverlayLayer[]
    /** The rotation of the map in degrees */
    rotation: number
  }
}

export type UserSlice = {
  /** The User Slice of the store */
  user: {
    /** The user's EDL token */
    edlToken: string | null
    /** Function to set the user's EDL token */
    setEdlToken: (edlToken: string | null) => void

    /** The user's site preferences */
    sitePreferences: PreferencesData
    /** Function to set the user's site preferences */
    setSitePreferences: (sitePreferences: PreferencesData) => void

    /** The username of the user */
    username: string | null
    /** Function to set the username of the user */
    setUsername: (username: string | null) => void

    /** The user's URS profile */
    ursProfile: UrsProfile | null
    /** Function to set the user's URS profile */
    setUrsProfile: (ursProfile: UrsProfile | null) => void

    /** Function to log out the user */
    logout: () => void
  }
}

export type EdscStore =
  CollectionSlice
  & CollectionsSlice
  & DataQualitySummariesSlice
  & EarthdataDownloadRedirectSlice
  & EarthdataEnvironmentSlice
  & ErrorsSlice
  & FacetsSlice
  & FacetParamsSlice
  & GranuleSlice
  & GranulesSlice
  & HomeSlice
  & MapSlice
  & PanelsSlice
  & PortalSlice
  & ProjectSlice
  & QuerySlice
  & SavedProjectSlice
  & ShapefileSlice
  & TimelineSlice
  & UiSlice
  & UserSlice

export type ImmerStateCreator<T> = StateCreator<EdscStore, [['zustand/immer', never], never], [], T>
