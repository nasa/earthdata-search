/**
 * @param {Array} readableGranuleName Array of strings to filter on the granule id.
 * @returns {Array} Array of regex equivalent to the strings in readableGranuleName
 * Convert our search terms into their Regex equivalent
 */
export const getSearchWords = (readableGranuleName) => readableGranuleName.map(
  (initialSearchTerm) => {
    let splitStars = initialSearchTerm.split('*')

    // Remove the first and last stars if they are there
    if (splitStars[0] === '') {
      splitStars = splitStars.slice(1)
    }

    if (splitStars[splitStars.length - 1] === '') {
      splitStars = splitStars.slice(0, splitStars.length - 1)
    }

    const searchTerm = splitStars.join('.+')

    // Replacing all the ? (single letter placeholders) with the equivalent regex
    return (RegExp(`(${searchTerm.replaceAll('?', '.')})`))
  }
)
