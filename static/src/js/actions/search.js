import actions from './index'
import { UPDATE_COLLECTION_QUERY, UPDATE_GRANULE_QUERY } from '../constants/actionTypes'

export const updateCollectionQuery = payload => ({
  type: UPDATE_COLLECTION_QUERY,
  payload
})

export const updateGranuleQuery = payload => ({
  type: UPDATE_GRANULE_QUERY,
  payload
})

export const changeQuery = query => (dispatch) => {
  // query is changing, so reset pageNum
  const newQuery = {
    ...query,
    pageNum: 1
  }

  dispatch(updateCollectionQuery(newQuery))

  // Remove all saved granules in the metadata/collections store
  dispatch(actions.clearCollectionGranules())

  dispatch(actions.getCollections())
  dispatch(actions.getGranules())
  dispatch(actions.getTimeline())
}

export const changeProjectQuery = query => (dispatch) => {
  dispatch(updateCollectionQuery(query))
  dispatch(actions.getProjectCollections())
}

export const changeCollectionPageNum = pageNum => (dispatch) => {
  dispatch(updateCollectionQuery({ pageNum }))
  dispatch(actions.getCollections())
}

export const changeGranulePageNum = pageNum => (dispatch) => {
  dispatch(updateGranuleQuery({ pageNum }))
  dispatch(actions.getGranules())
}

export const clearFilters = () => (dispatch) => {
  const query = {
    keyword: '',
    spatial: {},
    temporal: {}
  }

  // Remove URL items
  dispatch(actions.changeUrl({}))

  // Update Store
  dispatch(changeQuery(query))
}
