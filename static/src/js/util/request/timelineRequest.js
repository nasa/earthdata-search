import CmrRequest from './cmr'
import LambdaRequest from './lambda'
import Request from './request'

/**
 * Base Request object for timeline specific requests
 */
class BaseTimelineRequest extends Request {
  permittedCmrKeys() {
    return [
      'echo_collection_id',
      'end_date',
      'interval',
      'start_date'
    ]
  }
}

/**
 * AuthTokenenticated Request object for collection specific requests
 */
class AuthTokenenticatedTimelineRequest extends LambdaRequest {
  constructor(authToken) {
    super()

    this.authToken = authToken
  }

  permittedCmrKeys = BaseTimelineRequest.prototype.permittedCmrKeys

  /*
   * Makes a POST request to Lambda
   */
  search(params) {
    return super.post('granules/timeline', params)
  }
}

/**
 * UnauthTokenenticated Request object for collection specific requests
 */
class UnauthTokenenticatedTimelineRequest extends CmrRequest {
  permittedCmrKeys = BaseTimelineRequest.prototype.permittedCmrKeys

  /*
   * Makes a POST request to CMR
   */
  search(params) {
    return super.post('search/granules/timeline.json', params)
  }
}

/**
 * Request object for collection specific requests
 */
export default class TimelineRequest {
  constructor(authToken) {
    if (authToken) return new AuthTokenenticatedTimelineRequest(authToken)
    return new UnauthTokenenticatedTimelineRequest()
  }
}
