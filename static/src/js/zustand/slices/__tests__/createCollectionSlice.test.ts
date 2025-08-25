import nock from 'nock'

import useEdscStore from '../../useEdscStore'

// @ts-expect-error This file does not have types
import configureStore from '../../../store/configureStore'

// @ts-expect-error This file does not have types
import actions from '../../../actions'

// @ts-expect-error This file does not have types
import * as getClientId from '../../../../../../sharedUtils/getClientId'
// @ts-expect-error This file does not have types
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'

jest.mock('../../../actions', () => ({
  changeUrl: jest.fn(),
  collectionRelevancyMetrics: jest.fn(),
  getColorMap: jest.fn(),
  handleError: jest.fn(),
  toggleSpatialPolygonWarning: jest.fn()
}))

jest.mock('../../../store/configureStore', () => jest.fn())

const mockDispatch = jest.fn()
const mockGetState = jest.fn()
configureStore.mockReturnValue({
  dispatch: mockDispatch,
  getState: mockGetState
})

describe('createCollectionSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { collection } = zustandState

    expect(collection).toEqual({
      collectionId: null,
      collectionMetadata: {},
      getCollectionMetadata: expect.any(Function),
      setCollectionId: expect.any(Function),
      updateGranuleSubscriptions: expect.any(Function),
      viewCollectionDetails: expect.any(Function),
      viewCollectionGranules: expect.any(Function)
    })
  })

  describe('getCollectionMetadata', () => {
    beforeEach(() => {
      jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ client: 'eed-edsc-test-serverless-client' }))

      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))
    })

    describe('when metdata has already been retrieved from graphql', () => {
      test('should update the collection and call getGranules', async () => {
        useEdscStore.setState((state) => {
          state.collection.collectionId = 'C10000000000-EDSC'
          state.collection.collectionMetadata['C10000000000-EDSC'] = {
            conceptId: 'C10000000000-EDSC',
            hasAllMetadata: true
          }

          state.granules.getGranules = jest.fn()
        })

        mockGetState.mockReturnValue({
          authToken: '',
          router: {
            location: {}
          }
        })

        const { collection } = useEdscStore.getState()
        const { getCollectionMetadata } = collection

        await getCollectionMetadata()

        const {
          collection: updatedCollection,
          granules
        } = useEdscStore.getState()

        expect(updatedCollection.collectionMetadata).toEqual({
          'C10000000000-EDSC': {
            conceptId: 'C10000000000-EDSC',
            hasAllMetadata: true
          }
        })

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(1)
        expect(granules.getGranules).toHaveBeenCalledWith()

        expect(actions.getColorMap).toHaveBeenCalledTimes(0)
      })
    })

    describe('when there is no focused collection id', () => {
      test('redirects the user to /search', async () => {
        useEdscStore.setState((state) => {
          state.granules.getGranules = jest.fn()
        })

        mockGetState.mockReturnValue({
          authToken: '',
          router: {
            location: {
              search: '?zoom=4'
            }
          }
        })

        const { collection } = useEdscStore.getState()
        const { getCollectionMetadata } = collection

        await getCollectionMetadata()

        const {
          collection: updatedCollection,
          granules
        } = useEdscStore.getState()

        expect(updatedCollection.collectionMetadata).toEqual({})

        expect(actions.changeUrl).toHaveBeenCalledTimes(1)
        expect(actions.changeUrl).toHaveBeenCalledWith({
          pathname: '/search',
          search: '?zoom=4'
        })

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(0)
        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(0)
        expect(granules.getGranules).toHaveBeenCalledTimes(0)
        expect(actions.getColorMap).toHaveBeenCalledTimes(0)
      })
    })

    describe('when no metadata exists in the store for the collection from graphql', () => {
      describe('when graphql returns metadata for the requested collection', () => {
        test('should update the collection, fetch metadata from graphql and calls getGranules', async () => {
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

          useEdscStore.setState((state) => {
            state.collection.collectionId = 'C10000000000-EDSC'
            state.granules.getGranules = jest.fn()
          })

          mockGetState.mockReturnValue({
            authToken: '',
            router: {
              location: {}
            }
          })

          const { collection } = useEdscStore.getState()
          const { getCollectionMetadata } = collection

          await getCollectionMetadata()

          const {
            collection: updatedCollection,
            granules
          } = useEdscStore.getState()

          expect(updatedCollection.collectionMetadata).toEqual({
            'C10000000000-EDSC': {
              abstract: undefined,
              archiveAndDistributionInformation: undefined,
              associatedDois: undefined,
              boxes: undefined,
              cloudHosted: undefined,
              conceptId: 'C10000000000-EDSC',
              coordinateSystem: undefined,
              dataCenter: undefined,
              dataCenters: undefined,
              directDistributionInformation: {},
              doi: undefined,
              duplicateCollections: [],
              gibsLayers: 'None',
              granules: undefined,
              hasAllMetadata: true,
              hasGranules: undefined,
              id: 'C10000000000-EDSC',
              isCSDA: false,
              isOpenSearch: false,
              lines: undefined,
              nativeDataFormats: undefined,
              points: undefined,
              polygons: undefined,
              relatedCollections: undefined,
              relatedUrls: [],
              scienceKeywords: [],
              services: undefined,
              shortName: 'id_1',
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
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.atom',
                  title: 'ATOM'
                },
                dif: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.dif',
                  title: 'DIF'
                },
                echo10: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.echo10',
                  title: 'ECHO10'
                },
                html: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.html',
                  title: 'HTML'
                },
                iso19115: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.iso19115',
                  title: 'ISO19115'
                },
                native: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.native',
                  title: 'Native'
                },
                osdd: {
                  href: 'https://cmr.example.com/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=id_1&versionId=VersionID&dataCenter=EDSC',
                  title: 'OSDD'
                }
              },
              variables: undefined,
              versionId: 'VersionID'
            }
          })

          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

          expect(granules.getGranules).toHaveBeenCalledTimes(2)
          expect(granules.getGranules).toHaveBeenNthCalledWith(1)
          expect(granules.getGranules).toHaveBeenNthCalledWith(2)

          expect(actions.getColorMap).toHaveBeenCalledTimes(0)
        })

        describe('when the requested collection is opensearch and a polygon search is active and we try and retrieve an existing gibs tag', () => {
          test('should toggle the polygon warning, update the collection and call getGranules', async () => {
            nock(/graph/)
              .post(/api/)
              .reply(200, {
                data: {
                  collection: {
                    conceptId: 'C10000000000-EDSC',
                    consortiums: ['CEOS'],
                    shortName: 'id_1',
                    versionId: 'VersionID',
                    hasGranules: false,
                    tags: {
                      'org.ceos.wgiss.cwic.granules.prod': {}
                    },
                    tools: {
                      items: []
                    }
                  }
                }
              })

            useEdscStore.setState((state) => {
              state.collection.collectionId = 'C10000000000-EDSC'
              state.collection.collectionMetadata['C10000000000-EDSC'] = {
                conceptId: 'C10000000000-EDSC',
                isOpenSearch: true
              }

              state.granules.getGranules = jest.fn()
              state.query.collection.spatial = {
                polygon: ['-77,38,-77,38,-76,38,-77,38']
              }
            })

            mockGetState.mockReturnValue({
              authToken: '',
              router: {
                location: {}
              }
            })

            const { collection } = useEdscStore.getState()
            const { getCollectionMetadata } = collection

            await getCollectionMetadata()

            const {
              collection: updatedCollection,
              granules
            } = useEdscStore.getState()

            expect(updatedCollection.collectionMetadata).toEqual({
              'C10000000000-EDSC': {
                abstract: undefined,
                archiveAndDistributionInformation: undefined,
                associatedDois: undefined,
                boxes: undefined,
                cloudHosted: undefined,
                coordinateSystem: undefined,
                conceptId: 'C10000000000-EDSC',
                consortiums: ['CEOS'],
                dataCenter: undefined,
                dataCenters: undefined,
                directDistributionInformation: {},
                doi: undefined,
                duplicateCollections: [],
                gibsLayers: 'None',
                granules: undefined,
                hasAllMetadata: true,
                hasGranules: false,
                id: 'C10000000000-EDSC',
                isCSDA: false,
                isOpenSearch: false,
                lines: undefined,
                nativeDataFormats: undefined,
                points: undefined,
                polygons: undefined,
                relatedCollections: undefined,
                relatedUrls: [],
                scienceKeywords: [],
                services: undefined,
                shortName: 'id_1',
                spatial: undefined,
                subscriptions: undefined,
                tags: {
                  'org.ceos.wgiss.cwic.granules.prod': {}
                },
                temporal: ['Not available'],
                tilingIdentificationSystems: undefined,
                timeEnd: undefined,
                timeStart: undefined,
                title: undefined,
                tools: { items: [] },
                urls: {
                  atom: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.atom',
                    title: 'ATOM'
                  },
                  dif: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.dif',
                    title: 'DIF'
                  },
                  echo10: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.echo10',
                    title: 'ECHO10'
                  },
                  html: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.html',
                    title: 'HTML'
                  },
                  iso19115: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.iso19115',
                    title: 'ISO19115'
                  },
                  native: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.native',
                    title: 'Native'
                  },
                  osdd: {
                    href: 'https://cmr.example.com/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=id_1&versionId=VersionID&dataCenter=EDSC',
                    title: 'OSDD'
                  }
                },
                variables: undefined,
                versionId: 'VersionID'
              }
            })

            expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
            expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(true)

            expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
            expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

            expect(granules.getGranules).toHaveBeenCalledTimes(2)
            expect(granules.getGranules).toHaveBeenNthCalledWith(1)
            expect(granules.getGranules).toHaveBeenNthCalledWith(2)

            expect(actions.getColorMap).toHaveBeenCalledTimes(0)
          })
        })

        describe('when the requested collection is opensearch and a polygon search is active and we try and retrieve a non existant gibs tag', () => {
          test('Same test as above but no gibs tags, ensure it is not called', async () => {
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
                      items: []
                    }
                  }
                }
              })

            useEdscStore.setState((state) => {
              state.collection.collectionId = 'C10000000000-EDSC'
              state.collection.collectionMetadata['C10000000000-EDSC'] = {
                conceptId: 'C10000000000-EDSC',
                isOpenSearch: true
              }

              state.granules.getGranules = jest.fn()
              state.query.collection.spatial = {
                polygon: ['-77,38,-77,38,-76,38,-77,38']
              }
            })

            mockGetState.mockReturnValue({
              authToken: '',
              router: {
                location: {}
              }
            })

            const { collection } = useEdscStore.getState()
            const { getCollectionMetadata } = collection

            await getCollectionMetadata()

            const {
              collection: updatedCollection,
              granules
            } = useEdscStore.getState()

            expect(updatedCollection.collectionMetadata).toEqual({
              'C10000000000-EDSC': {
                abstract: undefined,
                archiveAndDistributionInformation: undefined,
                associatedDois: undefined,
                boxes: undefined,
                cloudHosted: undefined,
                conceptId: 'C10000000000-EDSC',
                coordinateSystem: undefined,
                dataCenter: undefined,
                dataCenters: undefined,
                directDistributionInformation: {},
                doi: undefined,
                duplicateCollections: [],
                gibsLayers: 'None',
                granules: undefined,
                hasAllMetadata: true,
                hasGranules: false,
                id: 'C10000000000-EDSC',
                isCSDA: false,
                isOpenSearch: false,
                lines: undefined,
                nativeDataFormats: undefined,
                points: undefined,
                polygons: undefined,
                relatedCollections: undefined,
                relatedUrls: [],
                scienceKeywords: [],
                services: undefined,
                shortName: 'id_1',
                spatial: undefined,
                subscriptions: undefined,
                tags: {
                  'org.ceos.wgiss.cwic.granules.prod': {}
                },
                temporal: ['Not available'],
                tilingIdentificationSystems: undefined,
                timeEnd: undefined,
                timeStart: undefined,
                title: undefined,
                tools: { items: [] },
                urls: {
                  atom: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.atom',
                    title: 'ATOM'
                  },
                  dif: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.dif',
                    title: 'DIF'
                  },
                  echo10: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.echo10',
                    title: 'ECHO10'
                  },
                  html: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.html',
                    title: 'HTML'
                  },
                  iso19115: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.iso19115',
                    title: 'ISO19115'
                  },
                  native: {
                    href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.native',
                    title: 'Native'
                  },
                  osdd: {
                    href: 'https://cmr.example.com/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=id_1&versionId=VersionID&dataCenter=EDSC',
                    title: 'OSDD'
                  }
                },
                variables: undefined,
                versionId: 'VersionID'
              }
            })

            expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
            expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(true)

            expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
            expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

            expect(granules.getGranules).toHaveBeenCalledTimes(2)
            expect(granules.getGranules).toHaveBeenNthCalledWith(1)
            expect(granules.getGranules).toHaveBeenNthCalledWith(2)

            expect(actions.getColorMap).toHaveBeenCalledTimes(0)
          })
        })
      })

      describe('when the requested collection and we try and retrieve an existing gibs tag', () => {
        test('Test that getColorMap works when a gibs tag is returned in the graphql call (call SET_COLOR_MAPS_LOADING and call ERRORED_COLOR_MAPS)', async () => {
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
                    'edsc.extra.serverless.gibs': {
                      data: [
                        { product: 'AIRS_Prata_SO2_Index_Day' }
                      ]
                    }
                  },
                  tools: {
                    items: []
                  }
                }
              }
            })

          nock(/localhost/)
            .get(/colormaps\/AIRS_Prata_SO2_Index_Day/)
            .reply(200, {
              scale: {}
            })

          useEdscStore.setState((state) => {
            state.collection.collectionId = 'C10000000000-EDSC'
            state.granules.getGranules = jest.fn()
          })

          mockGetState.mockReturnValue({
            authToken: '',
            router: {
              location: {}
            }
          })

          const { collection } = useEdscStore.getState()
          const { getCollectionMetadata } = collection

          await getCollectionMetadata()

          const {
            collection: updatedCollection,
            granules
          } = useEdscStore.getState()

          expect(updatedCollection.collectionMetadata).toEqual({
            'C10000000000-EDSC': {
              abstract: undefined,
              archiveAndDistributionInformation: undefined,
              associatedDois: undefined,
              boxes: undefined,
              cloudHosted: undefined,
              conceptId: 'C10000000000-EDSC',
              coordinateSystem: undefined,
              dataCenter: undefined,
              dataCenters: undefined,
              directDistributionInformation: {},
              doi: undefined,
              duplicateCollections: [],
              gibsLayers: 'None',
              granules: undefined,
              hasAllMetadata: true,
              hasGranules: false,
              id: 'C10000000000-EDSC',
              isCSDA: false,
              isOpenSearch: false,
              lines: undefined,
              nativeDataFormats: undefined,
              points: undefined,
              polygons: undefined,
              relatedCollections: undefined,
              relatedUrls: [],
              scienceKeywords: [],
              services: undefined,
              shortName: 'id_1',
              spatial: undefined,
              subscriptions: undefined,
              tags: {
                'edsc.extra.serverless.gibs': {
                  data: [
                    { product: 'AIRS_Prata_SO2_Index_Day' }
                  ]
                }
              },
              temporal: ['Not available'],
              tilingIdentificationSystems: undefined,
              timeEnd: undefined,
              timeStart: undefined,
              title: undefined,
              tools: { items: [] },
              urls: {
                atom: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.atom',
                  title: 'ATOM'
                },
                dif: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.dif',
                  title: 'DIF'
                },
                echo10: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.echo10',
                  title: 'ECHO10'
                },
                html: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.html',
                  title: 'HTML'
                },
                iso19115: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.iso19115',
                  title: 'ISO19115'
                },
                native: {
                  href: 'https://cmr.example.com/search/concepts/C10000000000-EDSC.native',
                  title: 'Native'
                },
                osdd: {
                  href: 'https://cmr.example.com/granules/descriptor_document.xml?clientId=eed-edsc-test-serverless-client&shortName=id_1&versionId=VersionID&dataCenter=EDSC',
                  title: 'OSDD'
                }
              },
              variables: undefined,
              versionId: 'VersionID'
            }
          })

          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

          expect(granules.getGranules).toHaveBeenCalledTimes(2)
          expect(granules.getGranules).toHaveBeenNthCalledWith(1)
          expect(granules.getGranules).toHaveBeenNthCalledWith(2)

          expect(actions.getColorMap).toHaveBeenCalledTimes(1)
          expect(actions.getColorMap).toHaveBeenCalledWith({
            product: 'AIRS_Prata_SO2_Index_Day'
          })
        })
      })

      describe('when graphql returns no metadata for the requested collection', () => {
        test('should clear the collection', async () => {
          nock(/graph/)
            .post(/api/)
            .reply(200, {
              data: {
                collection: null
              }
            })

          useEdscStore.setState((state) => {
            state.collection.collectionId = 'C10000000000-EDSC'
            state.collection.setCollectionId = jest.fn()
            state.granules.getGranules = jest.fn()
          })

          mockGetState.mockReturnValue({
            authToken: '',
            router: {
              location: {
                search: '?some=testparams',
                pathname: '/search/granules'
              }
            }
          })

          const { collection } = useEdscStore.getState()
          const { getCollectionMetadata } = collection

          await getCollectionMetadata()

          const {
            collection: updatedCollection,
            granules
          } = useEdscStore.getState()

          expect(updatedCollection.collectionId).toEqual(null)

          expect(actions.changeUrl).toHaveBeenCalledTimes(1)
          expect(actions.changeUrl).toHaveBeenCalledWith({
            pathname: '/search',
            search: '?some=testparams'
          })

          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

          expect(granules.getGranules).toHaveBeenCalledTimes(1)
          expect(granules.getGranules).toHaveBeenCalledWith()

          expect(actions.handleError).toHaveBeenCalledTimes(0)
          expect(actions.getColorMap).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when requesting a CSDA collection', () => {
      test('sets the metadata correctly', async () => {
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
                  items: []
                }
              }
            }
          })

        useEdscStore.setState((state) => {
          state.collection.collectionId = 'C10000000000-EDSC'
          state.granules.getGranules = jest.fn()
        })

        mockGetState.mockReturnValue({
          authToken: '',
          router: {
            location: {}
          }
        })

        const { collection } = useEdscStore.getState()
        const { getCollectionMetadata } = collection

        await getCollectionMetadata()

        const {
          collection: updatedCollection,
          granules
        } = useEdscStore.getState()

        expect(updatedCollection.collectionMetadata).toEqual({
          'C10000000000-EDSC': expect.objectContaining({
            isCSDA: true
          })
        })

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(2)
        expect(granules.getGranules).toHaveBeenNthCalledWith(1)
        expect(granules.getGranules).toHaveBeenNthCalledWith(2)

        expect(actions.getColorMap).toHaveBeenCalledTimes(0)
      })
    })

    describe('when requesting a collection with more variables than the maxCmrPageSize', () => {
      test('retrieves all variables associated to the collection and sets the metadata correctly', async () => {
        jest.spyOn(getEarthdataConfig, 'getApplicationConfig').mockImplementation(() => ({
          maxCmrPageSize: 1,
          env: 'prod',
          defaultCmrSearchTags: [
            'edsc.*',
            'opensearch.granule.osdd'
          ],
          clientId: {
            background: 'eed-PORTAL-ENV-serverless-background',
            client: 'eed-PORTAL-ENV-serverless-client',
            lambda: 'eed-PORTAL-ENV-serverless-lambda'
          }
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
                },
                variables: varResults[0].variables
              }
            }
          })

        nock(/graph/)
          .post(/api/)
          .reply(200, {
            data: {
              variables: varResults[1].variables
            }
          })

        nock(/graph/)
          .post(/api/)
          .reply(200, {
            data: {
              variables: varResults[2].variables
            }
          })

        useEdscStore.setState((state) => {
          state.collection.collectionId = 'C10000000000-EDSC'
          state.granules.getGranules = jest.fn()
        })

        mockGetState.mockReturnValue({
          authToken: '',
          router: {
            location: {}
          }
        })

        const expectedItems = [
          { conceptId: 'V10000000000-EDSC' },
          { conceptId: 'V10000000001-EDSC' },
          { conceptId: 'V10000000002-EDSC' }
        ]

        const { collection } = useEdscStore.getState()
        const { getCollectionMetadata } = collection

        await getCollectionMetadata()

        const {
          collection: updatedCollection,
          granules
        } = useEdscStore.getState()

        expect(updatedCollection.collectionMetadata).toEqual({
          'C10000000000-EDSC': expect.objectContaining({
            variables: {
              count: 3,
              items: expectedItems
            }
          })
        })

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

        expect(granules.getGranules).toHaveBeenCalledTimes(2)
        expect(granules.getGranules).toHaveBeenNthCalledWith(1)
        expect(granules.getGranules).toHaveBeenNthCalledWith(2)

        expect(actions.getColorMap).toHaveBeenCalledTimes(0)
      })
    })

    test('does not call updateCollection when graphql throws an http error', async () => {
      nock(/graph/)
        .post(/api/)
        .reply(500)

      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      mockGetState.mockReturnValue({
        authToken: '',
        router: {
          location: {}
        }
      })

      useEdscStore.setState((state) => {
        state.collection.collectionId = 'C10000000000-EDSC'
        state.granules.getGranules = jest.fn()
      })

      const { collection } = useEdscStore.getState()
      const { getCollectionMetadata } = collection

      await getCollectionMetadata()

      const {
        collection: updatedCollection,
        granules
      } = useEdscStore.getState()

      expect(updatedCollection.collectionMetadata).toEqual({})

      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

      expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
      expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

      expect(actions.handleError).toHaveBeenCalledTimes(1)
      expect(actions.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'getCollectionMetadata',
          error: expect.any(Error),
          resource: 'collection'
        })
      )

      expect(granules.getGranules).toHaveBeenCalledTimes(1)
      expect(granules.getGranules).toHaveBeenCalledWith()

      expect(actions.getColorMap).toHaveBeenCalledTimes(0)
    })
  })

  describe('setCollectionId', () => {
    describe('when a collection id is provided', () => {
      test('updates the collection and calls getCollectionMetadata', async () => {
        useEdscStore.setState((state) => {
          state.collection.getCollectionMetadata = jest.fn()
          state.query.initializeGranuleQuery = jest.fn()
          state.timeline.getTimeline = jest.fn()
        })

        mockGetState.mockReturnValue({
          router: {
            location: {
              pathname: '/search/granules',
              search: '?keyword=modis'
            }
          }
        })

        const zustandState = useEdscStore.getState()
        const {
          collection,
          timeline,
          query
        } = zustandState
        const {
          setCollectionId,
          getCollectionMetadata
        } = collection

        const collectionId = 'C1000000000-EDSC'

        await setCollectionId(collectionId)

        const { collection: updatedCollection } = useEdscStore.getState()
        expect(updatedCollection.collectionId).toEqual(collectionId)

        expect(query.initializeGranuleQuery).toHaveBeenCalledTimes(1)
        expect(query.initializeGranuleQuery).toHaveBeenCalledWith({
          collectionId: 'C1000000000-EDSC',
          query: {}
        })

        expect(getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(getCollectionMetadata).toHaveBeenCalledWith()

        expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
        expect(timeline.getTimeline).toHaveBeenCalledWith()
      })
    })

    describe('when a collection id is not provided', () => {
      test('should clear the collection and call changeUrl', async () => {
        useEdscStore.setState((state) => {
          state.collection.getCollectionMetadata = jest.fn()
          state.granule.setGranuleId = jest.fn()
          state.query.changeGranuleQuery = jest.fn()
          state.timeline.getTimeline = jest.fn()
        })

        mockGetState.mockReturnValue({
          router: {
            location: {
              pathname: '/search/granules',
              search: '?keyword=modis'
            }
          }
        })

        const zustandState = useEdscStore.getState()
        const {
          collection,
          timeline,
          query
        } = zustandState
        const {
          setCollectionId,
          getCollectionMetadata
        } = collection

        await setCollectionId(null)

        const {
          collection: updatedCollection,
          granule
        } = useEdscStore.getState()
        expect(updatedCollection.collectionId).toEqual(null)

        expect(granule.setGranuleId).toHaveBeenCalledTimes(1)
        expect(granule.setGranuleId).toHaveBeenCalledWith(null)

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

        expect(actions.changeUrl).toHaveBeenCalledTimes(1)
        expect(actions.changeUrl).toHaveBeenCalledWith({
          pathname: '/search',
          search: '?keyword=modis'
        })

        expect(getCollectionMetadata).toHaveBeenCalledTimes(0)
        expect(query.changeGranuleQuery).toHaveBeenCalledTimes(0)
        expect(timeline.getTimeline).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the granule sort preference is not the default', () => {
      test('updates the collection and calls getCollectionMetadata', async () => {
        useEdscStore.setState((state) => {
          state.collection.getCollectionMetadata = jest.fn()
          state.preferences.preferences.granuleSort = '-start_date'
          state.query.initializeGranuleQuery = jest.fn()
          state.timeline.getTimeline = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const {
          collection,
          timeline,
          query
        } = zustandState
        const {
          setCollectionId,
          getCollectionMetadata
        } = collection

        const collectionId = 'C1000000000-EDSC'

        await setCollectionId(collectionId)

        const { collection: updatedCollection } = useEdscStore.getState()
        expect(updatedCollection.collectionId).toEqual(collectionId)

        expect(query.initializeGranuleQuery).toHaveBeenCalledTimes(1)
        expect(query.initializeGranuleQuery).toHaveBeenCalledWith({
          collectionId: 'C1000000000-EDSC',
          query: {
            sortKey: '-start_date'
          }
        })

        expect(getCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(getCollectionMetadata).toHaveBeenCalledWith()

        expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
        expect(timeline.getTimeline).toHaveBeenCalledWith()
      })
    })

    describe('when clearing the collectionId on the project page', () => {
      test('updates the collectionId and does not redirect or call getCollectionMetadata', async () => {
        useEdscStore.setState((state) => {
          state.collection.getCollectionMetadata = jest.fn()
          state.granule.setGranuleId = jest.fn()
          state.query.changeGranuleQuery = jest.fn()
          state.timeline.getTimeline = jest.fn()
        })

        mockGetState.mockReturnValue({
          router: {
            location: {
              pathname: '/project',
              search: '?p=collectionId!collectionId'
            }
          }
        })

        const zustandState = useEdscStore.getState()
        const {
          collection,
          timeline,
          query
        } = zustandState
        const {
          setCollectionId,
          getCollectionMetadata
        } = collection

        await setCollectionId(null)

        const {
          collection: updatedCollection,
          granule
        } = useEdscStore.getState()

        expect(updatedCollection.collectionId).toEqual(null)

        expect(granule.setGranuleId).toHaveBeenCalledTimes(0)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(0)
        expect(actions.changeUrl).toHaveBeenCalledTimes(0)
        expect(getCollectionMetadata).toHaveBeenCalledTimes(0)
        expect(query.changeGranuleQuery).toHaveBeenCalledTimes(0)
        expect(timeline.getTimeline).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('updateGranuleSubscriptions', () => {
    test('updates the granule subscriptions', async () => {
      useEdscStore.setState((state) => {
        state.collection.collectionMetadata.collectionId = {
          conceptId: 'collectionId',
          subscriptions: {
            count: 1,
            items: [{
              conceptId: 'subscriptionId',
              nativeId: 'nativeId',
              name: 'Test Subscription',
              type: 'granule',
              query: 'point[]=0,0'
            }]
          }
        }
      })

      const zustandState = useEdscStore.getState()
      const { collection } = zustandState
      const { updateGranuleSubscriptions } = collection

      updateGranuleSubscriptions('collectionId', {
        count: 1,
        items: [{
          conceptId: 'subscriptionId',
          nativeId: 'nativeId',
          name: 'New Subscription',
          type: 'granule',
          query: 'point[]=0,0'
        }]
      })

      const { collection: updatedCollection } = useEdscStore.getState()

      expect(updatedCollection.collectionMetadata.collectionId.subscriptions).toEqual({
        count: 1,
        items: [{
          conceptId: 'subscriptionId',
          nativeId: 'nativeId',
          name: 'New Subscription',
          type: 'granule',
          query: 'point[]=0,0'
        }]
      })
    })
  })

  describe('viewCollectionDetails', () => {
    test('calls setCollectionId and changeUrl', async () => {
      useEdscStore.setState((state) => {
        state.collection.setCollectionId = jest.fn()
      })

      mockGetState.mockReturnValue({
        router: {
          location: {
            search: '?keyword=modis'
          }
        }
      })

      const zustandState = useEdscStore.getState()
      const { collection } = zustandState
      const { setCollectionId, viewCollectionDetails } = collection

      await viewCollectionDetails('collection-1')

      expect(setCollectionId).toHaveBeenCalledTimes(1)
      expect(setCollectionId).toHaveBeenCalledWith('collection-1')

      expect(actions.changeUrl).toHaveBeenCalledTimes(1)
      expect(actions.changeUrl).toHaveBeenCalledWith({
        pathname: '/search/granules/collection-details',
        search: '?keyword=modis'
      })
    })
  })

  describe('viewCollectionGranules', () => {
    test('calls setCollectionId and changeUrl', async () => {
      useEdscStore.setState((state) => {
        state.collection.setCollectionId = jest.fn()
      })

      mockGetState.mockReturnValue({
        router: {
          location: {
            search: '?keyword=modis'
          }
        }
      })

      const zustandState = useEdscStore.getState()
      const { collection } = zustandState
      const { setCollectionId, viewCollectionGranules } = collection

      await viewCollectionGranules('collection-1')

      expect(setCollectionId).toHaveBeenCalledTimes(1)
      expect(setCollectionId).toHaveBeenCalledWith('collection-1')

      expect(actions.changeUrl).toHaveBeenCalledTimes(1)
      expect(actions.changeUrl).toHaveBeenCalledWith({
        pathname: '/search/granules',
        search: '?keyword=modis'
      })
    })
  })
})
