import isNumber from '../isNumber'
import { encodeGranuleFilters, decodeGranuleFilters } from './granuleFiltersEncoders'

/**
 * Encode a list of Granule IDs
 * @param {boolean} isCwic Are the granules CWIC
 * @param {array} granuleIds List of granule IDs
 */
const encodeGranules = (isCwic, granuleIds) => {
  // On page log, isCwic hasn't been determined yet
  // temporary fix, if the granule doesn't start with G, it is CWIC
  const [firstGranuleId] = granuleIds

  if (isCwic || isNumber(firstGranuleId)) {
    return granuleIds.join('!')
  }

  // CMR Granule Ids
  // G12345-PROVIDER
  const provider = granuleIds[0].split('-')[1]
  const formattedGranuleIds = granuleIds.map(granuleId => granuleId.split('G')[1].split('-')[0])

  return `${formattedGranuleIds.join('!')}!${provider}`
}

/**
 * Decode a string of Granule IDs
 * @param {string} excludedGranules Encoded Granule IDs
 */
const decodedGranules = (key, granules) => {
  const keys = Object.keys(granules)

  let result = {
    isCwic: false,
    granuleIds: []
  }

  if (keys.indexOf(key) !== -1) {
    const { [key]: decodedGranules } = granules
    const granulesList = decodedGranules.split('!')
    const provider = granulesList.pop()
    const granuleIds = granulesList.map(granuleId => `G${granuleId}-${provider}`)

    result = {
      isCwic: false,
      granuleIds
    }
  }
  if (keys.indexOf(`c${key}`) !== -1) {
    const { [`c${key}`]: decodedGranules } = granules
    const granuleIds = decodedGranules.split('!')

    result = {
      isCwic: true,
      granuleIds
    }
  }
  return result
}

const encodeSelectedVariables = (projectCollection) => {
  if (!projectCollection) return null

  const {
    accessMethods,
    selectedAccessMethod
  } = projectCollection

  if (!accessMethods || !selectedAccessMethod) return null

  const selectedMethod = accessMethods[selectedAccessMethod]
  const {
    selectedVariables
  } = selectedMethod

  if (!selectedVariables) return null

  return selectedVariables.join('!')
}

const encodeOutputFormat = (projectCollection) => {
  if (!projectCollection) return null

  const {
    accessMethods,
    selectedAccessMethod
  } = projectCollection

  if (!accessMethods || !selectedAccessMethod) return null

  const selectedMethod = accessMethods[selectedAccessMethod]
  const {
    selectedOutputFormat
  } = selectedMethod

  if (!selectedOutputFormat) return null

  return selectedOutputFormat
}

const encodeAddedGranules = (isCwic, projectCollection) => {
  if (!projectCollection) return null

  const {
    addedGranuleIds = []
  } = projectCollection

  if (!addedGranuleIds.length) return null

  return encodeGranules(isCwic, addedGranuleIds)
}

const encodeRemovedGranules = (isCwic, projectCollection) => {
  if (!projectCollection) return null

  const {
    removedGranuleIds = []
  } = projectCollection

  if (!removedGranuleIds.length) return null

  return encodeGranules(isCwic, removedGranuleIds)
}

const decodedSelectedVariables = (pgParam) => {
  const { uv: variableIds } = pgParam

  if (!variableIds) return undefined

  return variableIds.split('!')
}

