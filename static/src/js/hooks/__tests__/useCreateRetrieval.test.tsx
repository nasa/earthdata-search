import React from 'react'
import { screen } from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../vitestConfigs/setupTest'
import { useCreateRetrieval } from '../useCreateRetrieval'
import CREATE_RETRIEVAL from '../../operations/mutations/createRetrieval'
import { metricsDataAccess } from '../../util/metrics/metricsDataAccess'
import logEvent from '../../util/metrics/experiments/logEvent'

vi.mock('../../util/metrics/metricsDataAccess', () => ({
  metricsDataAccess: vi.fn()
}))

vi.mock('../../util/metrics/experiments/logEvent', () => ({
  default: vi.fn()
}))

const mockUseNavigate = vi.fn()
vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
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
      handleError: vi.fn()
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

        expect(logEvent).toHaveBeenCalledTimes(1)
        expect(logEvent).toHaveBeenCalledWith({
          eventType: 'data_access',
          eventData: JSON.stringify({
            service_type: ['download']
          })
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
            error: new ApolloError({ errorMessage: 'An error occurred' })
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
          error: new ApolloError({ errorMessage: 'An error occurred' }),
          resource: 'retrieval',
          verb: 'creating'
        })

        expect(mockUseNavigate).toHaveBeenCalledTimes(0)
      })
    })

    describe('when the access method type is harmony', () => {
      test('calls metricsDataAccess with the correct data', async () => {
        const accessMethod = {
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
                    selectedAccessMethod: 'harmony',
                    accessMethods: {
                      harmony: accessMethod
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
            service: 'Harmony',
            type: 'harmony'
          }],
          type: 'data_access_completion'
        })
      })
    })
  })
})
