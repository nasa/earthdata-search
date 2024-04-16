/**
 * Determines if a given link is a data link.
 * A link is a data link if it has data in the rel property and it is not inherited.
 * @param {Object} link An individual link object from granule metadata
 * @param {String} type 'http' or 'ftp'
 * @returns {Boolean}
 */
export const isS3Link = (link) => {
  const { rel } = link

  return rel.indexOf('/s3#') !== -1
}

/**
 * Given a list of granule metadata links, filters out those links that are not s3 links
 * @param {Array} links List of links from granule metadata
 * @returns {Array} List of s3 links filtered from input links
 */
export const createS3Links = (links = []) => links.filter((link) => isS3Link(link))

/**
 * Pull out S3 links from within the granule metadata
 * @param {Array} granules search result for granules that a user has asked to download
 * @returns {Array} All relevant s3 paths for downloadable granules
*/
export const getS3Urls = (granules) => {
  // Iterate through each granule search result to pull out relevant links
  const urlArrays = granules.map((granuleMetadata) => {
    const { links: linkMetadata = [] } = granuleMetadata

    // Find the correct link from the list within the metadata
    return createS3Links(linkMetadata)
  }).filter(Boolean)

  // `filter` returns an array so we'll end up with an array of arrays so we
  // need to flatten the result before we return it
  const urls = [].concat(...urlArrays)

  return urls.map((url) => url.href)
}
