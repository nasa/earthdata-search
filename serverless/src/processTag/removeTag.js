import request from 'request-promise'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'

/**
 * Removes a tag association from any collections meeting the provided search criteria
 * @param {String} tagName The name of the tag to remove
 * @param {Object} searchCriteria Criteria used to search for collections in JQL
 * @return {Object} An object representing the CMR tag association response
 */
export async function removeTag(tagName, searchCriteria, cmrToken) {
  const tagRemovalUrl = `${getEarthdataConfig(deployedEnvironment()).cmrHost}/search/tags/${tagName}/associations/by_query`

  try {
    await request.delete({
      uri: tagRemovalUrl,
      headers: {
        Authorization: `Bearer ${cmrToken}`,
        'Client-Id': getClientId().background
      },
      body: searchCriteria,
      json: true,
      resolveWithFullResponse: true
    })
  } catch (e) {
    console.log(e)

    return false
  }

  return true
}
