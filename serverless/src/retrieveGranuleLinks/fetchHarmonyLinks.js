/**
 * Returns the links from order information saved in the database
 * @param {Object} orderInformation Order information pulled from database
 */
const fetchHarmonyLinks = (orderInformation) => {
  const { links: rawLinks = [] } = orderInformation

  const links = {}
  rawLinks.forEach((linkObject) => {
    const { href, rel } = linkObject

    const adjustedRel = rel === 'data' ? 'download' : rel

    if (links[adjustedRel]) {
      links[adjustedRel].push(href)
    } else {
      links[adjustedRel] = [href]
    }
  })

  return links
}

export default fetchHarmonyLinks
