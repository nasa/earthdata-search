import Request from './request'

/**
 * Request object for timeline specific requests
 */
export default class TimelineRequest extends Request {
  constructor(authToken) {
    if (authToken && authToken !== '') {
      super('http://localhost:3001')

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'granules/timeline'
    } else {
      super('https://cmr.earthdata.nasa.gov')

      this.searchPath = 'search/granules/timeline.json'
    }
  }

  permittedCmrKeys() {
    return [
      'echo_collection_id',
      'end_date',
      'interval',
      'start_date'
    ]
  }
}
