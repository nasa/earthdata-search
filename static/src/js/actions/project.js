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
  SUBMITTED_PROJECT
} from '../constants/actionTypes'
import { updateAuthTokenFromHeaders } from './authToken'
import { updateCollectionMetadata } from './collections'
import { createFocusedCollectionMetadata, getCollectionMetadata } from '../util/focusedCollection'
import { isProjectCollectionValid } from '../util/isProjectCollectionValid'
import { buildCollectionSearchParams, prepareCollectionParams } from '../util/collections'

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

export const selectAccessMethod = payload => ({
  type: SELECT_ACCESS_METHOD,
  payload
})

export const getProjectCollections = collectionId => (dispatch, getState) => {
  const { project } = getState()
  const { collectionIds: projectIds = [] } = project

  const filteredIds = !collectionId ? projectIds : [collectionId]

  if (filteredIds.length === 0) {
    return null
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
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    includeGranuleCounts,
    includeHasGranules,
    boundingBox,
    hasGranulesOrCwic,
    pageSize: 20,
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
      dispatch(actions.getGranules(filteredIds)).then(() => {
        // The process of fetching access methods requires that we have providers retrieved
        // in order to look up provider guids
        dispatch(actions.fetchProviders()).then(() => {
          dispatch(actions.fetchAccessMethods(filteredIds))
        })
      })
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

export const addProjectCollection = collectionId => (dispatch) => {
  dispatch(addCollectionToProject(collectionId))
  dispatch(actions.getProjectCollections(collectionId))
}
