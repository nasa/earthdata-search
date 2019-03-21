import actions from './index'
import { UPDATE_SEARCH_QUERY } from '../constants/actionTypes'

export const updateSearchQuery = payload => ({
  type: UPDATE_SEARCH_QUERY,
  payload
})

export const changeQuery = query => (dispatch) => {
  dispatch(updateSearchQuery(query))
  dispatch(actions.getCollections())
}

// TODO I think we might want to rethink this
// maybe have a collectionQuery and a granuleQuery
export const changeP = collectionId => (dispatch) => {
  dispatch(actions.getGranules(collectionId))
}

export const clearFilters = () => (dispatch) => {
  const query = {
    keyword: '',
    spatial: {}
  }

  // Remove URL items
  dispatch(actions.changeUrl({}))

  // Update Store
  dispatch(changeQuery(query))
}
