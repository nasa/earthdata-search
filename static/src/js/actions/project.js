import { isEmpty, intersection } from 'lodash'
import actions from './index'
import {
  ADD_ACCESS_METHODS,
  ADD_COLLECTION_TO_PROJECT,
  ADD_GRANULE_TO_PROJECT_COLLECTION,
  ADD_MORE_PROJECT_GRANULE_RESULTS,
  ERRORED_PROJECT_GRANULES,
  FINISHED_PROJECT_GRANULES_TIMER,
  PROJECT_GRANULES_LOADED,
  PROJECT_GRANULES_LOADING,
  REMOVE_COLLECTION_FROM_PROJECT,
  REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
  RESTORE_PROJECT,
  SELECT_ACCESS_METHOD,
  STARTED_PROJECT_GRANULES_TIMER,
  SUBMITTED_PROJECT,
  SUBMITTING_PROJECT,
  TOGGLE_COLLECTION_VISIBILITY,
  UPDATE_ACCESS_METHOD,
  UPDATE_PROJECT_GRANULE_PARAMS,
  UPDATE_PROJECT_GRANULE_RESULTS
} from '../constants/actionTypes'

import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'
import { buildPromise } from '../util/buildPromise'
import { createFocusedCollectionMetadata } from '../util/focusedCollection'
import { getApplicationConfig } from '../../../../sharedUtils/config'
import { getProjectGranules } from './granules'
import { hasTag } from '../../../../sharedUtils/tags'
import { isProjectCollectionValid } from '../util/isProjectCollectionValid'
import { parseError } from '../../../../sharedUtils/parseError'
import { updateAuthTokenFromHeaders } from './authToken'
import { updateCollectionMetadata } from './collections'

import GraphQlRequest from '../util/request/graphQlRequest'

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

export const addMoreProjectGranuleResults = payload => ({
  type: ADD_MORE_PROJECT_GRANULE_RESULTS,
  payload
})

export const updateProjectGranuleResults = payload => ({
  type: UPDATE_PROJECT_GRANULE_RESULTS,
  payload
})

export const startProjectGranulesTimer = payload => ({
  type: STARTED_PROJECT_GRANULES_TIMER,
  payload
})

export const finishProjectGranulesTimer = payload => ({
  type: FINISHED_PROJECT_GRANULES_TIMER,
  payload
})

export const projectGranulesLoaded = payload => ({
  type: PROJECT_GRANULES_LOADED,
  payload
})

export const projectGranulesLoading = payload => ({
  type: PROJECT_GRANULES_LOADING,
  payload
})

export const projectGranulesErrored = payload => ({
  type: ERRORED_PROJECT_GRANULES,
  payload
})

export const selectAccessMethod = payload => ({
  type: SELECT_ACCESS_METHOD,
  payload
})

export const updateProjectGranuleParams = payload => ({
  type: UPDATE_PROJECT_GRANULE_PARAMS,
  payload
})

/**
 * Retrieve collection metadata for the collections provided
 * @param {String} collectionId Single collection to lookup, if null then all collections in the project will be retrieved
 */
