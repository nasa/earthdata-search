import { isEmpty, intersection } from 'lodash'
import actions from './index'
import {
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  RESTORE_PROJECT,
  SELECT_ACCESS_METHOD,
  TOGGLE_COLLECTION_VISIBILITY,
  UPDATE_ACCESS_METHOD,
  ADD_ACCESS_METHODS,
  SUBMITTING_PROJECT,
  SUBMITTED_PROJECT,
  UPDATE_ACCESS_METHOD_ORDER_COUNT,
  ADD_GRANULE_TO_PROJECT_COLLECTION,
  REMOVE_GRANULE_FROM_PROJECT_COLLECTION
} from '../constants/actionTypes'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { updateAuthTokenFromHeaders } from './authToken'
import { updateCollectionMetadata } from './collections'
import { createFocusedCollectionMetadata, getCollectionMetadata } from '../util/focusedCollection'
import { isProjectCollectionValid } from '../util/isProjectCollectionValid'
import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'
import { parseError } from '../../../../sharedUtils/parseError'
import { buildPromise } from '../util/buildPromise'
import { getGranuleCount } from '../util/collectionMetadata/granuleCount'

export const submittingProject = () => ({
  type: SUBMITTING_PROJECT
})

export const submittedProject = () => ({
  type: SUBMITTED_PROJECT
})

export const addCollectionToProject = payload => ({
  type: ADD_COLLECTION_TO_PROJECT,
  payload
})

export const removeCollectionFromProject = payload => ({
  type: REMOVE_COLLECTION_FROM_PROJECT,
  payload
})

export const toggleCollectionVisibility = payload => ({
  type: TOGGLE_COLLECTION_VISIBILITY,
  payload
})

export const restoreProject = payload => ({
  type: RESTORE_PROJECT,
  payload
})

export const addAccessMethods = payload => ({
  type: ADD_ACCESS_METHODS,
  payload
})

export const updateAccessMethod = payload => ({
  type: UPDATE_ACCESS_METHOD,
  payload: {
    ...payload,
    isValid: isProjectCollectionValid(payload.method)
  }
})

export const updateAccessMethodOrderCount = payload => ({
  type: UPDATE_ACCESS_METHOD_ORDER_COUNT,
  payload
})

export const selectAccessMethod = payload => ({
  type: SELECT_ACCESS_METHOD,
  payload
})

/**
 * Retrieve collection metadata for the collections provided
 * @param {String} collectionId Single collection to lookup, if null then all collections in the project will be retrieved
 */
export const getProjectCollections = (collectionIds = []) => (dispatch, getState) => {
  const { defaultCmrPageSize, defaultCmrSearchTags } = getApplicationConfig()

  const emptyProjectCollections = []

  // Determine which collections are in the project that we have no metadata for
  collectionIds.forEach((projectCollection) => {
    const { [projectCollection]: collection = {} } = collectionIds
    const { metadata, ummMetadata = {} } = collection

    // If any of the metadata is missing push this collection to our array to fetch metadata for
    if (isEmpty(metadata) || isEmpty(ummMetadata)) {
      emptyProjectCollections.push(projectCollection)
    }
  })

  // Default filteredIds to the provided collectionId
  let filteredIds = collectionIds

  // If no collectionId was provided
  if (collectionIds == null) {
    // Prepare to retrieve all collections that we have not already retrieved
    filteredIds = intersection(emptyProjectCollections, collectionIds)
  }

  // If no collection was provided and the project has no collections return null
  if (filteredIds.length === 0) {
    return buildPromise(null)
  }

  const { authToken } = getState()

  const collectionParams = prepareCollectionParams(getState())
  const searchParams = buildCollectionSearchParams(collectionParams)

  const {
    includeGranuleCounts,
    includeHasGranules,
    boundingBox,
    hasGranulesOrCwic,
    point,
    polygon,
    temporal
  } = searchParams

  const response = getCollectionMetadata({
    conceptId: filteredIds,
    includeTags: defaultCmrSearchTags.join(','),
    includeGranuleCounts,
    includeHasGranules,
    boundingBox,
    hasGranulesOrCwic,
    pageSize: defaultCmrPageSize,
    point,
    polygon,
    temporal
  }, authToken)
    .then(([collectionJson, collectionUmm]) => {
      const payload = []

      const { entry: responseJson } = collectionJson.data.feed
      const { items: responseUmm } = collectionUmm.data

      responseJson.forEach((collection) => {
        const { id } = collection
        const metadata = collection
        const ummIndex = responseUmm.findIndex(item => id === item.meta['concept-id'])
        const ummMetadata = responseUmm[ummIndex].umm

        const formattedMetadata = createFocusedCollectionMetadata(metadata, ummMetadata, authToken)

        const { is_cwic: isCwic = false } = metadata

        dispatch(actions.fetchDataQualitySummaries(id))

        payload.push({
          [id]: {
            metadata,
            ummMetadata,
            formattedMetadata,
            isCwic
          }
        })
      })

      dispatch(updateAuthTokenFromHeaders(collectionJson.headers))
      dispatch(updateCollectionMetadata(payload))
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'getProjectCollections',
        resource: 'collections'
      }))
    })

  return response
}

/**
 * Adds a single collection to the project
 * @param {String} collectionId The CMR concept id of the collection to add to the project
 */
export const addProjectCollection = collectionId => async (dispatch) => {
  dispatch(addCollectionToProject(collectionId))

  try {
    await dispatch(actions.getProjectCollections([collectionId]))

    dispatch(actions.fetchAccessMethods([collectionId]))
    dispatch(actions.getGranules([collectionId]))
  } catch (e) {
    parseError(e)
  }
}

/**
 * Adds a single single granule to a project. If the collection is not in the
 * project, it will be added first.
*/
export const addGranuleToProjectCollection = payload => (dispatch, getState) => {
  const { project } = getState()
  const { collectionIds } = project

  const { collectionId } = payload

  // If the current collection is not in the project, add it.
  if (collectionIds.indexOf(collectionId) === -1) {
    dispatch(addProjectCollection(collectionId))
  }

  // Add the granule to the project collection.c
  dispatch({
    type: ADD_GRANULE_TO_PROJECT_COLLECTION,
    payload
  })
}

/**
 * Removes a single single granule from a project. If the collection would not have any granules
 * after removal, the collection is removed from the project.
*/
export const removeGranuleFromProjectCollection = payload => (dispatch, getState) => {
  const { collectionId, granuleId } = payload
  const { project, metadata } = getState()

  const { collections } = metadata
  const { byId: collectionsById } = collections
  const { byId: projectCollectionsById } = project

  const collection = collectionsById[collectionId]
  const projectCollection = projectCollectionsById[collectionId]

  const { granules } = collection
  const { removedGranuleIds = [] } = projectCollection

  const { allIds: collectionGranulesIds } = granules

  const indexInRemovedGranulesArray = removedGranuleIds.indexOf(granuleId)
  const indexInCollectionGranulesArray = collectionGranulesIds.indexOf(granuleId)

  const granuleCount = getGranuleCount(collection, projectCollection)

  // If the granule does not exist in the removed granules array and the
  // removing the granule would result in 0 granules in the project, remove
  // the current collection from the project.
  if (
    indexInRemovedGranulesArray === -1
    && indexInCollectionGranulesArray === 1
    && granuleCount - 1 === 0
  ) {
    dispatch(removeCollectionFromProject(collectionId))
  }

  dispatch({
    type: REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
    payload
  })
}
