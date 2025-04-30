import { AxiosHeaderValue, HttpStatusCode } from 'axios'

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
  [key: string]: unknown
}

/** The collections metadata object, by collection concept id */
export interface CollectionsMetadata {
  /** The collection concept id */
  [key: string]: CollectionMetadata
}

/** The query object */
export interface Query {
  [key: string]: unknown
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

/** A response received from an Axios request */
export type AxiosResponse = {
  /** The response data */
  data: unknown
  /** The response status */
  statusCode: HttpStatusCode
  /** The response status text */
  message: string
  /** The response headers */
  headers: CmrHeaders
}

/** Redux state types */
export type ReduxState = {
  /** The auth token */
  authToken: string
  /** The Earthdata Environment */
  earthdataEnvironment: string
}
