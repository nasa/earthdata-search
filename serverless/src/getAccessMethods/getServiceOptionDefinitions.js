import request from 'request-promise'
import 'array-foreach-async'

import {
  getEarthdataConfig,
  getSecretEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { generateFormDigest } from '../util/generateFormDigest'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'

export const getServiceOptionDefinitions = async (serviceOptionDefinitions, jwtToken) => {
  const forms = []

  await serviceOptionDefinitions.forEachAsync(async (serviceOptionDefinition, index) => {
    const { id: guid } = serviceOptionDefinition

    const url = `${getEarthdataConfig('prod').cmrHost}/legacy-services/rest/service_option_definitions/${guid}.json`

    // Get the access token and clientId to build the Echo-Token header
    const { clientId } = getSecretEarthdataConfig('prod')

    const { token } = getVerifiedJwtToken(jwtToken)
    const { access_token: accessToken } = token

    try {
      const response = await request.get({
        uri: url,
        resolveWithFullResponse: true,
        headers: {
          'Client-Id': getClientId('prod').lambda,
          'Echo-Token': `${accessToken}:${clientId}`
        }
      })

      const { body } = response
      const { service_option_definition: responseServiceOptionDefinition } = JSON.parse(body)
      const { form } = responseServiceOptionDefinition

      forms.push({
        [`esi${index}`]: {
          service_option_definition: {
            ...serviceOptionDefinition
          },
          service_option_definitions: undefined,
          form,
          form_digest: generateFormDigest(form)
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  })
  return forms
}
