import axios from 'axios'
import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'
// Import { getSystemToken } from '../../../util/urs/getSystemToken'
import { requestTimeout } from '../../../util/requestTimeout'

/**
 * Given a concept id, fetch the metadata for granules
 * @param {String} collectionConceptId A collection concept id to return granules for
 * @returns {JSON} the collection associated with the supplied id
 */
export const fetchCmrCollectionGranules = async (collectionConceptId) => {
  const headers = {}
  const earthdataEnvironment = deployedEnvironment()

  // If (!process.env.IS_OFFLINE) {
  //   const cmrToken = await getSystemToken()
  //   headers.Authorization = `${cmrToken}`
  // }

  const { cmrHost } = getEarthdataConfig(earthdataEnvironment)

  const granuleLocation = `${cmrHost}/search/granules.json?collection_concept_id=${collectionConceptId}`
  try {
    const response = await axios({
      url: granuleLocation,
      method: 'get',
      headers,
      timeout: requestTimeout()
    })
    const { data } = response
    const { feed } = data
    const { entry } = feed

    return entry
  } catch (error) {
    const { response } = error
    const { data: errorMessage } = response
    console.log(`Error fetching granules from collection ${collectionConceptId} to set a thumbnail ${JSON.stringify(errorMessage)}`)

    return errorMessage
  }
}
