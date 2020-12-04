import actions from './index'

import {
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  REMOVE_SUBSCRIPTION,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_SUBSCRIPTION_RESULTS
} from '../constants/actionTypes'

import { extractGranuleSearchParams, prepareGranuleParams } from '../util/granules'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getFocusedCollectionId } from '../selectors/focusedCollection'
import { getFocusedCollectionMetadata } from '../selectors/collectionMetadata'
import { getUsername } from '../selectors/user'

import { addToast } from '../util/addToast'
import GraphQlRequest from '../util/request/graphQlRequest'
import { prepareSubscriptionQuery } from '../util/subscriptions'

export const updateSubscriptionResults = payload => ({
  type: UPDATE_SUBSCRIPTION_RESULTS,
  payload
})

export const onSubscriptionsLoading = () => ({
  type: LOADING_SUBSCRIPTIONS
})

export const onSubscriptionsLoaded = payload => ({
  type: LOADED_SUBSCRIPTIONS,
  payload
})

export const onSubscriptionsErrored = payload => ({
  type: ERRORED_SUBSCRIPTIONS,
  payload
})

export const startSubscriptionsTimer = () => ({
  type: STARTED_SUBSCRIPTIONS_TIMER
})

export const finishSubscriptionsTimer = () => ({
  type: FINISHED_SUBSCRIPTIONS_TIMER
})

export const removeSubscription = payload => ({
  type: REMOVE_SUBSCRIPTION,
  payload
})

/**
 * Perform a subscriptions request.
 */
export const createSubscription = () => async (dispatch, getState) => {
  const state = getState()

  const {
    authToken
  } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const username = getUsername(state)
  const collectionId = getFocusedCollectionId(state)
  const collectionMetadata = getFocusedCollectionMetadata(state)

  const { subscriptions = {} } = collectionMetadata
  const { items: subscriptionItems = [] } = subscriptions
  const existingSubscriptionCount = subscriptionItems.length > 0 ? subscriptionItems.length : ''

  // Format the subscription name
  let subscriptionName = `${collectionId} Subscription`

  if (existingSubscriptionCount) {
    subscriptionName += ` (${existingSubscriptionCount})`
  }

  // Extract granule search parameters from redux specific to the focused collection
  const extractedGranuleParams = extractGranuleSearchParams(state, collectionId)

  const granuleParams = prepareGranuleParams(
    collectionMetadata,
    extractedGranuleParams
  )

  // Prune granuleParams and remove unused keys to create the subscription query
  const subscriptionQuery = prepareSubscriptionQuery(granuleParams)

  const graphRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    mutation CreateSubscription (
      $collectionConceptId: String!
      $name: String!
      $subscriberId: String!
      $query: String!
    ) {
      createSubscription (
        collectionConceptId: $collectionConceptId
        name: $name
        subscriberId: $subscriberId
        query: $query
      ) {
          conceptId
        }
      }
  `
  const response = graphRequestObject.search(graphQuery, {
    collectionConceptId: collectionId,
    name: subscriptionName,
    subscriberId: username,
    query: subscriptionQuery
  })
    .then(() => {
      addToast('Subscription created', {
        appearance: 'success',
        autoDismiss: true
      })
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'createSubscription',
        resource: 'subscription',
        requestObject: graphRequestObject
      }))
    })

  return response
}

/**
 * Perform a subscriptions request.
 */
export const getSubscriptions = () => async (dispatch, getState) => {
  const state = getState()

  const {
    authToken
  } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const username = getUsername(state)

  dispatch(onSubscriptionsLoading())
  dispatch(startSubscriptionsTimer())

  const graphRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    query GetSubscriptions (
      $subscriberId: String!
    ) {
      subscriptions (
        subscriberId: $subscriberId
      ) {
          items {
            collection {
              conceptId
              title
            }
            collectionConceptId
            conceptId
            name
            nativeId
            query
          }
        }
      }`

  const response = graphRequestObject.search(graphQuery, {
    subscriberId: username
  })
    .then((response) => {
      const {
        data: responseData
      } = response

      const { data } = responseData
      const { subscriptions } = data
      const { items } = subscriptions

      dispatch(finishSubscriptionsTimer())
      dispatch(onSubscriptionsLoaded({
        loaded: true
      }))
      dispatch(updateSubscriptionResults(items))
    })
    .catch((error) => {
      dispatch(finishSubscriptionsTimer())

      const { response } = error
      const { data } = response
      const { errors = [] } = data

      dispatch(onSubscriptionsErrored(errors))
      dispatch(onSubscriptionsLoaded({
        loaded: false
      }))

      dispatch(actions.handleError({
        error,
        action: 'fetchSubscriptions',
        resource: 'subscription',
        requestObject: graphRequestObject
      }))
    })

  return response
}

/**
 * Perform a subscriptions request.
 */
export const deleteSubscription = (conceptId, nativeId) => async (dispatch, getState) => {
  const state = getState()

  const {
    authToken
  } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const graphRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    mutation DeleteSubscription (
      $conceptId: String!
      $nativeId: String!
    ) {
      deleteSubscription (
        conceptId: $conceptId
        nativeId: $nativeId
      ) {
          conceptId
        }
      }
  `

  const response = graphRequestObject.search(graphQuery, {
    conceptId,
    nativeId
  })
    .then(() => {
      dispatch(removeSubscription(conceptId))
      addToast('Subscription removed', {
        appearance: 'success',
        autoDismiss: true
      })
    })
    .catch((error) => {
      dispatch(actions.handleError({
        error,
        action: 'deleteSubscription',
        resource: 'subscription',
        verb: 'deleting',
        graphRequestObject
      }))
    })

  return response
}
