/**
 * @param {Array} readableGranuleName Array of strings to filter on the granule id.
 * @returns {Array} Array of regex equivalent to the strings in readableGranuleName
 * Convert our search terms into their Regex equivalent
 */
export const getSearchWords = (readableGranuleName) => readableGranuleName.map(
  (initialSearchTerm) => {
    let splitStars = initialSearchTerm.split('*')

    // Remove the first and last stars if they are there in order to isolate the actual search term.
    if (splitStars[0] === '') {
      splitStars = splitStars.slice(1)
    }

    if (splitStars[splitStars.length - 1] === '') {
      splitStars = splitStars.slice(0, splitStars.length - 1)
    }

    // Converting the rest of the stars that were split from the original search term and converting it to the
    // regex equivalent. AB*CD -> AB.+CD because there can be any number of characters between AB and CD but those 2 should be matched.
    const searchTerm = splitStars.join('.+')

    // Replacing all the ? (single letter placeholders) with the equivalent regex
    return (RegExp(`(${searchTerm.replaceAll('?', '.')})`))
  }
)
