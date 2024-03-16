import axios from 'axios'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
import { determineEarthdataEnvironment } from '../../../util/determineEarthdataEnvironment'
import { getSystemToken } from '../../../util/urs/getSystemToken'
import { requestTimeout } from '../../../util/requestTimeout'

/**
 * Retrieve the CMR metadata for the provided concept id
 * @param {String} conceptId A collection or granule concept-id
 * @returns {JSON} The collection metadata associated with the provided concept id
 */
export const fetchCmrConcept = async (conceptId) => {
  const headers = {}
  const earthdataEnvironment = determineEarthdataEnvironment()

  if (!process.env.IS_OFFLINE) {
    const cmrToken = await getSystemToken()
    headers.Authorization = `${cmrToken}`
  }

  const conceptUrl = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/search/concepts/${conceptId}.json`
  try {
    const response = await axios({
      url: conceptUrl,
      method: 'get',
      headers,
      timeout: requestTimeout()
    })

    const {
      data: responseData
    } = response

    return responseData
  } catch (error) {
    const { response } = error
    const { data: errorMessage } = response
    console.log(`Error fetching concept ${conceptId} - ${JSON.stringify(errorMessage)}`)

    return errorMessage
  }
}
