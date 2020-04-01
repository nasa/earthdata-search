import {
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  SELECT_ACCESS_METHOD,
  UPDATE_ACCESS_METHOD,
  ADD_ACCESS_METHODS,
  RESTORE_FROM_URL,
  SUBMITTING_PROJECT,
  SUBMITTED_PROJECT,
  UPDATE_ACCESS_METHOD_ORDER_COUNT
} from '../constants/actionTypes'

const initialState = {
  byId: {},
  collectionIds: [],
  collectionsRequiringChunking: [],
  isSubmitted: false,
  isSubmitting: false
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
    case RESTORE_FROM_URL: {
      const { project } = action.payload

      return {
        ...state,
        ...project
      }
    }
    case SELECT_ACCESS_METHOD: {
      const { collectionId, selectedAccessMethod, orderCount } = action.payload

      const byId = {
        ...state.byId
      }

      byId[collectionId] = {
        ...byId[collectionId],
        selectedAccessMethod,
        orderCount
      }

      const collectionsRequiringChunking = Object.keys(byId)
        .filter(collection => byId[collection].orderCount > 1)

      return {
        ...state,
        collectionsRequiringChunking,
        byId: {
          ...state.byId,
          ...byId
        }
      }
    }
    case ADD_ACCESS_METHODS: {
      const {
        collectionId,
        methods,
        orderCount,
        selectedAccessMethod
      } = action.payload

      const byId = {
        ...state.byId
      }

      const { accessMethods = {} } = byId[collectionId] || {}
      const existingMethods = {}

      Object.keys(methods).forEach((key) => {
        existingMethods[key] = {
          ...accessMethods[key],
          ...methods[key]
        }
      })

      byId[collectionId] = {
        ...byId[collectionId],
        accessMethods: {
          ...existingMethods
        }
      }

      let newOrderCount
      if (selectedAccessMethod) {
        byId[collectionId].selectedAccessMethod = selectedAccessMethod

        newOrderCount = ['download', 'opendap'].includes(selectedAccessMethod) ? 0 : orderCount
        byId[collectionId].orderCount = newOrderCount
      }

      const { collectionsRequiringChunking } = state
      const collectionIndex = collectionsRequiringChunking.indexOf(collectionId)

      // If the collection exists in the collectionsRequiringChunking array remove
      if (collectionIndex > -1) {
        collectionsRequiringChunking.splice(collectionIndex, 1)
      }

      // If it requires chunking, re add it
      if (newOrderCount > 1) {
        collectionsRequiringChunking.push(collectionId)
      }

      return {
        ...state,
        byId: {
          ...state.byId,
          ...byId
        },
        collectionsRequiringChunking
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
    case UPDATE_ACCESS_METHOD_ORDER_COUNT: {
      const {
        collectionId,
        orderCount
      } = action.payload

      const { byId } = state
      const { [collectionId]: desiredCollection } = byId

      byId[collectionId] = {
        ...desiredCollection,
        orderCount
      }

      const collectionsRequiringChunking = Object.keys(byId)
        .filter(collection => byId[collection].orderCount > 1)

      return {
        ...state,
        byId: {
          ...state.byId,
          ...byId[collectionId]
        },
        collectionsRequiringChunking
      }
    }
    case SUBMITTING_PROJECT: {
      return {
        ...state,
        isSubmitted: false,
        isSubmitting: true
      }
    }
    case SUBMITTED_PROJECT: {
      return {
        ...state,
        isSubmitted: true,
        isSubmitting: false
      }
    }
    default:
      return state
  }
}

export default projectReducer
