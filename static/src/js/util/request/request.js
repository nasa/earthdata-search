import axios from 'axios'

/**
 * Parent class for the application API layer to communicate with external services
 */
export default class Request {
  constructor(baseUrl) {
    if (!baseUrl) {
      throw new Error('A baseUrl must be provided.')
    }

    this.baseUrl = baseUrl
  }

  /**
   * Modifies the payload just before the request is sent.
   * @param {Object} data - An object containing any keys.
   * @return {Object} A modified object.
   */
  transformRequest(data) {
    return data
  }

  /**
   * Transform the response before completing the Promise.
   * @param {Object} data - Response object from the request.
   * @return {Object} The transformed response.
   */
  transformResponse(data) {
    return data
  }

  /**
   * Makes a POST request to the provided URL.
   * @param {String} url - URL to send the provided data to.
   * @param {Object} data - Data to be sent with the request.
   * @return {Promise} A Promise object representing the reques that was made
   */
  post(url, data) {
    return axios({
      method: 'post',
      baseURL: this.baseUrl,
      url,
      data,
      transformRequest: [
        (data, headers) => this.transformRequest(data, headers)
      ],
      transformResponse: axios.defaults.transformResponse.concat(
        (data, headers) => this.transformResponse(data, headers)
      )
    })
  }
}
