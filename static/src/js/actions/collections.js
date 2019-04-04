import API from '../util/api'

import {
  UPDATE_COLLECTIONS,
  LOADING_COLLECTIONS,
  LOADED_COLLECTIONS,
  ERRORED_COLLECTIONS,
  LOADING_FACETS,
  LOADED_FACETS,
  UPDATE_FACETS,
  ERRORED_FACETS,
  STARTED_TIMER,
  FINISHED_TIMER
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

export const startTimer = () => ({
  type: STARTED_TIMER
})

export const finishTimer = () => ({
  type: FINISHED_TIMER
})


/**
 * Perform a collections request based on the current redux state.
 * @param {function} dispatch - A dispatch function provided by redux.
 * @param {function} getState - A function that returns the current state provided by redux.
 */

export const getCollections = () => (dispatch, getState) => {
  const {
    query,
    facetsParams
  } = getState()

  const {
    keyword,
    spatial = {}
  } = query

  const {
    point,
    boundingBox,
    polygon
  } = spatial

  const tagKey = []
  if (facetsParams.feature.mapImagery) tagKey.push('edsc.extra.gibs')
  if (facetsParams.feature.customizable) tagKey.push('edsc.extra.subset_service.*')

  dispatch(onCollectionsLoading())
  dispatch(onFacetsLoading())
  dispatch(startTimer())

  const response = API.endpoints.collections.getAll({
    boundingBox,
    collectionDataType: facetsParams.feature.nearRealTime ? ['NEAR_REAL_TIME'] : undefined,
    hasGranulesOrCwic: true,
    includeFacets: 'v2',
    includeGranuleCounts: true,
    includeHasGranules: true,
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    keyword,
    options: {
      temporal: {
        limit_to_granules: true
      },
      science_keywords_h: {
        or: true
      }
    },
    pageNum: 1,
    pageSize: 20,
    point,
    polygon,
    scienceKeywordsH: facetsParams.cmr.science_keywords_h,
    platformH: facetsParams.cmr.platform_h,
    instrumentH: facetsParams.cmr.instrument_h,
    dataCenterH: facetsParams.cmr.data_center_h,
    projectH: facetsParams.cmr.project_h,
    processingLevelId: facetsParams.cmr.processing_level_id_h,
    sortKey: ['has_granules_or_cwic'],
    tagKey
  })
    .then((response) => {
      const payload = {}
      payload.results = response.data.feed.entry
      payload.hits = response.data.feed.hits
      payload.facets = response.data.feed.facets.children || []
      payload.keyword = keyword

      dispatch(finishTimer())
      dispatch(onCollectionsLoaded({
        loaded: true
      }))
      dispatch(onFacetsLoaded({
        loaded: true
      }))
      dispatch(updateCollections(payload))
      dispatch(updateFacets(payload))
    }, (error) => {
      dispatch(finishTimer())
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
