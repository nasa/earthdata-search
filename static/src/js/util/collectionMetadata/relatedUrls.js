// Adds the http protocol to a url if none exists
export const formatRelatedUrl = (url) => {
  if (!url) return undefined
  if (url.search(/^(http|https):\/\//g) > -1) return url
  return `http://${url}`
}

// Sorts the list of related urls in the following order: Type, Subtype, URL
export const sortRelatedUrls = (a, b) => {
  const type1 = a.Type
  const type2 = b.Type

  const subType1 = a.SubType
  const subType2 = b.SubType

  const url1 = a.URL
  const url2 = b.URL

  console.warn('sorting', a.Type)
  console.warn('sorting', b.Type)
  console.warn('sorting', type1 > type2)

  if (type1 > type2) return 1
  if (type1 < type2) return -1
  if (subType1 > subType2) return 1
  if (subType1 < subType2) return -1
  if (url1 > url2) return 1
  if (url1 < url2) return -1
  return false
}

// Takes a umm_json object and returns the related urls formatted into a categorized array
export const buildRelatedUrls = (ummJson) => {
  const relatedUrls = ummJson.RelatedUrls

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

  relatedUrls.forEach((related) => {
    const relatedUrl = { ...related }

    // Exclude EDSC and Reverb URLs
    if (
      relatedUrl.URL.search(/search\.(sit|uat)?(\.)?earthdata\.nasa\.gov/g) > -1
      || relatedUrl.URL.search(/echo\.nasa\.gov/g) > -1
    ) return

    // Add the http protocol if none exists
    if (relatedUrl.URL) relatedUrl.URL = formatRelatedUrl(relatedUrl.URL)

    // Add the neccesary highlighed URLs
    if (relatedUrl.URLContentType === 'CollectionURL' && relatedUrl.Type === 'DATA SET LANDING PAGE') {
      highlightedUrls.urls.push({ ...relatedUrl, HighlightedType: 'Data Set Landing Page' })
    }

    if (relatedUrl.URLContentType === 'PublicationURL' && relatedUrl.Type === 'VIEW RELATED INFORMATION') {
      if (relatedUrl.Subtype === 'DATA QUALITY') {
        highlightedUrls.urls.push({ ...relatedUrl, HighlightedType: 'QA' })
      }

      if (relatedUrl.Subtype === 'ALGORITHM THEORETICAL BASIS DOCUMENT') {
        highlightedUrls.urls.push({ ...relatedUrl, HighlightedType: 'ATBD' })
      }

      if (relatedUrl.Subtype === 'USER\'S GUIDE') {
        highlightedUrls.urls.push({ ...relatedUrl, HighlightedType: 'User\'s Guide' })
      }
    }

    // Make sure Subtype is an empty string if it does not exist
    if (!relatedUrl.Subtype) relatedUrl.Subtype = ''

    if (relatedUrl.URLContentType === 'CollectionURL') collectionUrls.urls.push(relatedUrl)
    if (relatedUrl.URLContentType === 'DistributionURL') distributionUrls.urls.push(relatedUrl)
    if (relatedUrl.URLContentType === 'PublicationURL') publicationUrls.urls.push(relatedUrl)
    if (relatedUrl.URLContentType === 'VisualizationURL') visualizationUrls.urls.push(relatedUrl)
  })

  // Sort all url lists
  allRelatedUrls = allRelatedUrls.map(relatedUrlCat => ({
    ...relatedUrlCat,
    urls: relatedUrlCat.urls.sort(sortRelatedUrls)
  }))

  // Return an empty array if no related urls are defined
  if (allRelatedUrls.every(relatedUrlCat => !relatedUrlCat.urls.length)) return []

  return allRelatedUrls
}
