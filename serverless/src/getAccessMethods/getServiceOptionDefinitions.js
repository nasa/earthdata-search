import request from 'request-promise'
import 'array-foreach-async'

import {
  getEarthdataConfig,
  getClientId
} from '../../../sharedUtils/config'
import { generateFormDigest } from '../util/generateFormDigest'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { getEchoToken } from '../util/urs/getEchoToken'

export const getServiceOptionDefinitions = async (
  collectionProvider,
  serviceOptionDefinitions,
  jwtToken
) => {
  const forms = []

  const { provider } = collectionProvider
  const { id: providerId, organization_name: organizationName } = provider

  await serviceOptionDefinitions.forEachAsync(async (serviceOptionDefinition, index) => {
    const { name } = serviceOptionDefinition

    const url = `${getEarthdataConfig(cmrEnv()).cmrHost}/legacy-services/rest/service_option_definitions.json`

    try {
      const response = await request.get({
        time: true,
        uri: url,
        qs: {
          name,
          provider_guid: providerId
        },
        headers: {
          'Client-Id': getClientId().lambda,
          'Echo-Token': await getEchoToken(jwtToken)
        },
        resolveWithFullResponse: true
      })

      console.log(`Took ${response.elapsedTime / 1000}s to retrieve service option '${name}' for ${organizationName}`)

      const { body } = response
      const [firstServiceOptionDefinition] = JSON.parse(body)
      const {
        service_option_definition: responseServiceOptionDefinition
      } = firstServiceOptionDefinition
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
