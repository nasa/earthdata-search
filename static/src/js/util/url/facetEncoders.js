/**
 * Encodes a Facet object into a string
 * @param {object} facets Facet object
 * @return {string} A `!` delimited string of the facet values
 */
export const encodeFacets = (facets) => {
  if (!facets) return ''

  const encoded = []

  facets.forEach((facet) => {
    encoded.push(encodeURIComponent(facet))
  })

  return encoded.join('!')
}

/**
 * Decodes a Facet parameter string into an object
 * @param {string} string A `!` delimited string of the facet values
 * @return {object} Facet object
 */
export const decodeFacets = (string) => {
  if (!string) {
    return undefined
  }

  const decodedValues = string.split('!').map((value) => decodeURIComponent(value))

  return decodedValues
}
