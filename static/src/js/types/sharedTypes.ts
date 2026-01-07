import type {
  AxiosHeaderValue,
  AxiosResponseHeaders,
  HttpStatusCode
} from 'axios'
import type { FeatureCollection, GeoJsonObject } from 'geojson'
import type { Style } from 'ol/style'
import type { crsProjections } from '../util/map/crs'
import type { PreferencesData, MapLayer } from '../zustand/types'

/** A type for an empty object */
export type EmptyObject = Record<string, never>

/** A email address string. This does not check the format of the string but is used to signify that the string should follow a valid datetime string format. */
export type EmailAddressString = string

/** A datetime string. This does not check the format of the string but is used to signify that the string should follow a valid datetime string format. */
export type DateTimeString = string

/** A bounding box string following the CMR format. This does not check the format of the string but is used to signify that the string should follow a valid datetime string format. */
export type BoundingBoxString = string

/** A circle string following the CMR format This does not check the format of the string but is used to signify that the string should follow a valid datetime string format. */
export type CircleString = string

/** A line string following the CMR format This does not check the format of the string but is used to signify that the string should follow a valid datetime string format. */
export type LineString = string

/** A point string following the CMR format This does not check the format of the string but is used to signify that the string should follow a valid datetime string format. */
export type PointString = string

/** A polygon string following the CMR format This does not check the format of the string but is used to signify that the string should follow a valid datetime string format. */
export type PolygonString = string

/** The coordinate system used for spatial data */
export type CoordinateSystem = 'GEODETIC' | 'CARTESIAN'

/** The spatial object */
export interface Spatial {
  /** The bounding box coordinates, if applied */
  boundingBox?: BoundingBoxString[]
  /** The circle coordinates, if applied */
  circle?: CircleString[]
  /** The line coordinates, if applied */
  line?: LineString[]
  /** The point coordinates, if applied */
  point?: PointString[]
  /** The polygon coordinates, if applied */
  polygon?: PolygonString[]
}

/** The latitude of a coordinate */
export type Latitude = number
/** The longitude of a coordinate */
export type Longitude = number
/** The altitude of a coordinate */
export type Altitude = number
/** The radius of a circle */
export type CircleRadius = number

/** A GeoJSON coordinate with optional altitude */
export type GeoJsonCoordinate = [Longitude, Latitude, Altitude?]

/** A GeoJSON Point */
export type Point = GeoJsonCoordinate
/** A GeoJSON MultiPoint */
export type MultiPoint = GeoJsonCoordinate[]
/** A GeoJSON LineString */
export type Line = GeoJsonCoordinate[]
/** A GeoJSON MultiLineString */
export type MultiLine = GeoJsonCoordinate[][]
/** A GeoJSON Polygon */
export type Polygon = GeoJsonCoordinate[][]
/** A GeoJSON MultiPolygon */
export type MultiPolygon = GeoJsonCoordinate[][][]
/** A GeoJSON Circle */
export type Circle = [Point, CircleRadius]

/** Spatial coordinates including all GeoJSON types and Circle */
export type SpatialCoordinates = Point
  | MultiPoint
  | Line
  | MultiLine
  | Polygon
  | MultiPolygon
  | Circle

/** The spatial object */
export interface SpatialSearch {
  /** The selected region object */
  selectedRegion?: {
    /** The spatial coordinates */
    spatial?: string
    /** The spatial type */
    type?: 'reach' | 'huc'
  }
  /** The bounding box coordinates, if applied */
  boundingBoxSearch?: BoundingBoxString[]
  /** The circle coordinates, if applied */
  circleSearch?: CircleString[]
  /** The drawing new layer flag */
  drawingNewLayer: boolean | string
  /** The line coordinates, if applied */
  lineSearch?: LineString[]
  /** The point coordinates, if applied */
  pointSearch?: PointString[]
  /** The polygon coordinates, if applied */
  polygonSearch?: PolygonString[]
  /** The MBR (Minimum Bounding Rectangle) flag */
  showMbr: boolean
}

