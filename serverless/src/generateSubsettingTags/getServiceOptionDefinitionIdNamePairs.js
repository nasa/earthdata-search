import 'array-foreach-async'
import request from 'request-promise'
import { stringify } from 'qs'
import { chunkArray } from '../util/chunkArray'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { cmrEnv } from '../../../sharedUtils/cmrEnv'
import { parseError } from '../../../sharedUtils/parseError'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Retrieve service option definition records
 * @param {Array} serviceOptionIds Array of service option ids
 */
export const getServiceOptionDefinitionIdNamePairs = async (cmrToken, serviceOptionIds) => {
  // TODO: Consider consalidating this and the lambda that retrieves a single record
  const { echoRestRoot } = getEarthdataConfig(cmrEnv())

  // This is a get request so we need to consider URL length
  const chunkedServiceOptionIds = chunkArray(serviceOptionIds, 50)

  const serviceOptionIdNamePairs = {}

  await chunkedServiceOptionIds.forEachAsync(async (serviceOptionIdChunk) => {
    const serviceOptionDefinitionUrl = `${echoRestRoot}/service_option_definitions.json`

    // Construct a query param string from the chunk of ids
    const serviceOptionQueryParams = stringify({
      id: serviceOptionIdChunk
    }, { indices: false, arrayFormat: 'brackets' })

    try {
      // Request the service option definitions from legacy services
      const serviceOptionDefinitionResponse = await request.get({
        uri: `${serviceOptionDefinitionUrl}?${serviceOptionQueryParams}`,
        headers: {
          'Client-Id': getClientId().background,
          'Echo-Client': cmrToken
        },
        json: true,
        resolveWithFullResponse: true
      })

      // Iterate through the option definitions returned
      const serviceOptionDefinitionResponseBody = serviceOptionDefinitionResponse.body

      serviceOptionDefinitionResponseBody.forEach((serviceOptionObj) => {
        const { service_option_definition: serviceOptionDefinition } = serviceOptionObj
        const { id, name } = serviceOptionDefinition

        serviceOptionIdNamePairs[id] = name
      })
    } catch (e) {
      parseError(e)
    }
  })

  return serviceOptionIdNamePairs
}
