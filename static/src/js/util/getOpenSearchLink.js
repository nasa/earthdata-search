/**
 * Returns the OpenSearch OSDD link if one exists
 * @param {Array} links Metadata links
 * @returns {String} OpenSearch OSDD Link
 */
export const getOpenSearchOsddLink = (links = []) => {
  let value = false

  links.forEach((link) => {
    const {
      href, rel = ''
    } = link

    if (rel.indexOf('/search#') !== -1) {
      value = href
    }
  })

  return value
}
