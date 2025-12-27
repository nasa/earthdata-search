/**
 * Determines is the provided keyword was an 'exact match' for the metadata provided
 * @param {Object} metadata Collection metadata
 * @param {String} keyword keyword query parameter
 */
export const exactMatch = (metadata, keyword) => {
  if (!keyword) return false

  const {
    id = '',
    short_name: shortName = '',
    title = '',
    version_id: versionId = ''
  } = metadata

  switch (keyword.toLowerCase()) {
    case title.toLowerCase():
      return true
    case id.toLowerCase():
      return true
    case shortName.toLowerCase():
      return true
    case `${shortName.toLowerCase()}_${versionId.toLowerCase()}`:
      return true
    case `${shortName.toLowerCase()}_v${versionId.toLowerCase()}`:
      return true
    case `${shortName.toLowerCase()} ${versionId.toLowerCase()}`:
      return true
    case `${shortName.toLowerCase()} v${versionId.toLowerCase()}`:
      return true
    default:
      return false
  }
}

export default exactMatch
