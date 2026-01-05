import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../jestConfigs/setupTest'
import { useCreateRetrieval } from '../useCreateRetrieval'
import CREATE_RETRIEVAL from '../../operations/mutations/createRetrieval'
import { metricsDataAccess } from '../../util/metrics/metricsDataAccess'

jest.mock('../../util/metrics/metricsDataAccess', () => ({
  metricsDataAccess: jest.fn()
}))

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

const TestComponent = () => {
  const { createRetrieval, loading } = useCreateRetrieval()

  return (
    <div>
      <span>
        Loading:
        {' '}
        {loading.toString()}
      </span>

      <button
        type="button"
        onClick={createRetrieval}
      >
        Create
      </button>
    </div>
  )
}

const setup = setupTest({
  Component: TestComponent,
  defaultZustandState: {
    collections: {
      collections: {
        items: [{
          id: 'collectionId'
        }]
      }
    },
    errors: {
      handleError: jest.fn()
    },
    project: {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            isVisible: true,
            selectedAccessMethod: 'download',
            granules: {
              addedGranuleIds: [
                'G3857626071-LAADS'
              ],
              timerStart: null,
              isErrored: false,
              isLoaded: true,
              isLoading: false,
              loadTime: 546,
              allIds: [
                'G3857626071-LAADS'
              ],
              byId: {
                'G3857626071-LAADS': {
                  producerGranuleId: 'VNP03IMG.A2025315.0948.002.2025315172638.nc',
                  timeStart: '2025-11-11T09:48:00.000Z',
                  updated: '2025-11-11T17:48:37.630Z',
                  datasetId: 'VIIRS/NPP Imagery Resolution Terrain Corrected Geolocation 6-Min L1 Swath 375 m ',
                  dataCenter: 'LAADS',
                  title: 'LAADS:9175757689',
                  coordinateSystem: 'GEODETIC',
                  dayNightFlag: 'DAY',
                  timeEnd: '2025-11-11T09:54:00.000Z',
                  id: 'G3857626071-LAADS',
                  originalFormat: 'ECHO10',
                  granuleSize: '175.725131988525',
                  browseFlag: false,
                  polygons: [
                    [
                      '47.550789 23.454853 54.126953 66.886993 74.482941 74.790169 62.96862 -3.00628 47.550789 23.454853'
                    ]
                  ],
                  collectionConceptId: 'C2105092163-LAADS',
                  onlineAccessFlag: true,
                  links: [
                    {
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
                      type: 'application/x-netcdf',
                      hreflang: 'en-US',
                      href: 'https://data.laadsdaac.earthdatacloud.nasa.gov/prod-lads/VNP03IMG/VNP03IMG.A2025315.0948.002.2025315172638.nc'
                    },
                    {
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/s3#',
                      type: 'application/x-netcdf',
                      hreflang: 'en-US',
                      href: 's3://prod-lads/VNP03IMG/VNP03IMG.A2025315.0948.002.2025315172638.nc'
                    },
                    {
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/service#',
                      type: 'text/html',
                      title: 'This file may be accessed using OPeNDAP directly from this link (OPENDAP DATA)',
                      hreflang: 'en-US',
                      href: 'https://ladsweb.modaps.eosdis.nasa.gov/opendap/RemoteResources/laads/allData/5200/VNP03IMG/2025/315/VNP03IMG.A2025315.0948.002.2025315172638.nc.html'
                    },
                    {
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
                      type: 'text/html',
                      title: 'A link to Data set landing page (Data Set Landing Page)',
                      hreflang: 'en-US',
                      href: 'http://doi.org/10.5067/VIIRS/VNP03IMG.002'
                    },
                    {
                      inherited: true,
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/metadata#',
                      hreflang: 'en-US',
                      href: 'https://doi.org/10.5067/VIIRS/VNP03IMG.002'
                    },
                    {
                      inherited: true,
                      length: '0KB',
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
                      hreflang: 'en-US',
                      href: 'https://ladsweb.modaps.eosdis.nasa.gov/search/order/2/VNP03IMG--5200'
                    },
                    {
                      inherited: true,
                      length: '0KB',
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
                      hreflang: 'en-US',
                      href: 'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/5200/VNP03IMG/'
                    },
                    {
                      inherited: true,
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/service#',
                      type: 'text/html',
                      hreflang: 'en-US',
                      href: 'https://ladsweb.modaps.eosdis.nasa.gov/opendap/hyrax/allData/5200/VNP03IMG/contents.html'
                    },
                    {
                      inherited: true,
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
                      hreflang: 'en-US',
                      href: 'https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/viirs/NASA_VIIRS_L1B_UG_August_2021.pdf'
                    },
                    {
                      inherited: true,
                      rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
                      hreflang: 'en-US',
                      href: 'https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/viirs/NASARevisedVIIRSGeolocationATBD2014.pdf'
                    }
                  ],
                  isOpenSearch: false,
                  formattedTemporal: [
                    '2025-11-11 09:48:00',
                    '2025-11-11 09:54:00'
                  ]
                }
              },
              count: 1,
              isOpenSearch: false,
              totalSize: {
                size: '175.7',
                unit: 'MB'
              },
              singleGranuleSize: 175.725131988525
            },
            accessMethods: {
              download: {
                isValid: true,
                type: 'download'
              }
            }
          }
        }
      }
    }
  },
  withApolloClient: true,
  withRouter: true
})

