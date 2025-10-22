import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { stringify } from 'qs'
import { isEqual } from 'lodash-es'

import actions from '../index'

import {
  createSubscription,
  deleteSubscription,
  getGranuleSubscriptions,
  getSubscriptions,
  onSubscriptionsErrored,
  onSubscriptionsLoaded,
  onSubscriptionsLoading,
  updateSubscription,
  updateSubscriptionDisabledFields,
  updateSubscriptionResults
} from '../subscriptions'

import {
  DELETE_COLLECTION_SUBSCRIPTION,
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  REMOVE_SUBSCRIPTION,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_SUBSCRIPTION_DISABLED_FIELDS,
  UPDATE_SUBSCRIPTION_RESULTS
} from '../../constants/actionTypes'

import * as getClientId from '../../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import addToast from '../../util/addToast'

import {
  getCollectionSubscriptionQueryString,
  getGranuleSubscriptionQueryString
} from '../../zustand/selectors/query'
import useEdscStore from '../../zustand/useEdscStore'

jest.mock('../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

jest.mock('../../zustand/selectors/query', () => ({
  getCollectionSubscriptionQueryString: jest.fn().mockImplementation(() => {}),
  getGranuleSubscriptionQueryString: jest.fn().mockImplementation(() => {})
}))

const mockStore = configureMockStore([thunk])

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

describe('updateSubscriptionDisabledFields', () => {
  test('should create an action to update the search query', () => {
    const payload = { mock: 'data' }
    const expectedAction = {
      type: UPDATE_SUBSCRIPTION_DISABLED_FIELDS,
      payload
    }
    expect(updateSubscriptionDisabledFields(payload)).toEqual(expectedAction)
  })
})

describe('createSubscription', () => {
  test('calls graphql to create a granule subscription', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    const getGranuleSubscriptionsMock = jest.spyOn(actions, 'getGranuleSubscriptions').mockImplementationOnce(() => jest.fn())

    getGranuleSubscriptionQueryString.mockReturnValue('browse_only=true&temporal=2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z&polygon[]=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78')

    nock(/localhost/)
      .post(/graphql/, (body) => {
        const { data } = body
        const { variables } = data
        const { params } = variables
        const {
          collectionConceptId,
          name,
          subscriberId,
          query
        } = params

        const expectedQuery = `${stringify({
          browse_only: true,
          options: {},
          temporal: '2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z'
        }, { encode: false })
        }&${
          stringify({
            polygon: ['-18,-78,-13,-74,-16,-73,-22,-77,-18,-78']
          }, {
            encode: false,
            indices: false,
            arrayFormat: 'brackets'
          })}`

        // Mock the request if the the variables match
        return collectionConceptId === 'collectionId'
          && name.indexOf('test granule subscription') > -1
          && subscriberId === 'testUser'
          && isEqual(query, expectedQuery)
      })
      .reply(200, {
        data: {
          createSubscription: {
            conceptId: 'SUB1000-EDSC'
          }
        }
      })

    useEdscStore.setState({
      collection: {
        ...useEdscStore.getState().collection,
        collectionId: 'collectionId'
      }
    })

    const store = mockStore({
      authToken: 'token',
      subscriptions: {
        disabledFields: {
          collection: {},
          granule: {}
        }
      },
      user: {
        username: 'testUser'
      }
    })

    await store.dispatch(createSubscription('test granule subscription', 'granule')).then(() => {
      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription created', {
        appearance: 'success',
        autoDismiss: true
      })

      expect(getGranuleSubscriptionsMock).toHaveBeenCalledTimes(1)
    })
  })

  test('calls graphql to create a collection subscription', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    const getSubscriptionsMock = jest.spyOn(actions, 'getSubscriptions').mockImplementationOnce(() => jest.fn())

    getCollectionSubscriptionQueryString.mockReturnValue('options[temporal][limit_to_granules]=true&temporal=2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z&polygon[]=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78')

    nock(/localhost/)
      .post(/graphql/, (body) => {
        const { data } = body
        const { variables } = data
        const { params } = variables
        const {
          name,
          subscriberId,
          query
        } = params

        const expectedQuery = `${
          stringify({
            options: {
              temporal: {
                limit_to_granules: true
              }
            },
            temporal: '2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z'
          }, { encode: false })
        }&${
          stringify({
            polygon: ['-18,-78,-13,-74,-16,-73,-22,-77,-18,-78']
          }, {
            encode: false,
            indices: false,
            arrayFormat: 'brackets'
          })
        }`

        // Mock the request if the the variables match
        return name.indexOf('test collection subscription') > -1
          && subscriberId === 'testUser'
          && isEqual(query, expectedQuery)
      })
      .reply(200, {
        data: {
          createSubscription: {
            conceptId: 'SUB1000-EDSC'
          }
        }
      })

    const store = mockStore({
      authToken: 'token',
      subscriptions: {
        disabledFields: {
          collection: {},
          granule: {}
        }
      },
      user: {
        username: 'testUser'
      }
    })

    await store.dispatch(createSubscription('test collection subscription', 'collection')).then(() => {
      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription created', {
        appearance: 'success',
        autoDismiss: true
      })

      expect(getSubscriptionsMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when other subscriptions exist for the same collection', () => {
    test('calls graphql to create a subscription', async () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com'
      }))

      jest.spyOn(actions, 'getGranuleSubscriptions').mockImplementationOnce(() => jest.fn())

      getGranuleSubscriptionQueryString.mockReturnValue('browse_only=true&temporal=2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z&polygon[]=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78')

      nock(/localhost/)
        .post(/graphql/, (body) => {
          const { data } = body
          const { variables } = data
          const { params } = variables
          const {
            collectionConceptId,
            name,
            subscriberId,
            query
          } = params

          const expectedQuery = `${
            stringify({
              browse_only: true,
              options: {},
              temporal: '2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z'
            }, { encode: false })
          }&${
            stringify({
              polygon: ['-18,-78,-13,-74,-16,-73,-22,-77,-18,-78']
            }, {
              encode: false,
              indices: false,
              arrayFormat: 'brackets'
            })
          }`

          // Mock the request if the the variables match
          return collectionConceptId === 'collectionId'
            && name.indexOf('test granule subscription 2') > -1
            && subscriberId === 'testUser'
            && isEqual(query, expectedQuery)
        })
        .reply(200, {
          data: {
            createSubscription: {
              conceptId: 'SUB1000-EDSC'
            }
          }
        })

      useEdscStore.setState({
        collection: {
          ...useEdscStore.getState().collection,
          collectionId: 'collectionId'
        }
      })

      const store = mockStore({
        authToken: 'token',
        subscriptions: {
          disabledFields: {
            collection: {},
            granule: {}
          }
        },
        user: {
          username: 'testUser'
        }
      })

      await store.dispatch(createSubscription('test granule subscription 2', 'granule')).then(() => {
        expect(addToast).toHaveBeenCalledTimes(1)
        expect(addToast).toHaveBeenCalledWith('Subscription created', {
          appearance: 'success',
          autoDismiss: true
        })
      })
    })
  })

  describe('when the subscription fails to create', () => {
    test('calls handleError', async () => {
      useEdscStore.setState((state) => {
        // eslint-disable-next-line no-param-reassign
        state.errors.handleError = jest.fn()
      })

      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com'
      }))

      nock(/localhost/)
        .post(/graphql/)
        .reply(200, {
          errors: [{
            message: 'The Provider Id [EDSC] and Subscription Name [Test Name] combination must be unique for a given native-id.'
          }]
        })

      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      useEdscStore.setState({
        collection: {
          ...useEdscStore.getState().collection,
          collectionId: 'collectionId'
        }
      })

      const store = mockStore({
        authToken: 'token',
        subscriptions: {
          disabledFields: {
            collection: {},
            granule: {}
          }
        },
        user: {
          username: 'testUser'
        }
      })

      await store.dispatch(createSubscription('granule')).then(() => {
        const { errors } = useEdscStore.getState()
        expect(errors.handleError).toHaveBeenCalledTimes(1)
        expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
          action: 'createSubscription',
          resource: 'subscription',
          showAlertButton: true,
          title: 'Something went wrong creating your subscription'
        }))
      })
    })
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

        nock(/localhost/)
          .post(/graphql/)
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

        const store = mockStore({
          authToken: 'token'
        })

        await store.dispatch(getSubscriptions('granule')).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: UPDATE_SUBSCRIPTION_RESULTS,
            payload: []
          })

          expect(storeActions[1]).toEqual({
            type: LOADING_SUBSCRIPTIONS
          })

          expect(storeActions[2]).toEqual({
            type: STARTED_SUBSCRIPTIONS_TIMER
          })

          expect(storeActions[3]).toEqual({
            type: FINISHED_SUBSCRIPTIONS_TIMER
          })

          expect(storeActions[4]).toEqual({
            type: LOADED_SUBSCRIPTIONS,
            payload: {
              loaded: true
            }
          })

          expect(storeActions[5]).toEqual({
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

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              subscriptions: {
                count: 0,
                items: []
              }
            }
          })

        const store = mockStore({
          authToken: 'token'
        })

        await store.dispatch(getSubscriptions('granule', false)).then(() => {
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

  test('calls handleError when graphql throws an http error', async () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.errors.handleError = jest.fn()
    })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        errors: [{
          message: 'Token does not exist'
        }]
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'token'
    })

    await store.dispatch(getSubscriptions('granule', false)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_SUBSCRIPTIONS })
      expect(storeActions[1]).toEqual({ type: STARTED_SUBSCRIPTIONS_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_SUBSCRIPTIONS_TIMER })

      expect(storeActions[3]).toEqual({
        type: LOADED_SUBSCRIPTIONS,
        payload: { loaded: false }
      })

      expect(storeActions[4]).toEqual({
        type: ERRORED_SUBSCRIPTIONS,
        payload: [{
          message: 'Something went wrong fetching subscriptions'
        }]
      })

      const { errors } = useEdscStore.getState()
      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
        action: 'fetchSubscriptions',
        resource: 'subscription'
      }))
    })
  })
})

