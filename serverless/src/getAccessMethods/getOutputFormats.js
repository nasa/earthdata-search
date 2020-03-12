import request from 'request-promise'

import { getEarthdataConfig, getClientId } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { getUmmServiceVersionHeader } from '../../../sharedUtils/ummVersionHeader'
import { parseError } from '../util/parseError'

/**
 * Returns the SupportedOutputFormats field from a UMM-S record
 * @param {String} serviceId UMM-S concept id to retrieve
 * @param {String} jwtToken
 */
export const getOutputFormats = async (serviceId, jwtToken) => {
  const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/concepts/${serviceId}.umm_json`

  try {
    const response = await request.get({
      uri: url,
      headers: {
        'Client-Id': getClientId().lambda,
        'Echo-Token': await getEchoToken(jwtToken),
        Accept: getUmmServiceVersionHeader()
      },
      json: true,
      resolveWithFullResponse: true
    })

    const { body } = response

    const { ServiceOptions: serviceOptions } = body
    const { SupportedOutputFormats: supportedOutputFormats } = serviceOptions

    return { supportedOutputFormats }
  } catch (e) {
    parseError(e)
  }

  return null
}
