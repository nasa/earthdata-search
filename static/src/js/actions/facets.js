import {
  ERRORED_FACETS,
  LOADED_FACETS,
  LOADING_FACETS,
  UPDATE_FACETS
} from '../constants/actionTypes'

export const updateFacets = (payload) => ({
  type: UPDATE_FACETS,
  payload
})

export const onFacetsLoading = () => ({
  type: LOADING_FACETS
})

export const onFacetsLoaded = (payload) => ({
  type: LOADED_FACETS,
  payload
})

export const onFacetsErrored = () => ({
  type: ERRORED_FACETS
})
