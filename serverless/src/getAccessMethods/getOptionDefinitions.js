import request from 'request-promise'
import 'array-foreach-async'

import {
  getEarthdataConfig,
  getSecretEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { generateFormDigest } from '../util/generateFormDigest'
import { getVerifiedJwtToken } from '../util/getVerifiedJwtToken'

export const getOptionDefinitions = async (optionDefinitions, jwtToken) => {
  const forms = []

  await optionDefinitions.forEachAsync(async (optionDefinition, index) => {
    const { id: guid } = optionDefinition

    const url = `${getEarthdataConfig('prod').cmrHost}/legacy-services/rest/option_definitions/${guid}.json`

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
