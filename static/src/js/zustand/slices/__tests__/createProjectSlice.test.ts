import nock from 'nock'
import MockDate from 'mockdate'

import useEdscStore from '../../useEdscStore'
import { initialGranuleState, initialState } from '../createProjectSlice'

// @ts-expect-error This file does not have types
import configureStore from '../../../store/configureStore'

// @ts-expect-error This file does not have types
import actions from '../../../actions'
// @ts-expect-error This file does not have types
import GranuleRequest from '../../../util/request/granuleRequest'

// @ts-expect-error This file does not have types
import * as applicationConfig from '../../../../../../sharedUtils/config'
import { EchoOrderAccessMethod } from '../../types'

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-request-id')
}))

jest.mock('../../../../../../sharedUtils/getClientId', () => ({
  getClientId: jest.fn().mockReturnValue({
    client: 'mock-client-id'
  })
}))

jest.mock('../../../store/configureStore', () => jest.fn())

jest.mock('../../../actions', () => ({
  addGranuleMetadata: jest.fn(),
  handleAlert: jest.fn(),
  handleError: jest.fn(),
  toggleSpatialPolygonWarning: jest.fn(),
  updateCollectionMetadata: jest.fn()
}))

beforeEach(() => {
  MockDate.set(new Date('2025-01-01T00:00:00Z'))
})

afterEach(() => {
  MockDate.reset()
})

