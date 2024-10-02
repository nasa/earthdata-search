/**
 * @param {Array} readableGranuleName Array of strings to filter on the granule id.
 * @returns {Array} Array of regex equivalent to the strings in readableGranuleName
 * Highlight substring if it's in being searched for in Granule Id(s) Filter
 */
export const getSearchWords = (readableGranuleName) => {
  const searchTerms = []

  readableGranuleName.forEach((initialSearchTerm) => {
    let splitStars = initialSearchTerm.split('*')

    // Remove the first and last stars if they are there
    if (splitStars[0] === '') {
      splitStars = splitStars.slice(1)
    }

    if (splitStars[splitStars.length - 1] === '') {
      splitStars = splitStars.slice(0, splitStars.length - 1)
    }

    const searchTerm = splitStars.join('.+')

    searchTerms.push(RegExp(`(${searchTerm.replaceAll('?', '.')})`))
  })

  return searchTerms
}
