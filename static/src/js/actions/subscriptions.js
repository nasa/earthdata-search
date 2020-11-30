import actions from './index'

import {
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_SUBSCRIPTION_RESULTS
} from '../constants/actionTypes'

import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'

import GraphQlRequest from '../util/request/graphQlRequest'

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

/**
 * Perform a collection request based on the focusedCollection from the store.
 */
export const getSubscriptions = () => async (dispatch, getState) => {
  const state = getState()

  const {
    authToken
  } = state

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

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
            query
          }
        }
      }`

  const response = graphRequestObject.search(graphQuery, {
    subscriberId: 'rabbott'
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