describe('getGranuleSubscriptions', () => {
  beforeEach(() => {
    jest.spyOn(getClientId, 'getClientId').mockImplementationOnce(() => ({ client: 'eed-edsc-test-serverless-client' }))
  })

  describe('when a collection is not provided', () => {
    test('updates the subscriptions of the focused collection', async () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))

      nock(/graph/)
        .post(/api/)
        .reply(200, {
          data: {
            subscriptions: {
              items: [
                'new items'
              ]
            }
          }
        })

      useEdscStore.setState({
        collection: {
          ...useEdscStore.getState().collection,
          collectionId: 'C10000000000-EDSC',
          updateGranuleSubscriptions: jest.fn()
        }
      })

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getGranuleSubscriptions()).then(() => {
        const { collection } = useEdscStore.getState()

        expect(collection.updateGranuleSubscriptions).toHaveBeenCalledTimes(1)
        expect(collection.updateGranuleSubscriptions).toHaveBeenCalledWith('C10000000000-EDSC', { items: ['new items'] })
      })
    })
  })

  describe('when a collection is provided', () => {
    test('updates the subscriptions of the focused collection', async () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))

      nock(/graph/)
        .post(/api/)
        .reply(200, {
          data: {
            subscriptions: {
              items: [
                'new items'
              ]
            }
          }
        })

      useEdscStore.setState({
        collection: {
          ...useEdscStore.getState().collection,
          updateGranuleSubscriptions: jest.fn()
        }
      })

      const store = mockStore({
        authToken: ''
      })

      await store.dispatch(getGranuleSubscriptions('C10000000001-EDSC')).then(() => {
        const { collection } = useEdscStore.getState()

        expect(collection.updateGranuleSubscriptions).toHaveBeenCalledTimes(1)
        expect(collection.updateGranuleSubscriptions).toHaveBeenCalledWith('C10000000001-EDSC', { items: ['new items'] })
      })
    })
  })

  test('calls handleError when graphql throws an http error', async () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.errors.handleError = jest.fn()
    })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        errors: [{
          message: 'Token does not exist'
        }]
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'token'
    })

    await store.dispatch(getGranuleSubscriptions()).then(() => {
      const { errors } = useEdscStore.getState()
      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
        action: 'getGranuleSubscriptions',
        resource: 'subscription',
        showAlertButton: true,
        title: 'Something went wrong fetching granule subscriptions'
      }))
    })
  })
})

