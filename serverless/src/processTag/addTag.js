import request from 'request-promise'
import { getCollectionsByJson } from './getCollectionsByJson'
import { getEarthdataConfig } from '../../../sharedUtils/config'

/**
 * Adds a tag association to any collections meeting the provided search criteria
 * @param {String} tagName The tag name to associate with collections
 * @param {Object} tagData Data to store on the association object
 * @param {Object} searchCriteria Criteria used to search for collections in JQL
 * @param {Boolean} requireGranules Whether or not to include collections without granules
 * @param {Boolean} append If tag data already exists, should the provided data be appended or not
 * @return {Object} An object representing the CMR tag association response
 */
export async function addTag({
  tagName,
  tagData,
  searchCriteria,
  requireGranules,
  append,
  cmrToken
}) {
  let associationData = null

  // Avoid querying CMR if we were already able to generate the appropriate
  // payload by checking for searchCriteria.
  if (searchCriteria && (tagData || requireGranules)) {
    const cmrParams = {
      include_tags: tagName,
      include_has_granules: true
    }

    if (requireGranules) {
      cmrParams.has_granules = true
    }

    const collectionsResponse = await getCollectionsByJson(cmrParams, searchCriteria, cmrToken)

    const { entry: collections, errors } = collectionsResponse

    if (errors) {
      console.log(errors)

      return collectionsResponse
    }

    if (!collections.length) {
      return collectionsResponse
    }

    // GIBS specific functionality (at the moment) for appending data
    // to an existing tag for colormaps
    if (append) {
      associationData = collections.map((collection) => {
        const { tags = {} } = collection
        const { [tagName]: tagBody = {} } = tags
        const { data = [] } = tagBody

        const collectionTagData = [].concat(data)

        // If the product already exists in the collections tag data
        // overwrite it with the newer data
        const existingTagDataIndex = data.findIndex(data => data.product === tagData.product)
        if (existingTagDataIndex !== -1) {
          collectionTagData[existingTagDataIndex] = tagData
        } else {
          collectionTagData.push(tagData)
        }

        return { 'concept-id': collection.id, data: collectionTagData }
      })
    } else if (tagData) {
      const collectionTagData = [].concat(tagData)

      associationData = collections.map(collection => ({ 'concept-id': collection.id, data: collectionTagData }))
    } else {
      associationData = collections.map(collection => ({ 'concept-id': collection.id }))
    }
  } else {
    associationData = tagData
  }

  // After setting associationData ensure that it has content, if no content
  if (associationData) {
    try {
      const addTagUrl = `${getEarthdataConfig('prod').cmrHost}/search/tags/${tagName}/associations`
      await request.post({
        uri: addTagUrl,
        headers: {
          'Echo-Token': cmrToken
        },
        body: associationData,
        json: true,
        resolveWithFullResponse: true
      })
    } catch (e) {
      console.log(e)
    }

    return associationData
  }

  try {
    // If no tagData was provided, and granules are not required we dont need to ask CMR
    // for anything, so we'll just associate the tag with all collections that match the searchCriteria
    const tagRemovalUrl = `${getEarthdataConfig('prod').cmrHost}/search/tags/${tagName}/associations/by_query`

    await request.post({
      uri: tagRemovalUrl,
      headers: {
        'Echo-Token': cmrToken
      },
      body: searchCriteria,
      json: true,
      resolveWithFullResponse: true
    })
  } catch (e) {
    console.log(e)
  }

  return searchCriteria
}
