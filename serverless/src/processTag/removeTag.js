import axios from 'axios'

import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Removes a tag association from any collections meeting the provided search criteria
 * @param {String} tagName The name of the tag to remove
 * @param {Object} searchCriteria Criteria used to search for collections in JQL
 * @return {Object} An object representing the CMR tag association response
 */
export const removeTag = async (tagName, searchCriteria, cmrToken) => {
  const tagRemovalUrl = `${getEarthdataConfig(deployedEnvironment()).cmrHost}/search/tags/${tagName}/associations/by_query`

  try {
    await axios({
      method: 'delete',
      url: tagRemovalUrl,
      headers: {
        'Client-Id': getClientId().background,
        Authorization: `Bearer ${cmrToken}`
      },
      data: searchCriteria
    })
  } catch (e) {
    parseError(e)

    return false
  }

  return true
}
