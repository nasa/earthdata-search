import { pick } from 'lodash-es'
// @ts-expect-error Types are not defined for this module
import snakeCaseKeys from 'snakecase-keys'
import type { FeatureCollection } from 'geojson'

import Request from './request'

// @ts-expect-error Types are not defined for this module
import { getClientId } from '../../../../../sharedUtils/getClientId'
// @ts-expect-error Types are not defined for this module
import { prepKeysForCmr } from '../../../../../sharedUtils/prepKeysForCmr'

import type {
  CmrHeaders,
  CollectionRequestParams,
  RequestParams
} from '../../types/sharedTypes'

/**
 * Parent class for the application API layer to communicate with external services
 */
export default class CmrRequest extends Request {
  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys(): string[] {
    return []
  }

  /**
   * Defines the default array keys that should exclude their index when stringified.
   * @return { Array } An empty array
   */
  nonIndexedKeys(): string[] {
    return []
  }

  /**
   * Filter out any unwanted or non-permitted data
   * @param {Objet} data - An object representing an HTTP request payload
   */
  filterData(data: RequestParams) {
    if (data) {
      // Converts javascript compliant keys to snake cased keys for use
      // in URLs and request payloads
      const snakeKeyData = snakeCaseKeys(data, {
        exclude: [
          /edsc\.extra\.serverless/
        ]
      })

      return pick(snakeKeyData, this.permittedCmrKeys()) as RequestParams
    }

    return data
  }

  /**
   * Transforms data before sending it as a payload to an HTTP endpoint
   * @param {Object} data - An object representing an HTTP request payload
   */
  transformData(data: RequestParams) {
    const dataCopy = { ...data } as CollectionRequestParams

    // Shapefiles need to be handled differently
    const { shapefile } = dataCopy
    delete dataCopy.shapefile

    // Convert the data to a query string suitable for CMR
    const queryString = prepKeysForCmr(
      super.transformData(dataCopy),
      this.nonIndexedKeys()
    )

    const queryStringParts: string[] = queryString.split('&')

    const formData = new FormData()

    // Add each part of the query string to the form data
    queryStringParts.forEach((part) => {
      const [key, value] = part.split('=')

      formData.append(key, decodeURIComponent(value))
    })

    // Add the shapefile to the form data if it exists
    if (shapefile) {
      // Remove EDSC specific properties from each feature in the shapefile
      const filteredShapefile = { ...shapefile } as FeatureCollection
      filteredShapefile.features = filteredShapefile.features.map((feature) => ({
        ...feature,
        properties: {}
      }))

      // Convert the GeoJSON to a Blob to append to the FormData as a file
      const geojsonBlob = new Blob(
        [JSON.stringify(filteredShapefile)],
        { type: 'application/geo+json' }
      )

      formData.append('shapefile', geojsonBlob, 'shapefile.geojson')
    }

    return formData
  }

  /**
   * Modifies the payload just before the request is sent.
   * @param {Object} data - An object representing an HTTP request payload.
   * @return {Object} A modified object.
   */
  transformRequest(data: RequestParams, headers: CmrHeaders) {
    // If this request is not going to lambda, add headers that lambda would add for us
    if (
      !this.authenticated
      && !this.optionallyAuthenticated
      && !this.lambda
    ) {
      // Lambda will set this for us, if we're not using lambda
      // we'll set it to ensure its provided to CMR
      // eslint-disable-next-line no-param-reassign
      headers['CMR-Request-Id'] = this.requestId

      // Add the Client-Id header for requests directly to CMR
      // eslint-disable-next-line no-param-reassign
      headers['Client-Id'] = getClientId().client
    }

    return super.transformRequest(data, headers)
  }
}
