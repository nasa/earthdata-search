import camelCaseKeys from 'camelcase-keys'

import {
  RESTORE_FROM_URL,
  UPDATE_COLLECTION_METADATA
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

    byId[id] = {
      ...camelCaseKeys(result),
      conceptId: id
    }
  })

  return byId
}

const collectionMetadataReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_COLLECTION_METADATA: {
      const newState = {}

      const processPayload = processResults(action.payload)

      const currentKeys = Object.keys(processPayload)
      currentKeys.forEach((collectionId) => {
        const { [collectionId]: currentState = {} } = state

        newState[collectionId] = {
          ...currentState,
          ...processPayload[collectionId]
        }
      })

      return {
        ...state,
        ...newState
      }
    }
    case RESTORE_FROM_URL: {
      const { collections } = action.payload

      return {
        ...state,
        ...collections
      }
    }
    default:
      return state
  }
}

export default collectionMetadataReducer
