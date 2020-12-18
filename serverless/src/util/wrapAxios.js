/* eslint-disable no-param-reassign */

/**
 * Adds interceptors to a provided axios module for use in Lambda
 * @param {Module} axiosModule The imported axios module
 */
export const wrapAxios = (axiosModule) => {
  // Add the timing object and request start time during the request
  axiosModule.interceptors.request.use((x) => {
    x.timing = {}
    x.timing.requestStartedAt = new Date().getTime()

    return x
  })

  // Add the request end time and elapsedTime during the response
  axiosModule.interceptors.response.use((x) => {
    x.config.timing.requestEndedAt = new Date().getTime()

    x.config.elapsedTime = x.config.timing.requestEndedAt - x.config.timing.requestStartedAt

    return x
  })

  // Return the module with the interceptors applied
  return axiosModule
}
