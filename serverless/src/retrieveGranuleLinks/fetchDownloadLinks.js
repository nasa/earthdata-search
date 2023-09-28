import { fetchCmrLinks } from './fetchCmrLinks'
import { fetchOpenSearchLinks } from './fetchOpenSearchLinks'

/**
 * Fetches download access method links from CMR or OpenSearch
 * @param {Object} params
 * @param {String} params.collectionId Collection ID of links being retrieved
 * @param {Object} params.collectionMetadata Collection metadata of links being retrieved
 * @param {String} params.cursor Cursor to send with the request
 * @param {String} params.earthdataEnvironment Earthdata environment of the links being retrieved
 * @param {Object} params.granuleParams Granule parameters used in retrieval
 * @param {Array} params.linkTypes Types of links requested
 * @param {Number} params.pageNum Page number of request to send
 * @param {String} params.requestId Request ID to include in requests
 * @param {String} params.token Token to include in requests
 */
const fetchDownloadLinks = async ({
  collectionId,
  collectionMetadata,
  cursor,
  earthdataEnvironment,
  granuleParams,
  linkTypes,
  pageNum,
  requestId,
  token
}) => {
  const { isOpenSearch } = collectionMetadata
  let links
  let newCursor

  if (isOpenSearch) {
    ({ links } = await fetchOpenSearchLinks({
      collectionMetadata,
      collectionId,
      granuleParams,
      pageNum
    }))
  } else {
    ({ cursor: newCursor, links } = await fetchCmrLinks({
      collectionId,
      cursor,
      earthdataEnvironment,
      granuleParams,
      linkTypes,
      requestId,
      token
    }))
  }

  return {
    links,
    newCursor
  }
}

export default fetchDownloadLinks
