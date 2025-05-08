import {
  AxiosHeaderValue,
  AxiosResponseHeaders,
  HttpStatusCode
} from 'axios'

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

/** Redux state types */
export type ReduxState = {
  /** The auth token */
  authToken: string
  /** The Earthdata Environment */
  earthdataEnvironment: string
}
