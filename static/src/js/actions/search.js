import { getCollections } from './collections'
import { getGranules } from './granules'

export const updateSearchQuery = payload => ({
  type: 'UPDATE_SEARCH_QUERY',
  payload
})

export const changeQuery = query => (dispatch) => {
  dispatch(getCollections(query))
  dispatch(updateSearchQuery(query))
}

export const changeP = collectionId => (dispatch) => {
  dispatch(getGranules(collectionId))
}
