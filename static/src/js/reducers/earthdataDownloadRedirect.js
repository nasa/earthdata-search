import { ADD_EARTHDATA_DOWNLOAD_REDIRECT } from '../constants/actionTypes'

const initialState = {}

const earthdataDownloadRedirectReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ADD_EARTHDATA_DOWNLOAD_REDIRECT: {
      return action.payload
    }
    default:
      return state
  }
}

export default earthdataDownloadRedirectReducer
