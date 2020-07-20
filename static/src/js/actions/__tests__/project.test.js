import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import actions from '../index'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as cmrEnv from '../../../../../sharedUtils/cmrEnv'

import {
  ADD_ERROR,
  ADD_ACCESS_METHODS,
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  RESTORE_PROJECT,
  SELECT_ACCESS_METHOD,
  SUBMITTED_PROJECT,
  SUBMITTING_PROJECT,
  TOGGLE_COLLECTION_VISIBILITY,
  UPDATE_ACCESS_METHOD,
  UPDATE_AUTH,
  UPDATE_COLLECTION_METADATA
} from '../../constants/actionTypes'

import {
  addCollectionToProject,
  addProjectCollection,
  getProjectCollections,
  removeCollectionFromProject,
  toggleCollectionVisibility,
  restoreProject,
  updateAccessMethod,
  selectAccessMethod,
  addAccessMethods,
  submittingProject,
  submittedProject
} from '../project'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()

  jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')
})

describe('addCollectionToProject', () => {
  test('should create an action to add the collection to a project', () => {
    const payload = 'collectionId'
    const expectedAction = {
      type: ADD_COLLECTION_TO_PROJECT,
      payload
    }
    expect(addCollectionToProject(payload)).toEqual(expectedAction)
  })
})

describe('removeCollectionFromProject', () => {
  test('should create an action to remove the collection from a project', () => {
    const payload = 'collectionId'
    const expectedAction = {
      type: REMOVE_COLLECTION_FROM_PROJECT,
      payload
    }
    expect(removeCollectionFromProject(payload)).toEqual(expectedAction)
  })
})

describe('toggleCollectionVisibility', () => {
  test('should create an action to update the collection visibility', () => {
    const payload = 'collectionId'
    const expectedAction = {
      type: TOGGLE_COLLECTION_VISIBILITY,
      payload
    }
    expect(toggleCollectionVisibility(payload)).toEqual(expectedAction)
  })
})

describe('restoreProject', () => {
  test('should create an action to restore project collections', () => {
    const payload = {
      collectionIds: ['collectionId1', 'collectionId2']
    }
    const expectedAction = {
      type: RESTORE_PROJECT,
      payload
    }
    expect(restoreProject(payload)).toEqual(expectedAction)
  })
})

describe('addAccessMethods', () => {
  test('should create an action to update an access method', () => {
    const payload = {
      collectionId: 'collectionId',
      isValid: true,
      method: {
        download: {
          type: 'download'
        }
      }
    }
    const expectedAction = {
      type: ADD_ACCESS_METHODS,
      payload
    }
    expect(addAccessMethods(payload)).toEqual(expectedAction)
  })
})

describe('updateAccessMethod', () => {
  test('should create an action to update an access method', () => {
    const payload = {
      collectionId: 'collectionId',
      isValid: true,
      method: {
        download: {
          type: 'download'
        }
      }
    }
    const expectedAction = {
      type: UPDATE_ACCESS_METHOD,
      payload
    }
    expect(updateAccessMethod(payload)).toEqual(expectedAction)
  })
})

describe('selectAccessMethod', () => {
  test('should create an action to select the access method and update the access methods', () => {
    const payload = {
      collectionId: 'collectionId',
      selectedAccessMethod: 'download'
    }

    // mockStore with initialState
    const store = mockStore({
      metadata: {
        collections: {
          byId: {
            collectionId: {
              granules: {
                hits: 1,
                byId: {
                  'GRAN-1': {}
                },
                allIds: ['GRAN-1']
              }
            }
          }
        }
      },
      project: {
        byId: {
          collectionId: {
            orderCount: 1
          }
        },
        collectionIds: ['collectionId']
      }
    })

    // call the dispatch
    store.dispatch(selectAccessMethod(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SELECT_ACCESS_METHOD,
      payload: {
        collectionId: 'collectionId',
        orderCount: 0,
        selectedAccessMethod: 'download'
      }
    })
  })

  describe('submittingProject', () => {
    test('should create an action to update the project submitting state', () => {
      const expectedAction = {
        type: SUBMITTING_PROJECT
      }
      expect(submittingProject()).toEqual(expectedAction)
    })
  })

  describe('submittedProject', () => {
    test('should create an action to update the project submitted state', () => {
      const expectedAction = {
        type: SUBMITTED_PROJECT
      }
      expect(submittedProject()).toEqual(expectedAction)
    })
  })

  test('should not update the access methods if the method already exists', () => {
    const payload = {
      collectionId: 'collectionId',
      selectedAccessMethod: 'download'
    }

    // mockStore with initialState
    const store = mockStore({
      metadata: {
        collections: {
          byId: {
            collectionId: {
              granules: {
                hits: 1,
                byId: {
                  'GRAN-1': {}
                },
                allIds: ['GRAN-1']
              }
            }
          }
        }
      },
      project: {
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectAccessMethod: 'mock'
          }
        },
        collectionIds: ['collectionId']
      }
    })

    // call the dispatch
    store.dispatch(selectAccessMethod(payload))
    const storeActions = store.getActions()
    expect(storeActions.length).toBe(1)
    expect(storeActions[0]).toEqual({
      type: SELECT_ACCESS_METHOD,
      payload: {
        collectionId: 'collectionId',
        orderCount: 0,
        selectedAccessMethod: 'download'
      }
    })
  })
})

