import request from 'request-promise'
import { getEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Removes a tag association from any collections meeting the provided search criteria
 * @param {String} tagName The name of the tag to remove
 * @param {Object} searchCriteria Criteria used to search for collections in JQL
 * @return {Object} An object representing the CMR tag association response
 */
export async function removeTag(tagName, searchCriteria, cmrToken) {
  const tagRemovalUrl = `${getEarthdataConfig('prod').cmrHost}/search/tags/${tagName}/associations/by_query`

  const tagRemovalResponse = await request.delete({
    uri: tagRemovalUrl,
    headers: {
      'Echo-Token': cmrToken
    },
    body: searchCriteria,
    resolveWithFullResponse: true
  })

  return tagRemovalResponse
}

export default removeTag
