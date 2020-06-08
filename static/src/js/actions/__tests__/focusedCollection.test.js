import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'
import { updateFocusedCollection, getFocusedCollection } from '../focusedCollection'
import {
  UPDATE_AUTH,
  UPDATE_COLLECTION_METADATA,
  UPDATE_FOCUSED_COLLECTION,
  UPDATE_FOCUSED_GRANULE,
  UPDATE_GRANULE_QUERY,
  TOGGLE_SPATIAL_POLYGON_WARNING
} from '../../constants/actionTypes'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as cmrEnv from '../../../../../sharedUtils/cmrEnv'
import * as EventEmitter from '../../events/events'

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

describe('changeFocusedCollection', () => {
  test('with a collectionId it should update the focusedCollection and call getFocusedCollection', () => {
    const collectionId = 'collectionId'

    // mocks
    const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection')
    getFocusedCollectionMock.mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline')
    getTimelineMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      focusedCollection: '',
      query: {
        collection: {
          keyword: 'old stuff'
        }
      },
      router: {
        location: {
          pathname: ''
        }
      }
    })

    // call the dispatch
    store.dispatch(actions.changeFocusedCollection(collectionId))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_FOCUSED_COLLECTION,
      payload: collectionId
    })

    // were the mocks called
    expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
    expect(getTimelineMock).toHaveBeenCalledTimes(1)
  })

  test('without a collectionId it should clear the focusedCollection', () => {
    const collectionId = ''

    // mocks
    const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection')
    getFocusedCollectionMock.mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline')
    getTimelineMock.mockImplementation(() => jest.fn())
    const getFocusedGranuleMock = jest.spyOn(actions, 'getFocusedGranule')
    getFocusedGranuleMock.mockImplementation(() => jest.fn())
    const eventEmitterEmitMock = jest.spyOn(EventEmitter.eventEmitter, 'emit')

    // mockStore with initialState
    const granules = {
      allIds: ['granule1'],
      byId: {
        granule1: {
          mock: 'data'
        }
      }
    }
    const store = mockStore({
      focusedCollection: '',
      metadata: {
        collections: {
          allIds: [],
          byId: {}
        },
        granules: {
          allIds: [],
          byId: {}
        }
      },
      query: {
        collection: {
          keyword: 'old stuff'
        }
      },
      router: {
        location: {
          pathname: ''
        }
      },
      searchResults: {
        granules
      }
    })

    // call the dispatch
    store.dispatch(actions.changeFocusedCollection(collectionId))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: UPDATE_FOCUSED_GRANULE,
      payload: ''
    })
    expect(storeActions[1]).toEqual({
      type: '@@router/CALL_HISTORY_METHOD',
      payload: {
        args: [{
          pathname: '/search',
          search: undefined
        }],
        method: 'push'
      }
    })

    // were the mocks called
    expect(getFocusedCollectionMock).toHaveBeenCalledTimes(1)
    expect(getTimelineMock).toHaveBeenCalledTimes(1)
    expect(getFocusedGranuleMock).toHaveBeenCalledTimes(1)
    expect(eventEmitterEmitMock).toHaveBeenCalledTimes(1)
  })
})