/** The spatial query types */
export type SpatialQueryType =
  | 'boundingBox'
  | 'circle'
  | 'line'
  | 'point'
  | 'polygon'

export type Coordinate = {
  /** The latitude of the coordinate */
  lat: number
  /** The longitude of the coordinate */
  lng: number
}

/** The temporal object */
export interface Temporal {
  /** The end date timestamp, if applied */
  endDate?: DateTimeString | ''
  /** The start date timestamp, if applied */
  startDate?: DateTimeString | ''
  /** The recurring temporal flag, if applied */
  recurring?: boolean
}

/** The URS profile for the user */
export interface UrsProfile {
  /** The affiliation of the user from the URS profile */
  affiliation?: string
  /** The country of the user from the URS profile */
  country?: string
  /** The email address of the user from the URS profile */
  emailAddress: EmailAddressString
  /** The first name of the user from the URS profile */
  firstName: string
  /** The last name of the user from the URS profile */
  lastName?: string
  /** The organization of the user from the URS profile */
  organization?: string
  /** The study area of the user from the URS profile */
  studyArea?: string
  /** The user type of the user from the URS profile */
  userType?: string
}

/** The Collection Metadata */
export interface CollectionMetadata {
  // Will flush out Collection types in the future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  /** The collection concept id */
  conceptId?: string
  /** The collection id */
  id?: string
  /** The collection tags */
  tags?: {
    [key: string]: string
  }
}

/** The collections metadata object, by collection concept id */
export interface CollectionsMetadata {
  /** The collection concept id */
  [key: string]: CollectionMetadata
}

export type GranuleMetadata = {
  // Will flush out Granule types in the future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  /** The links associated with the granule */
  links?: {
    /** The link href */
    href: string
    /** The link rel */
    rel: string
  }[],
  /** The granule spatial coordinates in boxes */
  boxes?: BoundingBoxString[]
  /** The granule spatial coordinates in lines */
  lines?: LineString[]
  /** The granule spatial coordinates in points */
  points?: PointString[]
  /** The granule spatial coordinates in polygons */
  polygons?: PolygonString[][]
}

export type GranulesMetadata = {
  /** The granule concept id */
  [key: string]: GranuleMetadata
}

export type GibsLayersByCollection = {
  /** The MapLayers associated with a Collection Id */
  [collectionId: string]: MapLayer[]
}

export type GibsData = {
  /** The format of the GIBS product */
  format?: string
  /** The GIBS layer period value */
  layerPeriod?: string
  /** The GIBS layer name */
  product: string
  /** The GIBS layer resolution */
  resolution: string
  /** The opacity of the granule */
  opacity: number
  /** The GIBS layer time */
  time?: string
  /** The GIBS layer URL */
  url?: string
  /** The GIBS layer title */
  title?: string
  /** Whether the layer is visible (from Zustand state) */
  visible?: boolean
}

export type MapGranule = {
  /** The background granule style */
  backgroundGranuleStyle: Style
  /** The collection id */
  collectionId: string
  /** The temporal value formatted for display */
  formattedTemporal: string
  /** The granule id */
  granuleId: string
  /** The granule style */
  granuleStyle: Style
  /** The highlighted granule style */
  highlightedStyle: Style
  /** The spatial value for the granule */
  spatial: GeoJsonObject
  /** The time value for the granule */
  time: string
}
export type ColormapScale = {
  /** The scale object contains colors and labels */
  scale: {
    /** The colors in the colormap */
    colors: string[]
    /** The labels in the colormap */
    labels: string[]
  },
  /** The classes object is not used */
  classes?: undefined
}

export type ColormapClasses = {
  /** The scale object is not used */
  scale?: undefined
  /** The classes object contains colors and labels */
  classes: {
    /** The colors in the colormap */
    colors: string[]
    /** The labels in the colormap */
    labels: string[]
  }
}

/** Colormap can have the scale or the classes object */
export type Colormap = ColormapScale | ColormapClasses