describe('getProjectCollections', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls lambda to get authenticated collections', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov',
      opensearchRoot: 'https://cmr.earthdata.nasa.gov/opensearch'
    }))
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    nock(/localhost/)
      .post(/dqs/)
      .reply(200, {})

    nock(/localhost/)
      .post(/dqs/)
      .reply(200, {})

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          collections: {
            items: [{
              conceptId: 'collectionId1'
            },
            {
              conceptId: 'collectionId2'
            }]
          }
        }
      },
      {
        'jwt-token': 'token'
      })

    nock(/localhost/)
      .post(/granules/)
      .reply(200, {
        feed: {
          updated: '2019-03-27T20:21:14.705Z',
          id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collectionId',
          title: 'ECHO granule metadata',
          entry: [{
            id: 'G1000001-EDSC'
          }, {
            id: 'G1000002-EDSC'
          }]
        }
      }, {
        'cmr-hits': 1
      })

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      focusedCollection: '',
      project: {
        collectionIds: ['collectionId1', 'collectionId2']
      },
      providers: [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NON-EDSC-TEST',
            provider_id: 'NON-EDSC-TEST'
          }
        }
      ],
      query: {
        collection: {}
      }
    })

    // call the dispatch
    await store.dispatch(actions.getProjectCollections(['collectionId1', 'collectionId2']))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_AUTH,
      payload: 'token'
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_COLLECTION_METADATA,
      payload: [
        {
          collectionId1: expect.objectContaining({
            metadata: expect.objectContaining({
              conceptId: 'collectionId1'
            })
          })
        },
        {
          collectionId2: expect.objectContaining({
            metadata: expect.objectContaining({
              conceptId: 'collectionId2'
            })
          })
        }
      ]
    })
  })

  test('does not call updateCollectionMetadata if no projectIds exist', () => {
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      focusedCollection: '',
      project: {
        collectionIds: [],
        byId: {}
      },
      query: {
        collection: {}
      }
    })

    expect(store.dispatch(getProjectCollections([]))).toEqual(
      new Promise(resolve => resolve(null))
    )
  })

  test('does not call updateCollectionMetadata on error', async () => {
    const collectionId = 'collectionId'

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov'
    }))

    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    const fetchAccessMethods = jest.spyOn(actions, 'fetchAccessMethods')
      .mockImplementationOnce(() => jest.fn())
    const getGranules = jest.spyOn(actions, 'getGranules')
      .mockImplementationOnce(() => jest.fn())

    nock(/localhost/)
      .post(/graphql/)
      .reply(500, {
        errors: ['HTTP Request Error']
      },
      {
        'jwt-token': 'token'
      })

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {},
        granules: {}
      }
    })

    // call the dispatch
    await store.dispatch(addProjectCollection(collectionId))

    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: ADD_COLLECTION_TO_PROJECT,
      payload: 'collectionId'
    })
    expect(storeActions[1]).toEqual({
      type: ADD_ERROR,
      payload: expect.objectContaining({
        title: 'Error retrieving collections',
        message: 'There was a problem completing the request'
      })
    })

    expect(fetchAccessMethods).toBeCalledTimes(0)

    expect(getGranules).toBeCalledTimes(0)
  })
})

describe('addProjectCollection', () => {
  test('calls the correct actions to add the collection to the project', async () => {
    const collectionId = 'collectionId'

    const getProjectCollectionsMock = jest.spyOn(actions, 'getProjectCollections')
      .mockImplementationOnce(() => jest.fn())
    const fetchAccessMethods = jest.spyOn(actions, 'fetchAccessMethods')
      .mockImplementationOnce(() => jest.fn())
    const getGranules = jest.spyOn(actions, 'getGranules')
      .mockImplementationOnce(() => jest.fn())


    // mockStore with initialState
    const store = mockStore({
      authToken: 'token'
    })

    // call the dispatch
    await store.dispatch(addProjectCollection(collectionId))

    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: ADD_COLLECTION_TO_PROJECT,
      payload: collectionId
    })

    expect(getProjectCollectionsMock).toBeCalledTimes(1)
    expect(getProjectCollectionsMock).toBeCalledWith([collectionId])

    expect(fetchAccessMethods).toBeCalledTimes(1)
    expect(fetchAccessMethods).toBeCalledWith([collectionId])

    expect(getGranules).toBeCalledTimes(1)
    expect(getGranules).toBeCalledWith([collectionId])
  })
})
