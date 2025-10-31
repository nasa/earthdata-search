import actions from './index'

import {
  DELETE_COLLECTION_SUBSCRIPTION,
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  REMOVE_SUBSCRIPTION,
  REMOVE_SUBSCRIPTION_DISABLED_FIELDS,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_COLLECTION_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_DISABLED_FIELDS,
  UPDATE_SUBSCRIPTION_RESULTS
} from '../constants/actionTypes'

import { displayNotificationType } from '../constants/enums'

import addToast from '../util/addToast'
import { parseGraphQLError } from '../../../../sharedUtils/parseGraphQLError'
import GraphQlRequest from '../util/request/graphQlRequest'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'
import { getCollectionId, getCollectionsMetadata } from '../zustand/selectors/collection'
import {
  getCollectionSubscriptionQueryString,
  getGranuleSubscriptionQueryString
} from '../zustand/selectors/query'
import { getEdlToken, getUsername } from '../zustand/selectors/user'

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

export const deleteCollectionSubscription = (payload) => ({
  type: DELETE_COLLECTION_SUBSCRIPTION,
  payload
})

export const updateCollectionSubscription = (payload) => ({
  type: UPDATE_COLLECTION_SUBSCRIPTION,
  payload
})

export const updateSubscriptionDisabledFields = (payload) => ({
  type: UPDATE_SUBSCRIPTION_DISABLED_FIELDS,
  payload
})

export const removeSubscriptionDisabledFields = () => ({
  type: REMOVE_SUBSCRIPTION_DISABLED_FIELDS
})

/**
 * Perform a subscriptions request.
 */
export const createSubscription = (name, subscriptionType) => async (dispatch) => {
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)
  const username = getUsername(zustandState)

  let subscriptionQuery

  const graphQlRequestObject = new GraphQlRequest(edlToken, earthdataEnvironment)

  const graphQuery = `
    mutation CreateSubscription ($params: CreateSubscriptionInput) {
      createSubscription (params: $params) {
          conceptId
        }
      }`

  let response

  const params = {
    name,
    subscriberId: username,
    type: subscriptionType
  }

  // If collection type get collection params, spatial, temporal, keyword, facets, feature facets, and checkboxes
  if (subscriptionType === 'collection') {
    subscriptionQuery = getCollectionSubscriptionQueryString()
  } else {
    // If granule type, pull out the granule specific params
    subscriptionQuery = getGranuleSubscriptionQueryString(zustandState)

    const collectionId = getCollectionId(zustandState)
    params.collectionConceptId = collectionId
  }

  params.query = subscriptionQuery

  try {
    response = await graphQlRequestObject.search(graphQuery, {
      params
    })

    parseGraphQLError(response)

    addToast('Subscription created', {
      appearance: 'success',
      autoDismiss: true
    })

    if (subscriptionType === 'collection') {
      dispatch(actions.getSubscriptions(subscriptionType, false))
    } else {
      dispatch(actions.getGranuleSubscriptions())
    }
  } catch (error) {
    zustandState.errors.handleError({
      error,
      action: 'createSubscription',
      resource: 'subscription',
      requestObject: graphQlRequestObject,
      notificationType: displayNotificationType.toast,
      showAlertButton: true,
      title: 'Something went wrong creating your subscription'
    })
  }

  return response
}

/**
 * Perform a subscriptions request.
 */
