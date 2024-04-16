/**
 * Pull out browse links from within the granule metadata
 * @param {Array} granules search result for granules that a user has asked to download
 * @returns {Array} All relevant urls for downloadable granules
 */
export const getBrowseUrls = (granules) => {
  // Iterate through each granule search result to pull out relevant links
  const urlArrays = granules.map((granuleMetadata) => {
    const { links: linkMetadata = [] } = granuleMetadata

    // Find the correct link from the list within the metadata
    return linkMetadata.filter((link) => {
      const { inherited, rel } = link

      return rel.includes('/browse#') && !inherited
    })
  }).filter(Boolean)

  // `filter` returns an array so we'll end up with an array of arrays so we
  // need to flatten the result before we return it
  const urls = [].concat(...urlArrays)

  return urls.map((url) => url.href)
}
