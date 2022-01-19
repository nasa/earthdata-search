// Adds the http protocol to a url if none exists
export const formatRelatedUrl = (url) => {
  if (!url) return undefined
  if (url.search(/^(http|https):\/\//g) > -1) return url
  return `http://${url}`
}

// Sorts the list of related urls in the following order: Type, subtype, URL
export const sortRelatedUrls = (a, b) => {
  const type1 = a.type
  const type2 = b.type

  const subType1 = a.subtype
  const subType2 = b.subtype

  const url1 = a.url
  const url2 = b.url

  if (type1 > type2) return 1
  if (type1 < type2) return -1
  if (subType1 > subType2) return 1
  if (subType1 < subType2) return -1
  if (url1 > url2) return 1
  if (url1 < url2) return -1
  return false
}

export const buildRelatedUrls = (json) => {
  const { relatedUrls = [] } = json

  // Build out an array of the categories in the correct order
  const collectionUrls = {
    contentType: 'CollectionURL',
    label: 'Collection URL',
    urls: []
  }
  const distributionUrls = {
    contentType: 'DistributionURL',
    label: 'Distribution URL',
    urls: []
  }
  const publicationUrls = {
    contentType: 'PublicationURL',
    label: 'Publication URL',
    urls: []
  }
  const visualizationUrls = {
    contentType: 'VisualizationURL',
    label: 'Visualization URL',
    urls: []
  }
  const highlightedUrls = {
    contentType: 'HighlightedURL',
    label: 'Highlighted URL',
    urls: []
  }

  let allRelatedUrls = [
    collectionUrls,
    distributionUrls,
    publicationUrls,
    visualizationUrls,
    highlightedUrls
  ]

  if (!relatedUrls) return allRelatedUrls

  Array.from(relatedUrls).forEach((related) => {
    const relatedUrl = { ...related }

    // Exclude EDSC and Reverb URLs
    if (
      relatedUrl.url.search(/search\.(sit|uat)?(\.)?earthdata\.nasa\.gov/g) > -1
      || relatedUrl.url.search(/echo\.nasa\.gov/g) > -1
    ) return

    // Add the http protocol if none exists
    if (relatedUrl.url) relatedUrl.url = formatRelatedUrl(relatedUrl.url)

    // Add the neccesary highlighed URLs
    if (relatedUrl.urlContentType === 'CollectionURL' && relatedUrl.type === 'DATA SET LANDING PAGE') {
      highlightedUrls.urls.push({ ...relatedUrl, highlightedType: 'Data Set Landing Page' })
    }

    if (relatedUrl.urlContentType === 'PublicationURL' && relatedUrl.type === 'VIEW RELATED INFORMATION') {
      if (relatedUrl.subtype === 'DATA QUALITY') {
        highlightedUrls.urls.push({ ...relatedUrl, highlightedType: 'QA' })
      }

      if (relatedUrl.subtype === 'ALGORITHM THEORETICAL BASIS DOCUMENT') {
        highlightedUrls.urls.push({ ...relatedUrl, highlightedType: 'ATBD' })
      }

      if (relatedUrl.subtype === 'USER\'S GUIDE') {
        highlightedUrls.urls.push({ ...relatedUrl, highlightedType: 'User\'s Guide' })
      }
    }

    // Make sure subtype is an empty string if it does not exist
    if (!relatedUrl.subtype) relatedUrl.subtype = ''

    if (relatedUrl.urlContentType === 'CollectionURL') collectionUrls.urls.push(relatedUrl)
    if (relatedUrl.urlContentType === 'DistributionURL') distributionUrls.urls.push(relatedUrl)
    if (relatedUrl.urlContentType === 'PublicationURL') publicationUrls.urls.push(relatedUrl)
    if (relatedUrl.urlContentType === 'VisualizationURL') visualizationUrls.urls.push(relatedUrl)
  })

  // Sort all url lists
  allRelatedUrls = allRelatedUrls.map((relatedUrlCat) => ({
    ...relatedUrlCat,
    urls: relatedUrlCat.urls.sort(sortRelatedUrls)
  }))

  // Return an empty array if no related urls are defined
  if (allRelatedUrls.every((relatedUrlCat) => !relatedUrlCat.urls.length)) return []

  return allRelatedUrls
}