describe('deleteSubscription', () => {
  test('should call graphql and call removeSubscription', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          deleteSubscription: {
            conceptId: 'SUB1000-EDSC'
          }
        }
      })

    const store = mockStore({
      authToken: 'token'
    })

    await store.dispatch(deleteSubscription('SUB1000-EDSC', 'mock-guid', 'collectionId')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: REMOVE_SUBSCRIPTION,
        payload: 'SUB1000-EDSC'
      })

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription removed', {
        appearance: 'success',
        autoDismiss: true
      })
    })
  })

  test('should update collection metatdata if it exsits in redux', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          deleteSubscription: {
            conceptId: 'SUB1000-EDSC'
          }
        }
      })

    const store = mockStore({
      authToken: 'token'
    })

    useEdscStore.setState({
      collection: {
        collectionMetadata: {
          collectionId: {
            subscriptions: {
              items: [
                {
                  name: 'collectionId Subscription',
                  conceptId: 'SUB1'
                }
              ]
            }
          }
        }
      }
    })

    await store.dispatch(deleteSubscription('SUB1000-EDSC', 'mock-guid', 'collectionId')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: REMOVE_SUBSCRIPTION,
        payload: 'SUB1000-EDSC'
      })

      expect(storeActions[1]).toEqual({
        type: DELETE_COLLECTION_SUBSCRIPTION,
        payload: {
          collectionConceptId: 'collectionId',
          conceptId: 'SUB1000-EDSC'
        }
      })

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription removed', {
        appearance: 'success',
        autoDismiss: true
      })
    })
  })

  test('calls handleError when graphql throws an http error', async () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.errors.handleError = jest.fn()
    })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        errors: [{
          message: 'Token does not exist'
        }]
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'token'
    })

    await store.dispatch(deleteSubscription()).then(() => {
      const { errors } = useEdscStore.getState()
      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
        action: 'deleteSubscription',
        resource: 'subscription',
        showAlertButton: true,
        title: 'Something went wrong deleting your subscription'
      }))
    })
  })
})

