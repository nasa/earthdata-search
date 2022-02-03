import axios from 'axios'

import { castArray, isEmpty } from 'lodash'
import { stringify } from 'qs'

import { deployedEnvironment } from '../../../sharedUtils/deployedEnvironment'
import { getClientId } from '../../../sharedUtils/getClientId'
import { getEarthdataConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Adds a tag association to any collections meeting the provided search criteria
 * @param {String} tagName The tag name to associate with collections
 * @param {Object} tagData Data to store on the association object
 * @param {Object} searchCriteria Criteria used to search for collections in JQL
 * @param {Boolean} requireGranules Whether or not to include collections without granules
 * @param {Boolean} append If tag data already exists, should the provided data be appended or not
 */
export const addTag = async ({
  tagName,
  tagData,
  searchCriteria,
  requireGranules,
  append,
  cmrToken
}) => {
  let associationData = null

  // Avoid querying CMR if we were already able to generate the appropriate
  // payload by checking for searchCriteria.
  if (!isEmpty(searchCriteria) && (tagData || requireGranules)) {
    const cmrParams = {
      include_tags: tagName,
      include_has_granules: true
    }

    if (requireGranules) {
      cmrParams.has_granules = true
    }

    let collections = []

    try {
      const collectionJsonResponse = await axios({
        method: 'post',
        url: `${getEarthdataConfig(deployedEnvironment()).cmrHost}/search/collections.json?${stringify(cmrParams)}`,
        headers: {
          'Client-Id': getClientId().background,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Echo-Token': cmrToken
        },
        data: searchCriteria
      })

      const { data = {} } = collectionJsonResponse
      const { feed = {} } = data
      const { entry = [] } = feed

      collections = entry
    } catch (e) {
      parseError(e, { reThrowError: true })
    }

    // If collections were returned from the search, examine their metadata and
    // construct appropriate tag data to be assigned to them
    if (!collections.length) return false

    // If `append` is true, the tagData provided will be appended to previous tag data
    // already assigned to the provided collections
    if (append) {
      associationData = collections.map((collection) => {
        const { tags = {} } = collection
        const { [tagName]: tagBody = {} } = tags
        const { data = [] } = tagBody

        const collectionTagData = [].concat(data)

        // If the product already exists in the collections tag data
        // overwrite it with the newer data otherwise append it
        const existingTagDataIndex = data.findIndex((data) => data.product === tagData.product)
        if (existingTagDataIndex !== -1) {
          collectionTagData[existingTagDataIndex] = tagData
        } else {
          collectionTagData.push(tagData)
        }

        return { 'concept-id': collection.id, data: collectionTagData }
      })
    } else if (tagData) {
      const collectionTagData = [].concat(tagData)

      associationData = collections.map((collection) => ({ 'concept-id': collection.id, data: collectionTagData }))
    } else {
      associationData = collections.map((collection) => ({ 'concept-id': collection.id }))
    }
  } else {
    associationData = tagData
  }

  // After setting associationData ensure that it has content, if no content
  if (associationData) {
    try {
      const addTagUrl = `${getEarthdataConfig(deployedEnvironment()).cmrHost}/search/tags/${tagName}/associations`
      const taggingResponse = await axios({
        method: 'post',
        url: addTagUrl,
        headers: {
          'Client-Id': getClientId().background,
          'Echo-Token': cmrToken
        },
        data: castArray(associationData)
      })

      const { data = [] } = taggingResponse

      Array.from(data).forEach((tagResponse) => {
        const { errors = [] } = tagResponse

        // Log each (potential) error
        errors.forEach((error) => console.log(error))
      })
    } catch (e) {
      parseError(e, { reThrowError: true })
    }

    return associationData
  }

  try {
    // If no tagData was provided, and granules are not required we dont need to ask CMR
    // for anything, so we'll just associate the tag with all collections that match the searchCriteria
    const tagRemovalUrl = `${getEarthdataConfig(deployedEnvironment()).cmrHost}/search/tags/${tagName}/associations/by_query`

    await axios({
      method: 'post',
      url: tagRemovalUrl,
      headers: {
        'Client-Id': getClientId().background,
        'Echo-Token': cmrToken
      },
      data: searchCriteria
    })
  } catch (e) {
    parseError(e, { reThrowError: true })
  }

  return true
}
