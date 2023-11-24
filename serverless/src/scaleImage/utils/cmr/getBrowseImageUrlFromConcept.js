/**
 * Search the provided CMR metadata for browse image urls
 * @param {JSON} concept The JSON metadata associated with a CMR concept
 * @returns {String} The image url if one is found, or null if none is found
 */
export const getBrowseImageUrlFromConcept = (concept) => {
  const imgRegex = /\b(browse#)$/

  // Default `links` to an empty array for concepts that do not have any
  const { id, links = [] } = concept

  // Select the first browse image in the event there are more than one
  // Todo since granules could return any of these we could refine this to do the parsing here
  const [imgUrl] = links.filter((link) => imgRegex.test(link.rel))

  // If no image url was found return null
  // todo make this catch better
  if (imgUrl == null) {
    return null
  }

  console.log(`Found image link in ${id}: ${JSON.stringify(imgUrl, null, 4)}`)

  const { href } = imgUrl

  return href
}
