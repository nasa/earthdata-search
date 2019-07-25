import { UPDATE_SHAPEFILE } from '../constants/actionTypes'

const initialState = {
  shapefileId: undefined,
  shapefileName: undefined,
  shapefileSize: undefined
}

const shapefileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SHAPEFILE: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default shapefileReducer
