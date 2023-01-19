import { UPDATE_MAP, RESTORE_FROM_URL } from '../constants/actionTypes'
import projections from '../util/map/projections'

const initialState = {
  base: {
    blueMarble: true,
    trueColor: false,
    landWaterMap: false
  },
  latitude: 0,
  longitude: 0,
  overlays: {
    referenceFeatures: true,
    coastlines: false,
    referenceLabels: true
  },
  projection: projections.geographic,
  zoom: 2
}

const mapReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_MAP: {
      return {
        ...state,
        ...action.payload
      }
    }
    case RESTORE_FROM_URL: {
      const { map } = action.payload

      Object.keys(map).forEach((key) => map[key] === undefined && delete map[key])

      return {
        ...state,
        ...map
      }
    }
    default:
      return state
  }
}

export default mapReducer
