import { SET_SOTO_LAYERS } from '../constants/actionTypes'

const initialState = {
  sotoLayers: []
}

const handoffsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SOTO_LAYERS: {
      return {
        ...state,
        sotoLayers: action.payload
      }
    }
    default:
      return state
  }
}

export default handoffsReducer
