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
