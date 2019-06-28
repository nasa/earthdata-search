import isNumber from '../isNumber'

/**
 * Encode a list of Granule IDs
 * @param {boolean} isCwic Are the granules CWIC
 * @param {array} excludedGranuleIds List of granule IDs
 */
const encodeExcludedGranules = (isCwic, excludedGranuleIds) => {
  // On page log, isCwic hasn't been determined yet
  // temporary fix, if the granule doesn't start with G, it is CWIC
  const [firstGranuleId] = excludedGranuleIds

  if (isCwic || isNumber(firstGranuleId)) {
    return excludedGranuleIds.join('!')
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

  let result = {
    isCwic: false,
    granuleIds: []
  }

  if (keys.indexOf('x') !== -1) {
    const { x: granules } = excludedGranules
    const granulesList = granules.split('!')
    const provider = granulesList.pop()
    const granuleIds = granulesList.map(granuleId => `G${granuleId}-${provider}`)

    result = {
      isCwic: false,
      granuleIds
    }
  }
  if (keys.indexOf('cx') !== -1) {
    const { cx: granules } = excludedGranules
    const granuleIds = granules.split('!')

    result = {
      isCwic: true,
      granuleIds
    }
  }
  return result
}

/**
 * Encodes a Collections object into an object
 * @param {object} collections Collections object
 * @param {string} focusedCollection Focused Collection ID
 * @return {string} An object with encoded Collections
 */
export const encodeCollections = (props) => {
  const {
    collections = {},
    focusedCollection,
    project = {}
  } = props

  const { byId } = collections
  const { collectionIds: projectIds = [] } = project

  // pParameter - focusedCollection!projectCollection1!projectCollection2
  const pParameter = [
    focusedCollection,
    ...projectIds
  ].join('!')

  // If there isn't a focusedCollection or any projectIds, we don't see to continue
  if (pParameter === '') return ''

  // pgParameter - excluded granules and granule filters based on pParameter collections
  const pgParameter = []
  if (byId) {
    pParameter.split('!').forEach((collectionId, index) => {
      const pg = {}


      // if the focusedCollection is also in projectIds, don't encode the focusedCollection
      if (index === 0 && projectIds.indexOf(focusedCollection) !== -1) {
        pgParameter[index] = pg
        return
      }

      const collection = byId[collectionId]
      if (!collection) {
        pgParameter[index] = pg
        return
      }

      // excludedGranules
      let encodedExcludedGranules
      const {
        excludedGranuleIds = [],
        granules,
        isVisible,
        isCwic
      } = collection

      const excludedKey = isCwic ? 'cx' : 'x'

      if (granules && excludedGranuleIds.length > 0) {
        encodedExcludedGranules = encodeExcludedGranules(isCwic, excludedGranuleIds)
      }

      if (encodedExcludedGranules) pg[excludedKey] = encodedExcludedGranules

      // Collection visible, don't encode the focusedCollection
      if (index !== 0 && isVisible) pg.v = 't'

      // TODO Encode granule filters

      pgParameter[index] = pg
    })
  }

  const encoded = {
    p: pParameter,
    pg: pgParameter
  }

  return encoded
}


/**
 * Decodes a parameter object into a Collections object
 * @param {object} params URL parameter object from parsing the URL parameter string
 * @return {object} Collections object
 */
export const decodeCollections = (params) => {
  if (Object.keys(params).length === 0) return {}

  const { p, pg } = params
  if (!p && !pg) return {}

  let focusedCollection = ''
  let collections
  let project
  const allIds = []
  const byId = {}
  const projectIds = []

  p.split('!').forEach((collectionId, index) => {
    // If there is no collectionId, move on to the next index
    // i.e. there is no focusedCollection
    if (collectionId === '') return

    // Add collectionId to correct allIds and projectIds
    if (allIds.indexOf(collectionId) === -1) allIds.push(collectionId)
    if (index > 0) projectIds.push(collectionId)

    // Set the focusedCollection
    if (index === 0) focusedCollection = collectionId

    let granuleIds = []
    let isCwic = false
    let isVisible = false
    if (pg && pg[index]) {
      // Excluded Granules
      ({ isCwic, granuleIds } = decodedExcludeGranules(pg[index]))

      // Collection visible
      const { v: visible = '' } = pg[index]
      if (visible === 't') isVisible = true
    }

    // TODO Decode granule filters

    // Populate the collection object for the redux store
    byId[collectionId] = {
      excludedGranuleIds: granuleIds,
      granules: {},
      isCwic,
      isVisible,
      metadata: {},
      ummMetadata: {},
      formattedMetadata: {}
    }
  })

  // if no decoded collections information exists, return undfined for collections
  if (pg || projectIds.length > 0) {
    collections = {
      allIds,
      byId
    }
    project = {
      collectionIds: projectIds
    }
  }

  return {
    collections,
    focusedCollection,
    project
  }
}
