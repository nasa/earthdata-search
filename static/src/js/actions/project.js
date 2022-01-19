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
import { getCollectionsMetadata } from '../selectors/collectionMetadata'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getUsername } from '../selectors/user'
import { isProjectCollectionValid } from '../util/isProjectCollectionValid'
import { isCSDACollection } from '../util/isCSDACollection'
import { getOpenSearchOsddLink } from '../util/getOpenSearchLink'

import GraphQlRequest from '../util/request/graphQlRequest'

export const submittingProject = () => ({
  type: SUBMITTING_PROJECT
})

export const submittedProject = () => ({
  type: SUBMITTED_PROJECT
})

export const addCollectionToProject = (payload) => ({
  type: ADD_COLLECTION_TO_PROJECT,
  payload
})

export const removeCollectionFromProject = (payload) => ({
  type: REMOVE_COLLECTION_FROM_PROJECT,
  payload
})

export const toggleCollectionVisibility = (payload) => ({
  type: TOGGLE_COLLECTION_VISIBILITY,
  payload
})

export const restoreProject = (payload) => ({
  type: RESTORE_PROJECT,
  payload
})

export const addAccessMethods = (payload) => ({
  type: ADD_ACCESS_METHODS,
  payload
})

export const updateAccessMethod = (payload) => ({
  type: UPDATE_ACCESS_METHOD,
  payload: {
    ...payload,
    isValid: isProjectCollectionValid(payload.method)
  }
})

export const addMoreProjectGranuleResults = (payload) => ({
  type: ADD_MORE_PROJECT_GRANULE_RESULTS,
  payload
})

export const updateProjectGranuleResults = (payload) => ({
  type: UPDATE_PROJECT_GRANULE_RESULTS,
  payload
})

export const startProjectGranulesTimer = (payload) => ({
  type: STARTED_PROJECT_GRANULES_TIMER,
  payload
})

export const finishProjectGranulesTimer = (payload) => ({
  type: FINISHED_PROJECT_GRANULES_TIMER,
  payload
})

export const projectGranulesLoaded = (payload) => ({
  type: PROJECT_GRANULES_LOADED,
  payload
})

export const projectGranulesLoading = (payload) => ({
  type: PROJECT_GRANULES_LOADING,
  payload
})

export const projectGranulesErrored = (payload) => ({
  type: ERRORED_PROJECT_GRANULES,
  payload
})

export const selectAccessMethod = (payload) => ({
  type: SELECT_ACCESS_METHOD,
  payload
})

export const updateProjectGranuleParams = (payload) => ({
  type: UPDATE_PROJECT_GRANULE_PARAMS,
  payload
})

/**
 * Retrieve collection metadata for the collections provided
 * @param {String} collectionId Single collection to lookup, if null then all collections in the project will be retrieved
 */
