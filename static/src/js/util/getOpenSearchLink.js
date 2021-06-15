import { getValueForTag } from '../../../../sharedUtils/tags'

/**
 * Returns the OpenSearch OSDD link if one exists
 * @param {Object} metadata Collection metadata
 * @returns {String} OpenSearch OSDD Link
 */
export const getOpenSearchOsddLink = (metadata) => {
  const {
    hasGranules,
    links = [],
    tags
  } = metadata

  let value

  // Check for an OpenSearch link
  links.forEach((link) => {
    const {
      href, rel = ''
    } = link

    if (rel.indexOf('/search#') !== -1) {
      value = href
    }
  })

  // Fallback to the tag data if a link doesn't exist
  if (!value && !hasGranules) {
    value = getValueForTag('', tags, 'opensearch.granule.osdd')
  }

  return value
}
