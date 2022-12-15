import { UPDATE_GRANULE_LINKS, SET_GRANULE_LINKS_LOADING, SET_GRANULE_LINKS_LOADED } from '../constants/actionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false
}

const updateGranuleDownloadParamsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_GRANULE_LINKS: {
      const { [action.payload.id]: asdf = {} } = state
      const { links: currentLinks = {} } = asdf
      const {
        browse: currentBrowseLinks = [],
        download: currentDownloadLinks = [],
        s3: currentS3Links = []
      } = currentLinks

      const { links = {}, percentDone } = action.payload
      const {
        browse: newBrowseLinks = [],
        download: newDownloadLinks = [],
        s3: newS3Links = []
      } = links

      return {
        ...state,
        [action.payload.id]: {
          percentDone,
          links: {
            browse: [
              ...currentBrowseLinks,
              ...newBrowseLinks
            ],
            download: [
              ...currentDownloadLinks,
              ...newDownloadLinks
            ],
            s3: [
              ...currentS3Links,
              ...newS3Links
            ]
          }
        }
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