describe('useCreateRetrieval', () => {
  describe('when calling createRetrieval', () => {
    describe('when the mutation is successful', () => {
      test('calls metricsDataAccess, calls the mutation and navigates', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: CREATE_RETRIEVAL,
              variables: {
                collections: [{
                  id: 'collectionId',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata: {},
                  granuleParams: {
                    conceptId: ['G3857626071-LAADS'],
                    echoCollectionId: 'collectionId',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    twoDCoordinateSystem: {}
                  },
                  accessMethod: { type: 'download' }
                }],
                environment: 'prod',
                jsondata: {
                  source: ''
                }
              }
            },
            result: {
              data: {
                createRetrieval: {
                  environment: 'prod',
                  obfuscatedId: '123456'
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Create' })
        await user.click(button)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'collectionId',
            service: 'Download',
            type: 'download'
          }],
          type: 'data_access_completion'
        })

        expect(mockUseNavigate).toHaveBeenCalledTimes(1)
        expect(mockUseNavigate).toHaveBeenCalledWith('/downloads/123456')
      })
    })

    describe('when the mutation errors', () => {
      test('calls handleError', async () => {
        const { user, zustandState } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: CREATE_RETRIEVAL,
              variables: {
                collections: [{
                  id: 'collectionId',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata: {},
                  granuleParams: {
                    conceptId: ['G3857626071-LAADS'],
                    echoCollectionId: 'collectionId',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    twoDCoordinateSystem: {}
                  },
                  accessMethod: { type: 'download' }
                }],
                environment: 'prod',
                jsondata: {
                  source: ''
                }
              }
            },
            error: new Error('An error occurred')
          }]
        })

        const button = screen.getByRole('button', { name: 'Create' })
        await user.click(button)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'collectionId',
            service: 'Download',
            type: 'download'
          }],
          type: 'data_access_completion'
        })

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          action: 'createRetrieval',
          error: new Error('An error occurred'),
          resource: 'retrieval',
          verb: 'creating'
        })

        expect(mockUseNavigate).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the access method type is echo orders', () => {
      test('calls metricsDataAccess with the correct data', async () => {
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

        const { user } = setup({
          overrideZustandState: {
            project: {
              collections: {
                byId: {
                  collectionId: {
                    selectedAccessMethod: 'echoOrders0',
                    accessMethods: {
                      echoOrders0: accessMethod
                    }
                  }
                }
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: CREATE_RETRIEVAL,
              variables: {
                collections: [{
                  id: 'collectionId',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata: {},
                  granuleParams: {
                    conceptId: ['G3857626071-LAADS'],
                    echoCollectionId: 'collectionId',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    twoDCoordinateSystem: {}
                  },
                  accessMethod
                }],
                environment: 'prod',
                jsondata: {
                  source: ''
                }
              }
            },
            result: {
              data: {
                createRetrieval: {
                  environment: 'prod',
                  obfuscatedId: '123456'
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Create' })
        await user.click(button)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'collectionId',
            service: 'Delivery Option',
            type: 'order'
          }],
          type: 'data_access_completion'
        })
      })
    })

    describe('when the access method type is esi', () => {
      test('calls metricsDataAccess with the correct data', async () => {
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

        const { user } = setup({
          overrideZustandState: {
            project: {
              collections: {
                byId: {
                  collectionId: {
                    selectedAccessMethod: 'esi0',
                    accessMethods: {
                      esi0: accessMethod
                    }
                  }
                }
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: CREATE_RETRIEVAL,
              variables: {
                collections: [{
                  id: 'collectionId',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata: {},
                  granuleParams: {
                    conceptId: ['G3857626071-LAADS'],
                    echoCollectionId: 'collectionId',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    twoDCoordinateSystem: {}
                  },
                  accessMethod
                }],
                environment: 'prod',
                jsondata: {
                  source: ''
                }
              }
            },
            result: {
              data: {
                createRetrieval: {
                  environment: 'prod',
                  obfuscatedId: '123456'
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Create' })
        await user.click(button)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'collectionId',
            service: 'SPL4SMLM.3 ESI Service',
            type: 'esi'
          }],
          type: 'data_access_completion'
        })
      })
    })

    describe('when the access method type is harmony', () => {
      test('calls metricsDataAccess with the correct data', async () => {
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

        const { user } = setup({
          overrideZustandState: {
            project: {
              collections: {
                byId: {
                  collectionId: {
                    selectedAccessMethod: 'harmony0',
                    accessMethods: {
                      harmony0: accessMethod
                    }
                  }
                }
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: CREATE_RETRIEVAL,
              variables: {
                collections: [{
                  id: 'collectionId',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata: {},
                  granuleParams: {
                    conceptId: ['G3857626071-LAADS'],
                    echoCollectionId: 'collectionId',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    twoDCoordinateSystem: {}
                  },
                  accessMethod
                }],
                environment: 'prod',
                jsondata: {
                  source: ''
                }
              }
            },
            result: {
              data: {
                createRetrieval: {
                  environment: 'prod',
                  obfuscatedId: '123456'
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Create' })
        await user.click(button)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'collectionId',
            service: 'PODAAC Concise',
            type: 'harmony'
          }],
          type: 'data_access_completion'
        })
      })
    })

    describe('when the access method type is opendap', () => {
      test('calls metricsDataAccess with the correct data', async () => {
        const accessMethod = {
          type: 'OPeNDAP',
          selectedVariables: ['V1245794632-EEDTEST'],
          selectedOutputFormat: 'ascii',
          variables: {
            'V1245794632-EEDTEST': {}
          }
        }

        const { user } = setup({
          overrideZustandState: {
            project: {
              collections: {
                byId: {
                  collectionId: {
                    selectedAccessMethod: 'opendap',
                    accessMethods: {
                      opendap: accessMethod
                    }
                  }
                }
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: CREATE_RETRIEVAL,
              variables: {
                collections: [{
                  id: 'collectionId',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata: {},
                  granuleParams: {
                    conceptId: ['G3857626071-LAADS'],
                    echoCollectionId: 'collectionId',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    twoDCoordinateSystem: {}
                  },
                  accessMethod
                }],
                environment: 'prod',
                jsondata: {
                  source: ''
                }
              }
            },
            result: {
              data: {
                createRetrieval: {
                  environment: 'prod',
                  obfuscatedId: '123456'
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Create' })
        await user.click(button)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'collectionId',
            service: 'OPeNDAP',
            type: 'opendap'
          }],
          type: 'data_access_completion'
        })
      })
    })

    describe('when the access method type is swodlr', () => {
      test('calls metricsDataAccess with the correct data', async () => {
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

        const { user } = setup({
          overrideZustandState: {
            project: {
              collections: {
                byId: {
                  collectionId: {
                    selectedAccessMethod: 'swodlr',
                    accessMethods: {
                      swodlr: accessMethod
                    }
                  }
                }
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: CREATE_RETRIEVAL,
              variables: {
                collections: [{
                  id: 'collectionId',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata: {},
                  granuleParams: {
                    conceptId: ['G3857626071-LAADS'],
                    echoCollectionId: 'collectionId',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    twoDCoordinateSystem: {}
                  },
                  accessMethod
                }],
                environment: 'prod',
                jsondata: {
                  source: ''
                }
              }
            },
            result: {
              data: {
                createRetrieval: {
                  environment: 'prod',
                  obfuscatedId: '123456'
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Create' })
        await user.click(button)

        expect(metricsDataAccess).toHaveBeenCalledTimes(1)
        expect(metricsDataAccess).toHaveBeenCalledWith({
          collections: [{
            collectionId: 'collectionId',
            service: 'SWODLR',
            type: 'swodlr'
          }],
          type: 'data_access_completion'
        })
      })
    })
  })
})
