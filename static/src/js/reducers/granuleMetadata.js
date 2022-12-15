import camelCaseKeys from 'camelcase-keys'

import {
  ADD_GRANULE_METADATA,
  UPDATE_GRANULE_METADATA
} from '../constants/actionTypes'

const initialState = {}

/**
 * Transforms CMR metadata before adding to the store
 * @param {Array} results Array of metadata results from CMR
 */
const processResults = (results) => {
  const byId = {}

  results.forEach((result) => {
    const { id } = result

    byId[id] = camelCaseKeys(result)
  })

  return byId
}

const granuleMetadataReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_GRANULE_METADATA: {
      const newState = {}

      const processPayload = processResults(action.payload)

      const currentKeys = Object.keys(processPayload)
      currentKeys.forEach((granuleId) => {
        const { [granuleId]: currentState = {} } = state

        newState[granuleId] = {
          ...currentState,
          ...processPayload[granuleId]
        }
      })

      return {
        ...state,
        ...newState
      }
    }
    case ADD_GRANULE_METADATA: {
      return {
        ...state,
        ...processResults(action.payload)
      }
    }
    default:
      return state
  }
}

export default granuleMetadataReducer
