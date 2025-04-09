import { UPDATE_MAP, RESTORE_FROM_URL } from '../constants/actionTypes'
import projections from '../util/map/projections'

export const initialState = {
  base: {
    worldImagery: true,
    trueColor: false,
    landWaterMap: false
  },
  latitude: 0,
  longitude: 0,
  overlays: {
    bordersRoads: true,
    coastlines: false,
    placeLabels: true
  },
  projection: projections.geographic,
  rotation: 0,
  zoom: 3
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
      const { map = {} } = action.payload

      Object.keys(map).forEach((key) => map[key] === undefined && delete map[key])

      return {
        ...initialState,
        ...map
      }
    }

    default:
      return state
  }
}

export default mapReducer
