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

  const collectionUrl = `${getEarthdataConfig(earthdataEnvironment).cmrHost}/search/concepts/${conceptId}.json`

  try {
    const response = await axios.get(collectionUrl, {
      headers
    })

    const {
      data: responseData,
      errors
    } = response

    if (errors) {
      // On failure throw an exception
      const [firstError] = errors

      throw new Error(firstError)
    }

    return responseData
  } catch (error) {
    console.log(`Error fetching concept ${conceptId} - ${error.toString()}`)

    return error.toString()
  }
}
