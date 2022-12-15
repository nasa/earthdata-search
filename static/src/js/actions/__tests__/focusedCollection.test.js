import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import {
  getFocusedCollection,
  getGranuleSubscriptions,
  updateFocusedCollection,
  viewCollectionDetails,
  viewCollectionGranules
} from '../focusedCollection'

import {
  INITIALIZE_COLLECTION_GRANULES_QUERY,
  INITIALIZE_COLLECTION_GRANULES_RESULTS,
  TOGGLE_SPATIAL_POLYGON_WARNING,
  UPDATE_COLLECTION_METADATA,
  UPDATE_GRANULE_SUBSCRIPTIONS,
  UPDATE_FOCUSED_COLLECTION,
  UPDATE_FOCUSED_GRANULE
} from '../../constants/actionTypes'

import * as EventEmitter from '../../events/events'
import * as getClientId from '../../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('updateFocusedCollection', () => {
  test('should create an action to update the focused collection', () => {
    const payload = 'newCollectionId'
    const expectedAction = {
      type: UPDATE_FOCUSED_COLLECTION,
      payload
    }

    expect(updateFocusedCollection(payload)).toEqual(expectedAction)
  })
})

describe('getFocusedCollection', () => {
  beforeEach(() => {
    jest.spyOn(getClientId, 'getClientId').mockImplementationOnce(() => ({ client: 'eed-edsc-test-serverless-client' }))
  })

  describe('when metdata has already been retrieved from graphql', () => {
    test('should update the focusedCollection and call getSearchGranules', async () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))

      const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
      relevancyMock.mockImplementationOnce(() => jest.fn())

      const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
      getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

      const store = mockStore({
        authToken: '',
        focusedCollection: 'C10000000000-EDSC',
        metadata: {
          collections: {
            'C10000000000-EDSC': {
              hasAllMetadata: true
            }
          }
        },
        query: {
          collection: {
            spatial: {}
          }
        },
        searchResults: {}
      })

      await store.dispatch(getFocusedCollection()).then(() => {
        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          type: TOGGLE_SPATIAL_POLYGON_WARNING,
          payload: false
        })
      })

      expect(relevancyMock).toHaveBeenCalledTimes(1)
      expect(getSearchGranulesMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when no metadata exists in the store for the collection from graphql', () => {
    describe('when graphql returns metadata for the requested collection', () => {
      test('should update the focusedCollection, fetch metadata from graphql and calls getSearchGranules', async () => {
        jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
          cmrHost: 'https://cmr.example.com',
          graphQlHost: 'https://graphql.example.com',
          opensearchRoot: 'https://cmr.example.com'
        }))

        nock(/graph/)
          .post(/api/)
          .reply(200, {
            data: {
              collection: {
                conceptId: 'C10000000000-EDSC',
                shortName: 'id_1',
                versionId: 'VersionID',
                tools: {
                  items: [{
                    name: 'SOTO'
                  }]
                }
              }
            }
          })

        const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
        relevancyMock.mockImplementationOnce(() => jest.fn())

        const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
        getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

        const store = mockStore({
          authToken: '',
          focusedCollection: 'C10000000000-EDSC',
          metadata: {
            collections: {}
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          searchResults: {}
        })

        await store.dispatch(getFocusedCollection()).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: TOGGLE_SPATIAL_POLYGON_WARNING,
            payload: false
          })
          expect(storeActions[1]).toEqual({
            type: UPDATE_COLLECTION_METADATA,
            payload: [
              expect.objectContaining({
                id: 'C10000000000-EDSC'
              })
            ]
          })
        })

        expect(relevancyMock).toHaveBeenCalledTimes(1)
        expect(getSearchGranulesMock).toHaveBeenCalledTimes(1)
      })

      describe('when the requested collection is cwic and a polygon search is active', () => {
        test('should toggle the polygon warning, update the focusedCollection and call getSearchGranules', async () => {
          jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
            cmrHost: 'https://cmr.example.com',
            graphQlHost: 'https://graphql.example.com',
            opensearchRoot: 'https://cmr.example.com'
          }))

          nock(/graph/)
            .post(/api/)
            .reply(200, {
              data: {
                collection: {
                  conceptId: 'C10000000000-EDSC',
                  shortName: 'id_1',
                  versionId: 'VersionID',
                  hasGranules: false,
                  tags: {
                    'org.ceos.wgiss.cwic.granules.prod': {}
                  },
                  tools: {
                    items: null
                  }
                }
              }
            })

          const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
          relevancyMock.mockImplementationOnce(() => jest.fn())

          const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
          getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

          const store = mockStore({
            authToken: '',
            focusedCollection: 'C10000000000-EDSC',
            metadata: {
              collections: {
                'C10000000000-EDSC': {
                  isOpenSearch: true
                }
              }
            },
            query: {
              collection: {
                spatial: {
                  polygon: '-77,38,-77,38,-76,38,-77,38'
                }
              }
            },
            searchResults: {}
          })

          await store.dispatch(getFocusedCollection()).then(() => {
            const storeActions = store.getActions()
            expect(storeActions[0]).toEqual({
              type: TOGGLE_SPATIAL_POLYGON_WARNING,
              payload: true
            })
            expect(storeActions[1]).toEqual({
              type: UPDATE_COLLECTION_METADATA,
              payload: [
                expect.objectContaining({
                  id: 'C10000000000-EDSC'
                })
              ]
            })
          })

          expect(relevancyMock).toHaveBeenCalledTimes(1)
          expect(getSearchGranulesMock).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('when graphql returns no metadata for the requested collection', () => {
      test('should clear the focusedCollection', async () => {
        jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
          cmrHost: 'https://cmr.example.com',
          graphQlHost: 'https://graphql.example.com',
          opensearchRoot: 'https://cmr.example.com'
        }))

        nock(/graph/)
          .post(/api/)
          .reply(200, {
            data: {
              collection: null
            }
          })

        const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
        relevancyMock.mockImplementationOnce(() => jest.fn())

        const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
        getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

        const changeUrlMock = jest.spyOn(actions, 'changeUrl')
        changeUrlMock.mockImplementationOnce(() => jest.fn())

        const store = mockStore({
          authToken: '',
          focusedCollection: 'C10000000000-EDSC',
          metadata: {
            collections: {
              'C10000000000-EDSC': {}
            },
            granules: {}
          },
          router: {
            location: {
              search: '?some=testparams',
              pathname: '/search/granules'
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          }
        })

        await store.dispatch(getFocusedCollection()).then(() => {
          const storeActions = store.getActions()

          expect(storeActions[0]).toEqual({
            type: TOGGLE_SPATIAL_POLYGON_WARNING,
            payload: false
          })
          expect(storeActions[1]).toEqual({
            type: 'UPDATE_FOCUSED_COLLECTION',
            payload: ''
          })
        })

        expect(getSearchGranulesMock).toHaveBeenCalledTimes(0)
        expect(relevancyMock).toHaveBeenCalledTimes(1)
        expect(changeUrlMock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('when requesting a CSDA collection', () => {
    test('sets the metadata correctly', async () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))

      nock(/graph/)
        .post(/api/)
        .reply(200, {
          data: {
            collection: {
              conceptId: 'C10000000000-EDSC',
              shortName: 'id_1',
              versionId: 'VersionID',
              dataCenters: [
                {
                  shortName: 'NASA/CSDA'
                }
              ],
              tools: {
                items: null
              }
            }
          }
        })

      const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
      relevancyMock.mockImplementationOnce(() => jest.fn())

      const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
      getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

      const store = mockStore({
        authToken: '',
        focusedCollection: 'C10000000000-EDSC',
        metadata: {
          collections: {}
        },
        query: {
          collection: {
            spatial: {}
          }
        },
        searchResults: {}
      })

      await store.dispatch(getFocusedCollection()).then(() => {
        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          type: TOGGLE_SPATIAL_POLYGON_WARNING,
          payload: false
        })

        expect(storeActions[1]).toEqual({
          type: UPDATE_COLLECTION_METADATA,
          payload: [
            expect.objectContaining({
              isCSDA: true
            })
          ]
        })
      })

      expect(relevancyMock).toHaveBeenCalledTimes(1)
      expect(getSearchGranulesMock).toHaveBeenCalledTimes(1)
    })
  })

  test('does not call updateFocusedCollection when graphql throws an http error', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com',
      opensearchRoot: 'https://cmr.example.com'
    }))

    const getSearchGranulesMock = jest.spyOn(actions, 'getSearchGranules')
    getSearchGranulesMock.mockImplementationOnce(() => jest.fn())

    nock(/graph/)
      .post(/api/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: '',
      focusedCollection: 'C10000000000-EDSC',
      query: {
        collection: {
          spatial: {}
        }
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())
    const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
    relevancyMock.mockImplementationOnce(() => jest.fn())

    await store.dispatch(actions.getFocusedCollection()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(relevancyMock).toHaveBeenCalledTimes(1)
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

      const store = mockStore({
        authToken: '',
        focusedCollection: 'C10000000000-EDSC',
        metadata: {
          collections: {
            'C10000000000-EDSC': {
              id: 'C10000000000-EDSC',
              subscriptions: {
                items: [
                  'original items'
                ]
              }
            }
          }
        },
        query: {
          collection: {
            spatial: {}
          }
        },
        searchResults: {}
      })

      await store.dispatch(getGranuleSubscriptions()).then(() => {
        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          type: UPDATE_GRANULE_SUBSCRIPTIONS,
          payload: {
            collectionId: 'C10000000000-EDSC',
            subscriptions: {
              items: [
                'new items'
              ]
            }
          }
        })
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

      const store = mockStore({
        authToken: '',
        metadata: {
          collections: {
            'C10000000000-EDSC': {
              id: 'C10000000000-EDSC',
              subscriptions: {
                items: [
                  'original items'
                ]
              }
            }
          }
        },
        query: {
          collection: {
            spatial: {}
          }
        },
        searchResults: {}
      })

      await store.dispatch(getGranuleSubscriptions('C10000000000-EDSC')).then(() => {
        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          type: UPDATE_GRANULE_SUBSCRIPTIONS,
          payload: {
            collectionId: 'C10000000000-EDSC',
            subscriptions: {
              items: [
                'new items'
              ]
            }
          }
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

    await store.dispatch(getGranuleSubscriptions()).then(() => {
      expect(handleErrorMock).toHaveBeenCalledTimes(1)
      expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
        action: 'getGranuleSubscriptions',
        resource: 'subscription'
      }))

      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('changeFocusedCollection', () => {
  describe('when a collection id is provided', () => {
    test('updates the focusedCollection and calls getFocusedCollection', () => {
      const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection')
      getFocusedCollectionMock.mockImplementationOnce(() => jest.fn())

      const getTimelineMock = jest.spyOn(actions, 'getTimeline')
      getTimelineMock.mockImplementationOnce(() => jest.fn())

      const store = mockStore({
        preferences: {
          preferences: {
            granuleSort: 'default'
          }
        }
      })

      const collectionId = 'C1000000000-EDSC'

      store.dispatch(actions.changeFocusedCollection(collectionId))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_FOCUSED_COLLECTION,
        payload: collectionId
      })
      expect(storeActions[1]).toEqual({
        type: INITIALIZE_COLLECTION_GRANULES_QUERY,
        payload: {
          collectionId,
          granuleSortPreference: 'default'
        }
      })
      expect(storeActions[2]).toEqual({
        type: INITIALIZE_COLLECTION_GRANULES_RESULTS,
        payload: collectionId
      })

      expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
      expect(getTimelineMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when a collection id is not provided', () => {
    test('should clear the focusedCollection and call ', () => {
      const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

      const changeUrlMock = jest.spyOn(actions, 'changeUrl')
      changeUrlMock.mockImplementationOnce(() => jest.fn())

      const store = mockStore({
        router: {
          location: {
            search: '?some=testparams',
            pathname: '/search/granules'
          }
        }
      })

      store.dispatch(actions.changeFocusedCollection(''))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_FOCUSED_COLLECTION,
        payload: ''
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_FOCUSED_GRANULE,
        payload: ''
      })
      expect(storeActions[2]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })

      expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
      expect(changeUrlMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('viewCollectionDetails', () => {
  test('sets the focused collection and redirects to the collection details', () => {
    const changeFocusedCollectionMock = jest.spyOn(actions, 'changeFocusedCollection')
    changeFocusedCollectionMock.mockImplementationOnce(() => jest.fn())

    const changeUrlMock = jest.spyOn(actions, 'changeUrl')
    changeUrlMock.mockImplementationOnce(() => jest.fn())

    const store = mockStore({
      authToken: '',
      focusedCollection: 'C10000000000-EDSC',
      router: {
        location: {
          search: '?some=testparams',
          pathname: '/search/granules'
        }
      },
      query: {
        collection: {
          spatial: {}
        }
      }
    })

    store.dispatch(viewCollectionDetails())

    expect(changeFocusedCollectionMock).toHaveBeenCalledTimes(1)
    expect(changeUrlMock).toHaveBeenCalledTimes(1)
  })
})

describe('viewCollectionGranules', () => {
  test('sets the focused collection and redirects to the collection details', () => {
    const changeFocusedCollectionMock = jest.spyOn(actions, 'changeFocusedCollection')
    changeFocusedCollectionMock.mockImplementationOnce(() => jest.fn())

    const changeUrlMock = jest.spyOn(actions, 'changeUrl')
    changeUrlMock.mockImplementationOnce(() => jest.fn())

    const store = mockStore({
      authToken: '',
      focusedCollection: 'C10000000000-EDSC',
      router: {
        location: {
          search: '?some=testparams',
          pathname: '/search/granules'
        }
      },
      query: {
        collection: {
          spatial: {}
        }
      }
    })

    store.dispatch(viewCollectionGranules())

    expect(changeFocusedCollectionMock).toHaveBeenCalledTimes(1)
    expect(changeUrlMock).toHaveBeenCalledTimes(1)
  })
})
