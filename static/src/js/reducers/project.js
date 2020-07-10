import {
  ADD_ACCESS_METHODS,
  ADD_COLLECTION_TO_PROJECT,
  ADD_GRANULE_TO_PROJECT_COLLECTION,
  CLEAR_REMOVED_GRANULE_ID,
  REMOVE_COLLECTION_FROM_PROJECT,
  REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
  RESTORE_FROM_URL,
  SELECT_ACCESS_METHOD,
  SUBMITTED_PROJECT,
  SUBMITTING_PROJECT,
  UPDATE_ACCESS_METHOD,
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
    case ADD_GRANULE_TO_PROJECT_COLLECTION: {
      const { collectionId, granuleId } = action.payload

      if (state.collectionIds.indexOf(collectionId) === -1) return state

      let byId = {
        ...state.byId
      }

      const collection = byId[collectionId]
      const { addedGranuleIds = [], removedGranuleIds = [] } = collection

      if (removedGranuleIds.length) {
        // If there are no added granules or removed granules but the collection is in the project,
        // the user is trying to add a granule back a granule thats been removed from a project thats been added
        const index = removedGranuleIds.indexOf(granuleId)

        if (index !== -1) {
          byId = {
            ...byId,
            [collectionId]: {
              ...collection,
              removedGranuleIds: [
                ...removedGranuleIds.slice(0, index),
                ...removedGranuleIds.slice(index + 1)
              ]
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

      // If the granule already exists in added granule ids, do nothing.
      if (addedGranuleIds.indexOf(granuleId) !== -1) return state

      // Add the granule to the list.
      byId = {
        ...byId,
        [collectionId]: {
          ...collection,
          addedGranuleIds: [
            ...addedGranuleIds,
            granuleId
          ]
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
    case REMOVE_GRANULE_FROM_PROJECT_COLLECTION: {
      const { collectionId, granuleId } = action.payload

      // If the collection does not exist in the project, dont do anything.
      if (state.collectionIds.indexOf(collectionId) === -1) return state

      const collection = state.byId[collectionId]
      const { addedGranuleIds = [], removedGranuleIds = [] } = collection

      let byId = {
        ...state.byId,
        [collectionId]: {
          ...collection
        }
      }

      if (!addedGranuleIds.length) {
        // If there are no added granules, a user is trying to remove a granule from
        // a collection in their project.
        const index = removedGranuleIds.indexOf(granuleId)

        if (index === -1) {
          byId = {
            ...byId,
            [collectionId]: {
              ...byId[collectionId],
              removedGranuleIds: [
                ...removedGranuleIds,
                granuleId
              ]
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

      const index = addedGranuleIds.indexOf(granuleId)

      byId = {
        ...byId,
        [collectionId]: {
          ...byId[collectionId],
          addedGranuleIds: [
            ...addedGranuleIds.slice(0, index),
            ...addedGranuleIds.slice(index + 1)
          ]
        }
      }

      const collectionIndex = state.collectionIds.indexOf(collectionId)

      // If the last granule is being removed from the added granules array,
      // remove the collection from the project as well to prevent having all
      // granules added to the project.
      const collectionIds = addedGranuleIds.length === 1
        ? [
          ...state.collectionIds.slice(0, collectionIndex),
          ...state.collectionIds.slice(collectionIndex + 1)
        ]
        : [
          ...state.collectionIds
        ]

      return {
        ...state,
        byId: {
          ...state.byId,
          ...byId
        },
        collectionIds
      }
    }
    case CLEAR_REMOVED_GRANULE_ID: {
      const { collectionIds } = state
      const byId = {
        ...state.byId
      }

      collectionIds.forEach((collectionId) => {
        if ('removedGranuleIds' in byId[collectionId]) {
          byId[collectionId].removedGranuleIds = []
        }
      })

      return {
        ...state,
        byId
      }
    }
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
      const { byId, collectionIds } = state
      const collectionId = action.payload
      const index = collectionIds.indexOf(collectionId)

      const projectById = { ...byId }
      delete projectById[collectionId]

      return {
        ...state,
        byId: {
          ...projectById
        },
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

      const newCollection = {
        ...desiredCollection,
        orderCount
      }

      const collectionsRequiringChunking = Object.keys(byId)
        .filter(collection => byId[collection].orderCount > 1)

      return {
        ...state,
        byId: {
          ...state.byId,
          [collectionId]: newCollection
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
