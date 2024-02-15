import axios from 'axios'
import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

/**
 * Given a concept id, fetch the metadata for granules
 * @param {String} conceptId A collection concept id to return granules for
 * @returns {JSON} the collection associated with the supplied id
 */
export const fetchCmrCollectionGranules = async (conceptId) => {
  const earthdataEnvironment = deployedEnvironment()

  const { cmrHost } = getEarthdataConfig(earthdataEnvironment)

  const granuleLocation = `${cmrHost}/search/granules.json?collection_concept_id=${conceptId}`
  try {
    const response = await axios({
      url: granuleLocation,
      method: 'get'
    })
    const { data } = response
    const { feed } = data
    const { entry } = feed

    return entry
  } catch (error) {
    const { response } = error
    const { data: errorMessage } = response
    console.log(`Error fetching granules from cmr to set a thumbnail ${errorMessage}`)

    return errorMessage
  }
}
