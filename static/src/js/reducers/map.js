import { UPDATE_MAP } from '../constants/actionTypes'
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

const mapReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_MAP: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default mapReducer
