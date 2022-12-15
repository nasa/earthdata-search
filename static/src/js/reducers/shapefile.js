import {
  CLEAR_SHAPEFILE,
  UPDATE_SHAPEFILE,
  ERRORED_SHAPEFILE,
  RESTORE_FROM_URL,
  LOADING_SHAPEFILE,
  CLEAR_FILTERS
} from '../constants/actionTypes'

const initialState = {
  isLoading: false,
  isLoaded: false,
  isErrored: false,
  shapefileId: undefined,
  shapefileName: undefined,
  shapefileSize: undefined
}

const shapefileReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case CLEAR_SHAPEFILE: {
      return {
        ...initialState
      }
    }
    case UPDATE_SHAPEFILE: {
      return {
        ...state,
        isErrored: false,
        isLoaded: true,
        isLoading: false,
        ...action.payload
      }
    }
    case LOADING_SHAPEFILE: {
      const { payload } = action
      const {
        name
      } = payload
      return {
        isErrored: false,
        isLoading: true,
        isLoaded: false,
        shapefileName: name
      }
    }
    case ERRORED_SHAPEFILE: {
      const { payload } = action
      const { type } = payload
      return {
        isErrored: {
          type
        },
        isLoaded: true,
        isLoading: false
      }
    }
    case RESTORE_FROM_URL: {
      const { shapefile } = action.payload

      return {
        ...state,
        ...shapefile
      }
    }
    case CLEAR_FILTERS: {
      return initialState
    }
    default:
      return state
  }
}

export default shapefileReducer
