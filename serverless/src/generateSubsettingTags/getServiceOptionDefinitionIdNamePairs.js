import 'array-foreach-async'

import axios from 'axios'

import { stringify } from 'qs'

import { chunkArray } from '../util/chunkArray'
import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

/**
 * Retrieve service option definition records
 * @param {Array} serviceOptionIds Array of service option ids
 */
export const getServiceOptionDefinitionIdNamePairs = async (cmrToken, serviceOptionIds) => {
  // TODO: Consider consalidating this and the lambda that retrieves a single record
  const { echoRestRoot } = getEarthdataConfig(deployedEnvironment())

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
      const serviceOptionDefinitionResponse = await wrappedAxios({
        method: 'get',
        url: `${serviceOptionDefinitionUrl}?${serviceOptionQueryParams}`,
        headers: {
          'Client-Id': getClientId().background,
          Authorization: `Bearer ${cmrToken}`
        }
      })

      const { config, data } = serviceOptionDefinitionResponse
      const { elapsedTime } = config

      console.log(`Request for service options definition successfully completed in ${elapsedTime} ms`)

      // Iterate through the option definitions returned
      const serviceOptionDefinitionResponseBody = data

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
