import camelCaseKeys from 'camelcase-keys'

import {
  RESTORE_FROM_URL,
  DELETE_COLLECTION_SUBSCRIPTION,
  UPDATE_COLLECTION_METADATA,
  UPDATE_GRANULE_SUBSCRIPTIONS,
  UPDATE_GRANULE_SUBSCRIPTION
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

const collectionMetadataReducer = (state = initialState, action = {}) => {
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
    case UPDATE_GRANULE_SUBSCRIPTIONS: {
      const { payload } = action
      const { collectionId, subscriptions } = payload

      const collectionMetadata = state[collectionId]

      return {
        ...state,
        [collectionId]: {
          ...collectionMetadata,
          subscriptions
        }
      }
    }
    case DELETE_COLLECTION_SUBSCRIPTION: {
      const { payload } = action
      const { collectionConceptId, conceptId } = payload

      const collectionMetadata = state[collectionConceptId]
      const { subscriptions: subscriptionsMetadata = {} } = collectionMetadata
      const { items: currentSubscriptions = [], count } = subscriptionsMetadata

      const newSubscriptionItems = currentSubscriptions.filter((subscription) => {
        const { conceptId: subscriptionConceptId } = subscription
        return subscriptionConceptId !== conceptId
      })

      return {
        ...state,
        [collectionConceptId]: {
          ...collectionMetadata,
          subscriptions: {
            ...subscriptionsMetadata,
            count: count - 1,
            items: newSubscriptionItems
          }
        }
      }
    }
    case UPDATE_GRANULE_SUBSCRIPTION: {
      const { payload } = action
      const { collectionConceptId, conceptId, query } = payload

      const collectionMetadata = state[collectionConceptId]
      const { subscriptions: subscriptionsMetadata = {} } = collectionMetadata
      const { items: currentSubscriptions = [] } = subscriptionsMetadata

      const newSubscriptionItems = currentSubscriptions.map((subscription) => {
        const { conceptId: subscriptionConceptId } = subscription
        if (subscriptionConceptId === conceptId) {
          return {
            ...subscription,
            query
          }
        }
        return subscription
      })

      return {
        ...state,
        [collectionConceptId]: {
          ...collectionMetadata,
          subscriptions: {
            ...subscriptionsMetadata,
            items: newSubscriptionItems
          }
        }
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
