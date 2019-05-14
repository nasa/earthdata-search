/**
 * Encode a list of Granule IDs
 * @param {boolean} isCwic Are the granules CWIC
 * @param {array} excludedGranuleIds List of granule IDs
 */
const encodeExcludedGranules = (isCwic, excludedGranuleIds) => {
  if (isCwic) {
    // TODO figure this part out later
    return ''
  }

  // CMR Granule Ids
  // G12345-PROVIDER
  const provider = excludedGranuleIds[0].split('-')[1]
  const granuleIds = excludedGranuleIds.map(granuleId => granuleId.split('G')[1].split('-')[0])

  return `${granuleIds.join('!')}!${provider}`
}

/**
 * Decode a string of Granule IDs
 * @param {string} excludedGranules Encoded Granule IDs
 */
const decodedExcludeGranules = (excludedGranules) => {
  const keys = Object.keys(excludedGranules)

  if (keys.indexOf('x') !== -1) {
    const { x: granules } = excludedGranules
    const granulesList = granules.split('!')
    const provider = granulesList.pop()
    const granuleIds = granulesList.map(granuleId => `G${granuleId}-${provider}`)

    return {
      isCwic: false,
      granuleIds
    }
  }
  if (keys.indexOf('cx') !== -1) {
    // TODO Cwic, figure this part out later
    return {
      isCwic: true,
      granuleIds: []
    }
  }
  return {}
}

/**
 * Encodes a Collections object into an object
 * @param {object} collections Collections object
 * @param {string} focusedCollection Focused Collection ID
 * @return {string} An object with encoded Collections
 */
export const encodeCollections = (collections, focusedCollection) => {
  // TODO Encode project Collections
  // TODO Encode granule filters

  if (!collections) return ''
  const {
    // allIds,
    byId// ,
    // projectIds
  } = collections

  if (focusedCollection === '') return ''

  const collection = byId[focusedCollection]
  if (!collection) return ''

  const { granules, excludedGranuleIds = [] } = collection
  if (!granules || excludedGranuleIds.length === 0) return ''

  const { isCwic = false } = granules
  const excludedKey = isCwic ? 'cx' : 'x'

  const encoded = {
    pg: [{
      [excludedKey]: encodeExcludedGranules(isCwic, excludedGranuleIds)
    }]
  }

  return encoded
}


/**
 * Decodes a parameter object into a Collections object
 * @param {object} params URL parameter object from parsing the URL parameter string
 * @return {object} Collections object
 */
export const decodeCollections = (params) => {
  // TODO Decode project Collections
  // TODO Decode granule filters

  if (Object.keys(params).length === 0) return undefined

  const { p, pg } = params

  if (!p || !pg) return undefined

  const allIds = []
  const byId = {}
  const projectIds = []

  p.split('!').forEach((collectionId, index) => {
    allIds.push(collectionId)
    if (index > 0) projectIds.push(collectionId)

    const { isCwic, granuleIds } = decodedExcludeGranules(pg[index])
    byId[collectionId] = {
      excludedGranuleIds: granuleIds,
      isCwic,
      metadata: {}
    }
  })

  return {
    allIds,
    byId,
    projectIds
  }
}
