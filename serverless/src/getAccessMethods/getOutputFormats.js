import request from 'request-promise'

import { getEarthdataConfig, getClientId, getApplicationConfig } from '../../../sharedUtils/config'
import cmrEnv from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'

/**
 * Returns the SupportedOutputFormats field from a UMM-S record
 * @param {String} serviceId UMM-S concept id to retrieve
 * @param {String} jwtToken
 */
export const getOutputFormats = async (serviceId, jwtToken) => {
  const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/concepts/${serviceId}`

  try {
    const response = await request.get({
      uri: url,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': await getEchoToken(jwtToken),
        Accept: `application/vnd.nasa.cmr.umm_results+json; version=${getApplicationConfig().ummServiceVersion}`
      },
      resolveWithFullResponse: true
    })

    const { body } = response

    const { ServiceOptions: serviceOptions } = JSON.parse(body)
    const { SupportedOutputFormats: supportedOutputFormats } = serviceOptions

    return { supportedOutputFormats }
  } catch (error) {
    console.log(error)
  }

  return null
}
