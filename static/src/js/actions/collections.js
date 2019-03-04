import API from '../util/api'

import {
  UPDATE_COLLECTIONS,
  LOADING_COLLECTIONS,
  LOADED_COLLECTIONS,
  ERRORED_COLLECTIONS,
  LOADING_FACETS,
  LOADED_FACETS,
  UPDATE_FACETS,
  ERRORED_FACETS
} from '../constants/actionTypes'

export const updateCollections = payload => ({
  type: UPDATE_COLLECTIONS,
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

export const getCollections = keyword => (dispatch) => {
  dispatch(onCollectionsLoading())
  dispatch(onFacetsLoading())

  API.endpoints.collections.getAll({
    keyword,
    includeFacets: 'v2',
    pageSize: 20,
    pageNum: 1,
    hasGranulesOrCwic: true,
    includeHasGranules: true,
    includeGranuleCounts: true,
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    sortKey: ['has_granules_or_cwic']
  }).then((response) => {
    const payload = {}
    payload.results = response.data.feed.entry
    payload.hits = response.data.feed.hits
    payload.facets = response.data.feed.facets.children || []

    if (keyword) {
      payload.keyword = keyword
    }

    dispatch(onCollectionsLoaded({
      loaded: true
    }))
    dispatch(onFacetsLoaded({
      loaded: true
    }))
    dispatch(updateCollections(payload))
    dispatch(updateFacets(payload))
  }, (error) => {
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
}
