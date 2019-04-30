import { CollectionRequest } from '../util/request/cmr'
import { encodeTemporal } from '../util/url/temporalEncoders'

import {
  UPDATE_COLLECTIONS,
  LOADING_COLLECTIONS,
  LOADED_COLLECTIONS,
  ERRORED_COLLECTIONS,
  LOADING_FACETS,
  LOADED_FACETS,
  UPDATE_FACETS,
  ERRORED_FACETS,
  STARTED_COLLECTIONS_TIMER,
  FINISHED_COLLECTIONS_TIMER
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

export const startCollectionsTimer = () => ({
  type: STARTED_COLLECTIONS_TIMER
})

export const finishCollectionsTimer = () => ({
  type: FINISHED_COLLECTIONS_TIMER
})


/**
 * Perform a collections request based on the current redux state.
 * @param {function} dispatch - A dispatch function provided by redux.
 * @param {function} getState - A function that returns the current state provided by redux.
 */
export const getCollections = () => (dispatch, getState) => {
  const {
    facetsParams,
    query
  } = getState()

  const {
    keyword,
    spatial = {},
    temporal = {}
  } = query

  const {
    boundingBox,
    point,
    polygon
  } = spatial

  const temporalString = encodeTemporal(temporal)

  const {
    cmr: cmrFacets = {},
    feature: featureFacets = {}
  } = facetsParams

  const tagKey = []
  if (featureFacets.customizable) tagKey.push('edsc.extra.subset_service.*')
  if (featureFacets.mapImagery) tagKey.push('edsc.extra.gibs')

  dispatch(onCollectionsLoading())
  dispatch(onFacetsLoading())
  dispatch(startCollectionsTimer())

  const requestObject = new CollectionRequest()

  const response = requestObject.search({
    boundingBox,
    collectionDataType: featureFacets.nearRealTime ? ['NEAR_REAL_TIME'] : undefined,
    dataCenterH: cmrFacets.data_center_h,
    hasGranulesOrCwic: true,
    includeFacets: 'v2',
    includeGranuleCounts: true,
    includeHasGranules: true,
    includeTags: 'edsc.*,org.ceos.wgiss.cwic.granules.prod',
    instrumentH: cmrFacets.instrument_h,
    keyword,
    options: {
      science_keywords_h: {
        or: true
      },
      temporal: {
        limit_to_granules: true
      }
    },
    pageNum: 1,
    pageSize: 20,
    platformH: cmrFacets.platform_h,
    point,
    polygon,
    processingLevelIdH: cmrFacets.processing_level_id_h,
    projectH: cmrFacets.project_h,
    scienceKeywordsH: cmrFacets.science_keywords_h,
    sortKey: ['has_granules_or_cwic'],
    tagKey,
    temporal: temporalString
  })
    .then((response) => {
      const payload = {}

      payload.facets = response.data.feed.facets.children || []
      payload.hits = response.headers['cmr-hits']
      payload.keyword = keyword
      payload.results = response.data.feed.entry

      dispatch(finishCollectionsTimer())
      dispatch(onCollectionsLoaded({
        loaded: true
      }))
      dispatch(onFacetsLoaded({
        loaded: true
      }))
      dispatch(updateCollections(payload))
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
