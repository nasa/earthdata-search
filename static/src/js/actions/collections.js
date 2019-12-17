import { isCancel } from 'axios'
import { isPlainObject } from 'lodash'

import CollectionRequest from '../util/request/collectionRequest'
import {
  buildCollectionSearchParams,
  prepareCollectionParams
} from '../util/collections'
import { updateAuthTokenFromHeaders } from './authToken'
import { getProjectCollections } from './project'
import { handleError } from './errors'

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
  RESTORE_COLLECTIONS,
  UPDATE_COLLECTION_GRANULE_FILTERS
} from '../constants/actionTypes'

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
 * Update the granule filters for the collection. Here we prune off any values that are not truthy,
 * as well as any objects that contain only falsy values.
 * @param {String} id - The id for the collection to update.
 * @param {Object} granuleFilters - An object containing the flags to apply as granuleFilters.
 */
export const updateCollectionGranuleFilters = (id, granuleFilters) => (dispatch, getState) => {
  const { metadata = {} } = getState()
  const { collections = {} } = metadata
  const { byId = {} } = collections
  const { [id]: collectionMetadata = {} } = byId
  const { granuleFilters: existingGranuleFilters = {} } = collectionMetadata

  const allGranuleFilters = {
    ...existingGranuleFilters,
    ...granuleFilters
  }

  const prunedFilters = Object.keys(allGranuleFilters).reduce((obj, key) => {
    const newObj = obj

    // If the value is not an object, only add the key if the value is truthy. This removes
    // any unset values
    if (!isPlainObject(allGranuleFilters[key])) {
      if (allGranuleFilters[key]) {
        newObj[key] = allGranuleFilters[key]
      }
    } else if (Object.values(allGranuleFilters[key]).some(key => !!key)) {
      // Otherwise, only add an object if it contains at least one truthy value
      newObj[key] = allGranuleFilters[key]
    }

    return newObj
  }, {})

  dispatch({
    type: UPDATE_COLLECTION_GRANULE_FILTERS,
    payload: {
      id,
      granuleFilters: prunedFilters
    }
  })
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
    })
    .catch((error) => {
      if (isCancel(error)) {
        console.warn('request cancelled')
        return
      }
      dispatch(finishCollectionsTimer())
      dispatch(onCollectionsErrored())
      dispatch(onFacetsErrored())
      dispatch(onCollectionsLoaded({
        loaded: false
      }))
      dispatch(onFacetsLoaded({
        loaded: false
      }))
      dispatch(handleError({
        error,
        action: 'getCollections',
        resource: 'collections'
      }))
    })

  requestObject.cancel()

  return response
}
