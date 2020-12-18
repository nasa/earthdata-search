import 'array-foreach-async'

import axios from 'axios'

import { generateFormDigest } from '../util/generateFormDigest'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { getEchoToken } from '../util/urs/getEchoToken'
import { parseError } from '../../../sharedUtils/parseError'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

export const getOptionDefinitions = async (
  collectionProvider,
  optionDefinitions,
  jwtToken,
  earthdataEnvironment
) => {
  const forms = []

  const { provider } = collectionProvider
  const { id: providerId, organization_name: organizationName } = provider

  const accessToken = await getEchoToken(jwtToken, earthdataEnvironment)

  await optionDefinitions.forEachAsync(async (optionDefinition, index) => {
    const { name } = optionDefinition

    const url = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/legacy-services/rest/option_definitions.json`

    try {
      const response = await wrappedAxios({
        method: 'get',
        url,
        params: {
          name,
          provider: providerId
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': getClientId().lambda
        }
      })

      const { config } = response
      const { elapsedTime } = config

      console.log(`Took ${elapsedTime / 1000}s to retrieve option definition '${name}' for ${organizationName}`)

      const { data } = response
      const [firstOptionDefinition] = data
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
