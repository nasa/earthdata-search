import request from 'request-promise'
import 'array-foreach-async'

import {
  getEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { generateFormDigest } from '../util/generateFormDigest'
import { getEdlConfig } from '../util/configUtil'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getAccessTokenFromJwtToken } from '../util/urs/getAccessTokenFromJwtToken'

export const getServiceOptionDefinitions = async (serviceOptionDefinitions, jwtToken) => {
  const forms = []

  await serviceOptionDefinitions.forEachAsync(async (serviceOptionDefinition, index) => {
    const { id: guid } = serviceOptionDefinition

    const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/legacy-services/rest/service_option_definitions/${guid}.json`

    const { access_token: accessToken } = await getAccessTokenFromJwtToken(jwtToken)

    // The client id is part of our Earthdata Login credentials
    const edlConfig = await getEdlConfig()
    const { client } = edlConfig
    const { id: clientId } = client

    try {
      const response = await request.get({
        uri: url,
        resolveWithFullResponse: true,
        headers: {
          'Client-Id': getClientId().lambda,
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
