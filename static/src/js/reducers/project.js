import {
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  RESTORE_PROJECT,
  SELECT_ACCESS_METHOD,
  UPDATE_ACCESS_METHOD
} from '../constants/actionTypes'

const initialState = {
  byId: {},
  collectionIds: []
}

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COLLECTION_TO_PROJECT: {
      if (state.collectionIds.indexOf(action.payload) !== -1) return state

      return {
        ...state,
        collectionIds: [
          ...state.collectionIds,
          action.payload
        ]
      }
    }
    case REMOVE_COLLECTION_FROM_PROJECT: {
      const { collectionIds } = state
      const index = collectionIds.indexOf(action.payload)

      return {
        ...state,
        collectionIds: [
          ...state.collectionIds.slice(0, index),
          ...state.collectionIds.slice(index + 1)
        ]
      }
    }
    case RESTORE_PROJECT: {
      return {
        ...state,
        ...action.payload
      }
    }
    case SELECT_ACCESS_METHOD: {
      const { collectionId, selectedAccessMethod } = action.payload

      const byId = {
        ...state.byId
      }

      byId[collectionId] = {
        ...byId[collectionId],
        selectedAccessMethod
      }

      return {
        ...state,
        byId: {
          ...state.byId,
          ...byId
        }
      }
    }
    case UPDATE_ACCESS_METHOD: {
      const { collectionId, method } = action.payload

      const byId = {
        ...state.byId
      }

      const { accessMethods = {} } = byId[collectionId] || {}

      byId[collectionId] = {
        ...byId[collectionId],
        accessMethods: {
          ...accessMethods,
          ...method
        }
      }

      return {
        ...state,
        byId: {
          ...state.byId,
          ...byId
        }
      }
    }
    default:
      return state
  }
}

export default projectReducer
