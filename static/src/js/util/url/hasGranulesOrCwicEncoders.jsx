/**
 * Encodes hasGranulesOrCwic
 * @param {object} hasGranulesOrCwic hasGranulesOrCwic value from redux store
 * @return {string} Encoded value for hasGranulesOrCwic
 */
export const encodeHasGranulesOrCwic = (hasGranulesOrCwic) => {
  // When we have undefined in the store, the encoded value is true (ac=true)
  if (!hasGranulesOrCwic) return true

  // When we have true in the store, we don't encode the value
  return ''
}

/**
 * Decodes hasGranulesOrCwic
 * @param {string} value Encoded value for hasGranulesOrCwic
 * @return {object} Decoded hasGranulesOrCwic value
 */
export const decodeHasGranulesOrCwic = (value) => {
  // When we see true in the url, we do not store hasGranulesOrCwic in the store
  if (value === 'true') return undefined

  // If we do not see the ac param in the store, we save hasGranulesOrCwic=true in the store
  return true
}