export const getProjectCollections = () => async (dispatch, getState) => {
  const state = getState()
  const {
    authToken,
    project
  } = state

  // Retrieve data from Redux using selectors
  const collectionsMetadata = getCollectionsMetadata(state)
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const username = getUsername(state)

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

  const collectionParams = prepareCollectionParams(state)

  const searchParams = buildCollectionSearchParams(collectionParams)

  const {
    includeGranuleCounts,
    includeHasGranules
  } = searchParams

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    query GetCollections(
      $ids: [String]
      $includeHasGranules: Boolean
      $includeTags: String
      $pageSize: Int
      $subscriberId: String
    ) {
      collections (
        conceptId: $ids
        includeHasGranules: $includeHasGranules
        includeTags: $includeTags
        limit: $pageSize
      ) {
        items {
          abstract
          archiveAndDistributionInformation
          associatedDois
          boxes
          conceptId
          coordinateSystem
          dataCenter
          dataCenters
          directDistributionInformation
          doi
          hasGranules
          lines
          points
          polygons
          relatedCollections (
            limit: 3
          ) {
            count
            items {
              id
              title
            }
          }
          relatedUrls
          scienceKeywords
          shortName
          spatialExtent
          tags
          temporalExtents
          tilingIdentificationSystems
          title
          versionId
          services {
            count
            items {
              conceptId
              longName
              name
              type
              url
              serviceOptions
              supportedOutputProjections
              supportedReformattings
            }
          }
          granules {
            count
            items {
              conceptId
              onlineAccessFlag
            }
          }
          subscriptions (
            subscriberId: $subscriberId
          ) {
            count
            items {
              collectionConceptId
              conceptId
              name
              query
            }
          }
          tools {
            count
            items {
              longName
              name
              potentialAction
            }
          }
          variables {
            count
            items {
              conceptId
              definition
              longName
              name
              nativeId
              scienceKeywords
            }
          }
        }
      }
    }`

  const response = graphQlRequestObject.search(graphQuery, {
    ids: filteredIds,
    includeTags: defaultCmrSearchTags.join(','),
    includeGranuleCounts,
    includeHasGranules,
    pageSize: filteredIds.length,
    subscriberId: username
  })
    .then((response) => {
      const payload = []

      const {
        data: responseData
      } = response

      const { data } = responseData
      const { collections } = data
      const { items } = collections

      items.forEach((metadata) => {
        const {
          abstract,
          archiveAndDistributionInformation,
          associatedDois,
          boxes,
          conceptId,
          coordinateSystem,
          dataCenter,
          dataCenters,
          granules,
          hasGranules,
          services,
          shortName,
          subscriptions,
          tags,
          tilingIdentificationSystems,
          title,
          tools,
          variables,
          versionId
        } = metadata

        const focusedMetadata = createFocusedCollectionMetadata(
          metadata,
          authToken,
          earthdataEnvironment
        )

        payload.push({
          abstract,
          archiveAndDistributionInformation,
          associatedDois,
          boxes,
          coordinateSystem,
          dataCenter,
          granules,
          hasAllMetadata: true,
          hasGranules,
          id: conceptId,
          isCSDA: isCSDACollection(dataCenters),
          isOpenSearch: !!getOpenSearchOsddLink(metadata),
          services,
          shortName,
          subscriptions,
          tags,
          tilingIdentificationSystems,
          title,
          tools,
          variables,
          versionId,
          ...focusedMetadata
        })

        dispatch(actions.fetchDataQualitySummaries(conceptId))

        // If any tools are SOTO, call fetchSotoLayers
        const { items } = tools
        if (items && items.some((item) => item.name.toLowerCase() === 'soto')) {
          dispatch(actions.fetchSotoLayers())
        }
      })

      // Update metadata in the store
      dispatch(actions.updateCollectionMetadata(payload))
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'getProjectCollections',
        resource: 'project collections'
      }))
    })

  return response
}

/**
 * Adds a single collection to the project
 * @param {String} collectionId The CMR concept id of the collection to add to the project
 */
export const addProjectCollection = (collectionId) => async (dispatch) => {
  dispatch(actions.addCollectionToProject(collectionId))

  dispatch(actions.getProjectGranules())
}

/**
 * Adds a single single granule to a project. If the collection is not in the
 * project, it will be added first.
*/
export const addGranuleToProjectCollection = (payload) => (dispatch, getState) => {
  const { project } = getState()
  const { collections: projectCollections } = project
  const { allIds } = projectCollections

  const { collectionId } = payload

  // If the current collection is not in the project, add it.
  if (allIds.indexOf(collectionId) === -1) {
    dispatch(actions.addCollectionToProject(collectionId))
  }

  // Add the granule to the project collection.
  dispatch({
    type: ADD_GRANULE_TO_PROJECT_COLLECTION,
    payload
  })

  dispatch(actions.updateProjectGranuleParams({ collectionId, pageNum: 1 }))

  dispatch(actions.getProjectGranules())
}

/**
 * Removes a single granule from a project. If the collection would not have any granules
 * after removal, the collection is removed from the project.
*/
export const removeGranuleFromProjectCollection = (payload) => (dispatch, getState) => {
  const { collectionId, granuleId } = payload

  const { project } = getState()

  const { collections: projectCollections = {} } = project
  const { byId: projectCollectionsById = {} } = projectCollections
  const { [collectionId]: projectCollection = {} } = projectCollectionsById
  const { granules: projectCollectionGranules } = projectCollection

  const {
    addedGranuleIds = [],
    hits: granuleCount
  } = projectCollectionGranules

  const indexInAddedGranulesArray = addedGranuleIds.indexOf(granuleId)

  // If the granule is the last granule in the added granules array or the granule count is 1
  if (
    (indexInAddedGranulesArray === 0 && addedGranuleIds.length === 1)
    || granuleCount === 1
  ) {
    // Remove the collection from the project
    dispatch(actions.removeCollectionFromProject(collectionId))
  } else {
    dispatch({
      type: REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
      payload
    })

    // Updates the project collection granule query resetting the page number
    // to one for the subsequent request
    dispatch(actions.updateProjectGranuleParams({ collectionId, pageNum: 1 }))

    // Request granules with the updated parameters
    dispatch(actions.getProjectGranules())
  }
}

export const changeProjectGranulePageNum = ({ collectionId, pageNum }) => (dispatch, getState) => {
  const { project } = getState()

  const {
    collections: projectCollections
  } = project

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
    dispatch(actions.updateProjectGranuleParams({
      collectionId,
      pageNum
    }))

    // Fetch the next page of granules
    dispatch(actions.getProjectGranules())
  }
}
