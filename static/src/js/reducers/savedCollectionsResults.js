import camelCaseKeys from 'camelcase-keys'

import {
  DELETE_SAVED_COLLECTIONS_RESULTS,
  UPDATE_SAVED_COLLECTIONS_RESULTS
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
      ...camelCaseKeys(result, {
        exclude: [
          'isCSDA'
        ]
      }),
      conceptId: id
    }
  })

  return byId
}

const savedCollectionsResultsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_SAVED_COLLECTIONS_RESULTS: {
      console.log('update saved collection metadata func.')
      const newState = {}

      console.log(action.payload)
      const processPayload = processResults(action.payload.results)

      const currentKeys = Object.keys(processPayload)
      console.log(processPayload)
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

    case DELETE_SAVED_COLLECTIONS_RESULTS: {
      console.log('delete saved collections')

      return {}
    }

    default:
      return state
  }
}

export default savedCollectionsResultsReducer
