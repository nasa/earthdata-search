import { isLinkBrowse } from '../../../../../sharedUtils/isLinkBrowse'

/**
 * Search the provided CMR metadata for browse image urls
 * @param {JSON} concept The JSON metadata associated with a CMR concept
 * @returns {String} The image url if one is found, or null if none is found
 */
export const getBrowseImageUrlFromConcept = (concept) => {
  // Default `links` to an empty array for concepts that do not have any
  const { id, links = [] } = concept

  // Filter the links on the granule to find all browse links with an http/https protocol. This filters
  // any S3 browse links which cause protocol issues.
  const browseThumbnails = links.filter((link) => isLinkBrowse(link))
  const [imgUrl] = browseThumbnails

  // If no image url was found return null
  if (imgUrl == null) {
    console.log(`Did not find imgUrl for a browseable image on concept: ${id}`)

    return null
  }

  const { href } = imgUrl

  return href
}
