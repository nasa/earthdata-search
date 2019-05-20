import CmrRequest from './cmr'
import LambdaRequest from './lambda'
import Request from './request'

import { getTemporal } from '../edsc-date'

/**
 * Request object for granule specific requests
 */
class BaseGranuleRequest extends Request {
  permittedCmrKeys() {
    return [
      'bounding_box',
      'echo_collection_id',
      'page_num',
      'page_size',
      'point',
      'polygon',
      'sort_key'
    ]
  }

  nonIndexedKeys() {
    return [
      'sort_key'
    ]
  }

  transformResponse(data) {
    const { feed = {} } = data
    const { entry = [] } = feed

    entry.map((granule) => {
      const updatedGranule = granule

      updatedGranule.is_cwic = false

      updatedGranule.formatted_temporal = getTemporal(granule.time_start, granule.time_end)

      const h = 85
      const w = 85

      if (granule.id) {
        // eslint-disable-next-line
        updatedGranule.thumbnail = `${this.baseUrl}/browse-scaler/browse_images/granules/${granule.id}?h=${h}&w=${w}`
      }

      return updatedGranule
    })

    return {
      feed: {
        entry
      }
    }
  }
}

/**
 * Authenticated Request object for collection specific requests
 */
class AuthenticatedGranuleRequest extends LambdaRequest {
  constructor(authToken) {
    super()

    this.authToken = authToken
  }

  permittedCmrKeys = BaseGranuleRequest.prototype.permittedCmrKeys

  nonIndexedKeys = BaseGranuleRequest.prototype.nonIndexedKeys

  transformResponse = BaseGranuleRequest.prototype.transformResponse

  /*
   * Makes a POST request to Lambda
   */
  search(params) {
    return super.post('granules', params)
  }
}

/**
 * Unauthenticated Request object for collection specific requests
 */
class UnauthenticatedGranuleRequest extends CmrRequest {
  permittedCmrKeys = BaseGranuleRequest.prototype.permittedCmrKeys

  nonIndexedKeys = BaseGranuleRequest.prototype.nonIndexedKeys

  transformResponse = BaseGranuleRequest.prototype.transformResponse

  /*
   * Makes a POST request to CMR
   */
  search(params) {
    return super.post('search/granules.json', params)
  }
}

/**
 * Request object for collection specific requests
 */
export default class GranuleRequest {
  constructor(authToken) {
    if (authToken) return new AuthenticatedGranuleRequest(authToken)
    return new UnauthenticatedGranuleRequest()
  }
}
