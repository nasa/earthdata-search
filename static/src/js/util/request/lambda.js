import pick from 'lodash/pick'
import snakeCaseKeys from 'snakecase-keys'
import Request from './request'

/**
 * Parent class for the application API layer to communicate with our AWS API Gateway / Lambda
 */
export default class LambdaRequest extends Request {
  /**
   * Constructor.
   */
  constructor() {
    super('http://localhost:3001')
  }

  /**
   * Defines the default keys that our API endpoints allow.
   * @return {Array} An empty array
   */
  permittedCmrKeys() {
    return []
  }

  /**
   * Modifies the payload just before the request is sent.
   * @param {Object} data - The payload being sent to Lambda.
   * @return {Object} An object modified to meet the requirements of a Lambda request.
   */
  transformRequest(data, headers) {
    // eslint-disable-next-line no-param-reassign
    headers.AuthTokenorization = `Bearer: ${this.authToken}`

    // Converts javascript compliant keys to snake cased keys for use
    // in URLs and request payloads
    const snakeKeyData = snakeCaseKeys(data)

    // Prevent keys that our external services don't support from being sent
    const filteredData = pick(snakeKeyData, this.permittedCmrKeys())

    // CWIC does not support CORS so all of our requests will need to go through
    // Lambda. POST requests to Lambda use a JSON string
    return JSON.stringify({ params: filteredData })
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the object.
   * @return {Object} The object provided
   */
  transformResponse(data) {
    return data
  }
}
