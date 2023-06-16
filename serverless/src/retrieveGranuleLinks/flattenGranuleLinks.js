/**
 * Flattens an object of links to a single list of links if necessary
 * @param {Object} links Links to format
 * @param {String} linkTypes Comma delimited string of types of links that need to be selected when flattening list
 * @param {String} flattenLinks Stringified boolean if the links need to be flattened to a single list
 */
export const flattenGranuleLinks = (links, linkTypes, flattenLinks) => {
  if (!flattenLinks || flattenLinks === 'false') return links

  let linkType = 'download'

  if (linkTypes.includes('browse')) linkType = 'browse'

  // eslint-disable-next-line no-unused-vars
  const { [linkType]: flattenedLinks } = links

  // !! this can be uncommented to supply fake links to EDD for local dev
  if (flattenedLinks.length > 0) {
    return [
      'https://stsci-opo.org/STScI-01GS80QTFKXCEJEBGKV9SBEDJP.png',
      'https://stsci-opo.org/STScI-01G8GZQ3ZFJRD8YF8YZWMAXCE3.png',
      'https://stsci-opo.org/STScI-01GTYAME8Q4353E2WQQH2965S5.png',
      'https://stsci-opo.org/STScI-01G8H1K2BCNATEZSKVRN9Z69SR.png',
      'https://stsci-opo.org/STScI-01GA6KKWG229B16K4Q38CH3BXS.png',
      'https://stsci-opo.org/STScI-01G8H49RQ0E48YDM8WKW9PP5XS.png',
      'https://stsci-opo.org/STScI-01GK2KMYS6HADS6ND8NRHG53RP.png'
    ]
  }

  return flattenedLinks
}
