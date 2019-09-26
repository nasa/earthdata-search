import { UPDATE_GRANULE_LINKS } from '../constants/actionTypes'

const initialState = {}

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
    default:
      return state
  }
}

export default updateGranuleDownloadParamsReducer
