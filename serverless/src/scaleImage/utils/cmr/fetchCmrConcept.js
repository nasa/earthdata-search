import axios from 'axios'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { determineEarthdataEnvironment } from '../../../util/determineEarthdataEnvironment'

/**
 * Retrieve the CMR metadata for the provided concept id
 * @param {String} conceptId A collection or granule concept-id
 * @returns {JSON} The collection metadata associated with the provided concept id
 */
export const fetchCmrConcept = async (conceptId) => {
  const headers = {}

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const conceptUrl = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/search/concepts/${conceptId}.json`

  try {
    const response = await axios({
      url: conceptUrl,
      method: 'get',
      headers
    })

    const {
      data: responseData
    } = response

    return responseData
  } catch (error) {
    const { response } = error
    const { data: errorMessage } = response
    console.log(`Error fetching concept ${conceptId} - ${errorMessage}`)

    return errorMessage
  }
}
