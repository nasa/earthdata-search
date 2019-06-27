import { UPDATE_GRANULE_DOWNLOAD_PARAMS, UPDATE_GRANULE_LINKS } from '../constants/actionTypes'

const initialState = {
  granuleDownloadParams: {},
  granuleDownloadLinks: []
}

const updateGranuleDownloadParamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRANULE_DOWNLOAD_PARAMS: {
      return {
        ...state,
        granuleDownloadParams: action.payload,
        granuleDownloadLinks: []
      }
    }
    case UPDATE_GRANULE_LINKS: {
      return {
        ...state,
        granuleDownloadLinks: [
          ...state.granuleDownloadLinks,
          ...action.payload
        ]
      }
    }
    default:
      return state
  }
}

export default updateGranuleDownloadParamsReducer
