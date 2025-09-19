import {
  AxiosHeaderValue,
  AxiosResponseHeaders,
  HttpStatusCode
} from 'axios'
import {
  FeatureCollection,
  GeoJsonObject,
  Geometry
} from 'geojson'
import { Style } from 'ol/style'
import { crsProjections } from '../util/map/crs'
import { PreferencesData } from '../zustand/types'
import { Colormap } from '../components/ColorMap/ColorMap'

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
}

/** The URS profile for the user */
export interface UrsProfile {
  /** The email address of the user from the URS profile */
  email_address: EmailAddressString
}

/** The Collection Metadata */
export interface CollectionMetadata {
  // Will flush out Collection types in the future
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  /** The collection concept id */
  conceptId: string
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
  /** The GIBS metadata */
  gibsData: GibsData[]
  /** The granule id */
  granuleId: string
  /** The granule style */
  granuleStyle: Style
  /** The highlighted granule style */
  highlightedStyle: Style
  /** The spatial value for the granule */
  spatial: GeoJsonObject
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
export type RequestResponseData = EmptyObject | [] | TimelineResponseData[] | GranuleResponseData

/** The request parameters for a collection request */
export type CollectionRequestParams = {
  /** The collection concept id */
  conceptId: string
}

export type ShapefileFile = FeatureCollection & {
  name: string
  type: string
}

export type ShapefileRequestParams = {
  authToken: string
  file: ShapefileFile
  filename: string
  size: string
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

/** Redux state types */
export type ReduxState = {
  /** The auth token */
  authToken: string
  /** The Earthdata Environment */
  earthdataEnvironment: string
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

export type ImageryLayerItem = {
  /** The product name */
  product: string
  /** The layer title */
  title?: string
  /** The colormap data for this layer */
  colormap: Colormap
  /** The opacity of the layer */
  opacity: number
  /** Whether the layer is visible */
  isVisible: boolean
  /** Layer properties */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
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

export type SubscriptionResponse = {
  /** The total number of subscriptions */
  count: number
  /** The list of subscriptions */
  items: Subscription[]
}

/** NLP Collection Query Parameters */
export type NlpCollectionQuery = {
  /** The original search query string */
  query: string
  /** The spatial data extracted from NLP */
  spatial?: {
    /** The GeoJSON spatial data */
    geoJson: Geometry
    /** The location name from NLP */
    geoLocation: string
  }
  /** The temporal data extracted from NLP */
  temporal?: {
    startDate: string
    endDate: string
  }
}
