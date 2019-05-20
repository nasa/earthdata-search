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
 * Authenticated Request object for collection specific requests
 */
class AuthenticatedTimelineRequest extends LambdaRequest {
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
 * Unauthenticated Request object for collection specific requests
 */
class UnauthenticatedTimelineRequest extends CmrRequest {
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
    if (authToken) return new AuthenticatedTimelineRequest(authToken)
    return new UnauthenticatedTimelineRequest()
  }
}