/** Imagery layer item with colormap data */
export type ImageryLayerItem = MapLayer & {
  /** The colormap data for this layer */
  colormap?: Colormap
}

export type ImageryLayers = {
  /** Array of layer data with colormap information */
  layerData: ImageryLayerItem[]
  /** Function to toggle layer visibility */
  toggleLayerVisibility: (collectionId: string, productName: string) => void
  /** Function to set map layers order */
  setMapLayersOrder: (collectionId: string, layers: ImageryLayerItem[]) => void
  /** Function to update layer opacity */
  setLayerOpacity: (collectionId: string, productName: string, opacity: number) => void
}

/** The query object */
export interface Query {
  // Will flush out query types when implementing the querySlice
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export type PortalConfig = {
  /** The portal configuration for visible features */
  features: {
    /** Flag to show the advanced search */
    advancedSearch: boolean
    /** Flag to show the features behind authentication */
    authentication: boolean
    /** Flags for the feature facets */
    featureFacets: {
      /** Flag to show the Available in Earthdata Cloud facet */
      showAvailableInEarthdataCloud: boolean
      /** Flag to show the Customizable facet */
      showCustomizable: boolean
      /** Flag to show the Map Imagery facet */
      showMapImagery: boolean
    }
  }
  /** The portal configuration for the footer */
  footer: {
    /** The footer attribution text */
    attributionText: string
    /** Flag to show the application version */
    displayVersion: boolean
    /** The footer's primary links */
    primaryLinks: Array<{
      href: string
      title: string
    }>
    /** The footer's secondary links */
    secondaryLinks: Array<{
      href: string
      title: string
    }>
  }
  /** The URL to navigate to when the portal is clicked */
  moreInfoUrl?: string
  /** The portal's page title */
  pageTitle: string
  /** Flag to show the portal in the portal browser */
  portalBrowser: boolean
  /** The portal ID */
  portalId: string
  /** The portal's query */
  query: Query
  /** The title of the portal */
  title: {
    /** The primary title of the portal */
    primary: string
    /** The secondary title of the portal */
    secondary?: string
  }
  /** The UI Configuration of the portal */
  ui: {
    /** Flag to show the `Include only EOSDIS collections` Checkbox */
    showNonEosdisCheckbox: boolean
    /** Flag to show the `Include collections without granules` checkbox */
    showOnlyGranulesCheckbox: boolean
    /** Flag to show Tophat */
    showTophat: boolean
  }
}

export type ProjectionCode = keyof typeof crsProjections

/** CMR specific headers */
export interface CmrHeaders {
  /** The CMR Request ID */
  'CMR-Request-Id'?: string
  /** The CMR Client ID */
  'Client-Id'?: string
  /** The Earthdata Environment */
  'Earthdata-ENV'?: string
  /** The Authorization header */
  'Authorization'?: string | AxiosHeaderValue
}

/** The response data for granules */
export type CollectionResponseData = {
  /** The feed object containing collection entries */
  feed?: {
    /** The request ID */
    id: string
    /** The title of the feed */
    title: string
    /** The updated timestamp of the feed */
    updated: string
    /** The collection entries */
    entry: CollectionMetadata[]
  }
  /** The collection items */
  items?: CollectionMetadata[]
  /** Any errors returned from the request */
  errors?: string[]
}

/** The response data for granules */
export type GranuleResponseData = {
  feed: {
    entry: GranuleMetadata[]
  }
}

export type TimelineIntervals = ((number)[])[]

/** The response data for the timeline */
export type TimelineResponseData = {
  /** The collection concept id */
  'concept-id': string
  /** The timeline intervals for the collection */
  intervals: TimelineIntervals
}

/** The response data for our request classes */
export type RequestResponseData = EmptyObject
  | []
  | TimelineResponseData[]
  | CollectionResponseData
  | GranuleResponseData

/** The request parameters for a collection request */
export type CollectionRequestParams = {
  /** The collection concept id */
  conceptId: string
  /** The 2D coordinate system for the search */
  twoDCoordinateSystem?: {
    /** The coordinate system type */
    type: CoordinateSystem
    /** The coordinates for the search */
    coordinates?: SpatialCoordinates
  }
  /** Additional request parameters */
  [key: string]: unknown
}

export type ShapefileFile = FeatureCollection & {
  /** The name of the shapefile */
  name?: string
}

export type ShapefileRequestParams = {
  /** The Earthdata environment */
  earthdataEnvironment: string
  /** The user's edlToken */
  edlToken: string | null
  /** The shapefile filename */
  filename: string
  /** The shapefile size */
  size: string
  /** The shapefile contents */
  file: ShapefileFile
}

/** The request parameters for a timeline request */
export type TimelineRequestParams = {
  /** The bounding box search */
  boundingBox?: BoundingBoxString[]
  /** The circle search */
  circle?: CircleString[]
  /** The collection concept ids */
  conceptId: string[]
  /** The end date of the timeline */
  endDate: DateTimeString
  /** The point search */
  point?: PointString[]
  /** The polygon search */
  polygon?: PolygonString[]
  /** The start date of the timeline */
  startDate: DateTimeString
  /** The timeline zoom level */
  interval: string
}

/** The request parameters for a preferences request */
export type PreferencesRequestParams = {
  /** The preferences data */
  preferences: Partial<PreferencesData>
}

/** The request parameters for saved access configurations */
export type SavedAccessConfigsParams = {
  /** The collection IDs to retrieve */
  collectionIds: string[]
}

/** The request parameters for our request classes */
export type RequestParams = TimelineRequestParams
  | CollectionRequestParams
  | PreferencesRequestParams
  | SavedAccessConfigsParams
  | ShapefileRequestParams

/** The saved access configurations */
export type SavedAccessConfigs = {
  /** The collection ID */
  [key: string]: {
    /** The type of access method */
    type: string
  }
}

/** A response received from an Axios request */
export type Response = {
  /** The response data */
  data: RequestResponseData
  /** The response status */
  statusCode?: HttpStatusCode
  /** The response status text */
  message?: string
  /** The response headers */
  headers: CmrHeaders | AxiosResponseHeaders
}

/** The shapefile data */
export type Shapefile = {
  /** The shapefile file contents */
  file: File
  /** Is the shapefile loaded */
  isLoaded: boolean
  /** Is the shapefile loading */
  isLoading: boolean
  /** The shapefile id */
  shapefileId: string
  /** The selected features of the shapefile */
  selectedFeatures: string[]
}

export type ScienceKeyword = {
  /** The science keyword detailed variable name */
  detailed_variable?: string
  /** The science keyword term */
  term?: string
  /** The science keyword topic */
  topic?: string
  /** The science keyword variable level 1 name */
  variable_level_1?: string
  /** The science keyword variable level 2 name */
  variable_level_2?: string
  /** The science keyword variable level 3 name */
  variable_level_3?: string
}

export type VariableMetadata = {
  /** The variable concept ID */
  conceptId: string
  /** The variable definition */
  definition: string
  /** Describes a store (zarr) where a variable has been separated from its original data files and saved as its own entity */
  instanceInformation: {
    /** The internet location of the variable instance store */
    url: string
    /** Describes the format of the URL's data content */
    format: string
    /** Brief description of the store or any other useful information about the store */
    description?: string
    /** The variable's direct distribution information, if available */
    directDistributionInformation?: Record<string, unknown>
    /** Description of the chunking strategy for the store */
    chunkingInformation?: string
  }
  /** The variable long name */
  longName: string
  /** The variable name */
  name: string
  /** The variable native ID */
  nativeId: string
  /** The variable science keywords */
  scienceKeywords: ScienceKeyword[]
}

export type Subscription = {
  /** The subscription ID */
  conceptId: string
  /** The subscription nativeId */
  nativeId: string
  /** The subscription name */
  name: string
  /** The subscription type */
  type: 'granule' | 'collection'
  /** The collection concept ID */
  collectionConceptId?: string
  /** The query parameters for the subscription */
  query: string
}

export type SubscriptionResponse = {
  /** The total number of subscriptions */
  count: number
  /** The list of subscriptions */
  items: Subscription[]
}

/**
 * Admin Types
 */

/** A user */
export interface User {
  /** Unique identifier for the user */
  id: string
  /** URS username of the user */
  ursId: string
}

/** A project */
export interface Project {
  /** Unique identifier for the project */
  id: string
  /** Human-readable project name */
  name: string
  /** Obfuscated unique identifier for the project */
  obfuscatedId: string
  /** Source path or query string for the project */
  path: string
  /** User who owns the project */
  user: User
  /** ISO timestamp when the project was updated */
  updatedAt: string
  /** ISO timestamp when the project was created */
  createdAt: string
}

/** Order information for Harmony orders */
export type HarmonyOrderInformation = {
  /** The progress of the order */
  progress: number
  /** The links associated with the order */
  links: {
    /** The link href */
    href: string
    /** The link rel */
    rel: string
  }[]
  /** The status of the order */
  status: string
  /** The message associated with the order */
  message: string
  /** The job ID */
  jobId: string
}

/** Order information for SWODLR orders */
export type SwodlrOrderInformation = {
  /** The reason message (I think its a status?) */
  reason: string
  /** The granules associated with the order */
  granules: {
    /** The granule URI */
    uri: string
  }[]
}

/** Order information for ESI orders */
export type EsiOrderInformation = {
  /** Contact information for the order */
  contactInformation: {
    /** The contact name */
    contactName: string
    /** The contact email */
    contactEmail: string
  }
  /** The download URLs for the order */
  downloadUrls: {
    /** The download URLs for the order */
    downloadUrl: string[]
  }
  /** Process information for the order */
  processInfo: {
    /** The process message */
    message: string
  }
  /** Request status information for the order */
  requestStatus: {
    /** The request status */
    status: string
    /** The number of items processed */
    numberProcessed: number
    /** The total number of items */
    totalNumber: number
  }
}

/** Combined order information type */
export type OrderInformation = EsiOrderInformation
  & HarmonyOrderInformation
  & SwodlrOrderInformation

/** A retrieval order */
export interface RetrievalOrder {
  /** Unique identifier for the retrieval order */
  id: string
  /** Additional order configuration and parameters */
  orderInformation: OrderInformation
  /** Human-readable order number from the data provider */
  orderNumber: string
  /** Current processing state of the order */
  state: string
  /** Type of retrieval order */
  type: string
  /** Error message, if any */
  error: string | null
}

/** A retrieval collection. Contains collection metadata, order information, and tracking details */
export interface RetrievalCollection {
  /** Unique identifier for the retrieval collection */
  id: string
  /** Obfuscated unique identifier for the retrieval collection */
  obfuscatedId: string
  /** NASA CMR collection identifier */
  collectionId: string
  /** Metadata information about the collection */
  collectionMetadata: CollectionMetadata
  /** Total number of granules in this collection */
  granuleCount: number
  /** Access method configuration for data retrieval */
  accessMethod: {
    /** Type of access method (e.g., 'download', 'opendap', 'esi') */
    type: string
  }
  /** ISO timestamp when the retrieval collection was created */
  createdAt: string
  /** ISO timestamp when the retrieval collection was last updated */
  updatedAt: string
  /** Array of individual retrieval orders for this collection */
  retrievalOrders: RetrievalOrder[]
}

/** An admin retrieval */
export interface AdminRetrieval {
  /** Unique identifier for the retrieval */
  id: string
  /** Obfuscated unique identifier for the retrieval */
  obfuscatedId: string
  /** Raw JSON data for the retrieval */
  jsondata: Record<string, unknown>
  /** Environment string for the retrieval (e.g., 'prod', 'uat') */
  environment: string
  /** ISO timestamp when the retrieval was updated */
  updatedAt: string
  /** ISO timestamp when the retrieval was created */
  createdAt: string
  /** User who owns the retrieval */
  user: User
}
