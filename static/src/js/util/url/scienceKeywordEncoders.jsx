import getObjectKeyByValue from '../object'

/**
 * Mapping of Science Keyword keys to encoded values
 */
const scienceKeywordMapping = {
  topic: 'fst',
  term: 'fsm',
  variable_level_1: 'fs1',
  variable_level_2: 'fs2',
  variable_level_3: 'fs3',
  detailed_variable: 'fsd'
}

/**
 * Encodes a Science Keyword Facet object into a flat object with encoded keys
 * @param {object} scienceKeywords Science Keyword Facet object
 * @return {object} A flat object with encoded Science Keyword keys
 */
export const encodeScienceKeywords = (scienceKeywords) => {
  if (!scienceKeywords) return ''
  if (Object.keys(scienceKeywords).length === 0) return ''

  const encoded = {}
  scienceKeywords.forEach((keyword, index) => {
    Object.keys(keyword).forEach((key) => {
      encoded[`${scienceKeywordMapping[key]}${index}`] = keyword[key]
    })
  })

  return encoded
}

/**
 * Decodes a parameter object into a Science Keyword object
 * @param {object} params URL parameter object from parsing the URL parameter string
 * @return {object} Science Keyword Facet object
 */
export const decodeScienceKeywords = (params) => {
  if (Object.keys(params).length === 0) return undefined

  const decoded = []
  Object.keys(params).forEach((encodedKey) => {
    // All of the science keyword facets have an index as the last character of the key
    // Strip off the last character and check the mapping if it exists
    const key = encodedKey.slice(0, -1)
    const index = encodedKey.slice(-1)

    const decodedKey = getObjectKeyByValue(scienceKeywordMapping, key)
    if (decodedKey) {
      // Update the decoded index with value
      if (decoded[index] === undefined) decoded[index] = {}
      decoded[index][decodedKey] = params[encodedKey]
    }
  })

  if (decoded.length > 0) return decoded

  return undefined
}
