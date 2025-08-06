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
  changeFocusedGranule: jest.fn(),
  changeUrl: jest.fn(),
  collectionRelevancyMetrics: jest.fn(),
  getColorMap: jest.fn(),
  getSearchGranules: jest.fn(),
  handleError: jest.fn(),
  initializeCollectionGranulesResults: jest.fn(),
  toggleSpatialPolygonWarning: jest.fn(),
  updateCollectionMetadata: jest.fn()
}))

jest.mock('../../../store/configureStore', () => jest.fn())

const mockDispatch = jest.fn()
const mockGetState = jest.fn()
configureStore.mockReturnValue({
  dispatch: mockDispatch,
  getState: mockGetState
})

describe('createFocusedCollectionSlice', () => {
  test('sets the default state', () => {
    const zustandState = useEdscStore.getState()
    const { focusedCollection } = zustandState

    expect(focusedCollection).toEqual({
      focusedCollection: null,
      changeFocusedCollection: expect.any(Function),
      getFocusedCollection: expect.any(Function),
      setFocusedCollection: expect.any(Function),
      viewCollectionDetails: expect.any(Function),
      viewCollectionGranules: expect.any(Function)
    })
  })

  describe('changeFocusedCollection', () => {
    describe('when a collection id is provided', () => {
      test('updates the focusedCollection and calls getFocusedCollection', async () => {
        useEdscStore.setState((state) => {
          state.focusedCollection.getFocusedCollection = jest.fn()
          state.query.initializeGranuleQuery = jest.fn()
          state.timeline.getTimeline = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const {
          focusedCollection,
          timeline,
          query
        } = zustandState
        const {
          changeFocusedCollection,
          getFocusedCollection
        } = focusedCollection

        const collectionId = 'C1000000000-EDSC'

        await changeFocusedCollection(collectionId)

        const { focusedCollection: updatedFocusedCollection } = useEdscStore.getState()
        expect(updatedFocusedCollection.focusedCollection).toEqual(collectionId)

        expect(query.initializeGranuleQuery).toHaveBeenCalledTimes(1)
        expect(query.initializeGranuleQuery).toHaveBeenCalledWith({
          collectionId: 'C1000000000-EDSC',
          query: {}
        })

        expect(actions.initializeCollectionGranulesResults).toHaveBeenCalledTimes(1)
        expect(actions.initializeCollectionGranulesResults).toHaveBeenCalledWith(collectionId)

        expect(getFocusedCollection).toHaveBeenCalledTimes(1)
        expect(getFocusedCollection).toHaveBeenCalledWith()

        expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
        expect(timeline.getTimeline).toHaveBeenCalledWith()
      })
    })

    describe('when a collection id is not provided', () => {
      test('should clear the focusedCollection and call changeUrl', async () => {
        useEdscStore.setState((state) => {
          state.focusedCollection.getFocusedCollection = jest.fn()
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
          focusedCollection,
          timeline,
          query
        } = zustandState
        const {
          changeFocusedCollection,
          getFocusedCollection
        } = focusedCollection

        await changeFocusedCollection('')

        const { focusedCollection: updatedFocusedCollection } = useEdscStore.getState()
        expect(updatedFocusedCollection.focusedCollection).toEqual('')

        expect(actions.changeFocusedGranule).toHaveBeenCalledTimes(1)
        expect(actions.changeFocusedGranule).toHaveBeenCalledWith('')

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

        expect(actions.changeUrl).toHaveBeenCalledTimes(1)
        expect(actions.changeUrl).toHaveBeenCalledWith({
          pathname: '/search',
          search: '?keyword=modis'
        })

        expect(getFocusedCollection).toHaveBeenCalledTimes(0)
        expect(query.changeGranuleQuery).toHaveBeenCalledTimes(0)
        expect(timeline.getTimeline).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the granule sort preference is not the default', () => {
      test('updates the focusedCollection and calls getFocusedCollection', async () => {
        useEdscStore.setState((state) => {
          state.focusedCollection.getFocusedCollection = jest.fn()
          state.preferences.preferences.granuleSort = '-start_date'
          state.query.initializeGranuleQuery = jest.fn()
          state.timeline.getTimeline = jest.fn()
        })

        const zustandState = useEdscStore.getState()
        const {
          focusedCollection,
          timeline,
          query
        } = zustandState
        const {
          changeFocusedCollection,
          getFocusedCollection
        } = focusedCollection

        const collectionId = 'C1000000000-EDSC'

        await changeFocusedCollection(collectionId)

        const { focusedCollection: updatedFocusedCollection } = useEdscStore.getState()
        expect(updatedFocusedCollection.focusedCollection).toEqual(collectionId)

        expect(query.initializeGranuleQuery).toHaveBeenCalledTimes(1)
        expect(query.initializeGranuleQuery).toHaveBeenCalledWith({
          collectionId: 'C1000000000-EDSC',
          query: {
            sortKey: '-start_date'
          }
        })

        expect(actions.initializeCollectionGranulesResults).toHaveBeenCalledTimes(1)
        expect(actions.initializeCollectionGranulesResults).toHaveBeenCalledWith(collectionId)

        expect(getFocusedCollection).toHaveBeenCalledTimes(1)
        expect(getFocusedCollection).toHaveBeenCalledWith()

        expect(timeline.getTimeline).toHaveBeenCalledTimes(1)
        expect(timeline.getTimeline).toHaveBeenCalledWith()
      })
    })
  })

  // TODO Wednesday update these tests to work with zustand,
  // then update app to use focusedCollection functions
  describe('getFocusedCollection', () => {
    beforeEach(() => {
      jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({ client: 'eed-edsc-test-serverless-client' }))

      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
        cmrHost: 'https://cmr.example.com',
        graphQlHost: 'https://graphql.example.com',
        opensearchRoot: 'https://cmr.example.com'
      }))
    })

    describe('when metdata has already been retrieved from graphql', () => {
      test('should update the focusedCollection and call getSearchGranules', async () => {
        useEdscStore.setState((state) => {
          state.focusedCollection.focusedCollection = 'C10000000000-EDSC'
        })

        mockGetState.mockReturnValue({
          authToken: '',
          metadata: {
            collections: {
              'C10000000000-EDSC': {
                hasAllMetadata: true
              }
            }
          },
          searchResults: {}
        })

        const { focusedCollection } = useEdscStore.getState()
        const { getFocusedCollection } = focusedCollection

        await getFocusedCollection()

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

        expect(actions.getSearchGranules).toHaveBeenCalledTimes(1)
        expect(actions.getSearchGranules).toHaveBeenCalledWith()

        expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(0)
        expect(actions.getColorMap).toHaveBeenCalledTimes(0)
      })
    })

    describe('when no metadata exists in the store for the collection from graphql', () => {
      describe('when graphql returns metadata for the requested collection', () => {
        test('should update the focusedCollection, fetch metadata from graphql and calls getSearchGranules', async () => {
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
          // eslint-disable-next-line no-param-reassign
            state.focusedCollection.focusedCollection = 'C10000000000-EDSC'
          })

          mockGetState.mockReturnValue({
            authToken: '',
            metadata: {
              collections: {}
            },
            searchResults: {}
          })

          const { focusedCollection } = useEdscStore.getState()
          const { getFocusedCollection } = focusedCollection

          await getFocusedCollection()

          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

          expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)
          expect(actions.updateCollectionMetadata).toHaveBeenCalledWith([{
            abstract: undefined,
            archiveAndDistributionInformation: undefined,
            associatedDois: undefined,
            boxes: undefined,
            cloudHosted: undefined,
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
          }])

          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

          expect(actions.getSearchGranules).toHaveBeenCalledTimes(1)
          expect(actions.getSearchGranules).toHaveBeenCalledWith()

          expect(actions.getColorMap).toHaveBeenCalledTimes(0)
        })

        describe('when the requested collection is cwic and a polygon search is active and we try and retrieve an existing gibs tag', () => {
          test('should toggle the polygon warning, update the focusedCollection and call getSearchGranules', async () => {
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
              state.focusedCollection.focusedCollection = 'C10000000000-EDSC'
              state.query.collection.spatial = {
                polygon: ['-77,38,-77,38,-76,38,-77,38']
              }
            })

            mockGetState.mockReturnValue({
              authToken: '',
              metadata: {
                collections: {
                  'C10000000000-EDSC': {
                    isOpenSearch: true
                  }
                }
              },
              searchResults: {}
            })

            const { focusedCollection } = useEdscStore.getState()
            const { getFocusedCollection } = focusedCollection

            await getFocusedCollection()

            expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
            expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(true)

            expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)
            expect(actions.updateCollectionMetadata).toHaveBeenCalledWith([{
              abstract: undefined,
              archiveAndDistributionInformation: undefined,
              associatedDois: undefined,
              boxes: undefined,
              cloudHosted: undefined,
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
            }])

            expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
            expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

            expect(actions.getSearchGranules).toHaveBeenCalledTimes(1)
            expect(actions.getSearchGranules).toHaveBeenCalledWith()

            expect(actions.getColorMap).toHaveBeenCalledTimes(0)
          })
        })

        describe('when the requested collection is cwic and a polygon search is active and we try and retrieve a non existant gibs tag', () => {
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
              state.focusedCollection.focusedCollection = 'C10000000000-EDSC'
              state.query.collection.spatial = {
                polygon: ['-77,38,-77,38,-76,38,-77,38']
              }
            })

            mockGetState.mockReturnValue({
              authToken: '',
              metadata: {
                collections: {
                  'C10000000000-EDSC': {
                    isOpenSearch: true
                  }
                }
              },
              searchResults: {}
            })

            const { focusedCollection } = useEdscStore.getState()
            const { getFocusedCollection } = focusedCollection

            await getFocusedCollection()

            expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
            expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(true)

            expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)
            expect(actions.updateCollectionMetadata).toHaveBeenCalledWith([{
              abstract: undefined,
              archiveAndDistributionInformation: undefined,
              associatedDois: undefined,
              boxes: undefined,
              cloudHosted: undefined,
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
            }])

            expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
            expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

            expect(actions.getSearchGranules).toHaveBeenCalledTimes(1)
            expect(actions.getSearchGranules).toHaveBeenCalledWith()

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
            state.focusedCollection.focusedCollection = 'C10000000000-EDSC'
            state.query.collection.spatial = {
              polygon: ['-77,38,-77,38,-76,38,-77,38']
            }
          })

          mockGetState.mockReturnValue({
            authToken: '',
            metadata: {
              collections: {
                'C10000000000-EDSC': {
                  isOpenSearch: true
                }
              }
            },
            searchResults: {}
          })

          const { focusedCollection } = useEdscStore.getState()
          const { getFocusedCollection } = focusedCollection

          await getFocusedCollection()

          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(true)

          expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)
          expect(actions.updateCollectionMetadata).toHaveBeenCalledWith([{
            abstract: undefined,
            archiveAndDistributionInformation: undefined,
            associatedDois: undefined,
            boxes: undefined,
            cloudHosted: undefined,
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
          }])

          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

          expect(actions.getSearchGranules).toHaveBeenCalledTimes(1)
          expect(actions.getSearchGranules).toHaveBeenCalledWith()

          expect(actions.getColorMap).toHaveBeenCalledTimes(1)
          expect(actions.getColorMap).toHaveBeenCalledWith({
            product: 'AIRS_Prata_SO2_Index_Day'
          })
        })
      })

      describe('when graphql returns no metadata for the requested collection', () => {
        test('should clear the focusedCollection', async () => {
          nock(/graph/)
            .post(/api/)
            .reply(200, {
              data: {
                collection: null
              }
            })

          useEdscStore.setState((state) => {
            state.focusedCollection.focusedCollection = 'C10000000000-EDSC'
            state.focusedCollection.setFocusedCollection = jest.fn()
          })

          mockGetState.mockReturnValue({
            authToken: '',
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
            }
          })

          const { focusedCollection } = useEdscStore.getState()
          const { getFocusedCollection } = focusedCollection

          await getFocusedCollection()

          const { focusedCollection: updatedFocusedCollection } = useEdscStore.getState()
          const { setFocusedCollection } = updatedFocusedCollection

          expect(setFocusedCollection).toHaveBeenCalledTimes(1)
          expect(setFocusedCollection).toHaveBeenCalledWith('')

          expect(actions.changeUrl).toHaveBeenCalledTimes(1)
          expect(actions.changeUrl).toHaveBeenCalledWith({
            pathname: '/search',
            search: '?some=testparams'
          })

          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
          expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
          expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

          expect(actions.handleError).toHaveBeenCalledTimes(0)
          expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(0)
          expect(actions.getSearchGranules).toHaveBeenCalledTimes(0)
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
          state.focusedCollection.focusedCollection = 'C10000000000-EDSC'
        })

        mockGetState.mockReturnValue({
          authToken: '',
          metadata: {
            collections: {}
          },
          searchResults: {}
        })

        const { focusedCollection } = useEdscStore.getState()
        const { getFocusedCollection } = focusedCollection

        await getFocusedCollection()

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

        expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(actions.updateCollectionMetadata).toHaveBeenCalledWith(
          [
            expect.objectContaining({
              isCSDA: true
            })
          ]
        )

        expect(actions.getSearchGranules).toHaveBeenCalledTimes(1)
        expect(actions.getSearchGranules).toHaveBeenCalledWith()

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
          state.focusedCollection.focusedCollection = 'C10000000000-EDSC'
        })

        mockGetState.mockReturnValue({
          authToken: '',
          metadata: {
            collections: {}
          },
          searchResults: {}
        })

        const expectedItems = [
          { conceptId: 'V10000000000-EDSC' },
          { conceptId: 'V10000000001-EDSC' },
          { conceptId: 'V10000000002-EDSC' }
        ]

        const { focusedCollection } = useEdscStore.getState()
        const { getFocusedCollection } = focusedCollection

        await getFocusedCollection()

        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
        expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
        expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

        expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(1)
        expect(actions.updateCollectionMetadata).toHaveBeenCalledWith(
          [
            expect.objectContaining({
              variables: {
                count: 3,
                items: expectedItems
              }
            })
          ]
        )

        expect(actions.getSearchGranules).toHaveBeenCalledTimes(1)
        expect(actions.getSearchGranules).toHaveBeenCalledWith()

        expect(actions.getColorMap).toHaveBeenCalledTimes(0)
      })
    })

    test('does not call updateFocusedCollection when graphql throws an http error', async () => {
      nock(/graph/)
        .post(/api/)
        .reply(500)

      nock(/localhost/)
        .post(/error_logger/)
        .reply(200)

      mockGetState.mockReturnValue({
        authToken: '',
        metadata: {
          collections: {}
        }
      })

      const { focusedCollection } = useEdscStore.getState()
      const { getFocusedCollection } = focusedCollection

      await getFocusedCollection()

      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledTimes(1)
      expect(actions.toggleSpatialPolygonWarning).toHaveBeenCalledWith(false)

      expect(actions.collectionRelevancyMetrics).toHaveBeenCalledTimes(1)
      expect(actions.collectionRelevancyMetrics).toHaveBeenCalledWith()

      expect(actions.handleError).toHaveBeenCalledTimes(1)
      expect(actions.handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'getFocusedCollection',
          error: expect.any(Error),
          resource: 'collection'
        })
      )

      expect(actions.updateCollectionMetadata).toHaveBeenCalledTimes(0)
      expect(actions.getSearchGranules).toHaveBeenCalledTimes(0)
      expect(actions.getColorMap).toHaveBeenCalledTimes(0)
    })
  })

  describe('setFocusedCollection', () => {
    test('updates focusedCollection', () => {
      const zustandState = useEdscStore.getState()
      const { focusedCollection } = zustandState
      const { setFocusedCollection } = focusedCollection
      setFocusedCollection('collection-1')

      const updatedState = useEdscStore.getState()
      const { focusedCollection: updatedFocusedCollection } = updatedState
      expect(updatedFocusedCollection.focusedCollection).toEqual('collection-1')
    })
  })

  describe('viewCollectionDetails', () => {
    test('calls changeFocusedCollection and changeUrl', async () => {
      useEdscStore.setState((state) => {
        state.focusedCollection.changeFocusedCollection = jest.fn()
      })

      mockGetState.mockReturnValue({
        router: {
          location: {
            search: '?keyword=modis'
          }
        }
      })

      const zustandState = useEdscStore.getState()
      const { focusedCollection } = zustandState
      const { changeFocusedCollection, viewCollectionDetails } = focusedCollection

      await viewCollectionDetails('collection-1')

      expect(changeFocusedCollection).toHaveBeenCalledTimes(1)
      expect(changeFocusedCollection).toHaveBeenCalledWith('collection-1')

      expect(actions.changeUrl).toHaveBeenCalledTimes(1)
      expect(actions.changeUrl).toHaveBeenCalledWith({
        pathname: '/search/granules/collection-details',
        search: '?keyword=modis'
      })
    })
  })

  describe('viewCollectionGranules', () => {
    test('calls changeFocusedCollection and changeUrl', async () => {
      useEdscStore.setState((state) => {
        state.focusedCollection.changeFocusedCollection = jest.fn()
      })

      mockGetState.mockReturnValue({
        router: {
          location: {
            search: '?keyword=modis'
          }
        }
      })

      const zustandState = useEdscStore.getState()
      const { focusedCollection } = zustandState
      const { changeFocusedCollection, viewCollectionGranules } = focusedCollection

      await viewCollectionGranules('collection-1')

      expect(changeFocusedCollection).toHaveBeenCalledTimes(1)
      expect(changeFocusedCollection).toHaveBeenCalledWith('collection-1')

      expect(actions.changeUrl).toHaveBeenCalledTimes(1)
      expect(actions.changeUrl).toHaveBeenCalledWith({
        pathname: '/search/granules',
        search: '?keyword=modis'
      })
    })
  })
})
