import { UPDATE_GRANULES } from '../constants/actionTypes'

const initialState = {
  byId: {},
  allIds: []
}

const granulesReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_GRANULES: {
      const byId = {}
      const allIds = []
      action.payload.results.forEach((result) => {
        const { id } = result
        byId[id] = result
        allIds.push(id)
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
