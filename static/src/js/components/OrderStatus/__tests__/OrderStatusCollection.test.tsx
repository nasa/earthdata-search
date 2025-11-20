import React from 'react'
import { waitFor } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import DownloadStatusItem from '../AccessMethodItems/DownloadStatusItem'
import EchoOrderStatusItem from '../AccessMethodItems/EchoOrderStatusItem'
import EsiStatusItem from '../AccessMethodItems/EsiStatusItem'
import HarmonyStatusItem from '../AccessMethodItems/HarmonyStatusItem'
import OpendapStatusItem from '../AccessMethodItems/OpendapStatusItem'
import OrderStatusCollection from '../OrderStatusCollection'
// @ts-expect-error This file does not have types
import Skeleton from '../../Skeleton/Skeleton'
import SwodlrStatusItem from '../AccessMethodItems/SwodlrStatusItem'

import GET_RETRIEVAL_COLLECTION from '../../../operations/queries/getRetrievalCollection'

jest.mock('../../Skeleton/Skeleton', () => jest.fn(() => <div />))
jest.mock('../AccessMethodItems/DownloadStatusItem', () => jest.fn(() => <div />))
jest.mock('../AccessMethodItems/EchoOrderStatusItem', () => jest.fn(() => <div />))
jest.mock('../AccessMethodItems/EsiStatusItem', () => jest.fn(() => <div />))
jest.mock('../AccessMethodItems/HarmonyStatusItem', () => jest.fn(() => <div />))
jest.mock('../AccessMethodItems/OpendapStatusItem', () => jest.fn(() => <div />))
jest.mock('../AccessMethodItems/SwodlrStatusItem', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OrderStatusCollection,
  defaultProps: {
    collection: {
      obfuscatedId: '12345'
    },
    defaultOpen: true,
    onToggleAboutCSDAModal: jest.fn(),
    retrievalId: '42'
  },
  withApolloClient: true
})

const collectionMetadata = {
  mock: 'metadata'
}

afterEach(() => {
  jest.useRealTimers()
})

