// Pretty headers for the CSV file
const headers = [
  'Data Provider',
  'Short Name',
  'Version',
  'Entry Title',
  'Processing Level',
  'Platform',
  'Start Time',
  'End Time'
]

// Collection metadata keys to loop through for building the CSV data
const keysToMap = [
  'provider',
  'shortName',
  'version',
  'title',
  'processingLevel',
  'platforms',
  'timeStart',
  'timeEnd'
]

/**
 * Replacement function for JSON.stringify, replaces null values with an empty string
 */
const replacer = (_key, value) => (value === null ? undefined : value)

/**
 * Converts JSON array to CSV for search exports
 * @param {Array} jsonArray JSON to convert
 */
export const jsonToCsv = (jsonArray) => {
  // Build the header line
  let csvString = `${headers.join(',')}\r\n`

  // Loop through the JSON array and builds a line of CSV data for each collection
  jsonArray.forEach((collection) => {
    const collectionValues = []

    // Loop through the metadata keys to build the collection data
    keysToMap.forEach((key) => {
      // If the key is platforms, join the array of shortnames
      if (key === 'platforms') {
        const shortNames = collection[key].map((platform) => platform.shortName)

        collectionValues.push(JSON.stringify(shortNames.join(', '), replacer))
      } else if (key === 'processingLevel') {
        // Use the ID field in processingLevel
        const { id } = collection[key]

        collectionValues.push(`"${id}"`)
      } else {
        collectionValues.push(JSON.stringify(collection[key], replacer))
      }
    })

    // Add this collection onto the CSV string
    csvString += `${collectionValues.join(',')}\r\n`
  })

  return csvString
}
