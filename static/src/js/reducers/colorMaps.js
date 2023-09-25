import {
  ERRORED_COLOR_MAPS,
  SET_COLOR_MAPS_LOADING,
  SET_COLOR_MAPS_LOADED
} from '../constants/actionTypes'

const initialState = {}

const colorMapsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ERRORED_COLOR_MAPS: {
      const { product } = action.payload
      return {
        ...state,
        [product]: {
          ...state[product],
          isLoading: false,
          isLoaded: false,
          isErrored: true,
          colorMapData: {}
        }
      }
    }
    case SET_COLOR_MAPS_LOADING: {
      const { product } = action.payload
      return {
        ...state,
        [product]: {
          isLoading: true,
          isLoaded: false,
          isErrored: false,
          colorMapData: {}
        }
      }
    }
    case SET_COLOR_MAPS_LOADED: {
      const { product, colorMapData } = action.payload
      return {
        ...state,
        [product]: {
          isLoading: false,
          isLoaded: true,
          isErrored: false,
          colorMapData
        }
      }
    }
    default:
      return state
  }
}

export default colorMapsReducer
