import { UPDATE_MAP } from '../constants/actionTypes'

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
  projection: 'epsg4326',
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
