/**
 * Returns true the current collection link matches.
 * This expects the the link follows this format: http://www.somelink.com/example/{link type}#
 * @param {string} link - The link to be checked.
 * @param {string} linkType - The link type to be checked.
 * @return {boolean}
 */
export const isLinkType = (link = '', linkType) => {
  if (link.indexOf(`${linkType}#`) > -1) return true
  return false
}

export default isLinkType