describe('updateSubscription', () => {
  test('should call graphql and update the granule subscription', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    const getGranuleSubscriptionsMock = jest.spyOn(actions, 'getGranuleSubscriptions').mockImplementationOnce(() => jest.fn())

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          updateSubscription: {
            conceptId: 'SUB1000-EDSC'
          }
        }
      })

    const store = mockStore({
      authToken: 'token',
      subscriptions: {
        disabledFields: {
          collection: {},
          granule: {}
        }
      },
      user: {
        username: 'testUser'
      }
    })

    await store.dispatch(updateSubscription({
      subscription: {
        conceptId: 'SUB1000-EDSC',
        nativeId: 'mock-guid',
        name: 'Collection Name',
        query: 'point[]=0,0',
        type: 'granule'
      },
      shouldUpdateQuery: true
    })).then(() => {
      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription updated', {
        appearance: 'success',
        autoDismiss: true
      })

      expect(getGranuleSubscriptionsMock.mock.calls.length).toBe(1)
      expect(getGranuleSubscriptionsMock.mock.calls[0][1]).toBe()
    })
  })

  test('should call graphql and update the collection subscription', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    const getSubscriptionsMock = jest.spyOn(actions, 'getSubscriptions').mockImplementationOnce(() => jest.fn())

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          updateSubscription: {
            conceptId: 'SUB1000-EDSC'
          }
        }
      })

    const store = mockStore({
      authToken: 'token',
      subscriptions: {
        disabledFields: {
          collection: {},
          granule: {}
        }
      },
      user: {
        username: 'testUser'
      }
    })

    await store.dispatch(updateSubscription({
      subscription: {
        conceptId: 'SUB1000-EDSC',
        nativeId: 'mock-guid',
        name: 'Collection Name',
        query: 'point[]=0,0',
        type: 'collection'
      },
      shouldUpdateQuery: true
    })).then(() => {
      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription updated', {
        appearance: 'success',
        autoDismiss: true
      })

      expect(getSubscriptionsMock.mock.calls.length).toBe(1)
      expect(getSubscriptionsMock.mock.calls[0][0]).toBe('collection')
      expect(getSubscriptionsMock.mock.calls[0][1]).toBe(false)
    })
  })

  test('should update the subscription but not update the query', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    const getSubscriptionsMock = jest.spyOn(actions, 'getSubscriptions').mockImplementationOnce(() => jest.fn())

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          updateSubscription: {
            conceptId: 'SUB1000-EDSC'
          }
        }
      })

    const store = mockStore({
      authToken: 'token',
      subscriptions: {
        disabledFields: {
          collection: {},
          granule: {}
        }
      },
      user: {
        username: 'testUser'
      }
    })

    await store.dispatch(updateSubscription({
      subscription: {
        conceptId: 'SUB1000-EDSC',
        nativeId: 'mock-guid',
        name: 'Collection Name',
        query: 'point[]=0,0',
        type: 'collection'
      },
      shouldUpdateQuery: false
    })).then(() => {
      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Subscription updated', {
        appearance: 'success',
        autoDismiss: true
      })

      expect(getSubscriptionsMock.mock.calls.length).toBe(1)
      expect(getSubscriptionsMock.mock.calls[0][0]).toBe('collection')
      expect(getSubscriptionsMock.mock.calls[0][1]).toBe(false)
    })
  })

  test('calls handleError when graphql throws an http error', async () => {
    useEdscStore.setState((state) => {
      // eslint-disable-next-line no-param-reassign
      state.errors.handleError = jest.fn()
    })

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        errors: [{
          message: 'Token does not exist'
        }]
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'token',
      subscriptions: {
        disabledFields: {
          collection: {},
          granule: {}
        }
      },
      user: {
        username: 'testUser'
      }
    })

    await store.dispatch(updateSubscription({
      subscription: {
        conceptId: 'SUB1000-EDSC',
        nativeId: 'mock-guid',
        name: 'Collection Name',
        query: 'point[]=0,0',
        type: 'collection'
      },
      shouldUpdateQuery: true
    })).then(() => {
      const { errors } = useEdscStore.getState()
      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
        action: 'updateSubscription',
        resource: 'subscription',
        showAlertButton: true,
        title: 'Something went wrong updating your subscription'
      }))
    })
  })
})
