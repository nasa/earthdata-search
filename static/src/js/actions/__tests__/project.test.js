import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import actions from '../index'

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
  UPDATE_COLLECTION_METADATA
} from '../../constants/actionTypes'

import {
  addCollectionToProject,
  addProjectCollection,
  removeCollectionFromProject,
  toggleCollectionVisibility,
  restoreProject,
  updateAccessMethod,
  selectAccessMethod,
  addAccessMethods,
  submittingProject,
  submittedProject
} from '../project'

import * as getEarthdataConfig from '../../../../../sharedUtils/config'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
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
      allIds: ['collectionId1', 'collectionId2']
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

    const store = mockStore({
      metadata: {
        collections: {
          'GRAN-1': {}
        }
      },
      project: {
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {}
          }
        }
      }
    })

    store.dispatch(selectAccessMethod(payload))
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SELECT_ACCESS_METHOD,
      payload: {
        collectionId: 'collectionId',
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

    const store = mockStore({
      metadata: {
        granules: {
          'GRAN-1': {}
        }
      },
      project: {
        collections: {
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
          allIds: ['collectionId']
        }
      }
    })

    store.dispatch(selectAccessMethod(payload))
    const storeActions = store.getActions()
    expect(storeActions.length).toBe(1)
    expect(storeActions[0]).toEqual({
      type: SELECT_ACCESS_METHOD,
      payload: {
        collectionId: 'collectionId',
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
              conceptId: 'collectionId1',
              tools: {
                items: [{
                  name: 'SOTO'
                }]
              }
            },
            {
              conceptId: 'collectionId2',
              tools: {
                items: null
              }
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

    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {}
      },
      focusedCollection: '',
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2']
        }
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

    const fetchSotoLayersMock = jest.spyOn(actions, 'fetchSotoLayers')
    fetchSotoLayersMock.mockImplementationOnce(() => jest.fn())

    await store.dispatch(actions.getProjectCollections())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_COLLECTION_METADATA,
      payload: [
        expect.objectContaining({
          id: 'collectionId1'
        }),
        expect.objectContaining({
          id: 'collectionId2'
        })
      ]
    })
    expect(fetchSotoLayersMock).toHaveBeenCalledTimes(1)
  })

  test('does not call updateCollectionMetadata if no projectIds exist', () => {
    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {}
      },
      focusedCollection: '',
      project: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      query: {
        collection: {}
      }
    })

    expect(store.dispatch(actions.getProjectCollections())).toEqual(
      new Promise((resolve) => resolve(null))
    )
  })

  test('does not call updateCollectionMetadata on error', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov'
    }))

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())

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

    const store = mockStore({
      authToken: 'token',
      metadata: {
        collections: {},
        granules: {}
      },
      project: {
        collections: {
          allIds: ['C10000000000-EDSC'],
          byId: {}
        }
      }
    })

    await store.dispatch(actions.getProjectCollections())

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: ADD_ERROR,
      payload: expect.objectContaining({
        title: 'Error retrieving project collections',
        message: 'HTTP Request Error'
      })
    })

    expect(consoleMock).toBeCalledTimes(1)
  })

  describe('when requesting a CSDA collection', () => {
    test('calls lambda to get authenticated collections', async () => {
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
        cmrHost: 'https://cmr.earthdata.nasa.gov',
        opensearchRoot: 'https://cmr.earthdata.nasa.gov/opensearch'
      }))

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
                conceptId: 'collectionId1',
                dataCenters: [
                  {
                    shortName: 'NASA/CSDA'
                  }
                ],
                tools: {
                  items: null
                }
              },
              {
                conceptId: 'collectionId2',
                tools: {
                  items: null
                }
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

      const store = mockStore({
        authToken: 'token',
        metadata: {
          collections: {}
        },
        focusedCollection: '',
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2']
          }
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

      await store.dispatch(actions.getProjectCollections())

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: [
          expect.objectContaining({
            isCSDA: true
          }),
          expect.objectContaining({
            isCSDA: false
          })
        ]
      })
    })
  })
})

describe('addProjectCollection', () => {
  test('calls the correct actions to add the collection to the project', async () => {
    const collectionId = 'collectionId'

    const getProjectGranules = jest.spyOn(actions, 'getProjectGranules')
      .mockImplementationOnce(() => jest.fn())

    const store = mockStore({
      authToken: 'token'
    })

    await store.dispatch(addProjectCollection(collectionId))

    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: ADD_COLLECTION_TO_PROJECT,
      payload: collectionId
    })

    expect(getProjectGranules).toBeCalledTimes(1)
  })
})
