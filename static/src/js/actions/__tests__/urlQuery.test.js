import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import * as urlQuery from '../urlQuery'
import { UPDATE_SAVED_PROJECT, RESTORE_FROM_URL } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('updateStore', () => {
  test('calls restoreFromUrl and gets new search results', () => {
    const params = {
      cmrFacets: {},
      featureFacets: { customizable: false, mapImagery: false, nearRealTime: false },
      focusedCollection: 'C00001-EDSC',
      map: {},
      query: {
        collection: {
          overrideTemporal: {},
          pageNum: 1,
          spatial: {},
          temporal: {}
        },
        granule: { pageNum: 1 }
      },
      shapefile: {}
    }

    const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
    const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())
    const getProjectCollectionsMock = jest.spyOn(actions, 'getProjectCollections').mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())

    const store = mockStore({
      router: {
        location: {
          pathname: '/search'
        }
      }
    })
    store.dispatch(urlQuery.updateStore(params))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: params,
      type: RESTORE_FROM_URL
    })

    expect(getCollectionsMock).toBeCalledTimes(1)
    expect(getFocusedCollectionMock).toBeCalledTimes(1)
    expect(getProjectCollectionsMock).toBeCalledTimes(1)
    expect(getTimelineMock).toBeCalledTimes(1)
  })
})

describe('changePath', () => {
  test('retrieves path from database if there is a projectId', async () => {
    nock(/localhost/)
      .get(/projects/)
      .reply(200, {
        name: null,
        path: '/search?p=C00001-EDSC'
      })

    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())

    const newPath = '/search?projectId=1'

    const store = mockStore({
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    await store.dispatch(urlQuery.changePath(newPath)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          name: null,
          projectId: '1',
          path: '/search?p=C00001-EDSC'
        },
        type: UPDATE_SAVED_PROJECT
      })

      expect(updateStoreMock).toBeCalledTimes(1)
      expect(updateStoreMock).toBeCalledWith({
        cmrFacets: {},
        featureFacets: { customizable: false, mapImagery: false, nearRealTime: false },
        focusedCollection: 'C00001-EDSC',
        map: {},
        query: {
          collection: {
            hasGranulesOrCwic: true,
            overrideTemporal: {},
            pageNum: 1,
            spatial: {},
            temporal: {}
          },
          granule: { pageNum: 1 }
        },
        shapefile: {
          shapefileId: ''
        }
      })
    })
  })

  test('updates the store if there is not a projectId', () => {
    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())

    const newPath = '/search?p=C00001-EDSC'

    const store = mockStore({
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    store.dispatch(urlQuery.changePath(newPath))

    expect(updateStoreMock).toBeCalledTimes(1)
    expect(updateStoreMock).toBeCalledWith({
      cmrFacets: {},
      featureFacets: { customizable: false, mapImagery: false, nearRealTime: false },
      focusedCollection: 'C00001-EDSC',
      map: {},
      query: {
        collection: {
          hasGranulesOrCwic: true,
          overrideTemporal: {},
          pageNum: 1,
          spatial: {},
          temporal: {}
        },
        granule: { pageNum: 1 }
      },
      shapefile: {
        shapefileId: ''
      }
    }, '/search')
  })
})

describe('changeUrl', () => {
  describe('when called with a string', () => {
    describe('when called without a projectId', () => {
      test('calls replace when the pathname has not changed', () => {
        const newPath = '/search?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          },
          savedProject: {}
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          payload: {
            args: [
              newPath
            ],
            method: 'replace'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        })
      })

      test('calls push when the pathname has changed', () => {
        const newPath = '/search/granules?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/search'
            }
          },
          savedProject: {}
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          payload: {
            args: [
              newPath
            ],
            method: 'push'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        })
      })
    })

    describe('when called with a projectId', () => {
      test('updates the stored path', async () => {
        nock(/localhost/)
          .post(/projects/)
          .reply(200, {
            project_id: 1,
            path: '/search?p=C00001-EDSC'
          })

        const newPath = '/search?p=C00001-EDSC&ff=Map%20Imagery'

        const store = mockStore({
          query: {},
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        await store.dispatch(urlQuery.changeUrl(newPath)).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            payload: {
              projectId: 1,
              path: '/search?p=C00001-EDSC'
            },
            type: UPDATE_SAVED_PROJECT
          })
        })
      })

      test('updates the url if a new projectId was created', async () => {
        nock(/localhost/)
          .post(/projects/)
          .reply(200, {
            project_id: 2,
            path: '/search?p=C00001-EDSC'
          })

        const newPath = '/search?p=C00001-EDSC&ff=Map%20Imagery'

        const store = mockStore({
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        await store.dispatch(urlQuery.changeUrl(newPath)).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            payload: {
              args: [
                '/search?projectId=2'
              ],
              method: 'replace'
            },
            type: '@@router/CALL_HISTORY_METHOD'
          })
          expect(storeActions[1]).toEqual({
            payload: {
              projectId: 2,
              path: '/search?p=C00001-EDSC'
            },
            type: UPDATE_SAVED_PROJECT
          })
        })
      })

      test('when the path has not changed', () => {
        const newPath = '/search?p=C00001-EDSC'

        const store = mockStore({
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions.length).toBe(0)
      })
    })
  })


  describe('when called with an object', () => {
    test('calls replace when the pathname has not changed', () => {
      const newPath = {
        pathname: '/search',
        search: '?p=C00001-EDSC'
      }

      const store = mockStore({
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(urlQuery.changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'replace'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = {
        pathname: '/granules',
        search: '?p=C00001-EDSC'
      }

      const store = mockStore({
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(urlQuery.changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'push'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })
  })
})
