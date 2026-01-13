import snakecaseKeys from 'snakecase-keys'

import setupServer from './__mocks__/setupServer'

import CREATE_RETRIEVAL from '../../../../../static/src/js/operations/mutations/createRetrieval'
import DELETE_RETRIEVAL from '../../../../../static/src/js/operations/mutations/deleteRetrieval'
import GET_RETRIEVAL from '../../../../../static/src/js/operations/queries/getRetrieval'
import GET_RETRIEVAL_COLLECTION from '../../../../../static/src/js/operations/queries/getRetrievalCollection'
import GET_RETRIEVAL_GRANULE_LINKS from '../../../../../static/src/js/operations/queries/getRetrievalGranuleLinks'
import HISTORY_RETRIEVALS from '../../../../../static/src/js/operations/queries/historyRetrievals'

import { fetchGranuleLinks } from '../../../util/fetchGranuleLinks'

jest.mock('../../../util/fetchGranuleLinks', () => ({
  fetchGranuleLinks: jest.fn()
}))

const OLD_ENV = process.env

beforeEach(() => {
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  process.env.ORDER_DELAY_SECONDS = '30'
  process.env.SKIP_SQS = 'false'
  process.env.CATALOG_REST_QUEUE_URL = 'mock-catalog-rest-queue-url'
  process.env.CMR_ORDERING_ORDER_QUEUE_URL = 'mock-cmr-ordering-order-queue-url'
  process.env.HARMONY_QUEUE_URL = 'mock-harmony-queue-url'
  process.env.SWODLR_QUEUE_URL = 'mock-swodlr-queue-url'
})

