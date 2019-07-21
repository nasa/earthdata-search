import {
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  RESTORE_PROJECT,
  SELECT_ACCESS_METHOD,
  UPDATE_ACCESS_METHOD,
  ADD_ACCESS_METHODS
} from '../constants/actionTypes'

const initialState = {
  byId: {},
  collectionIds: []
}

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COLLECTION_TO_PROJECT: {
      const collectionId = action.payload
      if (state.collectionIds.indexOf(collectionId) !== -1) return state

      const byId = {
        ...state.byId
      }

      byId[collectionId] = {}

      return {
        ...state,
        byId: {
          ...state.byId,
          ...byId
        },
        collectionIds: [
          ...state.collectionIds,
          collectionId
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
      const { collectionIds } = action.payload
      const byId = {}

      collectionIds.forEach((id) => {
        byId[id] = {}
      })

      return {
        byId,
        collectionIds
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
    case ADD_ACCESS_METHODS: {
      const { collectionId, methods, selectedAccessMethod } = action.payload

      const byId = {
        ...state.byId
      }

      const { accessMethods = {} } = byId[collectionId] || {}

      byId[collectionId] = {
        ...byId[collectionId],
        accessMethods: {
          ...accessMethods,
          ...methods
        },
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

      const [methodKey] = Object.keys(method)
      const { accessMethods = {} } = byId[collectionId] || {}
      const oldMethod = accessMethods[methodKey] || {}

      byId[collectionId] = {
        ...byId[collectionId],
        accessMethods: {
          ...accessMethods,
          [methodKey]: {
            ...oldMethod,
            ...method[methodKey]
          }
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