describe('OrderStatusCollection', () => {
  describe('when the collection request is loading', () => {
    test('renders a skeleton', () => {
      setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod: {
                  type: 'download'
                },
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders: []
              }
            }
          }
        }]
      })

      expect(Skeleton).toHaveBeenCalledTimes(2)
      expect(Skeleton).toHaveBeenCalledWith({
        className: 'order-status__collection-skeleton',
        containerStyle: {
          display: 'inline-block',
          height: '175px',
          width: '100%'
        },
        shapes: [{
          height: 18,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 2,
          width: 200
        }, {
          height: 14,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 31,
          width: '80%'
        }, {
          height: 96,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 60,
          width: '100%'
        }]
      }, {})
    })
  })

  describe('when there is an error', () => {
    test('calls handleError', async () => {
      const { zustandState } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          error: new Error('An error occurred')
        }],
        overrideZustandState: {
          errors: {
            handleError: jest.fn()
          }
        }
      })

      // Wait for the error to be handled
      await waitFor(() => {
        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.errors.handleError).toHaveBeenCalledWith({
        action: 'getRetrievalCollection',
        error: new Error('An error occurred'),
        resource: 'collection'
      })
    })
  })

  describe('when the collection\'s access method is download', () => {
    test('renders a DownloadStatusItem', async () => {
      const { props } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod: {
                  type: 'download'
                },
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders: []
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(DownloadStatusItem).toHaveBeenCalledTimes(1)
      })

      expect(DownloadStatusItem).toHaveBeenCalledWith({
        defaultOpen: true,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        retrievalCollection: {
          accessMethod: { type: 'download' },
          collectionMetadata,
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalId: '42',
          retrievalOrders: [],
          updatedAt: '2025-01-01T00:00:00Z'
        },
        retrievalId: '42'
      }, {})
    })
  })

  describe('when the collection\'s access method is echo orders', () => {
    test('renders an EchoOrderStatusItem', async () => {
      const accessMethod = {
        url: 'https://e7eil01.cr.usgs.gov/ops/egi/request',
        type: 'ECHO ORDERS',
        model: '<ecs:options xmlns:ecs="http://ecs.nasa.gov/options" xmlns:lpdaac="http://lpdaac.usgs.gov/orderoptions.v1" xmlns:lpdaacSchemaLocation="/v1/MODIS.xsd"><!-- Model --><ecs:distribution><ecs:mediatype><ecs:value>FtpPull</ecs:value></ecs:mediatype><ecs:mediaformat><ecs:ftppull-format><ecs:value>FILEFORMAT</ecs:value></ecs:ftppull-format></ecs:mediaformat></ecs:distribution><lpdaac:subsetSpecification><lpdaac:productName criteriaName="Product Name" criteriaType="FIXED">MODIS</lpdaac:productName><lpdaac:longName criteriaName="Long Name" criteriaType="FIXED">MODIS Long Name</lpdaac:longName><lpdaac:granuleSize criteriaName="Granule_size" criteriaType="FIXED">0.0</lpdaac:granuleSize></lpdaac:subsetSpecification></ecs:options>',
        rawModel: '<ecs:options xmlns:ecs="http://ecs.nasa.gov/options" xmlns:lpdaac="http://lpdaac.usgs.gov/orderoptions.v1" xmlns:lpdaacSchemaLocation="/v1/MODIS.xsd"><!-- Model --><ecs:distribution><ecs:mediatype><ecs:value>FtpPull</ecs:value></ecs:mediatype><ecs:mediaformat><ecs:ftppull-format><ecs:value>FILEFORMAT</ecs:value></ecs:ftppull-format></ecs:mediaformat></ecs:distribution><lpdaac:subsetSpecification><lpdaac:productName criteriaName="Product Name" criteriaType="FIXED">MODIS</lpdaac:productName><lpdaac:longName criteriaName="Long Name" criteriaType="FIXED">MODIS Long Name</lpdaac:longName><lpdaac:granuleSize criteriaName="Granule_size" criteriaType="FIXED">0.0</lpdaac:granuleSize></lpdaac:subsetSpecification></ecs:options>',
        formDigest: '057d4def9987a7c11e734b5fe8669ef8',
        maxItemsPerOrder: 2000,
        optionDefinition: {
          name: 'Delivery Option',
          conceptId: 'OO2700491961-LPDAAC_ECS',
          revisionId: '1'
        }
      }

      const { props } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod,
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders: []
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(EchoOrderStatusItem).toHaveBeenCalledTimes(1)
      })

      expect(EchoOrderStatusItem).toHaveBeenCalledWith({
        defaultOpen: true,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        retrievalCollection: {
          accessMethod,
          collectionMetadata,
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalId: '42',
          retrievalOrders: [],
          updatedAt: '2025-01-01T00:00:00Z'
        },
        retrievalId: '42'
      }, {})
    })
  })

  describe('when the collection\'s access method is esi', () => {
    const accessMethod = {
      url: 'https://n5eil02u.ecs.nsidc.org/egi/request',
      type: 'ESI',
      model: '<ecs:request xmlns:ecs="http://ecs.nasa.gov/options"><!--NOTE: elements in caps losely match the ESI API, those in lowercase are helper elements --><ecs:requestInfo><ecs:email>mcrouch@innovim.com</ecs:email></ecs:requestInfo><!--Dataset ID will be injected by Reverb--><ecs:CLIENT>ESI</ecs:CLIENT><!--First SubsetAgent in the input capabilities XML is used as the default.--><ecs:SUBAGENT_ID><ecs:value>HEG</ecs:value></ecs:SUBAGENT_ID><!-- hardcode to async for Reverb services --><ecs:REQUEST_MODE>async</ecs:REQUEST_MODE><ecs:SPATIAL_MSG>Click the checkbox to enable spatial subsetting.</ecs:SPATIAL_MSG><ecs:ADVANCED_OPT_MSG>No resampling or interpolation options available with current selection.</ecs:ADVANCED_OPT_MSG><ecs:PROJ_MSG_1>CAUTION: Re-projection parameters may alter results.</ecs:PROJ_MSG_1><ecs:PROJ_MSG_2>Leave blank to choose default values for each re-projected granule.</ecs:PROJ_MSG_2><ecs:INTRPL_MSG_1>Used to calculate data of resampled and reprojected pixels.</ecs:INTRPL_MSG_1><ecs:UTM_MSG_1>NOTE: Zone parameter(s) are calculated automatically when spatial subsetting is active.</ecs:UTM_MSG_1><ecs:NULL_MSG/><ecs:HEG-request><!--Need to populate BBOX in final ESI request as follows: "&BBOX=ullon,lrlat,lrlon,ullat"--><ecs:BBOX/><ecs:spatial_subsetting><ecs:boundingbox/></ecs:spatial_subsetting><ecs:band_subsetting><ecs:SUBSET_DATA_LAYERS style="tree"><ecs:SPL4SMLM><ecs:dataset>/SPL4SMLM/Land-Model-Constants_Data</ecs:dataset></ecs:SPL4SMLM></ecs:SUBSET_DATA_LAYERS></ecs:band_subsetting><!--First Format in the input XML is used as the default.--><ecs:FORMAT><ecs:value>GeoTIFF</ecs:value></ecs:FORMAT><!-- OUTPUT_GRID is never used in ESI (but should be enabled for SSW)--><!-- FILE_IDS must be injected by Reverb --><!-- FILE_URLS is not used in requests from ECHO, Use FILE_IDS instead --><ecs:projection_options><ecs:PROJECTION><ecs:value>GEOGRAPHIC</ecs:value></ecs:PROJECTION><!--In final ESI request, projection parameters should be included as follows: "&PROJECTION_PARAMETERS=param1:value1,param2:value2,...paramn:valuen"--><ecs:PROJECTION_PARAMETERS/></ecs:projection_options><ecs:advanced_file_option_flag/><ecs:advanced_file_options><ecs:INTERPOLATION><ecs:value/></ecs:INTERPOLATION><!--INCLUDE_META needs to be converted from true/false here to Y/N in the request.--><ecs:INCLUDE_META>false</ecs:INCLUDE_META></ecs:advanced_file_options><ecs:spatial_subset_flag>false</ecs:spatial_subset_flag><ecs:band_subset_flag>true</ecs:band_subset_flag><ecs:temporal_subset_flag>false</ecs:temporal_subset_flag></ecs:HEG-request></ecs:request>',
      rawModel: '<ecs:request xmlns:ecs="http://ecs.nasa.gov/options"><!--NOTE: elements in caps losely match the ESI API, those in lowercase are helper elements --><ecs:requestInfo><ecs:email>mcrouch@innovim.com</ecs:email></ecs:requestInfo><!--Dataset ID will be injected by Reverb--><ecs:CLIENT>ESI</ecs:CLIENT><!--First SubsetAgent in the input capabilities XML is used as the default.--><ecs:SUBAGENT_ID><ecs:value>HEG</ecs:value></ecs:SUBAGENT_ID><!-- hardcode to async for Reverb services --><ecs:REQUEST_MODE>async</ecs:REQUEST_MODE><ecs:SPATIAL_MSG>Click the checkbox to enable spatial subsetting.</ecs:SPATIAL_MSG><ecs:NO_PROJ_MSG irrelevant="true">No projection options available with current selection.</ecs:NO_PROJ_MSG><ecs:ADVANCED_OPT_MSG>No resampling or interpolation options available with current selection.</ecs:ADVANCED_OPT_MSG><ecs:PROJ_MSG_1>CAUTION: Re-projection parameters may alter results.</ecs:PROJ_MSG_1><ecs:PROJ_MSG_2>Leave blank to choose default values for each re-projected granule.</ecs:PROJ_MSG_2><ecs:INTRPL_MSG_1>Used to calculate data of resampled and reprojected pixels.</ecs:INTRPL_MSG_1><ecs:UTM_MSG_1>NOTE: Zone parameter(s) are calculated automatically when spatial subsetting is active.</ecs:UTM_MSG_1><ecs:NULL_MSG/><ecs:HEG-request><!--Need to populate BBOX in final ESI request as follows: "&BBOX=ullon,lrlat,lrlon,ullat"--><ecs:BBOX/><ecs:spatial_subsetting><ecs:boundingbox><ecs:ullat irrelevant="true">90</ecs:ullat><ecs:ullon irrelevant="true">-180</ecs:ullon><ecs:lrlat irrelevant="true">-90</ecs:lrlat><ecs:lrlon irrelevant="true">180</ecs:lrlon></ecs:boundingbox></ecs:spatial_subsetting><ecs:band_subsetting><ecs:SUBSET_DATA_LAYERS style="tree"><ecs:SPL4SMLM><ecs:dataset>/SPL4SMLM/Land-Model-Constants_Data</ecs:dataset></ecs:SPL4SMLM></ecs:SUBSET_DATA_LAYERS></ecs:band_subsetting><!--First Format in the input XML is used as the default.--><ecs:FORMAT><ecs:value>GeoTIFF</ecs:value></ecs:FORMAT><!-- OUTPUT_GRID is never used in ESI (but should be enabled for SSW)--><!-- FILE_IDS must be injected by Reverb --><!-- FILE_URLS is not used in requests from ECHO, Use FILE_IDS instead --><ecs:projection_options><ecs:PROJECTION><ecs:value>GEOGRAPHIC</ecs:value></ecs:PROJECTION><!--In final ESI request, projection parameters should be included as follows: "&PROJECTION_PARAMETERS=param1:value1,param2:value2,...paramn:valuen"--><ecs:PROJECTION_PARAMETERS><ecs:UNIVERSAL_TRANSVERSE_MERCATOR_projection irrelevant="true"><ecs:LonZ/><ecs:LatZ/><ecs:NZone/></ecs:UNIVERSAL_TRANSVERSE_MERCATOR_projection></ecs:PROJECTION_PARAMETERS></ecs:projection_options><ecs:advanced_file_option_flag/><ecs:advanced_file_options><ecs:INTERPOLATION><ecs:value/></ecs:INTERPOLATION><!--INCLUDE_META needs to be converted from true/false here to Y/N in the request.--><ecs:INCLUDE_META>false</ecs:INCLUDE_META></ecs:advanced_file_options><ecs:spatial_subset_flag>false</ecs:spatial_subset_flag><ecs:band_subset_flag>true</ecs:band_subset_flag><ecs:temporal_subset_flag>false</ecs:temporal_subset_flag></ecs:HEG-request></ecs:request>',
      formDigest: '86fc1815d3e8d2432b455dda6c2ba7d0',
      maxItemsPerOrder: null,
      optionDefinition: {
        name: 'SPL4SMLM.3 ESI Service',
        conceptId: 'OO2700528162-NSIDC_ECS',
        revisionId: '1'
      }
    }

    test('renders an EsiStatusItem', async () => {
      const retrievalOrders = [{
        error: null,
        id: 126,
        orderInformation: {},
        orderNumber: null,
        state: 'create_failed',
        type: 'ESI'
      }]

      const { props } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod,
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(EsiStatusItem).toHaveBeenCalledTimes(1)
      })

      expect(EsiStatusItem).toHaveBeenCalledWith({
        defaultOpen: true,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        retrievalCollection: {
          accessMethod,
          collectionMetadata,
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalId: '42',
          retrievalOrders,
          updatedAt: '2025-01-01T00:00:00Z'
        },
        retrievalId: '42'
      }, {})
    })

    describe('when the order isn\'t complete', () => {
      beforeEach(() => {
        jest.useFakeTimers({ legacyFakeTimers: true })
      })

      test('refreshes the order status', async () => {
        const retrievalOrdersCreating = [{
          error: null,
          id: 126,
          orderInformation: {},
          orderNumber: null,
          state: 'creating',
          type: 'ESI'
        }]
        const retrievalOrdersDone = [{
          error: null,
          id: 126,
          orderInformation: {},
          orderNumber: null,
          state: 'complete',
          type: 'ESI'
        }]

        const { props } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: GET_RETRIEVAL_COLLECTION,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrievalCollection: {
                  accessMethod,
                  collectionMetadata,
                  granuleCount: 1,
                  obfuscatedId: '12345',
                  retrievalId: '42',
                  updatedAt: '2025-01-01T00:00:00Z',
                  retrievalOrders: retrievalOrdersCreating
                }
              }
            }
          }, {
            request: {
              query: GET_RETRIEVAL_COLLECTION,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrievalCollection: {
                  accessMethod,
                  collectionMetadata,
                  granuleCount: 1,
                  obfuscatedId: '12345',
                  retrievalId: '42',
                  updatedAt: '2025-01-01T00:00:00Z',
                  retrievalOrders: retrievalOrdersDone
                }
              }
            }
          }]
        })

        await waitFor(() => {
          // This is called two times because the call to setRefreshInterval causes a second render
          expect(EsiStatusItem).toHaveBeenCalledTimes(2)
        })

        expect(EsiStatusItem).toHaveBeenNthCalledWith(1, {
          defaultOpen: true,
          onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
          retrievalCollection: {
            accessMethod,
            collectionMetadata,
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalId: '42',
            retrievalOrders: retrievalOrdersCreating,
            updatedAt: '2025-01-01T00:00:00Z'
          },
          retrievalId: '42'
        }, {})

        // Clear existing mocks
        jest.clearAllMocks()

        // Advance the time by the poll interval
        jest.advanceTimersByTime(5000)

        // Test the second render after the load
        await waitFor(() => {
          // This is called two times because the call to setRefreshInterval causes a second render
          expect(EsiStatusItem).toHaveBeenCalledTimes(2)
        })

        expect(EsiStatusItem).toHaveBeenNthCalledWith(1, {
          defaultOpen: true,
          onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
          retrievalCollection: {
            accessMethod,
            collectionMetadata,
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalId: '42',
            retrievalOrders: retrievalOrdersDone,
            updatedAt: '2025-01-01T00:00:00Z'
          },
          retrievalId: '42'
        }, {})
      })
    })
  })

  describe('when the collection\'s access method is harmony', () => {
    const accessMethod = {
      defaultConcatenation: false,
      enableConcatenateDownload: false,
      enableSpatialSubsetting: true,
      enableTemporalSubsetting: true,
      selectedVariables: [
        'V2833331293-POCLOUD'
      ],
      supportsBoundingBoxSubsetting: true,
      supportsConcatenation: false,
      supportsShapefileSubsetting: true,
      type: 'Harmony',
      url: 'https://harmony.earthdata.nasa.gov',
      name: 'PODAAC Concise',
      variables: {
        'V2833331293-POCLOUD': {}
      }
    }

    test('renders an HarmonyStatusItem', async () => {
      const retrievalOrders = [{
        error: null,
        id: 126,
        orderInformation: {},
        orderNumber: null,
        state: 'complete',
        type: 'Harmony'
      }]

      const { props } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod,
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(HarmonyStatusItem).toHaveBeenCalledTimes(1)
      })

      expect(HarmonyStatusItem).toHaveBeenCalledWith({
        defaultOpen: true,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        retrievalCollection: {
          accessMethod,
          collectionMetadata,
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalId: '42',
          retrievalOrders,
          updatedAt: '2025-01-01T00:00:00Z'
        },
        retrievalId: '42'
      }, {})
    })

    describe('when the order isn\'t complete', () => {
      beforeEach(() => {
        jest.useFakeTimers({ legacyFakeTimers: true })
      })

      test('refreshes the order status', async () => {
        const retrievalOrdersInProgress = [{
          error: null,
          id: 126,
          orderInformation: {},
          orderNumber: null,
          state: 'in progress',
          type: 'Harmony'
        }]
        const retrievalOrdersDone = [{
          error: null,
          id: 126,
          orderInformation: {},
          orderNumber: null,
          state: 'complete',
          type: 'Harmony'
        }]

        const { props } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: GET_RETRIEVAL_COLLECTION,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrievalCollection: {
                  accessMethod,
                  collectionMetadata,
                  granuleCount: 1,
                  obfuscatedId: '12345',
                  retrievalId: '42',
                  updatedAt: '2025-01-01T00:00:00Z',
                  retrievalOrders: retrievalOrdersInProgress
                }
              }
            }
          }, {
            request: {
              query: GET_RETRIEVAL_COLLECTION,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrievalCollection: {
                  accessMethod,
                  collectionMetadata,
                  granuleCount: 1,
                  obfuscatedId: '12345',
                  retrievalId: '42',
                  updatedAt: '2025-01-01T00:00:00Z',
                  retrievalOrders: retrievalOrdersDone
                }
              }
            }
          }]
        })

        await waitFor(() => {
          // This is called two times because the call to setRefreshInterval causes a second render
          expect(HarmonyStatusItem).toHaveBeenCalledTimes(2)
        })

        expect(HarmonyStatusItem).toHaveBeenNthCalledWith(1, {
          defaultOpen: true,
          onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
          retrievalCollection: {
            accessMethod,
            collectionMetadata,
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalId: '42',
            retrievalOrders: retrievalOrdersInProgress,
            updatedAt: '2025-01-01T00:00:00Z'
          },
          retrievalId: '42'
        }, {})

        // Clear existing mocks
        jest.clearAllMocks()

        // Advance the time by the poll interval
        jest.advanceTimersByTime(60000)

        // Test the second render after the load
        await waitFor(() => {
          // This is called two times because the call to setRefreshInterval causes a second render
          expect(HarmonyStatusItem).toHaveBeenCalledTimes(2)
        })

        expect(HarmonyStatusItem).toHaveBeenNthCalledWith(1, {
          defaultOpen: true,
          onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
          retrievalCollection: {
            accessMethod,
            collectionMetadata,
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalId: '42',
            retrievalOrders: retrievalOrdersDone,
            updatedAt: '2025-01-01T00:00:00Z'
          },
          retrievalId: '42'
        }, {})
      })
    })
  })

  describe('when the collection\'s access method is opendap', () => {
    const accessMethod = {
      type: 'OPeNDAP',
      selectedVariables: ['V1245794632-EEDTEST'],
      selectedOutputFormat: 'ascii',
      variables: {
        'V1245794632-EEDTEST': {}
      }
    }

    test('renders an OpendapStatusItem', async () => {
      const { props } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod,
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders: []
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(OpendapStatusItem).toHaveBeenCalledTimes(1)
      })

      expect(OpendapStatusItem).toHaveBeenCalledWith({
        defaultOpen: true,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        retrievalCollection: {
          accessMethod,
          collectionMetadata,
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalId: '42',
          retrievalOrders: [],
          updatedAt: '2025-01-01T00:00:00Z'
        },
        retrievalId: '42'
      }, {})
    })
  })

  describe('when the collection\'s access method is swodlr', () => {
    const accessMethod = {
      url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
      type: 'SWODLR',
      swodlrData: {
        params: {
          rasterResolution: 90,
          outputSamplingGridType: 'UTM',
          outputGranuleExtentFlag: false
        },
        custom_params: {
          'G2886081992-POCLOUD': {
            utmZoneAdjust: 0,
            mgrsBandAdjust: 0
          }
        }
      }
    }

    test('renders an SwodlrStatusItem', async () => {
      const retrievalOrders = [{
        error: null,
        id: 123,
        orderInformation: {
          jobId: 'd91f9b2f-4653-4512-ba3d-9ad32f097284',
          reason: null,
          status: 'complete',
          granules: [
            {
              id: '192007e1-1f19-49ea-be3c-1655e9e37b02',
              uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/69cf2791-60ee-4867-8ef3-c3f02bfc56f6/1724207855/SWOT_L2_HR_Raster_90m_UTM45V_N_x_x_x_011_424_027F_20240229T235524_20240229T235545_DIC0_01.nc',
              timestamp: '2024-08-21T02:37:43.076'
            }
          ],
          createdAt: '2024-08-21T02:37:42.936',
          productId: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
          updatedAt: '2024-08-21T01:35:54.619529'
        },
        orderNumber: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
        state: 'complete',
        type: 'SWODLR'
      }]

      const { props } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod,
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(SwodlrStatusItem).toHaveBeenCalledTimes(1)
      })

      expect(SwodlrStatusItem).toHaveBeenCalledWith({
        defaultOpen: true,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
        retrievalCollection: {
          accessMethod,
          collectionMetadata,
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalId: '42',
          retrievalOrders,
          updatedAt: '2025-01-01T00:00:00Z'
        },
        retrievalId: '42'
      }, {})
    })

    describe('when the order isn\'t complete', () => {
      beforeEach(() => {
        jest.useFakeTimers({ legacyFakeTimers: true })
      })

      test('refreshes the order status', async () => {
        const retrievalOrdersInProgress = [{
          error: null,
          id: 123,
          orderInformation: {},
          orderNumber: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
          state: 'creating',
          type: 'SWODLR'
        }]
        const retrievalOrdersDone = [{
          error: null,
          id: 123,
          orderInformation: {
            jobId: 'd91f9b2f-4653-4512-ba3d-9ad32f097284',
            reason: null,
            status: 'complete',
            granules: [
              {
                id: '192007e1-1f19-49ea-be3c-1655e9e37b02',
                uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/69cf2791-60ee-4867-8ef3-c3f02bfc56f6/1724207855/SWOT_L2_HR_Raster_90m_UTM45V_N_x_x_x_011_424_027F_20240229T235524_20240229T235545_DIC0_01.nc',
                timestamp: '2024-08-21T02:37:43.076'
              }
            ],
            createdAt: '2024-08-21T02:37:42.936',
            productId: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
            updatedAt: '2024-08-21T01:35:54.619529'
          },
          orderNumber: '69cf2791-60ee-4867-8ef3-c3f02bfc56f6',
          state: 'complete',
          type: 'SWODLR'
        }]

        const { props } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: GET_RETRIEVAL_COLLECTION,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrievalCollection: {
                  accessMethod,
                  collectionMetadata,
                  granuleCount: 1,
                  obfuscatedId: '12345',
                  retrievalId: '42',
                  updatedAt: '2025-01-01T00:00:00Z',
                  retrievalOrders: retrievalOrdersInProgress
                }
              }
            }
          }, {
            request: {
              query: GET_RETRIEVAL_COLLECTION,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrievalCollection: {
                  accessMethod,
                  collectionMetadata,
                  granuleCount: 1,
                  obfuscatedId: '12345',
                  retrievalId: '42',
                  updatedAt: '2025-01-01T00:00:00Z',
                  retrievalOrders: retrievalOrdersDone
                }
              }
            }
          }]
        })

        await waitFor(() => {
          // This is called two times because the call to setRefreshInterval causes a second render
          expect(SwodlrStatusItem).toHaveBeenCalledTimes(2)
        })

        expect(SwodlrStatusItem).toHaveBeenNthCalledWith(1, {
          defaultOpen: true,
          onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
          retrievalCollection: {
            accessMethod,
            collectionMetadata,
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalId: '42',
            retrievalOrders: retrievalOrdersInProgress,
            updatedAt: '2025-01-01T00:00:00Z'
          },
          retrievalId: '42'
        }, {})

        // Clear existing mocks
        jest.clearAllMocks()

        // Advance the time by the poll interval
        jest.advanceTimersByTime(60000)

        // Test the second render after the load
        await waitFor(() => {
          // This is called two times because the call to setRefreshInterval causes a second render
          expect(SwodlrStatusItem).toHaveBeenCalledTimes(2)
        })

        expect(SwodlrStatusItem).toHaveBeenNthCalledWith(1, {
          defaultOpen: true,
          onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
          retrievalCollection: {
            accessMethod,
            collectionMetadata,
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalId: '42',
            retrievalOrders: retrievalOrdersDone,
            updatedAt: '2025-01-01T00:00:00Z'
          },
          retrievalId: '42'
        }, {})
      })
    })
  })
})
