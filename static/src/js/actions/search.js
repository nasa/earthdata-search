import { getCollections } from './collections'
import { getGranules } from './granules'

export const updateSearchQuery = payload => ({
  type: 'UPDATE_SEARCH_QUERY',
  payload
})

export const updateSpatialQuery = payload => ({
  type: 'UPDATE_SPATIAL_QUERY',
  payload
})

export const changeQuery = query => (dispatch, getState) => {
  console.log('query', query)

  dispatch(updateSearchQuery(query))
  const updatedQuery = getState().query
  console.log('getState', getState().query)
  dispatch(getCollections(updatedQuery))
}

export const changeP = collectionId => (dispatch) => {
  dispatch(getGranules(collectionId))
}
