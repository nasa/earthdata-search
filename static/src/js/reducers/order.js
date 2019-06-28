import { UPDATE_ORDER } from '../constants/actionTypes'

const initialState = {
  id: null,
  collections: {
    download: []
  }
}

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_ORDER: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}

export default orderReducer
