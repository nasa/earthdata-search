import { UPDATE_GRANULE_LINKS, SET_GRANULE_LINKS_LOADING, SET_GRANULE_LINKS_LOADED } from '../constants/actionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false
}

const updateGranuleDownloadParamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRANULE_LINKS: {
      const { [action.payload.id]: currentLinks = [] } = state

      return {
        ...state,
        [action.payload.id]: [
          ...currentLinks,
          ...action.payload.links
        ]
      }
    }
    case SET_GRANULE_LINKS_LOADING: {
      return {
        ...state,
        isLoading: true,
        isLoaded: false
      }
    }
    case SET_GRANULE_LINKS_LOADED: {
      return {
        ...state,
        isLoading: false,
        isLoaded: true
      }
    }
    default:
      return state
  }
}

export default updateGranuleDownloadParamsReducer