export const getProjectCollections = () => (dispatch, getState) => {
  const {
    authToken,
    metadata,
    project
  } = getState()

  const { collections: collectionsMetadata = {} } = metadata

  const { defaultCmrSearchTags } = getApplicationConfig()

  const emptyProjectCollections = []

  const { collections: projectCollections } = project
  const { allIds } = projectCollections

  // Determine which collections are in the project that we have no metadata for
  allIds.forEach((projectCollection) => {
    const { [projectCollection]: collectionMetadata = {} } = collectionsMetadata

    // If any of the metadata is missing push this collection to our array to fetch metadata for
    if (isEmpty(collectionMetadata)) {
      emptyProjectCollections.push(projectCollection)
    }
  })

  // Default filteredIds to the provided collectionId
  let filteredIds = allIds

  // If no collectionId was provided
  if (allIds == null) {
    // Prepare to retrieve all collections that we have not already retrieved
    filteredIds = intersection(emptyProjectCollections, allIds)
  }

  // If no collection was provided and the project has no collections return null
  if (filteredIds.length === 0) {
    return buildPromise(null)
  }

  const collectionParams = prepareCollectionParams(getState())
  const searchParams = buildCollectionSearchParams(collectionParams)

  const {
    includeGranuleCounts,
    includeHasGranules
  } = searchParams

  const graphRequestObject = new GraphQlRequest(authToken)

  const graphQuery = `
    query GetCollections(
      $ids: [String]
      $includeHasGranules: Boolean
      $includeTags: String
      $pageSize: Int
    ) {
      collections(
        conceptId: $ids
        includeHasGranules: $includeHasGranules
        includeTags: $includeTags
        limit: $pageSize
      ) {
        items {
          archiveAndDistributionInformation
          boxes
          conceptId
          dataCenter
          dataCenters
          doi
          hasGranules
          relatedUrls
          scienceKeywords
          shortName
          spatialExtent
          summary
          tags
          temporalExtents
          title
          versionId
          services {
            count
            items {
              conceptId
              type
              supportedOutputFormats
              supportedReformattings
            }
          }
          variables {
            count
            items {
              conceptId
              definition
              longName
              name
              scienceKeywords
            }
          }
        }
      }
    }`

  const response = graphRequestObject.search(graphQuery, {
    ids: filteredIds,
    includeTags: defaultCmrSearchTags.join(','),
    includeGranuleCounts,
    includeHasGranules,
    pageSize: filteredIds.length
  })
    .then((response) => {
      const payload = []

      const {
        data: responseData,
        headers
      } = response

      const { data } = responseData
      const { collections } = data
      const { items } = collections

      items.forEach((metadata) => {
        const {
          archiveAndDistributionInformation,
          boxes,
          conceptId,
          dataCenter,
          hasGranules,
          services,
          shortName,
          summary,
          tags,
          title,
          variables,
          versionId
        } = metadata

        const focusedMetadata = createFocusedCollectionMetadata(metadata, authToken)

        payload.push({
          archiveAndDistributionInformation,
          boxes,
          id: conceptId,
          dataCenter,
          hasAllMetadata: true,
          hasGranules,
          services,
          shortName,
          summary,
          tags,
          title,
          variables,
          versionId,
          isCwic: hasGranules === false && hasTag({ tags }, 'org.ceos.wgiss.cwic.granules.prod', ''),
          ...focusedMetadata
        })

        dispatch(actions.fetchDataQualitySummaries(conceptId))
      })

      // A users authToken will come back with an authenticated request if a valid token was used
      dispatch(updateAuthTokenFromHeaders(headers))

      // Update metadata in the store
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
    await dispatch(actions.getProjectCollections())

    dispatch(actions.fetchAccessMethods([collectionId]))
    dispatch(actions.getProjectGranules())
  } catch (error) {
    parseError(error)
  }
}

/**
 * Adds a single single granule to a project. If the collection is not in the
 * project, it will be added first.
*/
export const addGranuleToProjectCollection = payload => (dispatch, getState) => {
  const { project } = getState()
  const { collections: projectCollections } = project
  const { allIds } = projectCollections

  const { collectionId } = payload

  // If the current collection is not in the project, add it.
  if (allIds.indexOf(collectionId) === -1) {
    dispatch(addProjectCollection(collectionId))
  }

  // Add the granule to the project collection.c
  dispatch({
    type: ADD_GRANULE_TO_PROJECT_COLLECTION,
    payload
  })

  dispatch(actions.updateProjectGranuleParams({ collectionId, pageNum: 1 }))

  dispatch(actions.getProjectGranules())
}

/**
 * Removes a single single granule from a project. If the collection would not have any granules
 * after removal, the collection is removed from the project.
*/
export const removeGranuleFromProjectCollection = payload => (dispatch, getState) => {
  const { collectionId, granuleId } = payload

  const { project } = getState()

  const { collections: projectCollections } = project
  const { byId: projectCollectionsById } = projectCollections
  const { [collectionId]: projectCollection } = projectCollectionsById
  const { granules: projectCollectionGranules } = projectCollection

  const {
    hits: granuleCount,
    removedGranuleIds = []
  } = projectCollectionGranules

  const indexInRemovedGranulesArray = removedGranuleIds.indexOf(granuleId)

  // If the granule does not exist in the removed granules array and the
  // removing the granule would result in 0 granules in the project, remove
  // the current collection from the project.
  if (
    indexInRemovedGranulesArray === -1
    && granuleCount === 1
  ) {
    dispatch(removeCollectionFromProject(collectionId))
  }

  dispatch({
    type: REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
    payload
  })

  dispatch(actions.updateProjectGranuleParams({ collectionId, pageNum: 1 }))

  dispatch(actions.getProjectGranules())
}

export const changeProjectGranulePageNum = ({ collectionId, pageNum }) => (dispatch, getState) => {
  const { projectCollectionGranules } = getState()

  const {
    collections: projectCollections
  } = projectCollectionGranules

  const {
    byId: projectCollectionsById
  } = projectCollections

  const {
    [collectionId]: projectCollection
  } = projectCollectionsById

  const {
    granules
  } = projectCollection

  const { allIds, hits } = granules

  // Only load the next page of granules if there are granule results already loaded
  // and the granules loaded is less than the total granules
  if (allIds.length > 0 && allIds.length < hits) {
    // Update the collection specific granule query params
    dispatch(updateProjectGranuleParams({
      collectionId,
      pageNum
    }))

    // Fetch the next page of granules
    dispatch(getProjectGranules())
  }
}