export const getSubscriptions = (
  subscriptionType,
  clearSubscriptions = true
) => async (dispatch) => {
  if (clearSubscriptions) {
    dispatch(updateSubscriptionResults([]))
  }

  // Retrieve data using selectors
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)
  const username = getUsername(zustandState)

  dispatch(onSubscriptionsLoading())
  dispatch(startSubscriptionsTimer())

  const graphQlRequestObject = new GraphQlRequest(edlToken, earthdataEnvironment)

  const graphQuery = `
    query GetSubscriptions ($params: SubscriptionsInput) {
      subscriptions (params: $params) {
          items {
            collection {
              conceptId
              title
            }
            collectionConceptId
            conceptId
            creationDate
            name
            nativeId
            query
            revisionDate
            type
          }
        }
      }`

  let response

  try {
    response = await graphQlRequestObject.search(graphQuery, {
      params: {
        subscriberId: username,
        type: subscriptionType
      }
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

    dispatch(onSubscriptionsErrored(
      [
        {
          message: 'Something went wrong fetching subscriptions'
        }
      ]
    ))

    zustandState.errors.handleError({
      error,
      action: 'fetchSubscriptions',
      resource: 'subscription',
      requestObject: graphQlRequestObject,
      showAlertButton: true,
      title: 'Something went wrong fetching subscriptions'
    })
  }

  return response
}

/**
 * Request granule subscriptions
 */
export const getGranuleSubscriptions = (collectionId) => async () => {
  let collectionConceptId = collectionId

  // Retrieve data using selectors
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)
  const username = getUsername(zustandState)

  if (collectionId == null) {
    collectionConceptId = getCollectionId(zustandState)
  }

  const graphQlRequestObject = new GraphQlRequest(edlToken, earthdataEnvironment)

  const graphQuery = `
    query GetGranuleSubscriptions($params: SubscriptionsInput) {
      subscriptions(params: $params) {
        count
        items {
          collectionConceptId
          conceptId
          name
          nativeId
          query
          type
        }
      }
    }`

  try {
    const response = await graphQlRequestObject.search(graphQuery, {
      params: {
        collectionConceptId,
        subscriberId: username,
        type: 'granule'
      }
    })

    parseGraphQLError(response)

    const {
      data: responseData
    } = response.data

    const { subscriptions } = responseData

    const { collection } = zustandState
    const { updateGranuleSubscriptions } = collection
    updateGranuleSubscriptions(collectionConceptId, subscriptions)

    return response
  } catch (error) {
    zustandState.errors.handleError({
      error,
      action: 'getGranuleSubscriptions',
      resource: 'subscription',
      requestObject: graphQlRequestObject,
      showAlertButton: true,
      title: 'Something went wrong fetching granule subscriptions'
    })

    return null
  }
}

/**
 * Perform a subscriptions request.
 */
export const deleteSubscription = (
  conceptId,
  nativeId,
  collectionId
) => async (dispatch) => {
  // Retrieve data from Redux using selectors
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const collectionsMetadata = getCollectionsMetadata(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  const graphQlRequestObject = new GraphQlRequest(edlToken, earthdataEnvironment)

  const graphQuery = `
    mutation DeleteSubscription ($params: DeleteSubscriptionInput) {
      deleteSubscription (params: $params) {
          conceptId
        }
      }`

  let response

  try {
    response = await graphQlRequestObject.search(graphQuery, {
      params: {
        conceptId,
        nativeId
      }
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
    zustandState.errors.handleError({
      error,
      action: 'deleteSubscription',
      resource: 'subscription',
      verb: 'deleting',
      graphQlRequestObject,
      showAlertButton: true,
      title: 'Something went wrong deleting your subscription'
    })
  }

  return response
}

/**
 * Perform a subscriptions update.
 */
export const updateSubscription = ({
  subscription,
  shouldUpdateQuery
}) => async (dispatch) => {
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const username = getUsername(zustandState)

  const {
    collectionConceptId,
    nativeId,
    name,
    query: previousSubscriptionQuery,
    type: subscriptionType
  } = subscription

  const params = {
    name,
    nativeId,
    subscriberId: username,
    type: subscriptionType
  }

  // Default the subscriptionQuery to the previous query
  let subscriptionQuery = previousSubscriptionQuery

  // If shouldUpdateQuery is true, update the query with new values pulled from redux
  if (shouldUpdateQuery) {
    if (subscriptionType === 'collection') {
      subscriptionQuery = getCollectionSubscriptionQueryString(zustandState)
    } else {
      subscriptionQuery = getGranuleSubscriptionQueryString(zustandState)

      params.collectionConceptId = collectionConceptId
    }
  }

  params.query = subscriptionQuery

  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  const graphQlRequestObject = new GraphQlRequest(edlToken, earthdataEnvironment)

  const graphQuery = `
    mutation UpdateSubscription ($params: UpdateSubscriptionInput) {
      updateSubscription (params: $params) {
          conceptId
        }
      }`

  let response

  try {
    response = await graphQlRequestObject.search(graphQuery, {
      params
    })

    parseGraphQLError(response)

    addToast('Subscription updated', {
      appearance: 'success',
      autoDismiss: true
    })

    if (subscriptionType === 'collection') {
      dispatch(actions.getSubscriptions(subscriptionType, false))
    } else {
      dispatch(actions.getGranuleSubscriptions())
    }
  } catch (error) {
    zustandState.errors.handleError({
      error,
      action: 'updateSubscription',
      resource: 'subscription',
      verb: 'updating',
      graphQlRequestObject,
      showAlertButton: true,
      title: 'Something went wrong updating your subscription'
    })
  }

  return response
}
