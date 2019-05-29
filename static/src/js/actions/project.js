import actions from './index'
import {
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  UPDATE_PROJECT_GRANULES,
  TOGGLE_COLLECTION_VISIBILITY
} from '../constants/actionTypes'
import CollectionRequest from '../util/request/collectionRequest'
import GranuleRequest from '../util/request/granuleRequest'
import CwicGranuleRequest from '../util/request/cwic'
import { updateAuthTokenFromHeaders } from './authToken'
import { updateCollectionMetadata } from './collections'
import { prepareCollectionParams, buildSearchParams } from '../util/collections'
import { prepareGranuleParams, populateGranuleResults } from '../util/granules'
import { convertSize } from '../util/project'

export const addCollectionToProject = payload => ({
  type: ADD_COLLECTION_TO_PROJECT,
  payload
})

export const removeCollectionFromProject = payload => ({
  type: REMOVE_COLLECTION_FROM_PROJECT,
  payload
})

export const updateProjectGranules = payload => ({
  type: UPDATE_PROJECT_GRANULES,
  payload
})

export const toggleCollectionVisibility = payload => ({
  type: TOGGLE_COLLECTION_VISIBILITY,
  payload
})

export const getProjectGranules = () => (dispatch, getState) => {
  const { metadata } = getState()
  const { collections } = metadata
  const { projectIds } = collections

  return Promise.all(projectIds.map((collectionId) => {
    const granuleParams = prepareGranuleParams(getState(), collectionId)

    if (!granuleParams) {
      return null
    }

    const {
      authToken,
      boundingBox,
      isCwicCollection,
      pageNum,
      point,
      polygon,
      temporalString
    } = granuleParams

    let requestObject = null
    if (isCwicCollection) {
      requestObject = new CwicGranuleRequest()
    } else {
      requestObject = new GranuleRequest(authToken)
    }

    const searchResponse = requestObject.search({
      boundingBox,
      echoCollectionId: collectionId,
      pageNum,
      pageSize: 20,
      point,
      polygon,
      sortKey: '-start_date',
      temporal: temporalString
    })
      .then((response) => {
        const payload = populateGranuleResults(collectionId, isCwicCollection, response)
        let size = 0
        payload.results.forEach((granule) => {
          size += parseFloat(granule.granule_size || 0)
        })

        const totalSize = size / payload.results.length * payload.hits

        payload.totalSize = convertSize(totalSize)

        dispatch(updateAuthTokenFromHeaders(response.headers))
        dispatch(updateProjectGranules(payload))
      })
      .catch((e) => {
        if (e.response) {
          const { data } = e.response
          const { errors = [] } = data

          console.log(errors)
        } else {
          console.log(e)
        }
      })

    return searchResponse
  }))
}

export const getProjectCollections = () => (dispatch, getState) => {
  const collectionParams = prepareCollectionParams(getState())
  const { metadata } = getState()
  const { collections } = metadata
  const { projectIds } = collections

  if (projectIds.length === 0) {
    return null
  }

  const { authToken } = getState()
  const requestObject = new CollectionRequest(authToken)

  const response = requestObject.search(buildSearchParams({
    ...collectionParams,
    featureFacets: {},
    conceptId: projectIds,
    includeFacets: undefined,
    tagKey: undefined
  }))
    .then((response) => {
      const payload = []
      const { entry } = response.data.feed
      entry.forEach((collection) => {
        const { id } = collection
        payload.push({ [id]: collection })
      })

      dispatch(updateAuthTokenFromHeaders(response.headers))
      dispatch(updateCollectionMetadata(payload))
      dispatch(actions.getProjectGranules())
    }, (error) => {
      throw new Error('Request failed', error)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}

export const addProjectCollection = collectionId => (dispatch) => {
  dispatch(addCollectionToProject(collectionId))
  dispatch(actions.getProjectCollections())
}
