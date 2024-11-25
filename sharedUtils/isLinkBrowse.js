const protocolRegex = /^(http|https):\/\//
const browseRegex = /\b(browse#)$/

/**
 * Returns true if the link is browse and http/https
 * @param {Object} link A link object from CMR metadata, containing a rel and href
 * @returns {Boolean} True if the link is browse and http/https
 */
export const isLinkBrowse = (link) => {
  const { rel, href } = link

  return browseRegex.test(rel) && protocolRegex.test(href)
}
