/**
 * Parses ids of duplicate collections from a metadata object
 * @param {Object} json JSON metadata
 * @returns {string[]} array of collection ids
 */
export const buildDuplicateCollections = (json) => {
  const { duplicateCollections } = json

  if (!duplicateCollections) return []

  const ids = duplicateCollections.items.map((item) => item.id).sort()

  return ids
}

export default buildDuplicateCollections
