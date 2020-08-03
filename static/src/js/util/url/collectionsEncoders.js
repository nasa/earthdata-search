import isNumber from '../isNumber'

import { encodeGranuleFilters, decodeGranuleFilters } from './granuleFiltersEncoders'
import { initialGranuleState as initialProjectCollectionGranuleState } from '../../reducers/project'
import { initialGranuleState as initialCollectionGranuleQueryState } from '../../reducers/query'

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
 * @param {String} excludedGranules Encoded Granule IDs
 */
const decodedGranules = (key, granules) => {
  const keys = Object.keys(granules)

  let result = {
    isCwic: false,
    granuleIds: []
  }

  if (keys.indexOf(key) > -1) {
    const { [key]: decodedGranules } = granules

    const granulesList = decodedGranules.split('!')
    const provider = granulesList.pop()
    const granuleIds = granulesList.map(granuleId => `G${granuleId}-${provider}`)

    result = {
      isCwic: false,
      granuleIds
    }
  }

  if (keys.indexOf(`c${key}`) > -1) {
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

const encodeAddedGranules = (isCwic, addedGranuleIds) => {
  if (!addedGranuleIds.length) return null

  return encodeGranules(isCwic, addedGranuleIds)
}

const encodeExcludedGranules = (isCwic, excludedGranuleIds) => {
  if (!excludedGranuleIds.length) return null

  return encodeGranules(isCwic, excludedGranuleIds)
}

const encodeRemovedGranules = (isCwic, removedGranuleIds) => {
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
 * @param {Object} collectionsMetadata Collections object
 * @param {String} focusedCollection Focused Collection ID
 * @return {String} An object with encoded Collections
 */
export const encodeCollections = (props) => {
  const {
    collectionsMetadata = {},
    focusedCollection,
    project = {},
    query = {}
  } = props

  const { collections: projectCollections } = project

  const {
    byId: projectById = {},
    allIds: projectIds = []
  } = projectCollections

  // pParameter - focusedCollection!projectCollection1!projectCollection2
  const pParameter = [
    focusedCollection,
    ...projectIds
  ].join('!')

  const projectExists = projectIds.length > 0

  const ids = projectExists ? projectIds : [focusedCollection]

  // If there isn't a focusedCollection or any projectIds, we don't need to continue
  if (pParameter === '') return ''

  // pgParameter - excluded granules and granule filters based on pParameter collections
  const pgParameter = []

  ids.forEach((collectionId, index) => {
    // Compensate for the fact that we've already pulled
    // off the first element above to determine the focused collection
    const collectionListIndex = index + (projectExists ? 1 : 0)

    let pg = {}

    const { [collectionId]: collectionMetadata } = collectionsMetadata

    // Ignore this collection if we have no metadata for it
    if (!collectionMetadata) {
      pgParameter[collectionListIndex] = pg

      return
    }

    const {
      isCwic
    } = collectionMetadata

    const { [collectionId]: projectCollection = {} } = projectById
    const {
      granules: projectCollectionGranules = {},
      isVisible
    } = projectCollection

    // excludedGranules
    let encodedExcludedGranules
    const excludedKey = isCwic ? 'cx' : 'x'

    const { collection: collectionsQuery = {} } = query
    const { byId: collectionQueryById = {} } = collectionsQuery
    const { [collectionId]: collectionQuery = {} } = collectionQueryById
    const { granules: granuleQuery = {} } = collectionQuery
    const { excludedGranuleIds = [] } = granuleQuery

    if (excludedGranuleIds.length > 0) {
      encodedExcludedGranules = encodeExcludedGranules(isCwic, excludedGranuleIds)
    }

    if (encodedExcludedGranules) pg[excludedKey] = encodedExcludedGranules

    let encodedAddedGranules
    let encodedRemovedGranules
    const addedKey = isCwic ? 'ca' : 'a'
    const removedKey = isCwic ? 'cr' : 'r'

    // Encode granules added to the current project
    const {
      addedGranuleIds = [],
      removedGranuleIds = []
    } = projectCollectionGranules

    if (addedGranuleIds.length > 0) {
      encodedAddedGranules = encodeAddedGranules(isCwic, addedGranuleIds)
    }

    // Encode granules removed from the current project
    if (removedGranuleIds.length > 0) {
      encodedRemovedGranules = encodeRemovedGranules(isCwic, removedGranuleIds)
    }

    if (encodedAddedGranules) pg[addedKey] = encodedAddedGranules
    if (encodedRemovedGranules) pg[removedKey] = encodedRemovedGranules

    // Collection visible, don't encode the focusedCollection
    if (isVisible) pg.v = 't'

    // Add the granule encoded granule filters
    if (granuleQuery) {
      pg = { ...pg, ...encodeGranuleFilters(granuleQuery) }
    }

    // Encode selected variables
    pg.uv = encodeSelectedVariables(projectCollection)

    // Encode selected output format
    pg.of = encodeOutputFormat(projectCollection)

    pgParameter[collectionListIndex] = pg
  })

  const encoded = {
    p: pParameter,
    pg: pgParameter
  }

  return encoded
}

/**
 * Decodes a parameter object into a Collections object
 * @param {Object} params URL parameter object from parsing the URL parameter string
 * @return {Object} Collections object
 */
export const decodeCollections = (params) => {
  if (Object.keys(params).length === 0) return {}

  const { p, pg } = params

  if (!p && !pg) return {}

  let collections
  let project

  const collectionMetadata = {}

  const projectIds = []
  const projectById = {}

  const collectionGranuleQueryById = {}

  // Destructure the collection list defining the focused collection and project collections
  const [
    focusedCollection,
    ...projectCollectionIds
  ] = p.split('!')

  const projectExists = projectCollectionIds.length > 0

  const ids = projectExists ? projectCollectionIds : [focusedCollection]

  ids.forEach((collectionId, index) => {
    // Compensate for the fact that we've already pulled
    // off the first element above to determine the focused collection
    const collectionListIndex = index + (projectExists ? 1 : 0)

    // Metadata
    let isCwic

    // Project
    let addedGranuleIds = []
    let addedIsCwic
    let isVisible = false
    let removedGranuleIds = []
    let removedIsCwic
    let selectedOutputFormat
    let variableIds

    // Search
    let excludedIsCwic
    let excludedGranuleIds = []

    if (pg) {
      const { [collectionListIndex]: pCollection } = pg;

      // Granules added by way of additive model
      ({
        isCwic: addedIsCwic,
        granuleIds: addedGranuleIds = []
      } = decodedGranules('a', pCollection));

      // Granules removed by way of additive model
      ({
        isCwic: removedIsCwic,
        granuleIds: removedGranuleIds = []
      } = decodedGranules('r', pCollection));

      // Granules removed by way of terciary filter
      ({
        isCwic: excludedIsCwic,
        granuleIds: excludedGranuleIds = []
      } = decodedGranules('x', pCollection))

      // If `pg` exists we need to ensure that we initialize the granule
      // search state for each collection in it because pg defines granule level search filters
      collectionGranuleQueryById[collectionId] = {
        granules: {
          ...initialCollectionGranuleQueryState
        }
      }

      // Decode granule filters
      const { [collectionId]: collectionGranuleQuery } = collectionGranuleQueryById
      const { granules: granuleQuery } = collectionGranuleQuery

      const newGranulQuery = {
        ...granuleQuery,
        ...decodeGranuleFilters(pCollection)
      }

      if (excludedGranuleIds.length > 0) {
        newGranulQuery.excludedGranuleIds = excludedGranuleIds
      }

      collectionGranuleQueryById[collectionId] = {
        ...collectionGranuleQuery,
        granules: newGranulQuery
      }

      if (projectExists) {
        // If the collection is not already in the project ids, add it
        if (projectIds.indexOf(collectionId) === -1) {
          projectIds.push(collectionId)
        }

        projectById[collectionId] = {
          isVisible,
          granules: initialProjectCollectionGranuleState
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
          projectById[collectionId].granules.addedGranuleIds = addedGranuleIds
        }

        if (removedGranuleIds.length && projectById[collectionId]) {
          projectById[collectionId].granules.removedGranuleIds = removedGranuleIds
        }
      }

      // Collection visibility on the project page
      const { v: visible = '' } = pCollection
      isVisible = (visible === 't')

      // Decode selected variables
      variableIds = decodedSelectedVariables(pCollection)

      // Decode output format
      selectedOutputFormat = decodedOutputFormat(pCollection)

      // Determine if the collection is a CWIC collection
      isCwic = excludedIsCwic || addedIsCwic || removedIsCwic

      // Populate the collection object for the redux store
      collectionMetadata[collectionId] = {
        id: collectionId,
        isCwic
      }
    }
  })

  // if no decoded collections information exists, return undefined for collections
  if (projectIds.length > 0) {
    project = {
      collections: {
        byId: {
          ...projectById
        },
        allIds: projectIds
      }
    }
  }

  return {
    collections,
    focusedCollection,
    project,
    query: {
      collection: {
        byId: {
          ...collectionGranuleQueryById
        }
      }
    }
  }
}
