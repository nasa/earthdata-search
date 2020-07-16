import request from 'request-promise'
import 'array-foreach-async'

import { getEarthdataConfig } from '../../../sharedUtils/config'
import { generateFormDigest } from '../util/generateFormDigest'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'
import { parseError } from '../../../sharedUtils/parseError'
import { getClientId } from '../../../sharedUtils/getClientId'

export const getOptionDefinitions = async (
  collectionProvider,
  optionDefinitions,
  jwtToken
) => {
  const forms = []

  const { provider } = collectionProvider
  const { id: providerId, organization_name: organizationName } = provider

  await optionDefinitions.forEachAsync(async (optionDefinition, index) => {
    const { name } = optionDefinition

    const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/legacy-services/rest/option_definitions.json`

    try {
      const response = await request.get({
        time: true,
        uri: url,
        qs: {
          name,
          provider: providerId
        },
        headers: {
          'Client-Id': getClientId().lambda,
          'Echo-Token': await getEchoToken(jwtToken)
        },
        json: true,
        resolveWithFullResponse: true
      })

      console.log(`Took ${response.elapsedTime / 1000}s to retrieve option definition '${name}' for ${organizationName}`)

      const { body } = response
      const [firstOptionDefinition] = body
      const {
        option_definition: responseOptionDefinition
      } = firstOptionDefinition
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
      parseError(e)
    }
  })

  return forms
}