describe('createProjectSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { project } = zustandState

    expect(project).toEqual({
      ...initialState,
      addGranuleToProjectCollection: expect.any(Function),
      addProjectCollection: expect.any(Function),
      erroredProjectGranules: expect.any(Function),
      getProjectCollections: expect.any(Function),
      getProjectGranules: expect.any(Function),
      removeGranuleFromProjectCollection: expect.any(Function),
      removeProjectCollection: expect.any(Function),
      selectAccessMethod: expect.any(Function),
      startProjectGranulesTimer: expect.any(Function),
      stopProjectGranulesTimer: expect.any(Function),
      submittingProject: expect.any(Function),
      submittedProject: expect.any(Function),
      toggleCollectionVisibility: expect.any(Function),
      updateAccessMethod: expect.any(Function),
      updateProjectGranuleParams: expect.any(Function),
      updateProjectGranuleResults: expect.any(Function)
    })
  })

  describe('addGranuleToProjectCollection', () => {
    describe('when the granule does not exist in the collection', () => {
      test('adds the granule to the addedGranuleIds', () => {
        const collectionId = 'collectionId'
        const granuleId = 'granuleId'
        useEdscStore.setState((state) => {
          state.project.updateProjectGranuleParams = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.addGranuleToProjectCollection({
          collectionId,
          granuleId
        })

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.byId[collectionId].granules.addedGranuleIds).toEqual(
          [granuleId]
        )

        expect(updatedProject.collections.byId[collectionId].granules.removedGranuleIds).toEqual(
          []
        )

        expect(updatedProject.collections.byId[collectionId].granules.allIds).toEqual(
          []
        )

        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledTimes(1)
        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledWith({
          collectionId,
          pageNum: 1
        })
      })
    })

    describe('when the granule is in the removedGranuleIds', () => {
      test('does not add the granule again', () => {
        const collectionId = 'collectionId'
        const granuleId = 'granuleId'
        useEdscStore.setState((state) => {
          state.project.collections.allIds.push(collectionId)
          state.project.collections.byId[collectionId] = {
            granules: {
              ...initialGranuleState,
              removedGranuleIds: [granuleId],
              allIds: []
            },
            isVisible: true
          }

          state.project.updateProjectGranuleParams = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.addGranuleToProjectCollection({
          collectionId,
          granuleId
        })

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.byId[collectionId].granules.addedGranuleIds).toEqual(
          []
        )

        expect(updatedProject.collections.byId[collectionId].granules.removedGranuleIds).toEqual(
          []
        )

        expect(updatedProject.collections.byId[collectionId].granules.allIds).toEqual(
          []
        )

        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledTimes(1)
        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledWith({
          collectionId,
          pageNum: 1
        })
      })
    })
  })

  describe('addProjectCollection', () => {
    test('adds a collection to the project', () => {
      useEdscStore.setState((state) => {
        state.project.getProjectGranules = jest.fn()
      })

      const collectionId = 'C123456789-EDSC'
      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.addProjectCollection(collectionId)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.collections.allIds).toContain(collectionId)
      expect(updatedProject.collections.byId[collectionId]).toBeDefined()
      expect(updatedProject.collections.byId[collectionId].granules).toEqual({
        ...initialGranuleState
      })

      expect(updatedProject.getProjectGranules).toHaveBeenCalledTimes(1)
      expect(updatedProject.getProjectGranules).toHaveBeenCalledWith()
    })

    test('does not add a collection if it already exists', () => {
      useEdscStore.setState((state) => {
        state.project.getProjectGranules = jest.fn()
      })

      const collectionId = 'C123456789-EDSC'
      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        // eslint-disable-next-line no-param-reassign
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true
        }
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.addProjectCollection(collectionId)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.collections.allIds).toEqual([collectionId])

      expect(updatedProject.getProjectGranules).toHaveBeenCalledTimes(0)
    })
  })

  describe('erroredProjectGranules', () => {
    test('sets the errored granules', () => {
      const collectionId = 'collectionId'
      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true
        }
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.erroredProjectGranules(collectionId)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.collections.byId[collectionId].granules.isErrored).toEqual(
        true
      )
    })
  })

  describe('getProjectCollections', () => {
    describe('when the user is not logged in', () => {
      test('returns null', async () => {
        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: '',
            earthdataEnvironment: 'prod'
          })
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        const result = await project.getProjectCollections()
        expect(result).toBeNull()
      })
    })

    describe('when the the saved access configs request returns a 401', () => {
      test('returns null', async () => {
        nock(/localhost/)
          .post(/saved_access_configs/)
          .reply(401, {
            message: 'Request failed with status code 401',
            name: 'AxiosError',
            code: 'ERR_BAD_REQUEST'
          })

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = ['collectionId1', 'collectionId2']
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        const result = await project.getProjectCollections()
        expect(result).toBeNull()

        expect(actions.handleError).toHaveBeenCalledTimes(1)
        expect(actions.handleError).toHaveBeenCalledWith({
          action: 'getProjectCollections',
          error: expect.any(Error),
          resource: 'saved access configurations'
        })
      })
    })

    describe('when the user is logged in', () => {
      test('adds access methods and updates collection metadata', async () => {
        nock(/localhost/)
          .post(/saved_access_configs/)
          .reply(200, {})

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              collections: {
                items: [{
                  conceptId: 'collectionId1',
                  granules: {
                    items: [{
                      id: 'granuleId1',
                      onlineAccessFlag: true
                    }]
                  },
                  tools: {
                    items: [{
                      name: 'SOTO'
                    }]
                  },
                  services: {
                    items: []
                  },
                  dataQualitySummaries: {
                    items: []
                  }
                },
                {
                  conceptId: 'collectionId2',
                  granules: {
                    items: [{
                      id: 'granuleId2',
                      onlineAccessFlag: true
                    }]
                  },
                  tools: {
                    items: []
                  },
                  services: {
                    items: []
                  },
                  dataQualitySummaries: {
                    items: []
                  }
                }]
              }
            }
          }, {
            'jwt-token': 'token'
          })

        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = ['collectionId1', 'collectionId2']
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectCollections()

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState
        const { collections } = updatedProject
        const { byId } = collections
        const collection1 = byId.collectionId1
        const collection2 = byId.collectionId2

        expect(collection1.selectedAccessMethod).toEqual('download')
        expect(collection1.accessMethods).toEqual({
          download: {
            isValid: true,
            type: 'download'
          }
        })

        expect(collection2.selectedAccessMethod).toEqual('download')
        expect(collection2.accessMethods).toEqual({
          download: {
            isValid: true,
            type: 'download'
          }
        })

        expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(2)
        expect(actions.updateCollectionMetadata).toHaveBeenCalledWith([{
          abstract: undefined,
          archiveAndDistributionInformation: undefined,
          associatedDois: undefined,
          boxes: undefined,
          cloudHosted: undefined,
          coordinateSystem: undefined,
          dataCenter: undefined,
          dataCenters: undefined,
          dataQualitySummaries: { items: [] },
          directDistributionInformation: {},
          doi: undefined,
          duplicateCollections: [],
          gibsLayers: 'None',
          granules: {
            items: [{
              id: 'granuleId1',
              onlineAccessFlag: true
            }]
          },
          hasAllMetadata: true,
          hasGranules: undefined,
          id: 'collectionId1',
          isCSDA: false,
          isOpenSearch: false,
          relatedCollections: undefined,
          relatedUrls: [],
          scienceKeywords: [],
          services: { items: [] },
          shortName: undefined,
          spatial: undefined,
          subscriptions: undefined,
          tags: undefined,
          temporal: ['Not available'],
          tilingIdentificationSystems: undefined,
          timeEnd: undefined,
          timeStart: undefined,
          title: undefined,
          tools: { items: [{ name: 'SOTO' }] },
          urls: {
            atom: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.atom&token=mockAuthToken',
              title: 'ATOM'
            },
            dif: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.dif&token=mockAuthToken',
              title: 'DIF'
            },
            echo10: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.echo10&token=mockAuthToken',
              title: 'ECHO10'
            },
            html: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.html&token=mockAuthToken',
              title: 'HTML'
            },
            iso19115: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.iso19115&token=mockAuthToken',
              title: 'ISO19115'
            },
            native: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId1.native&token=mockAuthToken',
              title: 'Native'
            },
            osdd: {
              href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=mock-client-id&shortName=undefined&versionId=undefined&dataCenter=collectionId1',
              title: 'OSDD'
            }
          },
          variables: undefined,
          versionId: undefined
        }, {
          abstract: undefined,
          archiveAndDistributionInformation: undefined,
          associatedDois: undefined,
          boxes: undefined,
          cloudHosted: undefined,
          coordinateSystem: undefined,
          dataCenter: undefined,
          dataCenters: undefined,
          dataQualitySummaries: { items: [] },
          directDistributionInformation: {},
          doi: undefined,
          duplicateCollections: [],
          gibsLayers: 'None',
          granules: {
            items: [{
              id: 'granuleId2',
              onlineAccessFlag: true
            }]
          },
          hasAllMetadata: true,
          hasGranules: undefined,
          id: 'collectionId2',
          isCSDA: false,
          isOpenSearch: false,
          relatedCollections: undefined,
          relatedUrls: [],
          scienceKeywords: [],
          services: { items: [] },
          shortName: undefined,
          spatial: undefined,
          subscriptions: undefined,
          tags: undefined,
          temporal: ['Not available'],
          tilingIdentificationSystems: undefined,
          timeEnd: undefined,
          timeStart: undefined,
          title: undefined,
          tools: { items: [] },
          urls: {
            atom: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.atom&token=mockAuthToken',
              title: 'ATOM'
            },
            dif: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.dif&token=mockAuthToken',
              title: 'DIF'
            },
            echo10: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.echo10&token=mockAuthToken',
              title: 'ECHO10'
            },
            html: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.html&token=mockAuthToken',
              title: 'HTML'
            },
            iso19115: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.iso19115&token=mockAuthToken',
              title: 'ISO19115'
            },
            native: {
              href: 'http://localhost:3000/concepts/metadata?ee=prod&url=https%3A%2F%2Fcmr.earthdata.nasa.gov%2Fsearch%2Fconcepts%2FcollectionId2.native&token=mockAuthToken',
              title: 'Native'
            },
            osdd: {
              href: 'https://cmr.earthdata.nasa.gov/opensearch/granules/descriptor_document.xml?clientId=mock-client-id&shortName=undefined&versionId=undefined&dataCenter=collectionId2',
              title: 'OSDD'
            }
          },
          variables: undefined,
          versionId: undefined
        }])
      })
    })

    describe('when the user has a saved access config', () => {
      test('adds access methods with the saved access config', async () => {
        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        nock(/localhost/)
          .post(/saved_access_configs/)
          .reply(200, {
            collectionId1: {
              url: 'https://example.com/ops/egi/request',
              type: 'ECHO ORDERS',
              model: '<mockModel></mockModel>',
              rawModel: '<mockRawModel></mockRawModel>',
              maxItemsPerOrder: 2000,
              optionDefinition: {
                name: 'Delivery Option',
                conceptId: 'OO1000000-EDSC'
              },
              formDigest: 'da2a203dca5e777d2b2c2fc3553c3d2f'
            }
          })

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              collections: {
                items: [{
                  conceptId: 'collectionId1',
                  granules: {
                    items: [{
                      id: 'granuleId1',
                      onlineAccessFlag: true
                    }]
                  },
                  tools: {
                    items: [{
                      name: 'SOTO'
                    }]
                  },
                  services: {
                    count: 1,
                    items: [{
                      conceptId: 'S100000-EDSC',
                      type: 'ECHO ORDERS',
                      url: {
                        urlValue: 'https://example.com/ops/egi/request'
                      },
                      serviceOptions: {
                        interpolationTypes: [
                          'Bilinear Interpolation',
                          'Nearest Neighbor'
                        ],
                        subset: {
                          spatialSubset: {
                            boundingBox: {
                              allowMultipleValues: false
                            },
                            shapefile: [
                              {
                                format: 'ESRI'
                              },
                              {
                                format: 'KML'
                              },
                              {
                                format: 'GeoJSON'
                              }
                            ]
                          },
                          temporalSubset: {
                            allowMultipleValues: false
                          },
                          variableSubset: {
                            allowMultipleValues: true
                          }
                        }
                      },
                      supportedOutputProjections: null,
                      supportedReformattings: null,
                      maxItemsPerOrder: 2000,
                      orderOptions: {
                        count: 1,
                        items: [
                          {
                            conceptId: 'OO1000000-EDSC',
                            revisionId: '1',
                            name: 'Delivery Option',
                            form: '<form></form>'
                          }
                        ]
                      },
                      variables: {
                        count: 0,
                        items: []
                      }
                    }]
                  },
                  dataQualitySummaries: {
                    items: []
                  }
                }]
              }
            }
          }, {
            'jwt-token': 'token'
          })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = ['collectionId1']
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectCollections()

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState
        const { collections } = updatedProject
        const { byId } = collections
        const collection1 = byId.collectionId1

        expect(collection1.selectedAccessMethod).toEqual('echoOrders0')
        expect(collection1.accessMethods).toEqual({
          download: {
            isValid: true,
            type: 'download'
          },
          echoOrders0: {
            form: '<form></form>',
            formDigest: 'da2a203dca5e777d2b2c2fc3553c3d2f',
            maxItemsPerOrder: 2000,
            model: '<mockModel></mockModel>',
            optionDefinition: {
              conceptId: 'OO1000000-EDSC',
              name: 'Delivery Option',
              revisionId: '1'
            },
            rawModel: '<mockRawModel></mockRawModel>',
            type: 'ECHO ORDERS',
            url: 'https://example.com/ops/egi/request'
          }
        })
      })
    })

    describe('when requesting a collection with more variables than the maxCmrPageSize', () => {
      test('retrieves all variables associated to the collection and sets the metadata correctly', async () => {
        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        jest.spyOn(applicationConfig, 'getEarthdataConfig').mockImplementation(() => ({
          cmrHost: 'https://cmr.example.com',
          graphQlHost: 'https://graphql.example.com',
          opensearchRoot: 'https://cmr.example.com'
        }))

        jest.spyOn(applicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
          maxCmrPageSize: '1',
          defaultCmrSearchTags: [
            'edsc.*',
            'opensearch.granule.osdd'
          ]
        }))

        const varResults = [{
          variables: {
            items: [{ conceptId: 'V10000000000-EDSC' }],
            count: 3,
            cursor: 'mock-cursor-0'
          }
        },
        {
          variables: {
            items: [{ conceptId: 'V10000000001-EDSC' }],
            count: 3,
            cursor: 'mock-cursor-1'
          }
        },
        {
          variables: {
            items: [{ conceptId: 'V10000000002-EDSC' }],
            count: 3,
            cursor: null
          }
        }]

        nock(/localhost/)
          .post(/saved_access_configs/)
          .reply(200, {})

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              collections: {
                items: [{
                  conceptId: 'C10000000000-EDSC',
                  tools: {
                    items: [{
                      name: 'SOTO'
                    }]
                  },
                  variables: varResults[0].variables
                }]
              }
            }
          }, {
            'jwt-token': 'token'
          })

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              variables: varResults[1].variables
            }
          })

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              variables: varResults[2].variables
            }
          })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = ['C10000000000-EDSC']
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectCollections()

        expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(actions.updateCollectionMetadata).toHaveBeenCalledWith([
          expect.objectContaining({
            variables: {
              count: 3,
              items: [
                { conceptId: 'V10000000000-EDSC' },
                { conceptId: 'V10000000001-EDSC' },
                { conceptId: 'V10000000002-EDSC' }
              ]
            }
          })
        ])
      })
    })

    describe('when requesting a CSDA collection', () => {
      test('adds access methods and updates collection metadata', async () => {
        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        jest.spyOn(applicationConfig, 'getEarthdataConfig').mockImplementation(() => ({
          cmrHost: 'https://cmr.earthdata.nasa.gov',
          opensearchRoot: 'https://cmr.earthdata.nasa.gov/opensearch'
        }))

        nock(/localhost/)
          .post(/saved_access_configs/)
          .reply(200, {})

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              collections: {
                items: [{
                  conceptId: 'collectionId1',
                  granules: {
                    items: [{
                      id: 'granuleId1',
                      onlineAccessFlag: true
                    }]
                  },
                  dataCenters: [
                    {
                      shortName: 'NASA/CSDA'
                    }
                  ],
                  dataQualitySummaries:
                  {
                    items: []
                  },
                  tools: {
                    items: []
                  },
                  services: {
                    items: []
                  }
                }]
              }
            }
          }, {
            'jwt-token': 'token'
          })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = ['collectionId1']
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectCollections()

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState
        const { collections } = updatedProject
        const { byId } = collections
        const collection1 = byId.collectionId1

        expect(collection1.selectedAccessMethod).toEqual('download')
        expect(collection1.accessMethods).toEqual({
          download: {
            isValid: true,
            type: 'download'
          }
        })

        expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(actions.updateCollectionMetadata).toHaveBeenCalledWith([
          expect.objectContaining({
            isCSDA: true
          })
        ])
      })
    })

    describe('when no project collections exist', () => {
      test('does not fetch access methods or metadata', async () => {
        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = []
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState
        await project.getProjectCollections()

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState
        const { collections } = updatedProject
        const { byId } = collections

        expect(byId).toEqual({})

        expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the saved access configs request errors', () => {
      test('still loads the project collections', async () => {
        nock(/localhost/)
          .post(/saved_access_configs/)
          .reply(500, {
            message: 'Request failed with status code 500',
            name: 'AxiosError',
            code: 'ERR_BAD_REQUEST'
          })

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              collections: {
                items: [{
                  conceptId: 'collectionId1',
                  granules: {
                    items: [{
                      id: 'granuleId1',
                      onlineAccessFlag: true
                    }]
                  },
                  tools: {
                    items: [{
                      name: 'SOTO'
                    }]
                  },
                  services: {
                    items: []
                  },
                  dataQualitySummaries:
                  {
                    items: []
                  }
                }]
              }
            }
          }, {
            'jwt-token': 'token'
          })

        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = ['collectionId1']
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectCollections()

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState
        const { collections } = updatedProject
        const { byId } = collections
        const collection1 = byId.collectionId1

        expect(collection1.selectedAccessMethod).toEqual('download')
        expect(collection1.accessMethods).toEqual({
          download: {
            isValid: true,
            type: 'download'
          }
        })

        expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)

        expect(actions.handleError).toHaveBeenCalledTimes(1)
        expect(actions.handleError).toHaveBeenCalledWith({
          action: 'getProjectCollections',
          error: expect.any(Error),
          resource: 'saved access configurations'
        })
      })
    })

    describe('when the graphql request errors', () => {
      test('calls handleError', async () => {
        nock(/localhost/)
          .post(/saved_access_configs/)
          .reply(200, {})

        nock(/localhost/)
          .post(/graphql/)
          .reply(500, {
            message: 'Request failed with status code 500',
            name: 'AxiosError',
            code: 'ERR_BAD_REQUEST'
          })

        nock(/localhost/)
          .post(/error_logger/)
          .reply(200)

        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = ['collectionId1']
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectCollections()

        expect(actions.handleError).toHaveBeenCalledTimes(1)
        expect(actions.handleError).toHaveBeenCalledWith({
          action: 'getProjectCollections',
          error: expect.any(Error),
          resource: 'project collections'
        })
      })
    })

    describe('when data quality summaries are returned', () => {
      test('sets the data quality summaries for the collection', async () => {
        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: 'mockAuthToken',
            earthdataEnvironment: 'prod'
          })
        })

        nock(/localhost/)
          .post(/saved_access_configs/)
          .reply(200, {})

        nock(/localhost/)
          .post(/graphql/)
          .reply(200, {
            data: {
              collections: {
                items: [{
                  conceptId: 'collectionId1',
                  granules: {
                    items: [{
                      id: 'granuleId1',
                      onlineAccessFlag: true
                    }]
                  },
                  tools: {
                    items: []
                  },
                  services: {
                    items: []
                  },
                  dataQualitySummaries:
                  {
                    items: [{
                      conceptId: 'DQS1000000-EDSC',
                      title: 'Data Quality Summary 1'
                    }]
                  }
                }]
              }
            }
          }, {
            'jwt-token': 'token'
          })

        useEdscStore.setState((state) => {
          state.project.collections.allIds = ['collectionId1']
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectCollections()

        const updatedState = useEdscStore.getState()
        expect(updatedState.dataQualitySummaries.byCollectionId.collectionId1).toEqual([{
          conceptId: 'DQS1000000-EDSC',
          title: 'Data Quality Summary 1'
        }])
      })
    })
  })

  describe('getProjectGranules', () => {
    test('retrieves project granules for all collections', async () => {
      nock(/cmr/)
        .post(/granules/)
        .reply(200, {
          feed: {
            updated: '2019-03-27T20:21:14.705Z',
            id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collection1',
            title: 'ECHO granule metadata',
            entry: [{
              id: 'granule1'
            }]
          }
        }, {
          'cmr-hits': '1'
        })

      nock(/cmr/)
        .post(/granules/)
        .reply(200, {
          feed: {
            updated: '2019-03-27T20:21:14.705Z',
            id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collection2',
            title: 'ECHO granule metadata',
            entry: [{
              id: 'granule2'
            }]
          }
        }, {
          'cmr-hits': '1'
        })

      configureStore.mockReturnValue({
        dispatch: jest.fn(),
        getState: () => ({
          authToken: '',
          earthdataEnvironment: 'prod',
          metadata: {
            collections: {
              collection1: {
                mock: 'data'
              },
              collection2: {
                mock: 'data'
              }
            }
          },
          query: {
            collection: {
              temporal: {},
              spatial: {}
            }
          }
        })
      })

      useEdscStore.setState((state) => {
        state.project.collections.allIds.push('collection1')
        state.project.collections.byId.collection1 = {
          granules: initialGranuleState,
          isVisible: true
        }

        state.project.collections.allIds.push('collection2')
        state.project.collections.byId.collection2 = {
          granules: initialGranuleState,
          isVisible: true
        }
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState
      await project.getProjectGranules()

      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(2)
      expect(actions.toggleSpatialPolygonWarning).toHaveBeenNthCalledWith(1, false)
      expect(actions.toggleSpatialPolygonWarning).toHaveBeenNthCalledWith(2, false)

      expect(actions.addGranuleMetadata).toHaveBeenCalledTimes(2)
      expect(actions.addGranuleMetadata).toHaveBeenNthCalledWith(
        1,
        [{
          id: 'granule1',
          isOpenSearch: false,
          spatial: null,
          thumbnail: 'http://localhost:3000/scale/granules/granule1?h=85&w=85&ee=prod'
        }]
      )

      expect(actions.addGranuleMetadata).toHaveBeenNthCalledWith(
        2,
        [{
          id: 'granule2',
          isOpenSearch: false,
          spatial: null,
          thumbnail: 'http://localhost:3000/scale/granules/granule2?h=85&w=85&ee=prod'
        }]
      )

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      const { collection1 } = updatedProject.collections.byId
      const { collection2 } = updatedProject.collections.byId

      expect(collection1.granules.isLoading).toEqual(false)
      expect(collection1.granules.isLoaded).toEqual(true)
      expect(collection1.granules.isErrored).toEqual(false)

      expect(collection2.granules.isLoading).toEqual(false)
      expect(collection2.granules.isLoaded).toEqual(true)
      expect(collection2.granules.isErrored).toEqual(false)
    })

    describe('when the collection is open search', () => {
      test('retrieves project granules', async () => {
        nock(/localhost/)
          .post(/opensearch\/granules/)
          .reply(200, '<feed><opensearch:totalResults>1</opensearch:totalResults><entry><title>CWIC Granule</title></entry></feed>')

        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: '',
            earthdataEnvironment: 'prod',
            metadata: {
              collections: {
                collection1: {
                  links: [{
                    length: '0.0KB',
                    rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
                    hreflang: 'en-US',
                    href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-prod'
                  }]
                }
              }
            },
            query: {
              collection: {
                temporal: {},
                spatial: {}
              }
            }
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds.push('collection1')
          state.project.collections.byId.collection1 = {
            granules: initialGranuleState,
            isVisible: true
          }
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState
        await project.getProjectGranules()

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenNthCalledWith(1, false)

        expect(actions.addGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(actions.addGranuleMetadata).toHaveBeenNthCalledWith(
          1,
          [{
            browse_flag: false,
            collectionConceptId: 'collection1',
            isOpenSearch: true,
            spatial: null,
            title: 'CWIC Granule'
          }]
        )

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        const { collection1 } = updatedProject.collections.byId

        expect(collection1.granules.isLoading).toEqual(false)
        expect(collection1.granules.isLoaded).toEqual(true)
        expect(collection1.granules.isErrored).toEqual(false)
        expect(collection1.granules.isOpenSearch).toEqual(true)
      })

      test('replaces polygon spatial with an MBR', async () => {
        nock(/localhost/)
          .post(/opensearch\/granules/, JSON.stringify({
            params: {
              boundingBox: '-77,37.99999999999998,-76,38.00105844675541',
              conceptId: [],
              echoCollectionId: 'collection1',
              exclude: {},
              openSearchOsdd: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-prod',
              options: {},
              pageNum: 1,
              pageSize: 20,
              twoDCoordinateSystem: {}
            },
            requestId: 'mock-request-id'
          }))
          .reply(200, '<feed><opensearch:totalResults>1</opensearch:totalResults><entry><title>CWIC Granule</title></entry></feed>')

        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: '',
            earthdataEnvironment: 'prod',
            metadata: {
              collections: {
                collection1: {
                  links: [{
                    length: '0.0KB',
                    rel: 'http://esipfed.org/ns/fedsearch/1.1/search#',
                    hreflang: 'en-US',
                    href: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-prod'
                  }]
                }
              }
            },
            query: {
              collection: {
                temporal: {},
                spatial: {
                  polygon: ['-77,38,-77,38,-76,38,-77,38']
                }
              }
            }
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds.push('collection1')
          state.project.collections.byId.collection1 = {
            granules: initialGranuleState,
            isVisible: true
          }
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState
        await project.getProjectGranules()

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(2)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenNthCalledWith(1, false)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenNthCalledWith(2, true)

        expect(actions.addGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(actions.addGranuleMetadata).toHaveBeenCalledWith([{
          browse_flag: false,
          collectionConceptId: 'collection1',
          isOpenSearch: true,
          spatial: null,
          title: 'CWIC Granule'
        }])

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        const { collection1 } = updatedProject.collections.byId

        expect(collection1.granules.isLoading).toEqual(false)
        expect(collection1.granules.isLoaded).toEqual(true)
        expect(collection1.granules.isErrored).toEqual(false)
        expect(collection1.granules.isOpenSearch).toEqual(true)
      })
    })

    describe('when the request errors', () => {
      test('handles the error', async () => {
        nock(/cmr/)
          .post(/granules/)
          .reply(500, {
            errors: [{
              message: 'Internal Server Error'
            }]
          })

        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: '',
            earthdataEnvironment: 'prod',
            metadata: {
              collections: {
                collection1: {
                  mock: 'data'
                }
              }
            },
            query: {
              collection: {
                temporal: {},
                spatial: {}
              }
            }
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds.push('collection1')
          state.project.collections.byId.collection1 = {
            granules: initialGranuleState,
            isVisible: true
          }
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectGranules()

        expect(actions.handleError).toHaveBeenCalledTimes(1)
        expect(actions.handleError).toHaveBeenCalledWith({
          action: 'getProjectGranules',
          resource: 'granules',
          error: expect.any(Error),
          requestObject: expect.any(GranuleRequest)
        })

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.byId.collection1.granules.isErrored).toEqual(true)
      })
    })

    describe('when the user adds more granules than the maxCmrPageSize', () => {
      test('logs an alert', async () => {
        jest.spyOn(applicationConfig, 'getApplicationConfig').mockImplementation(() => ({
          maxCmrPageSize: '1',
          defaultCmrPageSize: '1',
          thumbnailSize: {
            height: 85,
            width: 85
          }
        }))

        nock(/localhost/)
          .post(/alert_logger/)
          .reply(200)

        nock(/cmr/)
          .post(/granules/)
          .reply(200, {
            feed: {
              updated: '2019-03-27T20:21:14.705Z',
              id: 'https://cmr.sit.earthdata.nasa.gov:443/search/granules.json?echo_collection_id=collection1',
              title: 'ECHO granule metadata',
              entry: [{
                id: 'granule1'
              }]
            }
          }, {
            'cmr-hits': '1'
          })

        configureStore.mockReturnValue({
          dispatch: jest.fn(),
          getState: () => ({
            authToken: '',
            earthdataEnvironment: 'prod',
            metadata: {
              collections: {
                collection1: {
                  mock: 'data'
                }
              }
            },
            query: {
              collection: {
                temporal: {},
                spatial: {}
              }
            }
          })
        })

        useEdscStore.setState((state) => {
          state.project.collections.allIds.push('collection1')
          state.project.collections.byId.collection1 = {
            granules: {
              ...initialGranuleState,
              addedGranuleIds: ['granule1', 'granule2']
            },
            isVisible: true
          }
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        await project.getProjectGranules()

        expect(actions.handleAlert).toHaveBeenCalledTimes(1)
        expect(actions.handleAlert).toHaveBeenCalledWith({
          action: 'getProjectGranules',
          message: 'User requested more than 1 granules. Requested 2 granules.',
          resource: 'granules',
          requestObject: expect.any(GranuleRequest)
        })

        expect(actions.addGranuleMetadata).toHaveBeenCalledTimes(1)
        expect(actions.addGranuleMetadata).toHaveBeenNthCalledWith(
          1,
          [{
            id: 'granule1',
            isOpenSearch: false,
            spatial: null,
            thumbnail: 'http://localhost:3000/scale/granules/granule1?h=85&w=85&ee=prod'
          }]
        )

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        const { collection1 } = updatedProject.collections.byId

        expect(collection1.granules.isLoading).toEqual(false)
        expect(collection1.granules.isLoaded).toEqual(true)
        expect(collection1.granules.isErrored).toEqual(false)
      })
    })
  })

  describe('removeGranuleFromProjectCollection', () => {
    describe('when the granule exists in the addedGranuleIds', () => {
      test('removes the granule from addedGranuleIds', () => {
        const collectionId = 'collectionId'
        const granuleId = 'granuleId'
        useEdscStore.setState((state) => {
          state.project.collections.allIds.push(collectionId)
          state.project.collections.byId[collectionId] = {
            granules: {
              ...initialGranuleState,
              addedGranuleIds: [granuleId, 'anotherId'],
              allIds: []
            },
            isVisible: true
          }

          state.project.updateProjectGranuleParams = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.removeGranuleFromProjectCollection({
          collectionId,
          granuleId
        })

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.byId[collectionId].granules.addedGranuleIds).toEqual(
          ['anotherId']
        )

        expect(updatedProject.collections.byId[collectionId].granules.removedGranuleIds).toEqual(
          []
        )

        expect(updatedProject.collections.byId[collectionId].granules.allIds).toEqual(
          []
        )

        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledTimes(1)
        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledWith({
          collectionId,
          pageNum: 1
        })
      })
    })

    describe('when the granule is the last granule in addedGranuleIds', () => {
      test('removes the collection', () => {
        const collectionId = 'collectionId'
        const granuleId = 'granuleId'
        useEdscStore.setState((state) => {
          state.project.collections.allIds.push(collectionId)
          state.project.collections.byId[collectionId] = {
            granules: {
              ...initialGranuleState,
              addedGranuleIds: [granuleId],
              allIds: []
            },
            isVisible: true
          }

          state.project.updateProjectGranuleParams = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.removeGranuleFromProjectCollection({
          collectionId,
          granuleId
        })

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.allIds).not.toContain(collectionId)
        expect(updatedProject.collections.byId[collectionId]).toBeUndefined()

        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the granule does not exist in addedGranuleIds or removedGranuleIds', () => {
      test('adds the granule to removedGranuleIds', () => {
        const collectionId = 'collectionId'
        const granuleId = 'granuleId'
        useEdscStore.setState((state) => {
          state.project.collections.allIds.push(collectionId)
          state.project.collections.byId[collectionId] = {
            granules: {
              ...initialGranuleState,
              addedGranuleIds: [],
              removedGranuleIds: [],
              allIds: []
            },
            isVisible: true
          }

          state.project.updateProjectGranuleParams = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.removeGranuleFromProjectCollection({
          collectionId,
          granuleId
        })

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.byId[collectionId].granules.addedGranuleIds).toEqual(
          []
        )

        expect(updatedProject.collections.byId[collectionId].granules.removedGranuleIds).toEqual(
          [granuleId]
        )

        expect(updatedProject.collections.byId[collectionId].granules.allIds).toEqual(
          []
        )

        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledTimes(1)
        expect(updatedProject.updateProjectGranuleParams).toHaveBeenCalledWith({
          collectionId,
          pageNum: 1
        })
      })
    })
  })

  describe('removeProjectCollection', () => {
    test('removes a collection from the project', () => {
      const collectionId = 'C123456789-EDSC'
      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        // eslint-disable-next-line no-param-reassign
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true
        }
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.removeProjectCollection(collectionId)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.collections.allIds).not.toContain(collectionId)
      expect(updatedProject.collections.byId[collectionId]).toBeUndefined()
    })

    test('does not remove a collection if it does not exist', () => {
      const collectionId = 'C123456789-EDSC'
      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.removeProjectCollection(collectionId)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.collections.allIds).toEqual([])
    })
  })

  describe('selectAccessMethod', () => {
    test('selects the access method for a collection', () => {
      const collectionId = 'collectionId'

      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true,
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            },
            echoOrders0: {
              form: '<form></form>',
              formDigest: 'da2a203dca5e777d2b2c2fc3553c3d2f',
              maxItemsPerOrder: 2000,
              model: '<mockModel></mockModel>',
              optionDefinition: {
                conceptId: 'OO1000000-EDSC',
                name: 'Delivery Option',
                revisionId: '1'
              },
              rawModel: '<mockRawModel></mockRawModel>',
              type: 'ECHO ORDERS',
              url: 'https://example.com/ops/egi/request',
              hasChanged: false,
              isValid: false
            }
          }
        }
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.selectAccessMethod({
        collectionId,
        selectedAccessMethod: 'echoOrders0'
      })

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState
      const updatedProjectCollection = updatedProject.collections.byId[collectionId]

      expect(updatedProjectCollection.selectedAccessMethod).toEqual('echoOrders0')
      expect(updatedProjectCollection.accessMethods).toEqual({
        download: {
          isValid: true,
          type: 'download'
        },
        echoOrders0: {
          form: '<form></form>',
          formDigest: 'da2a203dca5e777d2b2c2fc3553c3d2f',
          maxItemsPerOrder: 2000,
          model: '<mockModel></mockModel>',
          optionDefinition: {
            conceptId: 'OO1000000-EDSC',
            name: 'Delivery Option',
            revisionId: '1'
          },
          rawModel: '<mockRawModel></mockRawModel>',
          type: 'ECHO ORDERS',
          url: 'https://example.com/ops/egi/request',
          hasChanged: false,
          isValid: false
        }
      })
    })
  })

  describe('startProjectGranulesTimer', () => {
    test('starts the granules timer', () => {
      const collectionId = 'collectionId'
      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true
        }
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.startProjectGranulesTimer(collectionId)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState
      const updatedProjectCollection = updatedProject.collections.byId[collectionId]

      expect(updatedProjectCollection.granules.timerStart).toEqual(new Date().getTime())
      expect(updatedProjectCollection.granules.isErrored).toEqual(false)
      expect(updatedProjectCollection.granules.isLoaded).toEqual(false)
      expect(updatedProjectCollection.granules.isLoading).toEqual(true)
    })
  })

  describe('stopProjectGranulesTimer', () => {
    test('stops the granules timer', () => {
      const collectionId = 'collectionId'
      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        state.project.collections.byId[collectionId] = {
          granules: {
            ...initialGranuleState,
            timerStart: Date.now(),
            isLoading: true
          },
          isVisible: true
        }
      })

      // 1 minute later
      MockDate.set(new Date('2025-01-01T00:01:00Z'))

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.stopProjectGranulesTimer(collectionId)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState
      const updatedProjectCollection = updatedProject.collections.byId[collectionId]

      expect(updatedProjectCollection.granules.timerStart).toBeNull()
      expect(updatedProjectCollection.granules.loadTime).toEqual(60000)
      expect(updatedProjectCollection.granules.isErrored).toEqual(false)
      expect(updatedProjectCollection.granules.isLoaded).toEqual(true)
      expect(updatedProjectCollection.granules.isLoading).toEqual(false)
    })

    describe('when the collection does not exist', () => {
      test('does not update any granule state', () => {
        const collectionId = 'nonExistentCollection'
        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.stopProjectGranulesTimer(collectionId)

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.allIds).toEqual([])
        expect(updatedProject.collections.byId[collectionId]).toBeUndefined()
      })
    })
  })

  describe('submittingProject', () => {
    test('sets isSubmitting to true and isSubmitted to false', () => {
      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.submittingProject()

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.isSubmitted).toEqual(false)
      expect(updatedProject.isSubmitting).toEqual(true)
    })
  })

  describe('submittedProject', () => {
    test('sets isSubmitting to false and isSubmitted to true', () => {
      useEdscStore.setState((state) => {
        state.project.isSubmitting = true
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.submittedProject()

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.isSubmitted).toEqual(true)
      expect(updatedProject.isSubmitting).toEqual(false)
    })
  })

  describe('toggleProjectCollectionVisibility', () => {
    test('toggles the visibility of a collection', () => {
      const collectionId = 'collectionId'
      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true
        }
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.toggleCollectionVisibility(collectionId)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState
      const updatedProjectCollection = updatedProject.collections.byId[collectionId]

      expect(updatedProjectCollection.isVisible).toEqual(false)
    })
  })

  describe('updateAccessMethod', () => {
    test('updates the access method for a collection', () => {
      const collectionId = 'collectionId'
      const accessMethod = {
        type: 'ECHO ORDERS',
        form: '<form></form>',
        formDigest: 'da2a203dca5e777d2b2c2fc3553c3d2f',
        maxItemsPerOrder: 2000,
        model: '<mockModel></mockModel>',
        optionDefinition: {
          conceptId: 'OO1000000-EDSC',
          name: 'Delivery Option',
          revisionId: '1'
        },
        rawModel: '<mockRawModel></mockRawModel>',
        url: 'https://example.com/ops/egi/request',
        hasChanged: false,
        isValid: false
      }

      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true,
          accessMethods: {
            download: {
              isValid: true,
              type: 'download'
            },
            echoOrders0: accessMethod as EchoOrderAccessMethod
          }
        }
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.updateAccessMethod({
        collectionId,
        method: {
          echoOrders0: {
            type: 'ECHO ORDERS',
            model: '<mockModel>Updated</mockModel>'
          }
        }
      })

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState
      const updatedProjectCollection = updatedProject.collections.byId[collectionId]

      expect(updatedProjectCollection.accessMethods?.echoOrders0).toEqual({
        ...accessMethod,
        model: '<mockModel>Updated</mockModel>'
      })
    })
  })

  describe('updateProjectGranuleParams', () => {
    test('updates the granule params for a collection', () => {
      const collectionId = 'collectionId'
      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true
        }

        state.project.getProjectGranules = jest.fn()
      })

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.updateProjectGranuleParams({
        collectionId,
        pageNum: 2
      })

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.collections.byId[collectionId].granules.params).toEqual({
        pageNum: 2
      })

      expect(updatedProject.getProjectGranules).toHaveBeenCalledTimes(1)
      expect(updatedProject.getProjectGranules).toHaveBeenCalledWith()
    })

    describe('when the collection does not exist', () => {
      test('does not update any params', () => {
        const collectionId = 'collectionId'
        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.updateProjectGranuleParams({
          collectionId,
          pageNum: 2
        })

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.allIds).toEqual([])
        expect(updatedProject.collections.byId[collectionId]).toBeUndefined()
      })
    })
  })

  describe('updateProjectGranuleResults', () => {
    test('adds new granule results for a collection', () => {
      const collectionId = 'collectionId'
      useEdscStore.setState((state) => {
        state.project.collections.allIds.push(collectionId)
        state.project.collections.byId[collectionId] = {
          granules: initialGranuleState,
          isVisible: true
        }
      })

      const data = {
        collectionId,
        hits: 1,
        isOpenSearch: false,
        pageNum: 1,
        results: [{
          id: 'granuleId'
        }],
        singleGranuleSize: 42,
        totalSize: {
          size: '42',
          units: 'MB'
        }
      }

      const zustandState = useEdscStore.getState()
      const { project } = zustandState

      project.updateProjectGranuleResults(data)

      const updatedState = useEdscStore.getState()
      const { project: updatedProject } = updatedState

      expect(updatedProject.collections.byId[data.collectionId].granules).toEqual({
        ...initialGranuleState,
        allIds: ['granuleId'],
        byId: {
          granuleId: {
            id: 'granuleId'
          }
        },
        isOpenSearch: false,
        hits: 1,
        totalSize: {
          size: '42',
          units: 'MB'
        },
        singleGranuleSize: 42
      })
    })

    describe('when the collection already has granules', () => {
      test('updates existing granule results', () => {
        const collectionId = 'collectionId'
        useEdscStore.setState((state) => {
          state.project.collections.allIds.push(collectionId)
          state.project.collections.byId[collectionId] = {
            granules: {
              ...initialGranuleState,
              allIds: ['existingGranule'],
              byId: {
                existingGranule: { id: 'existingGranule' }
              }
            },
            isVisible: true
          }
        })

        const data = {
          collectionId,
          hits: 1,
          isOpenSearch: false,
          pageNum: 2,
          results: [{
            id: 'granuleId'
          }],
          singleGranuleSize: 42,
          totalSize: {
            size: '42',
            units: 'MB'
          }
        }

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.updateProjectGranuleResults(data)

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.byId[data.collectionId].granules).toEqual({
          ...initialGranuleState,
          allIds: ['existingGranule', 'granuleId'],
          byId: {
            existingGranule: { id: 'existingGranule' },
            granuleId: { id: 'granuleId' }
          },
          isOpenSearch: false,
          hits: 1,
          totalSize: {
            size: '42',
            units: 'MB'
          },
          singleGranuleSize: 42
        })
      })
    })

    describe('when the collection does not exist', () => {
      test('does not update any granule results', () => {
        const data = {
          collectionId: 'nonExistentCollection',
          hits: 1,
          isOpenSearch: false,
          pageNum: 1,
          results: [{
            id: 'granuleId'
          }],
          singleGranuleSize: 42,
          totalSize: {
            size: '42',
            units: 'MB'
          }
        }

        const zustandState = useEdscStore.getState()
        const { project } = zustandState

        project.updateProjectGranuleResults(data)

        const updatedState = useEdscStore.getState()
        const { project: updatedProject } = updatedState

        expect(updatedProject.collections.allIds).toEqual([])
        expect(updatedProject.collections.byId[data.collectionId]).toBeUndefined()
      })
    })
  })
})