const decodedOutputFormat = (pgParam) => {
  const { of: outputFormat } = pgParam

  return outputFormat
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
  const {
    byId: projectById = {},
    collectionIds: projectIds = []
  } = project

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
      let pg = {}

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

      const projectCollection = projectById[collectionId]

      // excludedGranules
      let encodedExcludedGranules
      const {
        excludedGranuleIds = [],
        granules,
        granuleFilters,
        isVisible,
        isCwic
      } = collection

      const excludedKey = isCwic ? 'cx' : 'x'

      if (granules && excludedGranuleIds.length > 0) {
        encodedExcludedGranules = encodeGranules(isCwic, excludedGranuleIds)
      }

      if (encodedExcludedGranules) pg[excludedKey] = encodedExcludedGranules

      let encodedAddedGranules
      let encodedRemovedGranules
      const addedKey = isCwic ? 'ca' : 'a'
      const removedKey = isCwic ? 'cr' : 'r'

      // Encode granules added to the current project
      if (
        projectCollection
        && projectCollection.addedGranuleIds
        && projectCollection.addedGranuleIds.length > 0
      ) {
        encodedAddedGranules = encodeAddedGranules(isCwic, projectCollection)
      }

      // Encode granules removed from the current project
      if (
        projectCollection
        && projectCollection.removedGranuleIds
        && projectCollection.removedGranuleIds.length > 0
      ) {
        encodedRemovedGranules = encodeRemovedGranules(isCwic, projectCollection)
      }

      if (encodedAddedGranules) pg[addedKey] = encodedAddedGranules
      if (encodedRemovedGranules) pg[removedKey] = encodedRemovedGranules

      // Collection visible, don't encode the focusedCollection
      if (index !== 0 && isVisible) pg.v = 't'

      // Add the granule encoded granule filters
      if (granuleFilters) {
        pg = { ...pg, ...encodeGranuleFilters(granuleFilters) }
      }

      // Encode selected variables
      pg.uv = encodeSelectedVariables(projectCollection)

      // Encode selected output format
      pg.of = encodeOutputFormat(projectCollection)

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
  const projectById = {}

  p.split('!').forEach((collectionId, index) => {
    // If there is no collectionId, move on to the next index
    // i.e. there is no focusedCollection
    if (collectionId === '') return

    // Add collectionId to correct allIds and projectIds
    if (allIds.indexOf(collectionId) === -1) allIds.push(collectionId)
    if (index > 0) projectIds.push(collectionId)

    // Set the focusedCollection
    if (index === 0) focusedCollection = collectionId

    let excludedGranuleIds = []
    let addedGranuleIds = []
    let removedGranuleIds = []
    let granuleFilters = {}
    let selectedOutputFormat
    let isCwic
    let excludedIsCwic
    let addedIsCwic
    let removedIsCwic
    let isVisible = false

    let variableIds
    if (pg && pg[index]) {
      // Excluded Granules
      ({ isCwic: excludedIsCwic, granuleIds: excludedGranuleIds } = decodedGranules('x', pg[index]));

      ({ isCwic: addedIsCwic, granuleIds: addedGranuleIds = [] } = decodedGranules('a', pg[index]));

      ({ isCwic: removedIsCwic, granuleIds: removedGranuleIds = [] } = decodedGranules('r', pg[index]))

      isCwic = excludedIsCwic || addedIsCwic || removedIsCwic

      // Collection visible
      const { v: visible = '' } = pg[index]
      if (visible === 't') isVisible = true

      // Decode selected variables
      variableIds = decodedSelectedVariables(pg[index])

      // Decode granule filters
      granuleFilters = decodeGranuleFilters(pg[index])

      // Decode output format
      selectedOutputFormat = decodedOutputFormat(pg[index])
    }

    // Populate the collection object for the redux store
    byId[collectionId] = {
      excludedGranuleIds,
      granules: {},
      granuleFilters,
      isCwic,
      isVisible,
      metadata: {},
      ummMetadata: {},
      formattedMetadata: {}
    }

    if (index > 0) {
      projectById[collectionId] = {}
    }

    if (variableIds || selectedOutputFormat) {
      projectById[collectionId] = {
        accessMethods: {
          opendap: {
            selectedVariables: variableIds,
            selectedOutputFormat
          }
        }
      }
    }

    if (addedGranuleIds.length && projectById[collectionId]) {
      projectById[collectionId].addedGranuleIds = addedGranuleIds
    }

    if (removedGranuleIds.length && projectById[collectionId]) {
      projectById[collectionId].removedGranuleIds = removedGranuleIds
    }
  })

  // if no decoded collections information exists, return undfined for collections
  if (pg || projectIds.length > 0) {
    collections = {
      allIds,
      byId
    }

    project = {
      byId: projectById,
      collectionIds: projectIds
    }
  }

  return {
    collections,
    focusedCollection,
    project
  }
}
