import { UPDATE_GRANULES } from '../constants/actionTypes'

const initialState = {
  byId: {},
  allIds: []
}

const resultToStateObj = result => result

const granulesReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRANULES: {
      const byId = {}
      const allIds = []
      action.payload.results.forEach((result, i) => {
        byId[i] = resultToStateObj(result)
        allIds.push(i)
      })

      return {
        ...state,
        byId,
        allIds
      }
    }
    default:
      return state
  }
}

export default granulesReducer
