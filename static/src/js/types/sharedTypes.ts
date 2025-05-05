import {
  AxiosHeaderValue,
  AxiosResponseHeaders,
  HttpStatusCode
} from 'axios'
import { GeoJsonObject } from 'geojson'
import { Style } from 'ol/style'
import { crsProjections } from '../util/map/crs'

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
  /** The point coordinates, if applied */
  point?: PointString[]
  /** The polygon coordinates, if applied */
  polygon?: PolygonString[]
}

/** The spatial object */
export interface SpatialSearch {
  advancedSearch?: {
    /** The region search object */
    regionSearch?: {
      /** The selected region object */
      selectedRegion?: {
        /** The spatial coordinates */
        spatial?: string
        /** The spatial type */
        type?: 'reach' | 'huc'
      }
    }
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
}

export type MapGranule = {
  /** The background granule style */
  backgroundGranuleStyle: Style
  /** The collection id */
  collectionId: string
  /** The temporal value formatted for display */
  formattedTemporal: string
  /** The GIBS metadata */
  gibsData: GibsData
  /** The granule id */
  granuleId: string
  /** The granule style */
  granuleStyle: Style
  /** The highlighted granule style */
  highlightedStyle: Style
  /** The spatial value for the granule */
  spatial: GeoJsonObject
}

export type ProjectionCode = keyof typeof crsProjections

/** The query object */
export interface Query {
  // Will flush out query types when implementing the querySlice
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

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

export type TimelineIntervals = ((number)[])[]

/** The response data for the timeline */
export type TimelineResponseData = {
  /** The collection concept id */
  'concept-id': string
  /** The timeline intervals for the collection */
  intervals: TimelineIntervals
}

/** The response data for our request classes */
export type RequestResponseData = EmptyObject | [] | TimelineResponseData[]

/** The request parameters for a collection request */
export type CollectionRequestParams = {
  /** The collection concept id */
  conceptId: string
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

/** The request parameters for our request classes */
export type RequestParams = TimelineRequestParams | CollectionRequestParams

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