describe('Retrieval resolver', () => {
  describe('Query', () => {
    describe('retrieval', () => {
      test('returns the retrieval', async () => {
        const databaseClient = {
          getRetrievalByObfuscatedId: jest.fn().mockResolvedValue({
            id: 1,
            user_id: 42,
            jsondata: {},
            environment: 'test',
            created_at: '2023-01-01T00:00:00Z',
            updated_at: '2023-01-01T00:00:00Z'
          }),
          getRetrievalCollectionsByRetrievalId: jest.fn().mockResolvedValue([{
            id: 1,
            retrieval_id: 1,
            access_method: { mock: 'access method' },
            collection_id: 'collectionId',
            collection_metadata: {
              title: 'Mock Title',
              relatedUrls: [{
                urls: [{
                  url: 'https://doi.org/10.5067/MODIS/MYD11A1.061',
                  type: 'DATA SET LANDING PAGE',
                  subtype: '',
                  description: 'The LP DAAC product page provides information on Science Data Set layers and links for user guides, ATBDs, data access, tools, customer support, etc.',
                  urlContentType: 'CollectionURL'
                }, {
                  url: 'https://lpdaac.usgs.gov/',
                  type: 'PROJECT HOME PAGE',
                  subtype: '',
                  description: 'The LP DAAC website provides detailed information on discovery, distribution, access, and support of land data products.',
                  urlContentType: 'CollectionURL'
                }],
                label: 'Collection URL',
                contentType: 'CollectionURL'
              }, {
                urls: [{
                  url: 'https://appeears.earthdatacloud.nasa.gov/',
                  type: 'GET DATA',
                  subtype: 'APPEEARS',
                  description: 'The Application for Extracting and Exploring Analysis Ready Samples (AρρEEARS) offers a simple and efficient way to perform data access and transformation processes.',
                  urlContentType: 'DistributionURL'
                }, {
                  url: 'https://e4ftl01.cr.usgs.gov/MOLA/MYD11A1.061/',
                  type: 'GET DATA',
                  subtype: 'DATA TREE',
                  description: 'LP DAAC Data Pool provides direct access to available products via HTTPS.',
                  urlContentType: 'DistributionURL'
                }, {
                  url: 'https://earthexplorer.usgs.gov/',
                  type: 'GET DATA',
                  subtype: 'USGS EARTH EXPLORER',
                  description: 'USGS EarthExplorer provides users the ability to query, search, and order products available from the LP DAAC.',
                  urlContentType: 'DistributionURL'
                }, {
                  url: 'https://opendap.cr.usgs.gov/opendap/hyrax/DP128/MOLA/MYD11A1.061/contents.html',
                  type: 'USE SERVICE API',
                  subtype: 'OPENDAP DATA',
                  description: 'Access data via Open-source Project for a Network Data Access Protocol',
                  urlContentType: 'DistributionURL'
                }],
                label: 'Distribution URL',
                contentType: 'DistributionURL'
              }, {
                urls: [{
                  url: 'https://lpdaac.usgs.gov/documents/119/MOD11_ATBD.pdf',
                  type: 'VIEW RELATED INFORMATION',
                  subtype: 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)',
                  description: 'The ATBD provides physical theory and mathematical procedures for the calculations used to produce the data products.',
                  urlContentType: 'PublicationURL'
                }, {
                  url: 'https://ladsweb.modaps.eosdis.nasa.gov/filespec/MODIS/61/MYD11A1',
                  type: 'VIEW RELATED INFORMATION',
                  subtype: 'GENERAL DOCUMENTATION',
                  description: 'The File Specification provides a description of the product file including Scientific Data Sets and their attributes.',
                  urlContentType: 'PublicationURL'
                }, {
                  url: 'https://modis-land.gsfc.nasa.gov/MODLAND_val.html',
                  type: 'VIEW RELATED INFORMATION',
                  subtype: 'SCIENCE DATA PRODUCT VALIDATION',
                  description: 'Validation at stage 2 has been achieved for all MODIS Land Surface Temperature and Emissivity products.',
                  urlContentType: 'PublicationURL'
                }, {
                  url: 'https://modis-land.gsfc.nasa.gov/ValStatus.php?ProductID=MOD11',
                  type: 'VIEW RELATED INFORMATION',
                  subtype: 'SCIENCE DATA PRODUCT VALIDATION',
                  description: 'Further details regarding MODIS land product validation for the MYD11 data products are available from the MODIS Land Team Validation site.',
                  urlContentType: 'PublicationURL'
                }, {
                  url: 'https://lpdaac.usgs.gov/documents/715/MOD11_User_Guide_V61.pdf',
                  type: 'VIEW RELATED INFORMATION',
                  subtype: "USER'S GUIDE",
                  description: "The technical information in the User's Guide enables users to interpret and use the data products.",
                  urlContentType: 'PublicationURL'
                }],
                label: 'Publication URL',
                contentType: 'PublicationURL'
              }, {
                urls: [{
                  url: 'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2020.05.25/BROWSE.MYD11A1.A2002185.h18v06.061.2020128174728.1.jpg',
                  type: 'GET RELATED VISUALIZATION',
                  subtype: '',
                  description: 'Browse image for Earthdata Search',
                  urlContentType: 'VisualizationURL'
                }],
                label: 'Visualization URL',
                contentType: 'VisualizationURL'
              }, {
                urls: [{
                  url: 'https://doi.org/10.5067/MODIS/MYD11A1.061',
                  type: 'DATA SET LANDING PAGE',
                  description: 'The LP DAAC product page provides information on Science Data Set layers and links for user guides, ATBDs, data access, tools, customer support, etc.',
                  urlContentType: 'CollectionURL',
                  highlightedType: 'Data Set Landing Page'
                }, {
                  url: 'https://lpdaac.usgs.gov/documents/715/MOD11_User_Guide_V61.pdf',
                  type: 'VIEW RELATED INFORMATION',
                  subtype: "USER'S GUIDE",
                  description: "The technical information in the User's Guide enables users to interpret and use the data products.",
                  urlContentType: 'PublicationURL',
                  highlightedType: "User's Guide"
                }],
                label: 'Highlighted URL',
                contentType: 'HighlightedURL'
              }]
            },
            granule_params: { mock: 'granule params' },
            granule_count: 42,
            granule_link_count: 42,
            updated_at: '2023-01-01T00:00:00Z'
          }])
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: GET_RETRIEVAL,
          variables: {
            obfuscatedId: 'test-obfuscated-id'
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(data).toEqual({
          retrieval: {
            id: 1,
            jsondata: {},
            obfuscatedId: '4517239960',
            retrievalCollections: [{
              collectionId: 'collectionId',
              collectionMetadata: {
                relatedUrls: [{
                  contentType: 'CollectionURL',
                  label: 'Collection URL',
                  urls: [{
                    description: 'The LP DAAC product page provides information on Science Data Set layers and links for user guides, ATBDs, data access, tools, customer support, etc.',
                    subtype: '',
                    type: 'DATA SET LANDING PAGE',
                    url: 'https://doi.org/10.5067/MODIS/MYD11A1.061',
                    urlContentType: 'CollectionURL'
                  }, {
                    description: 'The LP DAAC website provides detailed information on discovery, distribution, access, and support of land data products.',
                    subtype: '',
                    type: 'PROJECT HOME PAGE',
                    url: 'https://lpdaac.usgs.gov/',
                    urlContentType: 'CollectionURL'
                  }]
                }, {
                  contentType: 'DistributionURL',
                  label: 'Distribution URL',
                  urls: [{
                    description: 'The Application for Extracting and Exploring Analysis Ready Samples (AρρEEARS) offers a simple and efficient way to perform data access and transformation processes.',
                    subtype: 'APPEEARS',
                    type: 'GET DATA',
                    url: 'https://appeears.earthdatacloud.nasa.gov/',
                    urlContentType: 'DistributionURL'
                  }, {
                    description: 'LP DAAC Data Pool provides direct access to available products via HTTPS.',
                    subtype: 'DATA TREE',
                    type: 'GET DATA',
                    url: 'https://e4ftl01.cr.usgs.gov/MOLA/MYD11A1.061/',
                    urlContentType: 'DistributionURL'
                  }, {
                    description: 'USGS EarthExplorer provides users the ability to query, search, and order products available from the LP DAAC.',
                    subtype: 'USGS EARTH EXPLORER',
                    type: 'GET DATA',
                    url: 'https://earthexplorer.usgs.gov/',
                    urlContentType: 'DistributionURL'
                  }, {
                    description: 'Access data via Open-source Project for a Network Data Access Protocol',
                    subtype: 'OPENDAP DATA',
                    type: 'USE SERVICE API',
                    url: 'https://opendap.cr.usgs.gov/opendap/hyrax/DP128/MOLA/MYD11A1.061/contents.html',
                    urlContentType: 'DistributionURL'
                  }]
                }, {
                  contentType: 'PublicationURL',
                  label: 'Publication URL',
                  urls: [{
                    description: 'The ATBD provides physical theory and mathematical procedures for the calculations used to produce the data products.',
                    subtype: 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)',
                    type: 'VIEW RELATED INFORMATION',
                    url: 'https://lpdaac.usgs.gov/documents/119/MOD11_ATBD.pdf',
                    urlContentType: 'PublicationURL'
                  }, {
                    description: 'The File Specification provides a description of the product file including Scientific Data Sets and their attributes.',
                    subtype: 'GENERAL DOCUMENTATION',
                    type: 'VIEW RELATED INFORMATION',
                    url: 'https://ladsweb.modaps.eosdis.nasa.gov/filespec/MODIS/61/MYD11A1',
                    urlContentType: 'PublicationURL'
                  }, {
                    description: 'Validation at stage 2 has been achieved for all MODIS Land Surface Temperature and Emissivity products.',
                    subtype: 'SCIENCE DATA PRODUCT VALIDATION',
                    type: 'VIEW RELATED INFORMATION',
                    url: 'https://modis-land.gsfc.nasa.gov/MODLAND_val.html',
                    urlContentType: 'PublicationURL'
                  }, {
                    description: 'Further details regarding MODIS land product validation for the MYD11 data products are available from the MODIS Land Team Validation site.',
                    subtype: 'SCIENCE DATA PRODUCT VALIDATION',
                    type: 'VIEW RELATED INFORMATION',
                    url: 'https://modis-land.gsfc.nasa.gov/ValStatus.php?ProductID=MOD11',
                    urlContentType: 'PublicationURL'
                  }, {
                    description: "The technical information in the User's Guide enables users to interpret and use the data products.",
                    subtype: "USER'S GUIDE",
                    type: 'VIEW RELATED INFORMATION',
                    url: 'https://lpdaac.usgs.gov/documents/715/MOD11_User_Guide_V61.pdf',
                    urlContentType: 'PublicationURL'
                  }]
                }, {
                  contentType: 'VisualizationURL',
                  label: 'Visualization URL',
                  urls: [{
                    description: 'Browse image for Earthdata Search',
                    subtype: '',
                    type: 'GET RELATED VISUALIZATION',
                    url: 'https://e4ftl01.cr.usgs.gov//WORKING/BRWS/Browse.001/2020.05.25/BROWSE.MYD11A1.A2002185.h18v06.061.2020128174728.1.jpg',
                    urlContentType: 'VisualizationURL'
                  }]
                }, {
                  contentType: 'HighlightedURL',
                  label: 'Highlighted URL',
                  urls: [{
                    description: 'The LP DAAC product page provides information on Science Data Set layers and links for user guides, ATBDs, data access, tools, customer support, etc.',
                    highlightedType: 'Data Set Landing Page',
                    type: 'DATA SET LANDING PAGE',
                    url: 'https://doi.org/10.5067/MODIS/MYD11A1.061',
                    urlContentType: 'CollectionURL'
                  }, {
                    description: "The technical information in the User's Guide enables users to interpret and use the data products.",
                    highlightedType: "User's Guide",
                    subtype: "USER'S GUIDE",
                    type: 'VIEW RELATED INFORMATION',
                    url: 'https://lpdaac.usgs.gov/documents/715/MOD11_User_Guide_V61.pdf',
                    urlContentType: 'PublicationURL'
                  }]
                }],
                title: 'Mock Title'
              },
              links: {
                links: [{
                  type: 'DATA SET LANDING PAGE',
                  url: 'https://doi.org/10.5067/MODIS/MYD11A1.061'
                }],
                title: 'Mock Title'
              },
              obfuscatedId: '4517239960'
            }]
          }
        })

        expect(databaseClient.getRetrievalByObfuscatedId).toHaveBeenCalledTimes(1)
        expect(databaseClient.getRetrievalByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id', 42)

        expect(databaseClient.getRetrievalCollectionsByRetrievalId).toHaveBeenCalledTimes(1)
        expect(databaseClient.getRetrievalCollectionsByRetrievalId).toHaveBeenCalledWith([1])
      })
    })

    describe('historyRetrivals', () => {
      test('returns the history retrievals', async () => {
        const databaseClient = {
          getHistoryRetrievals: jest.fn().mockResolvedValue([{
            created_at: '2023-01-01T00:00:00Z',
            id: 1,
            portal_id: 'edsc',
            titles_array: ['title 1'],
            total: 1
          }])
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: HISTORY_RETRIEVALS,
          variables: {}
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(data).toEqual({
          historyRetrievals: {
            count: 1,
            historyRetrievals: [
              {
                createdAt: '2023-01-01T00:00:00Z',
                id: 1,
                obfuscatedId: '4517239960',
                portalId: 'edsc',
                titles: ['title 1']
              }
            ],
            pageInfo: {
              currentPage: 1,
              hasNextPage: false,
              hasPreviousPage: false,
              pageCount: 1
            }
          }
        })

        expect(databaseClient.getHistoryRetrievals).toHaveBeenCalledTimes(1)
        expect(databaseClient.getHistoryRetrievals).toHaveBeenCalledWith(
          {
            limit: 20,
            offset: 0,
            userId: 42
          }
        )
      })
    })

    describe('retrievalCollection', () => {
      test('returns the retrieval collection', async () => {
        const databaseClient = {
          getRetrievalCollectionByObfuscatedId: jest.fn().mockResolvedValue({
            id: 1,
            retrieval_id: 2,
            access_method: { mock: 'access method' },
            collection_id: 'collectionId',
            collection_metadata: { mock: 'collection metadata' },
            granule_params: { mock: 'granule params' },
            granule_count: 42,
            granule_link_count: 42,
            updated_at: '2023-01-01T00:00:00Z',
            retrieval_order_id: 3,
            type: 'type',
            order_number: 1,
            order_information: { mock: 'order information' },
            state: 'state',
            error: 'error',
            retrieval_order_updated_at: '2023-01-01T00:00:00Z'
          }),
          getRetrievalOrdersByRetrievalCollectionId: jest.fn().mockResolvedValue([{
            id: 1,
            retrieval_collection_id: 1,
            type: 'type',
            state: 'state',
            order_information: { mock: 'order information' },
            order_number: 1
          }])
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: GET_RETRIEVAL_COLLECTION,
          variables: {
            obfuscatedId: 'test-obfuscated-id'
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(data).toEqual({
          retrievalCollection: {
            accessMethod: { mock: 'access method' },
            collectionMetadata: { mock: 'collection metadata' },
            granuleCount: 42,
            obfuscatedId: '4517239960',
            retrievalId: 2,
            retrievalOrders: [{
              error: null,
              id: 1,
              orderInformation: { mock: 'order information' },
              orderNumber: 1,
              state: 'state',
              type: 'type'
            }],
            updatedAt: '2023-01-01T00:00:00Z'
          }
        })

        expect(databaseClient.getRetrievalCollectionByObfuscatedId).toHaveBeenCalledTimes(1)
        expect(databaseClient.getRetrievalCollectionByObfuscatedId).toHaveBeenCalledWith('test-obfuscated-id', 42)

        expect(databaseClient.getRetrievalOrdersByRetrievalCollectionId).toHaveBeenCalledTimes(1)
        expect(databaseClient.getRetrievalOrdersByRetrievalCollectionId).toHaveBeenCalledWith([1])
      })
    })

    describe('retrieveGranuleLinks', () => {
      test('retrieves granule links for a given retrieval collection', async () => {
        fetchGranuleLinks.mockResolvedValue({
          cursor: null,
          done: null,
          links: [
            'https://example.com/granule1',
            'https://example.com/granule2'
          ]
        })

        const { contextValue, server } = setupServer({
          databaseClient: {}
        })

        const response = await server.executeOperation({
          query: GET_RETRIEVAL_GRANULE_LINKS,
          variables: {
            obfuscatedRetrievalCollectionId: 'test-obfuscated-id',
            flattenLinks: true,
            linkTypes: ['data']
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(data).toEqual({
          retrieveGranuleLinks: {
            cursor: null,
            done: null,
            links: [
              'https://example.com/granule1',
              'https://example.com/granule2'
            ]
          }
        })

        expect(fetchGranuleLinks).toHaveBeenCalledTimes(1)
        expect(fetchGranuleLinks).toHaveBeenCalledWith({
          cursor: undefined,
          databaseClient: {},
          earthdataEnvironment: 'prod',
          edlToken: 'token',
          flattenLinks: true,
          linkTypes: 'data',
          obfuscatedRetrievalCollectionId: 'test-obfuscated-id',
          pageNum: 1,
          requestId: undefined,
          userId: 42
        })
      })
    })
  })

  describe('Mutation', () => {
    describe('createRetrieval', () => {
      const collectionMetadata = {
        conceptId: 'C2105092163-LAADS',
        dataCenter: 'LAADS',
        directDistributionInformation: {
          region: 'us-west-2',
          s3BucketAndObjectPrefixNames: [
            's3://prod-lads/VNP03IMG'
          ],
          s3CredentialsApiEndpoint: 'https://data.laadsdaac.earthdatacloud.nasa.gov/s3credentials',
          s3CredentialsApiDocumentationUrl: 'https://data.laadsdaac.earthdatacloud.nasa.gov/s3credentialsREADME'
        },
        isCSDA: false,
        isOpenSearch: false,
        relatedUrls: [
          {
            contentType: 'CollectionURL',
            label: 'Collection URL',
            urls: [
              {
                description: 'The product landing page',
                urlContentType: 'CollectionURL',
                type: 'DATA SET LANDING PAGE',
                url: 'https://doi.org/10.5067/VIIRS/VNP03IMG.002',
                subtype: ''
              }
            ]
          },
          {
            contentType: 'DistributionURL',
            label: 'Distribution URL',
            urls: [
              {
                description: 'Direct access to VNP03IMG C1 data set.',
                urlContentType: 'DistributionURL',
                type: 'GET DATA',
                subtype: 'DIRECT DOWNLOAD',
                url: 'https://ladsweb.modaps.eosdis.nasa.gov/archive/allData/5200/VNP03IMG/',
                getData: {
                  format: 'Not provided',
                  mimeType: 'text/html',
                  size: 0,
                  unit: 'KB'
                }
              },
              {
                description: 'Search and order products from LAADS website.',
                urlContentType: 'DistributionURL',
                type: 'GET DATA',
                subtype: 'LAADS',
                url: 'https://ladsweb.modaps.eosdis.nasa.gov/search/order/2/VNP03IMG--5200',
                getData: {
                  format: 'Not provided',
                  mimeType: 'text/html',
                  size: 0,
                  unit: 'KB'
                }
              },
              {
                getService: {
                  format: 'Not provided',
                  mimeType: 'text/html',
                  protocol: 'HTTPS',
                  fullName: 'Not provided',
                  dataId: 'Not provided',
                  dataType: 'Not provided'
                },
                description: "Direct access to product's OPeNDAP directory",
                urlContentType: 'DistributionURL',
                type: 'USE SERVICE API',
                subtype: 'OPENDAP DATA',
                url: 'https://ladsweb.modaps.eosdis.nasa.gov/opendap/hyrax/allData/5200/VNP03IMG/contents.html'
              }
            ]
          },
          {
            contentType: 'PublicationURL',
            label: 'Publication URL',
            urls: [
              {
                description: 'VIIRS Geolocation ATBD Link',
                urlContentType: 'PublicationURL',
                type: 'VIEW RELATED INFORMATION',
                subtype: 'ALGORITHM THEORETICAL BASIS DOCUMENT (ATBD)',
                url: 'https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/viirs/NASARevisedVIIRSGeolocationATBD2014.pdf'
              },
              {
                description: 'VIIRS Level-1 User Guide - version 3',
                urlContentType: 'PublicationURL',
                type: 'VIEW RELATED INFORMATION',
                subtype: "USER'S GUIDE",
                url: 'https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/viirs/NASA_VIIRS_L1B_UG_August_2021.pdf'
              }
            ]
          },
          {
            contentType: 'VisualizationURL',
            label: 'Visualization URL',
            urls: []
          },
          {
            contentType: 'HighlightedURL',
            label: 'Highlighted URL',
            urls: [
              {
                description: 'The product landing page',
                urlContentType: 'CollectionURL',
                type: 'DATA SET LANDING PAGE',
                url: 'https://doi.org/10.5067/VIIRS/VNP03IMG.002',
                highlightedType: 'Data Set Landing Page'
              },
              {
                description: 'VIIRS Level-1 User Guide - version 3',
                urlContentType: 'PublicationURL',
                type: 'VIEW RELATED INFORMATION',
                subtype: "USER'S GUIDE",
                url: 'https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/viirs/NASA_VIIRS_L1B_UG_August_2021.pdf',
                highlightedType: "User's Guide"
              }
            ]
          }
        ],
        title: 'VIIRS/NPP Imagery Resolution Terrain Corrected Geolocation 6-Min L1 Swath 375 m',
        shortName: 'VNP03IMG',
        versionId: '2'
      }

      const jsondata = {
        portalId: 'edsc',
        source: '?p=C2105092163-LAADS!C2105092163-LAADS&pg[1][a]=3857626071!LAADS&pg[1][v]=t&pg[1][gsk]=-start_date&pg[1][m]=download&pg[1][cd]=f&q=C2799465509-POCLOUD&base=landWaterMap&lat=-17.84970003129062&long=62.31893843151474&projection=EPSG%3A3031&zoom=2',
        shapefileId: ''
      }

      const granuleParams = {
        conceptId: [
          'G3857626071-LAADS'
        ],
        echoCollectionId: 'C2105092163-LAADS',
        exclude: {},
        options: {},
        pageNum: 1,
        pageSize: 20,
        sortKey: '-start_date',
        twoDCoordinateSystem: {}
      }

      describe('when the collection already has a saved access configuration', () => {
        test('creates a new retrieval and updates the saved access configuration', async () => {
          const databaseClient = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            createRetrieval: jest.fn().mockResolvedValue({
              id: 1,
              user_id: 42,
              environment: 'prod',
              jsondata,
              updated_at: '2023-01-01T00:00:00Z',
              created_at: '2023-01-01T00:00:00Z'
            }),
            createRetrievalCollection: jest.fn().mockResolvedValue([{
              id: 1,
              access_method: { type: 'download' },
              collection_id: 'C2105092163-LAADS',
              collection_metadata: {},
              granule_params: {},
              granule_count: 1,
              granule_link_count: 10
            }]),
            getAccessConfiguration: jest.fn().mockResolvedValue([{ id: 1 }]),
            updateAccessConfiguration: jest.fn()
          }

          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: CREATE_RETRIEVAL,
            variables: {
              collections: [
                {
                  id: 'C2105092163-LAADS',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata,
                  granuleParams: {
                    conceptId: [
                      'G3857626071-LAADS'
                    ],
                    echoCollectionId: 'C2105092163-LAADS',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    sortKey: '-start_date',
                    twoDCoordinateSystem: {}
                  },
                  accessMethod: {
                    type: 'download'
                  }
                }
              ],
              environment: 'prod',
              jsondata
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createRetrieval: {
              environment: 'prod',
              obfuscatedId: '4517239960'
            }
          })

          expect(databaseClient.startTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.startTransaction).toHaveBeenCalledWith()

          expect(databaseClient.commitTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.commitTransaction).toHaveBeenCalledWith()

          expect(databaseClient.createRetrieval).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrieval).toHaveBeenCalledWith({
            environment: 'prod',
            jsondata,
            token: 'token',
            userId: 42
          })

          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledWith({
            accessMethod: { type: 'download' },
            collectionId: 'C2105092163-LAADS',
            collectionMetadata,
            granuleCount: 1,
            granuleLinkCount: 10,
            granuleParams: {
              concept_id: ['G3857626071-LAADS'],
              echo_collection_id: 'C2105092163-LAADS',
              exclude: {},
              options: {},
              page_num: 1,
              page_size: 20,
              sort_key: '-start_date',
              two_d_coordinate_system: {}
            },
            retrievalId: 1
          })

          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledWith({
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.updateAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.updateAccessConfiguration).toHaveBeenCalledWith({
            accessMethod: { type: 'download' }
          }, {
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })
        })
      })

      describe('when the access method type is download', () => {
        test('creates a new retrieval and returns the retrieval object', async () => {
          const databaseClient = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            createRetrieval: jest.fn().mockResolvedValue({
              id: 1,
              user_id: 42,
              environment: 'prod',
              jsondata,
              updated_at: '2023-01-01T00:00:00Z',
              created_at: '2023-01-01T00:00:00Z'
            }),
            createRetrievalCollection: jest.fn().mockResolvedValue([{
              id: 1,
              access_method: { type: 'download' },
              collection_id: 'C2105092163-LAADS',
              collection_metadata: {},
              granule_params: {},
              granule_count: 1,
              granule_link_count: 10
            }]),
            getAccessConfiguration: jest.fn().mockResolvedValue([]),
            saveAccessConfiguration: jest.fn()
          }

          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: CREATE_RETRIEVAL,
            variables: {
              collections: [
                {
                  id: 'C2105092163-LAADS',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata,
                  granuleParams: {
                    conceptId: [
                      'G3857626071-LAADS'
                    ],
                    echoCollectionId: 'C2105092163-LAADS',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    sortKey: '-start_date',
                    twoDCoordinateSystem: {}
                  },
                  accessMethod: {
                    type: 'download'
                  }
                }
              ],
              environment: 'prod',
              jsondata
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createRetrieval: {
              environment: 'prod',
              obfuscatedId: '4517239960'
            }
          })

          expect(databaseClient.startTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.startTransaction).toHaveBeenCalledWith()

          expect(databaseClient.commitTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.commitTransaction).toHaveBeenCalledWith()

          expect(databaseClient.createRetrieval).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrieval).toHaveBeenCalledWith({
            environment: 'prod',
            jsondata,
            token: 'token',
            userId: 42
          })

          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledWith({
            accessMethod: { type: 'download' },
            collectionId: 'C2105092163-LAADS',
            collectionMetadata,
            granuleCount: 1,
            granuleLinkCount: 10,
            granuleParams: {
              concept_id: ['G3857626071-LAADS'],
              echo_collection_id: 'C2105092163-LAADS',
              exclude: {},
              options: {},
              page_num: 1,
              page_size: 20,
              sort_key: '-start_date',
              two_d_coordinate_system: {}
            },
            retrievalId: 1
          })

          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledWith({
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledWith({
            accessMethod: { type: 'download' },
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })
        })
      })

      describe('when the access method type is echo orders', () => {
        test('creates a new retrieval, sends an sqs message, and returns the retrieval object', async () => {
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

          const databaseClient = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            createRetrieval: jest.fn().mockResolvedValue({
              id: 1,
              user_id: 42,
              environment: 'prod',
              jsondata,
              updated_at: '2023-01-01T00:00:00Z',
              created_at: '2023-01-01T00:00:00Z'
            }),
            createRetrievalCollection: jest.fn().mockResolvedValue([{
              id: 1,
              access_method: { type: 'download' },
              collection_id: 'C2105092163-LAADS',
              collection_metadata: collectionMetadata,
              granule_params: snakecaseKeys(granuleParams),
              granule_count: 1,
              granule_link_count: 10
            }]),
            createRetrievalOrder: jest.fn().mockResolvedValue({ id: 4 }),
            getAccessConfiguration: jest.fn().mockResolvedValue([]),
            saveAccessConfiguration: jest.fn()
          }

          const sqs = {
            send: jest.fn()
          }

          const { contextValue, server } = setupServer({
            databaseClient,
            sqs
          })

          const response = await server.executeOperation({
            query: CREATE_RETRIEVAL,
            variables: {
              collections: [
                {
                  id: 'C2105092163-LAADS',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata,
                  granuleParams,
                  accessMethod
                }
              ],
              environment: 'prod',
              jsondata
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createRetrieval: {
              environment: 'prod',
              obfuscatedId: '4517239960'
            }
          })

          expect(databaseClient.startTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.startTransaction).toHaveBeenCalledWith()

          expect(databaseClient.commitTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.commitTransaction).toHaveBeenCalledWith()

          expect(databaseClient.createRetrieval).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrieval).toHaveBeenCalledWith({
            environment: 'prod',
            jsondata,
            token: 'token',
            userId: 42
          })

          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            collectionMetadata,
            granuleCount: 1,
            granuleLinkCount: 10,
            granuleParams: snakecaseKeys(granuleParams),
            retrievalId: 1
          })

          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledWith({
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.createRetrievalOrder).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalOrder).toHaveBeenCalledWith({
            orderPayload: snakecaseKeys({
              ...granuleParams,
              pageSize: 2000
            }),
            retrievalCollectionId: 1,
            type: 'ECHO ORDERS'
          })

          expect(sqs.send).toHaveBeenCalledTimes(1)
          expect(sqs.send).toHaveBeenCalledWith({
            deserialize: expect.any(Function),
            input: {
              Entries: [{
                DelaySeconds: 3,
                Id: '1-1',
                MessageBody: '{"accessToken":"token","id":4}'
              }],
              QueueUrl: 'mock-cmr-ordering-order-queue-url'
            },
            middlewareStack: {
              add: expect.any(Function),
              addRelativeTo: expect.any(Function),
              applyToStack: expect.any(Function),
              clone: expect.any(Function),
              concat: expect.any(Function),
              identify: expect.any(Function),
              identifyOnResolve: expect.any(Function),
              remove: expect.any(Function),
              removeByTag: expect.any(Function),
              resolve: expect.any(Function),
              use: expect.any(Function)
            },
            serialize: expect.any(Function)
          })
        })
      })

      describe('when the access method type is esi', () => {
        test('creates a new retrieval, sends an sqs message, and returns the retrieval object', async () => {
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

          const databaseClient = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            createRetrieval: jest.fn().mockResolvedValue({
              id: 1,
              user_id: 42,
              environment: 'prod',
              jsondata,
              updated_at: '2023-01-01T00:00:00Z',
              created_at: '2023-01-01T00:00:00Z'
            }),
            createRetrievalCollection: jest.fn().mockResolvedValue([{
              id: 1,
              access_method: { type: 'download' },
              collection_id: 'C2105092163-LAADS',
              collection_metadata: collectionMetadata,
              granule_params: snakecaseKeys(granuleParams),
              granule_count: 1,
              granule_link_count: 10
            }]),
            createRetrievalOrder: jest.fn().mockResolvedValue({ id: 4 }),
            getAccessConfiguration: jest.fn().mockResolvedValue([]),
            saveAccessConfiguration: jest.fn()
          }

          const sqs = {
            send: jest.fn()
          }

          const { contextValue, server } = setupServer({
            databaseClient,
            sqs
          })

          const response = await server.executeOperation({
            query: CREATE_RETRIEVAL,
            variables: {
              collections: [
                {
                  id: 'C2105092163-LAADS',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata,
                  granuleParams,
                  accessMethod
                }
              ],
              environment: 'prod',
              jsondata
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createRetrieval: {
              environment: 'prod',
              obfuscatedId: '4517239960'
            }
          })

          expect(databaseClient.startTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.startTransaction).toHaveBeenCalledWith()

          expect(databaseClient.commitTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.commitTransaction).toHaveBeenCalledWith()

          expect(databaseClient.createRetrieval).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrieval).toHaveBeenCalledWith({
            environment: 'prod',
            jsondata,
            token: 'token',
            userId: 42
          })

          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            collectionMetadata,
            granuleCount: 1,
            granuleLinkCount: 10,
            granuleParams: snakecaseKeys(granuleParams),
            retrievalId: 1
          })

          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledWith({
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.createRetrievalOrder).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalOrder).toHaveBeenCalledWith({
            orderPayload: snakecaseKeys({
              ...granuleParams,
              pageSize: 2000
            }),
            retrievalCollectionId: 1,
            type: 'ESI'
          })

          expect(sqs.send).toHaveBeenCalledTimes(1)
          expect(sqs.send).toHaveBeenCalledWith({
            deserialize: expect.any(Function),
            input: {
              Entries: [{
                DelaySeconds: 3,
                Id: '1-1',
                MessageBody: '{"accessToken":"token","id":4}'
              }],
              QueueUrl: 'mock-catalog-rest-queue-url'
            },
            middlewareStack: {
              add: expect.any(Function),
              addRelativeTo: expect.any(Function),
              applyToStack: expect.any(Function),
              clone: expect.any(Function),
              concat: expect.any(Function),
              identify: expect.any(Function),
              identifyOnResolve: expect.any(Function),
              remove: expect.any(Function),
              removeByTag: expect.any(Function),
              resolve: expect.any(Function),
              use: expect.any(Function)
            },
            serialize: expect.any(Function)
          })
        })
      })

      describe('when the access method type is harmony', () => {
        test('creates a new retrieval, sends an sqs message, and returns the retrieval object', async () => {
          const accessMethod = {
            defaultConcatenation: false,
            enableConcatenateDownload: false,
            enableSpatialSubsetting: true,
            enableTemporalSubsetting: true,
            selectedVariables: [
              'V2833331293-POCLOUD',
              'V2833331295-POCLOUD',
              'V2833331301-POCLOUD'
            ],
            supportsBoundingBoxSubsetting: true,
            supportsConcatenation: false,
            supportsShapefileSubsetting: true,
            type: 'Harmony',
            url: 'https://harmony.earthdata.nasa.gov',
            selectedVariableNames: [
              '/data_20/alt_state_acq_mode_flag',
              '/data_20/alt_state_track_trans_flag',
              '/data_20/altitude'
            ]
          }

          const databaseClient = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            createRetrieval: jest.fn().mockResolvedValue({
              id: 1,
              user_id: 42,
              environment: 'prod',
              jsondata,
              updated_at: '2023-01-01T00:00:00Z',
              created_at: '2023-01-01T00:00:00Z'
            }),
            createRetrievalCollection: jest.fn().mockResolvedValue([{
              id: 1,
              access_method: { type: 'download' },
              collection_id: 'C2105092163-LAADS',
              collection_metadata: collectionMetadata,
              granule_params: snakecaseKeys(granuleParams),
              granule_count: 1,
              granule_link_count: 10
            }]),
            createRetrievalOrder: jest.fn().mockResolvedValue({ id: 4 }),
            getAccessConfiguration: jest.fn().mockResolvedValue([]),
            saveAccessConfiguration: jest.fn()
          }

          const sqs = {
            send: jest.fn()
          }

          const { contextValue, server } = setupServer({
            databaseClient,
            sqs
          })

          const response = await server.executeOperation({
            query: CREATE_RETRIEVAL,
            variables: {
              collections: [
                {
                  id: 'C2105092163-LAADS',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata,
                  granuleParams,
                  accessMethod
                }
              ],
              environment: 'prod',
              jsondata
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createRetrieval: {
              environment: 'prod',
              obfuscatedId: '4517239960'
            }
          })

          expect(databaseClient.startTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.startTransaction).toHaveBeenCalledWith()

          expect(databaseClient.commitTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.commitTransaction).toHaveBeenCalledWith()

          expect(databaseClient.createRetrieval).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrieval).toHaveBeenCalledWith({
            environment: 'prod',
            jsondata,
            token: 'token',
            userId: 42
          })

          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            collectionMetadata,
            granuleCount: 1,
            granuleLinkCount: 10,
            granuleParams: snakecaseKeys(granuleParams),
            retrievalId: 1
          })

          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledWith({
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.createRetrievalOrder).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalOrder).toHaveBeenCalledWith({
            orderPayload: snakecaseKeys({
              ...granuleParams,
              pageSize: 2000
            }),
            retrievalCollectionId: 1,
            type: 'Harmony'
          })

          expect(sqs.send).toHaveBeenCalledTimes(1)
          expect(sqs.send).toHaveBeenCalledWith({
            deserialize: expect.any(Function),
            input: {
              Entries: [{
                DelaySeconds: 3,
                Id: '1-1',
                MessageBody: '{"accessToken":"token","id":4}'
              }],
              QueueUrl: 'mock-harmony-queue-url'
            },
            middlewareStack: {
              add: expect.any(Function),
              addRelativeTo: expect.any(Function),
              applyToStack: expect.any(Function),
              clone: expect.any(Function),
              concat: expect.any(Function),
              identify: expect.any(Function),
              identifyOnResolve: expect.any(Function),
              remove: expect.any(Function),
              removeByTag: expect.any(Function),
              resolve: expect.any(Function),
              use: expect.any(Function)
            },
            serialize: expect.any(Function)
          })
        })
      })

      describe('when the access method type is opendap', () => {
        test('creates a new retrieval and returns the retrieval object', async () => {
          const accessMethod = {
            type: 'OPeNDAP',
            selectedVariables: ['V1245794632-EEDTEST'],
            selectedOutputFormat: 'ascii',
            selectedVariableNames: ['/gt1l/bckgrd_atlas/bckgrd_counts']
          }

          const databaseClient = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            createRetrieval: jest.fn().mockResolvedValue({
              id: 1,
              user_id: 42,
              environment: 'prod',
              jsondata,
              updated_at: '2023-01-01T00:00:00Z',
              created_at: '2023-01-01T00:00:00Z'
            }),
            createRetrievalCollection: jest.fn().mockResolvedValue([{
              id: 1,
              access_method: { type: 'download' },
              collection_id: 'C2105092163-LAADS',
              collection_metadata: {},
              granule_params: {},
              granule_count: 1,
              granule_link_count: 10
            }]),
            getAccessConfiguration: jest.fn().mockResolvedValue([]),
            saveAccessConfiguration: jest.fn()
          }

          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: CREATE_RETRIEVAL,
            variables: {
              collections: [
                {
                  id: 'C2105092163-LAADS',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata,
                  granuleParams,
                  accessMethod
                }
              ],
              environment: 'prod',
              jsondata
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createRetrieval: {
              environment: 'prod',
              obfuscatedId: '4517239960'
            }
          })

          expect(databaseClient.startTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.startTransaction).toHaveBeenCalledWith()

          expect(databaseClient.commitTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.commitTransaction).toHaveBeenCalledWith()

          expect(databaseClient.createRetrieval).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrieval).toHaveBeenCalledWith({
            environment: 'prod',
            jsondata,
            token: 'token',
            userId: 42
          })

          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            collectionMetadata,
            granuleCount: 1,
            granuleLinkCount: 10,
            granuleParams: {
              concept_id: ['G3857626071-LAADS'],
              echo_collection_id: 'C2105092163-LAADS',
              exclude: {},
              options: {},
              page_num: 1,
              page_size: 20,
              sort_key: '-start_date',
              two_d_coordinate_system: {}
            },
            retrievalId: 1
          })

          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledWith({
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })
        })
      })

      describe('when the access method type is swodlr', () => {
        test('creates a new retrieval, sends an sqs message, and returns the retrieval object', async () => {
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

          const databaseClient = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            createRetrieval: jest.fn().mockResolvedValue({
              id: 1,
              user_id: 42,
              environment: 'prod',
              jsondata,
              updated_at: '2023-01-01T00:00:00Z',
              created_at: '2023-01-01T00:00:00Z'
            }),
            createRetrievalCollection: jest.fn().mockResolvedValue([{
              id: 1,
              access_method: { type: 'download' },
              collection_id: 'C2105092163-LAADS',
              collection_metadata: collectionMetadata,
              granule_params: snakecaseKeys(granuleParams),
              granule_count: 1,
              granule_link_count: 10
            }]),
            createRetrievalOrder: jest.fn().mockResolvedValue({ id: 4 }),
            getAccessConfiguration: jest.fn().mockResolvedValue([]),
            saveAccessConfiguration: jest.fn()
          }

          const sqs = {
            send: jest.fn()
          }

          const { contextValue, server } = setupServer({
            databaseClient,
            sqs
          })

          const response = await server.executeOperation({
            query: CREATE_RETRIEVAL,
            variables: {
              collections: [
                {
                  id: 'C2105092163-LAADS',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata,
                  granuleParams,
                  accessMethod
                }
              ],
              environment: 'prod',
              jsondata
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            createRetrieval: {
              environment: 'prod',
              obfuscatedId: '4517239960'
            }
          })

          expect(databaseClient.startTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.startTransaction).toHaveBeenCalledWith()

          expect(databaseClient.commitTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.commitTransaction).toHaveBeenCalledWith()

          expect(databaseClient.createRetrieval).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrieval).toHaveBeenCalledWith({
            environment: 'prod',
            jsondata,
            token: 'token',
            userId: 42
          })

          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            collectionMetadata,
            granuleCount: 1,
            granuleLinkCount: 10,
            granuleParams: snakecaseKeys(granuleParams),
            retrievalId: 1
          })

          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.getAccessConfiguration).toHaveBeenCalledWith({
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledTimes(1)
          expect(databaseClient.saveAccessConfiguration).toHaveBeenCalledWith({
            accessMethod,
            collectionId: 'C2105092163-LAADS',
            userId: 42
          })

          expect(databaseClient.createRetrievalOrder).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalOrder).toHaveBeenCalledWith({
            orderPayload: snakecaseKeys({
              ...granuleParams,
              pageSize: 1
            }),
            retrievalCollectionId: 1,
            type: 'SWODLR'
          })

          expect(sqs.send).toHaveBeenCalledTimes(1)
          expect(sqs.send).toHaveBeenCalledWith({
            deserialize: expect.any(Function),
            input: {
              Entries: [{
                DelaySeconds: 3,
                Id: '1-1',
                MessageBody: '{"accessToken":"token","id":4}'
              }],
              QueueUrl: 'mock-swodlr-queue-url'
            },
            middlewareStack: {
              add: expect.any(Function),
              addRelativeTo: expect.any(Function),
              applyToStack: expect.any(Function),
              clone: expect.any(Function),
              concat: expect.any(Function),
              identify: expect.any(Function),
              identifyOnResolve: expect.any(Function),
              remove: expect.any(Function),
              removeByTag: expect.any(Function),
              resolve: expect.any(Function),
              use: expect.any(Function)
            },
            serialize: expect.any(Function)
          })
        })
      })

      describe('when a database error occurs', () => {
        test('rolls back the database transaction and returns an error', async () => {
          const databaseClient = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            rollbackTransaction: jest.fn(),
            createRetrieval: jest.fn().mockResolvedValue({
              id: 1,
              user_id: 42,
              environment: 'prod',
              jsondata,
              updated_at: '2023-01-01T00:00:00Z',
              created_at: '2023-01-01T00:00:00Z'
            }),
            createRetrievalCollection: jest.fn().mockImplementation(() => {
              throw new Error('Database error')
            })
          }

          const { contextValue, server } = setupServer({
            databaseClient
          })

          const response = await server.executeOperation({
            query: CREATE_RETRIEVAL,
            variables: {
              collections: [
                {
                  id: 'C2105092163-LAADS',
                  granuleCount: 1,
                  granuleLinkCount: 10,
                  collectionMetadata,
                  granuleParams: {
                    conceptId: [
                      'G3857626071-LAADS'
                    ],
                    echoCollectionId: 'C2105092163-LAADS',
                    exclude: {},
                    options: {},
                    pageNum: 1,
                    pageSize: 20,
                    sortKey: '-start_date',
                    twoDCoordinateSystem: {}
                  },
                  accessMethod: {
                    type: 'download'
                  }
                }
              ],
              environment: 'prod',
              jsondata
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toEqual([{
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              stacktrace: expect.arrayContaining(['Error: Failed to create retrieval'])
            },
            locations: [{
              column: 3,
              line: 2
            }],
            message: 'Failed to create retrieval',
            path: ['createRetrieval']
          }])

          expect(data).toEqual({
            createRetrieval: null
          })

          expect(databaseClient.startTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.startTransaction).toHaveBeenCalledWith()

          expect(databaseClient.commitTransaction).toHaveBeenCalledTimes(0)

          expect(databaseClient.rollbackTransaction).toHaveBeenCalledTimes(1)
          expect(databaseClient.rollbackTransaction).toHaveBeenCalledWith()

          expect(databaseClient.createRetrieval).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrieval).toHaveBeenCalledWith({
            environment: 'prod',
            jsondata,
            token: 'token',
            userId: 42
          })

          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledTimes(1)
          expect(databaseClient.createRetrievalCollection).toHaveBeenCalledWith({
            accessMethod: { type: 'download' },
            collectionId: 'C2105092163-LAADS',
            collectionMetadata,
            granuleCount: 1,
            granuleLinkCount: 10,
            granuleParams: {
              concept_id: ['G3857626071-LAADS'],
              echo_collection_id: 'C2105092163-LAADS',
              exclude: {},
              options: {},
              page_num: 1,
              page_size: 20,
              sort_key: '-start_date',
              two_d_coordinate_system: {}
            },
            retrievalId: 1
          })
        })
      })
    })

    describe('deleteRetrieval', () => {
      test('deletes a retrieval successfully', async () => {
        const databaseClient = {
          deleteRetrieval: jest.fn().mockResolvedValue(1)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: DELETE_RETRIEVAL,
          variables: {
            obfuscatedId: '2057964173'
          }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.deleteRetrieval).toHaveBeenCalledWith({
          obfuscatedId: '2057964173',
          userId: contextValue.user.id
        })

        expect(data).toEqual({
          deleteRetrieval: true
        })
      })

      test('returns false when the retrieval is not deleted', async () => {
        const databaseClient = {
          deleteRetrieval: jest.fn().mockResolvedValue(0)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: DELETE_RETRIEVAL,
          variables: {
            obfuscatedId: '2057964173'
          }
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(databaseClient.deleteRetrieval).toHaveBeenCalledWith({
          obfuscatedId: '2057964173',
          userId: contextValue.user.id
        })

        expect(data).toEqual({
          deleteRetrieval: false
        })
      })

      test('throws an error when the mutation fails', async () => {
        const databaseClient = {
          deleteRetrieval: jest.fn().mockImplementation(() => {
            throw new Error('Failed to delete retrieval')
          })
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: DELETE_RETRIEVAL,
          variables: {
            obfuscatedId: '2057964173'
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult
        expect(errors[0].message).toEqual('Failed to delete retrieval')

        expect(data).toEqual({
          deleteRetrieval: null
        })
      })
    })
  })
})
