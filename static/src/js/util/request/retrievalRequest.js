import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class RetrievalRequest extends Request {
  constructor(authToken) {
    super(getEnvironmentConfig().apiHost)
    this.authenticated = true
    this.authToken = authToken
  }

  permittedCmrKeys() {
    return [
      'collections',
      'environment',
      'json_data'
    ]
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the object.
   * @return {Object} The object provided
   */
  transformResponse(data) {
    super.transformResponse(data)

    // If the response status code is not 200, return unaltered data
    // If the status code is 200, it doesn't exist in the response
    const { statusCode = 200 } = data
    if (statusCode !== 200) return data

    if (!data || Object.keys(data).length === 0) return data

    const transformedResponse = data

    const { collections = {} } = data
    const { byId = {} } = collections

    const collectionIds = Object.keys(byId)

    if (collectionIds.length > 0) {
      collectionIds.forEach((id) => {
        transformedResponse.collections.byId[id] = {
          ...transformedResponse.collections.byId[id],
          isLoading: false,
          isLoaded: true
        }
      })
    }

    return transformedResponse
  }

  all() {
    return this.get('retrievals')
  }

  remove(id) {
    return this.delete(`retrievals/${id}`)
  }

  fetch(id) {
    return this.get(`retrievals/${id}`)
  }

  submit(params) {
    return this.post('retrievals', params)
  }
}
