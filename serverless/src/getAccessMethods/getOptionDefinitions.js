import request from 'request-promise'
import 'array-foreach-async'

import {
  getEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { generateFormDigest } from '../util/generateFormDigest'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'
import { getEdlConfig } from '../configUtil'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'

export const getOptionDefinitions = async (optionDefinitions, jwtToken) => {
  const forms = []

  await optionDefinitions.forEachAsync(async (optionDefinition, index) => {
    const { id: guid } = optionDefinition

    const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/legacy-services/rest/option_definitions/${guid}.json`

    const { token } = getVerifiedJwtToken(jwtToken)
    const { access_token: accessToken } = token

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
      const { option_definition: responseOptionDefinition } = JSON.parse(body)
      const { form } = responseOptionDefinition

      forms.push({
        [`echoOrder${index}`]: {
          option_definition: {
            ...optionDefinition
          },
          option_definitions: undefined,
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
