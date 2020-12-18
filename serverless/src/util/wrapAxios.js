/* eslint-disable no-param-reassign */

/**
 * Adds interceptors to a provided axios module for use in Lambda
 * @param {Module} axiosModule The imported axios module
 */
export const wrapAxios = (axiosModule) => {
  // Add the timing object and request start time during the request
  axiosModule.interceptors.request.use((module) => {
    module.timing = {}
    module.timing.requestStartedAt = new Date().getTime()

    return module
  })

  // Add the request end time and elapsedTime during the response
  axiosModule.interceptors.response.use((module) => {
    module.config.timing.requestEndedAt = new Date().getTime()

    const { config = {} } = module
    const { timing = {} } = config
    const { requestEndedAt, requestStartedAt } = timing

    module.config.elapsedTime = requestEndedAt - requestStartedAt

    return module
  })

  // Return the module with the interceptors applied
  return axiosModule
}
