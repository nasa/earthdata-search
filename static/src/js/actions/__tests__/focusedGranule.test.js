import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import {
  getFocusedGranule,
  updateFocusedGranule
} from '../focusedGranule'

import {
  UPDATE_GRANULE_METADATA,
  UPDATE_FOCUSED_GRANULE
} from '../../constants/actionTypes'

import * as getClientId from '../../../../../sharedUtils/getClientId'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('updateFocusedGranule', () => {
  test('should create an action to update the focused collection', () => {
    const payload = 'newCollectionId'
    const expectedAction = {
      type: UPDATE_FOCUSED_GRANULE,
      payload
    }

    expect(updateFocusedGranule(payload)).toEqual(expectedAction)
  })
})

describe('getFocusedGranule', () => {
  beforeEach(() => {
    jest.spyOn(getClientId, 'getClientId').mockImplementationOnce(() => ({ client: 'eed-edsc-test-serverless-client' }))
  })

  describe('when metadata has already been retrieved from graphql', () => {
    test('should take no action', async () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))

      const store = mockStore({
        authToken: '',
        focusedCollection: 'C10000000000-EDSC',
        focusedGranule: 'G10000000000-EDSC',
        metadata: {
          collections: {
            'C10000000000-EDSC': {
              hasAllMetadata: true
            }
          },
          granules: {
            'G10000000000-EDSC': {
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

      store.dispatch(getFocusedGranule())

      const storeActions = store.getActions()
      expect(storeActions.length).toBe(0)
    })
  })

  describe('when no metadata exists in the store for the collection from graphql', () => {
    describe('when graphql returns metadata for the requested collection', () => {
      test('should update the focusedGranule and fetch metadata from graphql', async () => {
        jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
          cmrHost: 'https://cmr.example.com',
          graphQlHost: 'https://graphql.example.com',
          opensearchRoot: 'https://cmr.example.com'
        }))

        nock(/graph/)
          .post(/api/)
          .reply(200, {
            data: {
              granule: {
                conceptId: 'G10000000000-EDSC'
              }
            }
          })

        // mockStore with initialState
        const store = mockStore({
          authToken: '',
          focusedCollection: 'C10000000000-EDSC',
          focusedGranule: 'G10000000000-EDSC',
          metadata: {
            collections: {},
            granules: {}
          },
          searchResults: {}
        })

        // call the dispatch
        await store.dispatch(getFocusedGranule()).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            type: UPDATE_GRANULE_METADATA,
            payload: [
              expect.objectContaining({
                id: 'G10000000000-EDSC',
                hasAllMetadata: true
              })
            ]
          })
        })
      })

      describe('when the requested granule is cwic and a polygon search is active', () => {
        test('take no action', async () => {
          jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
            cmrHost: 'https://cmr.example.com',
            graphQlHost: 'https://graphql.example.com',
            opensearchRoot: 'https://cmr.example.com'
          }))

          const store = mockStore({
            authToken: '',
            focusedCollection: 'C10000000000-EDSC',
            focusedGranule: 'G10000000000-EDSC',
            metadata: {
              collections: {
                'C10000000000-EDSC': {
                  isOpenSearch: true
                }
              },
              granules: {
                'G10000000000-EDSC': {
                  isOpenSearch: true
                }
              }
            },
            searchResults: {}
          })

          store.dispatch(getFocusedGranule())

          const storeActions = store.getActions()
          expect(storeActions.length).toBe(0)
        })
      })
    })

    describe('when graphql returns no metadata for the requested collection', () => {
      test('should clear the focusedGranule', async () => {
        jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
          cmrHost: 'https://cmr.example.com',
          graphQlHost: 'https://graphql.example.com',
          opensearchRoot: 'https://cmr.example.com'
        }))

        nock(/graph/)
          .post(/api/)
          .reply(200, {
            data: {
              granule: null
            }
          })

        const changeUrlMock = jest.spyOn(actions, 'changeUrl')
        changeUrlMock.mockImplementationOnce(() => jest.fn())

        const store = mockStore({
          authToken: '',
          focusedCollection: 'C10000000000-EDSC',
          focusedGranule: 'G10000000000-EDSC',
          metadata: {
            collections: {},
            granules: {
              'G10000000000-EDSC': {}
            }
          },
          router: {
            location: {
              search: '?some=testparams',
              pathname: '/search/granules'
            }
          }
        })

        // call the dispatch
        await store.dispatch(getFocusedGranule()).then(() => {
          const storeActions = store.getActions()

          expect(storeActions[0]).toEqual({
            type: 'UPDATE_FOCUSED_GRANULE',
            payload: ''
          })
        })

        expect(changeUrlMock).toHaveBeenCalledTimes(1)
      })
    })
  })

  test('does not call updateFocusedGranule when graphql throws an http error', async () => {
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
      focusedGranule: 'G10000000000-EDSC',
      query: {
        collection: {
          spatial: {}
        }
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

    await store.dispatch(actions.getFocusedGranule()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})

describe('changeFocusedGranule', () => {
  describe('when a collection id is provided', () => {
    test('updates the focusedGranule and calls getFocusedGranule', () => {
      const getFocusedGranuleMock = jest.spyOn(actions, 'getFocusedGranule')
      getFocusedGranuleMock.mockImplementationOnce(() => jest.fn())

      const store = mockStore({})

      const collectionId = 'C1000000000-EDSC'

      store.dispatch(actions.changeFocusedGranule(collectionId))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_FOCUSED_GRANULE,
        payload: collectionId
      })

      expect(getFocusedGranuleMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('when a collection id is not provided', () => {
    test('should clear the focusedGranule', () => {
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

      // call the dispatch
      store.dispatch(actions.changeFocusedGranule(''))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_FOCUSED_GRANULE,
        payload: ''
      })
    })
  })
})