describe('getFocusedCollection', () => {
  test('should update the focusedCollection and call getGranules', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.example.com',
      graphQlHost: 'https://graphql.example.com',
      opensearchRoot: 'https://cmr.example.com'
    }))
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    nock(/graph/)
      .post(/api/)
      .reply(200, {
        data: {
          collection: {
            conceptId: 'collectionId1',
            shortName: 'id_1',
            versionId: 'VersionID'
          }
        }
      })

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())

    const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
    relevancyMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      authToken: '',
      focusedCollection: 'collectionId1',
      metadata: {
        collections: {
          allIds: []
        }
      },
      query: {
        collection: {}
      },
      searchResults: {}
    })

    // call the dispatch
    await store.dispatch(getFocusedCollection()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_GRANULE_QUERY,
        payload: { pageNum: 1 }
      })
      // updateCollectionMetadata
      expect(storeActions[2]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: [{
          collectionId1: expect.objectContaining({
            isCwic: false,
            metadata: {
              conceptId: 'collectionId1',
              gibsLayers: [
                'None'
              ],
              nativeFormats: [],
              relatedUrls: [],
              scienceKeywords: [],
              shortName: 'id_1',
              temporal: [
                'Not available'
              ],
              urls: {
                atom: {
                  href: 'https://cmr.example.com/search/concepts/collectionId1.atom',
                  title: 'ATOM'
                },
                dif: {
                  href: 'https://cmr.example.com/search/concepts/collectionId1.dif',
                  title: 'DIF'
                },
                echo10: {
                  href: 'https://cmr.example.com/search/concepts/collectionId1.echo10',
                  title: 'ECHO10'
                },
                html: {
                  href: 'https://cmr.example.com/search/concepts/collectionId1.html',
                  title: 'HTML'
                },
                iso19115: {
                  href: 'https://cmr.example.com/search/concepts/collectionId1.iso19115',
                  title: 'ISO19115'
                },
                native: {
                  href: 'https://cmr.example.com/search/concepts/collectionId1.native',
                  title: 'Native'
                },
                osdd: {
                  href: 'https://cmr.example.com/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=id_1&versionId=VersionID&dataCenter=collectionId1',
                  title: 'OSDD'
                }
              },
              versionId: 'VersionID'
            }
          })
        }]
      })
    })

    // was getGranules called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
    expect(relevancyMock).toHaveBeenCalledTimes(1)
  })

  test('should update the authenticated focusedCollection and call getGranules', async () => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.example.com',
      opensearchRoot: 'https://cmr.example.com/opensearch'
    }))
    jest.spyOn(cmrEnv, 'cmrEnv').mockImplementation(() => 'prod')

    nock(/localhost/)
      .post(/graphql/)
      .reply(200, {
        data: {
          collection: {
            conceptId: 'collectionId1',
            shortName: 'id_1',
            versionId: 'VersionID'
          }
        }
      }, {
        'jwt-token': 'token'
      })

    const collectionId = 'collectionId'

    // mock getGranules
    const getGranulesMock = jest.spyOn(actions, 'getGranules')
    getGranulesMock.mockImplementation(() => jest.fn())
    const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
    relevancyMock.mockImplementation(() => jest.fn())

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      focusedCollection: collectionId,
      metadata: {
        collections: {
          allIds: []
        }
      },
      query: {
        collection: {}
      },
      searchResults: {
        granules: {}
      }
    })

    // call the dispatch
    await store.dispatch(actions.getFocusedCollection()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: TOGGLE_SPATIAL_POLYGON_WARNING,
        payload: false
      })
      expect(storeActions[1]).toEqual({
        type: UPDATE_GRANULE_QUERY,
        payload: { pageNum: 1 }
      })
      expect(storeActions[2]).toEqual({
        type: UPDATE_AUTH,
        payload: 'token'
      })
      // updateCollectionMetadata
      expect(storeActions[3]).toEqual({
        type: UPDATE_COLLECTION_METADATA,
        payload: [{
          collectionId: expect.objectContaining({
            isCwic: false,
            metadata: {
              conceptId: 'collectionId1',
              gibsLayers: [
                'None'
              ],
              nativeFormats: [],
              relatedUrls: [],
              scienceKeywords: [],
              shortName: 'id_1',
              temporal: [
                'Not available'
              ],
              urls: {
                atom: {
                  href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.example.com%2Fsearch%2Fconcepts%2FcollectionId1.atom&token=token',
                  title: 'ATOM'
                },
                dif: {
                  href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.example.com%2Fsearch%2Fconcepts%2FcollectionId1.dif&token=token',
                  title: 'DIF'
                },
                echo10: {
                  href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.example.com%2Fsearch%2Fconcepts%2FcollectionId1.echo10&token=token',
                  title: 'ECHO10'
                },
                html: {
                  href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.example.com%2Fsearch%2Fconcepts%2FcollectionId1.html&token=token',
                  title: 'HTML'
                },
                iso19115: {
                  href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.example.com%2Fsearch%2Fconcepts%2FcollectionId1.iso19115&token=token',
                  title: 'ISO19115'
                },
                native: {
                  href: 'http://localhost:3000/concepts/metadata?url=https%3A%2F%2Fcmr.example.com%2Fsearch%2Fconcepts%2FcollectionId1.native&token=token',
                  title: 'Native'
                },
                osdd: {
                  href: 'https://cmr.example.com/opensearch/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=id_1&versionId=VersionID&dataCenter=collectionId1',
                  title: 'OSDD'
                }
              },
              versionId: 'VersionID'
            }
          })
        }]
      })
    })

    // was getGranules called
    expect(getGranulesMock).toHaveBeenCalledTimes(1)
    expect(relevancyMock).toHaveBeenCalledTimes(1)
  })

  test('returns no result if there is no focusedCollection', () => {
    const store = mockStore({
      focusedCollection: '',
      searchResults: {
        granules: {}
      },
      metadata: {},
      query: {
        collection: {}
      }
    })

    store.dispatch(actions.getFocusedCollection())
    const storeActions = store.getActions()

    expect(storeActions[0]).toEqual({
      type: TOGGLE_SPATIAL_POLYGON_WARNING,
      payload: false
    })
    expect(storeActions[1]).toEqual({
      type: UPDATE_GRANULE_QUERY,
      payload: { pageNum: 1 }
    })
  })

  test('does not call updateFocusedCollection on error', async () => {
    nock(/localhost/)
      .post(/graph/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: '',
      focusedCollection: 'collectionId',
      metadata: {
        collections: {
          allIds: []
        }
      },
      query: {
        collection: {}
      },
      searchResults: {
        granules: {}
      }
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementationOnce(() => jest.fn())
    const relevancyMock = jest.spyOn(actions, 'collectionRelevancyMetrics')
    relevancyMock.mockImplementation(() => jest.fn())

    await store.dispatch(actions.getFocusedCollection('')).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(relevancyMock).toHaveBeenCalledTimes(1)
    })
  })
})
