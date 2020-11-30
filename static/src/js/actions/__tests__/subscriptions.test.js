import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import {
  getSubscriptions,
  updateSubscriptionResults,
  onSubscriptionsLoading,
  onSubscriptionsLoaded,
  onSubscriptionsErrored
} from '../subscriptions'

import {
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_SUBSCRIPTION_RESULTS
} from '../../constants/actionTypes'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('updateSubscriptionResults', () => {
  test('should create an action to update the search query', () => {
    const payload = []
    const expectedAction = {
      type: UPDATE_SUBSCRIPTION_RESULTS,
      payload
    }
    expect(updateSubscriptionResults(payload)).toEqual(expectedAction)
  })
})

describe('onSubscriptionsLoading', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: LOADING_SUBSCRIPTIONS
    }
    expect(onSubscriptionsLoading()).toEqual(expectedAction)
  })
})

describe('onSubscriptionsLoaded', () => {
  test('should create an action to update the search query', () => {
    const payload = { loaded: true }
    const expectedAction = {
      type: LOADED_SUBSCRIPTIONS,
      payload
    }
    expect(onSubscriptionsLoaded(payload)).toEqual(expectedAction)
  })
})

describe('onSubscriptionsErrored', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: ERRORED_SUBSCRIPTIONS
    }
    expect(onSubscriptionsErrored()).toEqual(expectedAction)
  })
})

describe('getSubscriptions', () => {
  describe('when no metadata exists in the store for the collection from graphql', () => {
    describe('when graphql returns metadata for the requested collection', () => {
      test('should update the subscriptions, fetch metadata from graphql and call getSearchGranules', async () => {
        jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
          cmrHost: 'https://cmr.example.com',
          graphQlHost: 'https://graphql.example.com'
        }))

        nock(/graph/)
          .post(/api/)
          .reply(200, {
            data: {
              subscriptions: {
                count: 15,
                items: [
                  {
                    collection: {
                      conceptId: 'C1200240776-DEV08',
                      title: 'MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V006'
                    },
                    collectionConceptId: 'C1200240776-DEV08',
                    conceptId: 'SUB1200376128-DEV08',
                    name: 'Test Subscription',
                    query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
                  }
                ]
              }
            }
          })

        const store = mockStore({})

        await store.dispatch(getSubscriptions()).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: LOADING_SUBSCRIPTIONS
          })
          expect(storeActions[1]).toEqual({
            type: STARTED_SUBSCRIPTIONS_TIMER
          })
          expect(storeActions[2]).toEqual({
            type: FINISHED_SUBSCRIPTIONS_TIMER
          })
          expect(storeActions[3]).toEqual({
            type: LOADED_SUBSCRIPTIONS,
            payload: {
              loaded: true
            }
          })
          expect(storeActions[4]).toEqual({
            type: UPDATE_SUBSCRIPTION_RESULTS,
            payload: [
              {
                collection: {
                  conceptId: 'C1200240776-DEV08',
                  title: 'MODIS/Terra Vegetation Indices 16-Day L3 Global 250m SIN Grid V006'
                },
                collectionConceptId: 'C1200240776-DEV08',
                conceptId: 'SUB1200376128-DEV08',
                name: 'Test Subscription',
                query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
              }
            ]
          })
        })
      })
    })

    describe('when graphql returns no metadata for the requested collection', () => {
      test('should clear the subscriptions', async () => {
        jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
          cmrHost: 'https://cmr.example.com',
          graphQlHost: 'https://graphql.example.com'
        }))

        nock(/graph/)
          .post(/api/)
          .reply(200, {
            data: {
              subscriptions: {
                count: 0,
                items: []
              }
            }
          })

        const store = mockStore({})

        await store.dispatch(getSubscriptions()).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: LOADING_SUBSCRIPTIONS
          })
          expect(storeActions[1]).toEqual({
            type: STARTED_SUBSCRIPTIONS_TIMER
          })
          expect(storeActions[2]).toEqual({
            type: FINISHED_SUBSCRIPTIONS_TIMER
          })
          expect(storeActions[3]).toEqual({
            type: LOADED_SUBSCRIPTIONS,
            payload: {
              loaded: true
            }
          })
          expect(storeActions[4]).toEqual({
            type: UPDATE_SUBSCRIPTION_RESULTS,
            payload: []
          })
        })
      })
    })
  })

  test('does not call updateFocusedCollection when graphql throws an http error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/graph/)
      .post(/api/)
      .reply(403, {
        errors: [{
          message: 'Token does not exist'
        }]
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({})

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getSubscriptions()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_SUBSCRIPTIONS })
      expect(storeActions[1]).toEqual({ type: STARTED_SUBSCRIPTIONS_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_SUBSCRIPTIONS_TIMER })
      expect(storeActions[3]).toEqual({
        type: ERRORED_SUBSCRIPTIONS,
        payload: [
          {
            message: 'Token does not exist'
          }
        ]
      })
      expect(storeActions[4]).toEqual({
        type: LOADED_SUBSCRIPTIONS,
        payload: { loaded: false }
      })

      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
        action: 'fetchSubscriptions',
        resource: 'subscription'
      }))

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
