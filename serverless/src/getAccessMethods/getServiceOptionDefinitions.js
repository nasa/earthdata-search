import 'array-foreach-async'

import axios from 'axios'

import { getEarthdataConfig } from '../../../sharedUtils/config'
import { generateFormDigest } from '../util/generateFormDigest'
import { getEchoToken } from '../util/urs/getEchoToken'
import { parseError } from '../../../sharedUtils/parseError'
import { getClientId } from '../../../sharedUtils/getClientId'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

export const getServiceOptionDefinitions = async (
  collectionProvider,
  serviceOptionDefinitions,
  jwtToken,
  earthdataEnvironment
) => {
  const forms = []

  const { provider } = collectionProvider
  const { id: providerId, organization_name: organizationName } = provider

  const accessToken = await getEchoToken(jwtToken, earthdataEnvironment)

  await serviceOptionDefinitions.forEachAsync(async (serviceOptionDefinition, index) => {
    const { name } = serviceOptionDefinition

    const url = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/legacy-services/rest/service_option_definitions.json`

    try {
      const response = await wrappedAxios({
        method: 'get',
        url,
        params: {
          name,
          provider_guid: providerId
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': getClientId().lambda
        }
      })

      const { config } = response
      const { elapsedTime } = config

      console.log(`Took ${elapsedTime / 1000}s to retrieve service option '${name}' for ${organizationName}`)

      const { data } = response
      const [firstServiceOptionDefinition] = data
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
      parseError(e)
    }
  })

  return forms
}
