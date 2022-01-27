import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { stringify } from 'qs'
import { isEqual } from 'lodash'

import actions from '../index'

import {
  createSubscription,
  deleteSubscription,
  getSubscriptions,
  onSubscriptionsErrored,
  onSubscriptionsLoaded,
  onSubscriptionsLoading,
  updateSubscription,
  updateSubscriptionResults
} from '../subscriptions'

import {
  ADD_ERROR,
  ERRORED_SUBSCRIPTIONS,
  FINISHED_SUBSCRIPTIONS_TIMER,
  LOADED_SUBSCRIPTIONS,
  LOADING_SUBSCRIPTIONS,
  REMOVE_SUBSCRIPTION,
  STARTED_SUBSCRIPTIONS_TIMER,
  UPDATE_COLLECTION_SUBSCRIPTION,
  UPDATE_SUBSCRIPTION_RESULTS
} from '../../constants/actionTypes'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as addToast from '../../util/addToast'

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

describe('createSubscription', () => {
  test('calls graphql to create a subscription', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))

    const getCollectionSubscriptionsMock = jest.spyOn(actions, 'getCollectionSubscriptions').mockImplementationOnce(() => jest.fn())
    const addToastMock = jest.spyOn(addToast, 'addToast')

    nock(/localhost/)
      .post(/graphql/, (body) => {
        const { data } = body
        const { variables } = data
        const {
          collectionConceptId,
          name,
          subscriberId,
          query
        } = variables

        const expectedQuery = stringify({
          browseOnly: true,
          options: {},
          polygon: ['-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'],
          temporal: '2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z'
        }, { encode: false, indices: false, arrayFormat: 'brackets' })

        // Mock the request if the the variables match
        return collectionConceptId === 'collectionId'
          && name.indexOf('collectionId Subscription') > -1
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
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          collectionId: {
            mock: 'data'
          }
        }
      },
      project: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          byId: {
            collectionId: {
              granules: {
                excludedGranuleIds: [],
                gridCoords: '',
                pageNum: 2,
                sortKey: '-start_date',
                collectionId: 'collectionId',
                browseOnly: true
              }
            }
          },
          temporal: {
            startDate: '2020-01-01T00:00:00.000Z',
            endDate: '2020-01-31T23:59:59.999Z',
            isRecurring: false
          },
          spatial: {
            polygon: ['-18,-78,-13,-74,-16,-73,-22,-77,-18,-78']
          }
        }
      },
      timeline: {
        query: {}
      },
      user: {
        username: 'testUser'
      }
    })

    await store.dispatch(createSubscription()).then(() => {
      expect(addToastMock.mock.calls.length).toBe(1)
      expect(addToastMock.mock.calls[0][0]).toEqual('Subscription created')
      expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
      expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
      expect(getCollectionSubscriptionsMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when other subscriptions exist for the same collection', () => {
    test('calls graphql to create a subscription', async () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com'
      }))
      const addToastMock = jest.spyOn(addToast, 'addToast')
      jest.spyOn(actions, 'getCollectionSubscriptions').mockImplementationOnce(() => jest.fn())

      nock(/localhost/)
        .post(/graphql/, (body) => {
          const { data } = body
          const { variables } = data
          const {
            collectionConceptId,
            name,
            subscriberId,
            query
          } = variables

          const expectedQuery = stringify({
            browseOnly: true,
            options: {},
            polygon: '-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
            temporal: '2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z'
          }, { encode: false })

          // Mock the request if the the variables match
          return collectionConceptId === 'collectionId'
            && name.indexOf('collectionId Subscription - ') > -1
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
        earthdataEnvironment: 'prod',
        metadata: {
          collections: {
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
        },
        project: {},
        focusedCollection: 'collectionId',
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  excludedGranuleIds: [],
                  gridCoords: '',
                  pageNum: 2,
                  sortKey: '-start_date',
                  collectionId: 'collectionId',
                  browseOnly: true
                }
              }
            },
            temporal: {
              startDate: '2020-01-01T00:00:00.000Z',
              endDate: '2020-01-31T23:59:59.999Z',
              isRecurring: false
            },
            spatial: {
              polygon: '-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
            }
          }
        },
        timeline: {
          query: {}
        },
        user: {
          username: 'testUser'
        }
      })

      await store.dispatch(createSubscription()).then(() => {
        expect(addToastMock.mock.calls.length).toBe(1)
        expect(addToastMock.mock.calls[0][0]).toEqual('Subscription created')
        expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
        expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
      })
    })
  })

  describe('when the subscription fails to create', () => {
    test('calls handleError', async () => {
      const handleErrorMock = jest.spyOn(actions, 'handleError')

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

      const store = mockStore({
        authToken: 'token',
        earthdataEnvironment: 'prod',
        metadata: {
          collections: {
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
        },
        project: {},
        focusedCollection: 'collectionId',
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  excludedGranuleIds: [],
                  gridCoords: '',
                  pageNum: 2,
                  sortKey: '-start_date',
                  collectionId: 'collectionId',
                  browseOnly: true
                }
              }
            },
            temporal: {
              startDate: '2020-01-01T00:00:00.000Z',
              endDate: '2020-01-31T23:59:59.999Z',
              isRecurring: false
            },
            spatial: {
              polygon: '-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
            }
          }
        },
        timeline: {
          query: {}
        },
        user: {
          username: 'testUser'
        }
      })

      const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

      await store.dispatch(createSubscription()).then(() => {
        expect(handleErrorMock).toHaveBeenCalledTimes(1)
        expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
          action: 'createSubscription',
          resource: 'subscription'
        }))

        expect(consoleMock).toHaveBeenCalledTimes(1)
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

  test('calls handleError when graphql throws an http error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')

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

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(getSubscriptions()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({ type: LOADING_SUBSCRIPTIONS })
      expect(storeActions[1]).toEqual({ type: STARTED_SUBSCRIPTIONS_TIMER })
      expect(storeActions[2]).toEqual({ type: FINISHED_SUBSCRIPTIONS_TIMER })

      expect(storeActions[3]).toEqual({
        type: LOADED_SUBSCRIPTIONS,
        payload: { loaded: false }
      })

      expect(storeActions[4]).toEqual({
        type: ADD_ERROR,
        payload: expect.objectContaining({
          message: 'Error: Token does not exist',
          notificationType: 'banner',
          title: 'Error retrieving subscription'
        })
      })

      expect(storeActions[5]).toEqual({
        type: ERRORED_SUBSCRIPTIONS,
        payload: 'Error: Token does not exist'
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

describe('deleteSubscription', () => {
  test('should call graphql and call removeSubscription', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))
    const addToastMock = jest.spyOn(addToast, 'addToast')

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

      expect(addToastMock.mock.calls.length).toBe(1)
      expect(addToastMock.mock.calls[0][0]).toEqual('Subscription removed')
      expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
      expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
    })
  })

  test('should update collection metatdata if it exsits in redux', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))
    const addToastMock = jest.spyOn(addToast, 'addToast')

    const deleteCollectionSubscriptionMock = jest.spyOn(actions, 'deleteCollectionSubscription').mockImplementationOnce(() => jest.fn())

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
      authToken: 'token',
      metadata: {
        collections: {
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

      expect(deleteCollectionSubscriptionMock).toHaveBeenCalledTimes(1)

      expect(addToastMock.mock.calls.length).toBe(1)
      expect(addToastMock.mock.calls[0][0]).toEqual('Subscription removed')
      expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
      expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
    })
  })

  test('calls handleError when graphql throws an http error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')

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
      metadata: {
        collections: {
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

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(deleteSubscription()).then(() => {
      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
        action: 'deleteSubscription',
        resource: 'subscription'
      }))

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('updateSubscription', () => {
  test('should call graphql and update the subscription', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com'
    }))
    const addToastMock = jest.spyOn(addToast, 'addToast')

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
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          collectionId: {
            subscriptions: {
              items: [
                {
                  name: 'collectionId Subscription',
                  conceptId: 'SUB1',
                  query: 'query=original'
                }
              ]
            }
          }
        }
      },
      project: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          byId: {
            collectionId: {
              granules: {
                browseOnly: true
              }
            }
          },
          temporal: {
            startDate: '2020-01-01T00:00:00.000Z',
            endDate: '2020-01-31T23:59:59.999Z',
            isRecurring: false
          },
          spatial: {}
        }
      },
      timeline: {
        query: {}
      },
      user: {
        username: 'testUser'
      }
    })

    await store.dispatch(updateSubscription('SUB1000-EDSC', 'mock-guid', 'Collection Name')).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_COLLECTION_SUBSCRIPTION,
        payload: {
          collectionConceptId: 'collectionId',
          conceptId: 'SUB1000-EDSC',
          query: 'browseOnly=true&temporal=2020-01-01T00:00:00.000Z,2020-01-31T23:59:59.999Z'
        }
      })

      expect(addToastMock.mock.calls.length).toBe(1)
      expect(addToastMock.mock.calls[0][0]).toEqual('Subscription updated')
      expect(addToastMock.mock.calls[0][1].appearance).toEqual('success')
      expect(addToastMock.mock.calls[0][1].autoDismiss).toEqual(true)
    })
  })

  test('calls handleError when graphql throws an http error', async () => {
    const handleErrorMock = jest.spyOn(actions, 'handleError')

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
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          collectionId: {
            subscriptions: {
              items: [
                {
                  name: 'collectionId Subscription',
                  conceptId: 'SUB1',
                  query: 'query=original'
                }
              ]
            }
          }
        }
      },
      project: {},
      focusedCollection: 'collectionId',
      query: {
        collection: {
          byId: {
            collectionId: {
              granules: {
                browseOnly: true
              }
            }
          },
          temporal: {
            startDate: '2020-01-01T00:00:00.000Z',
            endDate: '2020-01-31T23:59:59.999Z',
            isRecurring: false
          },
          spatial: {}
        }
      },
      timeline: {
        query: {}
      },
      user: {
        username: 'testUser'
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(updateSubscription()).then(() => {
      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
        action: 'updateSubscription',
        resource: 'subscription'
      }))

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
