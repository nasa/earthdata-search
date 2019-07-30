import { UPDATE_SHAPEFILE, ERRORED_SHAPEFILE } from '../constants/actionTypes'

const initialState = {
  shapefileError: false,
  shapefileId: undefined,
  shapefileName: undefined,
  shapefileSize: undefined
}

const shapefileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SHAPEFILE: {
      return {
        ...state,
        shapefileError: false,
        ...action.payload
      }
    }
    case ERRORED_SHAPEFILE: {
      const { payload } = action
      const { type } = payload
      return {
        shapefileError: {
          type
        }
      }
    }
    default:
      return state
  }
}

export default shapefileReducer
