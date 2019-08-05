import { UPDATE_GRANULE_DOWNLOAD_PARAMS, UPDATE_GRANULE_LINKS } from '../constants/actionTypes'

const initialState = {
  retrievalCollection: {},
  granuleLinks: []
}

const updateGranuleDownloadParamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRANULE_DOWNLOAD_PARAMS: {
      return {
        ...state,
        retrievalCollection: action.payload,
        granuleLinks: []
      }
    }
    case UPDATE_GRANULE_LINKS: {
      return {
        ...state,
        granuleLinks: [
          ...state.granuleLinks,
          ...action.payload
        ]
      }
    }
    default:
      return state
  }
}

export default updateGranuleDownloadParamsReducer
