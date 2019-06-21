import { UPDATE_GRANULE_DOWNLOAD_PARAMS } from '../constants/actionTypes'

const initialState = {}

const updateGranuleDownloadParamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRANULE_DOWNLOAD_PARAMS: {
      return action.payload
    }
    default:
      return state
  }
}

export default updateGranuleDownloadParamsReducer
