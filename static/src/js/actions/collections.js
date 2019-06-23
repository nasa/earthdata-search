import CollectionRequest from '../util/request/collectionRequest'
import {
  buildCollectionSearchParams,
  prepareCollectionParams
} from '../util/collections'
import { updateAuthTokenFromHeaders } from './authToken'


import {
  ADD_MORE_COLLECTION_RESULTS,
  UPDATE_COLLECTION_METADATA,
  UPDATE_COLLECTION_RESULTS,
  LOADING_COLLECTIONS,
  LOADED_COLLECTIONS,
  ERRORED_COLLECTIONS,
  LOADING_FACETS,
  LOADED_FACETS,
  UPDATE_FACETS,
  ERRORED_FACETS,
  STARTED_COLLECTIONS_TIMER,
  FINISHED_COLLECTIONS_TIMER,
  RESTORE_COLLECTIONS
} from '../constants/actionTypes'
import { getProjectCollections } from './project'

export const addMoreCollectionResults = payload => ({
  type: ADD_MORE_COLLECTION_RESULTS,
  payload
})

export const updateCollectionResults = payload => ({
  type: UPDATE_COLLECTION_RESULTS,
  payload
})

export const updateCollectionMetadata = payload => ({
  type: UPDATE_COLLECTION_METADATA,
  payload
})

export const onCollectionsLoading = () => ({
  type: LOADING_COLLECTIONS
})

export const onCollectionsLoaded = payload => ({
  type: LOADED_COLLECTIONS,
  payload
})

export const onCollectionsErrored = () => ({
  type: ERRORED_COLLECTIONS
})

export const updateFacets = payload => ({
  type: UPDATE_FACETS,
  payload
})

export const onFacetsLoading = () => ({
  type: LOADING_FACETS
})

export const onFacetsLoaded = payload => ({
  type: LOADED_FACETS,
  payload
})

export const onFacetsErrored = () => ({
  type: ERRORED_FACETS
})

export const startCollectionsTimer = () => ({
  type: STARTED_COLLECTIONS_TIMER
})

export const finishCollectionsTimer = () => ({
  type: FINISHED_COLLECTIONS_TIMER
})

export const restoreCollections = payload => (dispatch) => {
  dispatch({
    type: RESTORE_COLLECTIONS,
    payload
  })
  dispatch(getProjectCollections())
}

/**
 * Perform a collections request based on the current redux state.
 * @param {function} dispatch - A dispatch function provided by redux.
 * @param {function} getState - A function that returns the current state provided by redux.
 */
export const getCollections = () => (dispatch, getState) => {
  const collectionParams = prepareCollectionParams(getState())
  const {
    authToken,
    keyword,
    pageNum
  } = collectionParams

  if (pageNum === 1) {
    const emptyPayload = {
      results: []
    }
    dispatch(updateCollectionResults(emptyPayload))
  }

  dispatch(onCollectionsLoading())
  dispatch(onFacetsLoading())
  dispatch(startCollectionsTimer())

  const requestObject = new CollectionRequest(authToken)

  const response = requestObject.search(buildCollectionSearchParams(collectionParams))
    .then((response) => {
      const payload = {}
      const { 'cmr-hits': cmrHits } = response.headers

      payload.facets = response.data.feed.facets.children || []
      payload.hits = cmrHits
      payload.keyword = keyword
      payload.results = response.data.feed.entry

      dispatch(finishCollectionsTimer())
      dispatch(updateAuthTokenFromHeaders(response.headers))
      dispatch(onCollectionsLoaded({
        loaded: true
      }))
      dispatch(onFacetsLoaded({
        loaded: true
      }))
      if (pageNum === 1) {
        dispatch(updateCollectionResults(payload))
      } else {
        dispatch(addMoreCollectionResults(payload))
      }
      dispatch(updateFacets(payload))
    }, (error) => {
      dispatch(finishCollectionsTimer())
      dispatch(onCollectionsErrored())
      dispatch(onFacetsErrored())
      dispatch(onCollectionsLoaded({
        loaded: false
      }))
      dispatch(onFacetsLoaded({
        loaded: false
      }))

      throw new Error('Request failed', error)
    })
    .catch((e) => {
      console.log('Promise Rejected', e)
    })

  return response
}
