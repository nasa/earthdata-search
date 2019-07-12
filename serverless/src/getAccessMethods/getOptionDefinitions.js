import request from 'request-promise'
import jwt from 'jsonwebtoken'
import 'array-foreach-async'

import {
  getEarthdataConfig,
  getSecretEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'

export const getOptionDefinitions = async (optionDefinitions, jwtToken) => {
  const forms = []

  await optionDefinitions.forEachAsync(async (optionDefinition, index) => {
    const { id: guid } = optionDefinition

    const url = `${getEarthdataConfig('prod').cmrHost}/legacy-services/rest/option_definitions/${guid}.json`

    // Get the access token and clientId to build the Echo-Token header
    const { clientId, secret } = getSecretEarthdataConfig('prod')

    const verifiedJwtToken = jwt.verify(jwtToken, secret)
    const { token } = verifiedJwtToken
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

      // TODO figure out if we really need to save the option_definition data in the access method
      forms.push({
        [`echoOrder${index}`]: {
          option_definition: {
            ...optionDefinition
          },
          option_definitions: undefined,
          form
        }
      })
    } catch (e) {
      console.log('error', e)
    }
  })
  return forms
}
