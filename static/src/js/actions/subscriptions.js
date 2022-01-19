import actions from './index'

import {
  DELETE_COLLECTION_SUBSCRIPTION,
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  REMOVE_SUBSCRIPTION,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_SUBSCRIPTION_RESULTS,
  UPDATE_COLLECTION_SUBSCRIPTION
} from '../constants/actionTypes'

import { addToast } from '../util/addToast'
import { displayNotificationType } from '../constants/enums'
import { buildGranuleSearchParams, extractGranuleSearchParams, prepareGranuleParams } from '../util/granules'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { getFocusedCollectionId } from '../selectors/focusedCollection'
import {
  getCollectionsMetadata,
  getFocusedCollectionMetadata
} from '../selectors/collectionMetadata'
import { getUsername } from '../selectors/user'
import { parseGraphQLError } from '../../../../sharedUtils/parseGraphQLError'
import { prepareSubscriptionQuery } from '../util/subscriptions'

import GraphQlRequest from '../util/request/graphQlRequest'

export const updateSubscriptionResults = (payload) => ({
  type: UPDATE_SUBSCRIPTION_RESULTS,
  payload
})

export const onSubscriptionsLoading = () => ({
  type: LOADING_SUBSCRIPTIONS
})

export const onSubscriptionsLoaded = (payload) => ({
  type: LOADED_SUBSCRIPTIONS,
  payload
})

export const onSubscriptionsErrored = (payload) => ({
  type: ERRORED_SUBSCRIPTIONS,
  payload
})

export const startSubscriptionsTimer = () => ({
  type: STARTED_SUBSCRIPTIONS_TIMER
})

export const finishSubscriptionsTimer = () => ({
  type: FINISHED_SUBSCRIPTIONS_TIMER
})

export const removeSubscription = (payload) => ({
  type: REMOVE_SUBSCRIPTION,
  payload
})

export const updateCollectionSubscription = (payload) => ({
  type: UPDATE_COLLECTION_SUBSCRIPTION,
  payload
})

export const deleteCollectionSubscription = (payload) => ({
  type: DELETE_COLLECTION_SUBSCRIPTION,
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
  const collectionId = getFocusedCollectionId(state)
  const collectionMetadata = getFocusedCollectionMetadata(state)
  const earthdataEnvironment = getEarthdataEnvironment(state)
  const username = getUsername(state)

  // Format the subscription name
  const subscriptionName = `${collectionId} Subscription - ${new Date().toISOString()}`

  // Extract granule search parameters from redux specific to the focused collection
  const extractedGranuleParams = extractGranuleSearchParams(state, collectionId)

  const granuleParams = prepareGranuleParams(
    collectionMetadata,
    extractedGranuleParams
  )

  const searchParams = buildGranuleSearchParams(granuleParams)

  // Prune granuleParams and remove unused keys to create the subscription query
  const subscriptionQuery = prepareSubscriptionQuery(searchParams)

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

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
      }`

  let response

  try {
    response = await graphQlRequestObject.search(graphQuery, {
      collectionConceptId: collectionId,
      name: subscriptionName,
      subscriberId: username,
      query: subscriptionQuery
    })

    parseGraphQLError(response)

    addToast('Subscription created', {
      appearance: 'success',
      autoDismiss: true
    })

    await dispatch(actions.getCollectionSubscriptions())
  } catch (error) {
    dispatch(actions.handleError({
      error,
      action: 'createSubscription',
      resource: 'subscription',
      requestObject: graphQlRequestObject,
      notificationType: displayNotificationType.toast
    }))
  }

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

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

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

  let response

  try {
    response = await graphQlRequestObject.search(graphQuery, {
      subscriberId: username
    })

    parseGraphQLError(response)

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
  } catch (error) {
    dispatch(finishSubscriptionsTimer())

    dispatch(onSubscriptionsLoaded({
      loaded: false
    }))

    dispatch(actions.handleError({
      error,
      action: 'fetchSubscriptions',
      resource: 'subscription',
      requestObject: graphQlRequestObject,
      errorAction: onSubscriptionsErrored
    }))
  }

  return response
}

/**
 * Perform a subscriptions request.
 */
export const deleteSubscription = (
  conceptId,
  nativeId,
  collectionId
) => async (dispatch, getState) => {
  const state = getState()

  const {
    authToken
  } = state

  // Retrieve data from Redux using selectors
  const collectionsMetadata = getCollectionsMetadata(state)
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

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
      }`

  let response

  try {
    response = await graphQlRequestObject.search(graphQuery, {
      conceptId,
      nativeId
    })

    parseGraphQLError(response)

    dispatch(removeSubscription(conceptId))

    // If the collection associated with the subscription has metadata in Redux, remove the
    // subscription from the store.
    if (Object.keys(collectionsMetadata).includes(collectionId)) {
      dispatch(actions.deleteCollectionSubscription({
        collectionConceptId: collectionId,
        conceptId
      }))
    }

    addToast('Subscription removed', {
      appearance: 'success',
      autoDismiss: true
    })
  } catch (error) {
    dispatch(actions.handleError({
      error,
      action: 'deleteSubscription',
      resource: 'subscription',
      verb: 'deleting',
      graphQlRequestObject
    }))
  }

  return response
}

/**
 * Perform a subscriptions update.
 */
export const updateSubscription = (
  conceptId,
  nativeId,
  subscriptionName
) => async (dispatch, getState) => {
  const state = getState()

  const username = getUsername(state)
  const collectionId = getFocusedCollectionId(state)
  const collectionMetadata = getFocusedCollectionMetadata(state)

  // Extract granule search parameters from redux specific to the focused collection
  const extractedGranuleParams = extractGranuleSearchParams(state, collectionId)

  const granuleParams = prepareGranuleParams(
    collectionMetadata,
    extractedGranuleParams
  )

  const searchParams = buildGranuleSearchParams(granuleParams)

  // Prune granuleParams and remove unused keys to create the subscription query
  const subscriptionQuery = prepareSubscriptionQuery(searchParams)

  const {
    authToken
  } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const graphQlRequestObject = new GraphQlRequest(authToken, earthdataEnvironment)

  const graphQuery = `
    mutation UpdateSubscription (
      $collectionConceptId: String!
      $name: String!
      $nativeId: String!
      $subscriberId: String!
      $query: String!
    ) {
      updateSubscription (
        collectionConceptId: $collectionConceptId
        name: $name
        nativeId: $nativeId
        subscriberId: $subscriberId
        query: $query
      ) {
          conceptId
        }
      }`

  let response

  try {
    response = await graphQlRequestObject.search(graphQuery, {
      collectionConceptId: collectionId,
      name: subscriptionName,
      nativeId,
      subscriberId: username,
      query: subscriptionQuery
    })

    parseGraphQLError(response)

    addToast('Subscription updated', {
      appearance: 'success',
      autoDismiss: true
    })

    dispatch(
      actions.updateCollectionSubscription({
        collectionConceptId: collectionId,
        conceptId,
        query: subscriptionQuery
      })
    )
  } catch (error) {
    dispatch(actions.handleError({
      error,
      action: 'updateSubscription',
      resource: 'subscription',
      verb: 'updating',
      graphQlRequestObject
    }))
  }

  return response
}
