import axios from 'axios'
import Request from './request'

import {
  getEnvironmentConfig,
  getEarthdataConfig
} from '../../../../../sharedUtils/config'
import { getClientId } from '../../../../../sharedUtils/getClientId'

export default class GraphQlRequest extends Request {
  constructor(authToken, earthdataEnvironment) {
    if (authToken && authToken !== '') {
      super(getEnvironmentConfig().apiHost, earthdataEnvironment)

      this.authenticated = true
      this.authToken = authToken
      this.searchPath = 'graphql'
    } else {
      super(getEarthdataConfig(earthdataEnvironment).graphQlHost, earthdataEnvironment)

      this.searchPath = 'api'
    }
  }

  /**
   * Modifies the payload just before the request is sent.
   * @param {Object} data - An object containing any keys.
   * @return {Object} A modified object.
   */
  transformRequest(data, headers) {
    if (
      this.earthdataEnvironment
      && (this.authenticated || this.optionallyAuthenticated || this.lambda)
    ) {
      // eslint-disable-next-line no-param-reassign
      headers['Earthdata-ENV'] = this.earthdataEnvironment
    }

    if (this.authenticated || this.optionallyAuthenticated) {
      // eslint-disable-next-line no-param-reassign
      headers.Authorization = `Bearer ${this.getAuthToken()}`
    }

    // If contacting GraphQL directly, add the content type
    if (!this.authenticated && !this.optionallyAuthenticated && !this.lambda) {
      // eslint-disable-next-line no-param-reassign
      headers['Content-Type'] = 'application/json'
    }

    if (data) {
      // POST requests to Lambda use a JSON string
      if (this.authenticated || this.lambda) {
        return JSON.stringify({
          requestId: this.requestId,
          data
        })
      }

      // Lambda will set this for us, if we're not using lambda
      // we'll set it to ensure its provided to CMR
      // eslint-disable-next-line no-param-reassign
      headers['X-Request-Id'] = this.requestId

      // Add the Client-Id header for requests directly to CMR
      // eslint-disable-next-line no-param-reassign
      headers['Client-Id'] = getClientId().client

      return JSON.stringify(data)
    }

    return null
  }

  search(query, variables, format = undefined) {
    this.startTimer()
    this.setFullUrl(this.searchPath)
    this.generateRequestId()

    return axios({
      method: 'post',
      baseURL: this.baseUrl,
      url: this.searchPath,
      data: {
        query,
        variables,
        format
      },
      transformRequest: [
        (data, headers) => this.transformRequest(data, headers)
      ],
      transformResponse: axios.defaults.transformResponse.concat(
        (data, headers) => this.transformResponse(data, headers)
      ),
      cancelToken: this.cancelToken.token
    })
  }
}
