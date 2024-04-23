import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'
import { v4 as uuidv4 } from 'uuid'

import * as getDbConnection from '../../util/database/getDbConnection'
import * as startOrderStatusUpdateWorkflow from '../../util/startOrderStatusUpdateWorkflow'

import { mockSwodlrOrder } from './mocks'

import submitSwodlrOrder from '../handler'

let dbTracker

jest.mock('uuid')
uuidv4.mockImplementation(() => 'mock-request-id')

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    const dbCon = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbCon)

    return dbCon
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('submitSwodlrOrder', () => {
  test('correctly submits order to swodlr', async () => {
    const startOrderStatusUpdateWorkflowMock = jest.spyOn(startOrderStatusUpdateWorkflow, 'startOrderStatusUpdateWorkflow')
      .mockImplementation(() => (jest.fn()))
    const consoleMock = jest.spyOn(console, 'log')

    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .get(/granules/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G2938391118-POCLOUD',
            title: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_087F_20240414T225546_20240414T225558_PIC0_01'
          }, {
            id: 'G2938390924-POCLOUD',
            title: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_086F_20240414T225526_20240414T225547_PIC0_01'
          }
          ]
        }
      })

    nock(/swodlr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/api\/graphql/)
      .reply(200, {
        data: {
          generateL2RasterProduct: {
            id: 'e40d4b75-b632-4608-bfae-6f6e2c6f8f56',
            cycle: 13,
            pass: 514,
            scene: 87,
            outputGranuleExtentFlag: false,
            outputSamplingGridType: 'GEO',
            rasterResolution: 6,
            utmZoneAdjust: null,
            mgrsBandAdjust: null,
            status: [
              {
                id: 'dcb5e83f-6669-4fef-9d45-5296dcbef1c6',
                timestamp: '2024-04-22T20:30:05.061178',
                state: 'NEW',
                reason: null
              }
            ]
          }
        }
      })

    nock(/swodlr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/api\/graphql/)
      .reply(200, {
        data: {
          generateL2RasterProduct: {
            id: 'f40d4b75-b632-4608-bfae-6f6e2c6f8f56',
            cycle: 13,
            pass: 514,
            scene: 86,
            outputGranuleExtentFlag: false,
            outputSamplingGridType: 'GEO',
            rasterResolution: 6,
            utmZoneAdjust: null,
            mgrsBandAdjust: null,
            status: [
              {
                id: 'ccb5e83f-6669-4fef-9d45-5296dcbef1c6',
                timestamp: '2024-04-22T20:30:05.061178',
                state: 'NEW',
                reason: null
              }
            ]
          }
        }
      })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          id: 1,
          environment: 'prod',
          access_method: {
            optionDefinition: {
              conceptId: 'C2799438271-POCLOUD',
              name: 'SWOT Level 2 Water Mask Raster Image Data Product, Version 2.0'
            },
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR'
          },
          collection_id: 'C2799438271-POCLOUD',
          granule_params: {
            exclude: {},
            options: {},
            page_num: 1,
            sort_key: '-start_date',
            json_data: {
              params: {
                rasterResolution: 6,
                outputSamplingGridType: 'GEO',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G2938391118-POCLOUD': {
                  utmZoneAdjust: null,
                  mgrsBandAdjust: null
                },
                'G2938390924-POCLOUD': {
                  utmZoneAdjust: null,
                  mgrsBandAdjust: null
                }
              }
            },
            page_size: 2000,
            concept_id: [
              'G2938390910-POCLOUD',
              'G2938390924-POCLOUD'
            ],
            echo_collection_id: 'C2799438271-POCLOUD',
            two_d_coordinate_system: {}
          }
        }
        ])
      } else if (step === 2) {
        query.response([{
          id: 1,
          environment: 'prod',
          access_method: {
            optionDefinition: {
              conceptId: 'C2799438271-POCLOUD',
              name: 'SWOT Level 2 Water Mask Raster Image Data Product, Version 2.0'
            },
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR'
          },
          collection_id: 'C2799438271-POCLOUD',
          granule_params: {
            exclude: {},
            options: {},
            page_num: 1,
            sort_key: '-start_date',
            json_data: {
              params: {
                rasterResolution: 6,
                outputSamplingGridType: 'GEO',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G2938391118-POCLOUD': {
                  utmZoneAdjust: null,
                  mgrsBandAdjust: null
                },
                'G2938390924-POCLOUD': {
                  utmZoneAdjust: null,
                  mgrsBandAdjust: null
                }
              }
            },
            page_size: 2000,
            concept_id: [
              'G2938390910-POCLOUD',
              'G2938390924-POCLOUD'
            ],
            echo_collection_id: 'C2799438271-POCLOUD',
            two_d_coordinate_system: {}
          }
        }
        ])
      } else if (step === 3) {
        query.response([])
      }
    })

    const context = {}
    await submitSwodlrOrder(mockSwodlrOrder, context)

    const { queries } = dbTracker.queries

    expect(consoleMock.mock.calls[0]).toEqual(['Processing 1 order(s)'])
    expect(consoleMock.mock.calls[1]).toEqual(['Submitting retrieval_order 12 to swodlr with requestId mock-request-id'])

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')
    expect(queries[1].bindings).toEqual(['e40d4b75-b632-4608-bfae-6f6e2c6f8f56', { jobId: 'dcb5e83f-6669-4fef-9d45-5296dcbef1c6' }, 'NEW', 12])
    expect(queries[2].method).toEqual('update')
    expect(queries[2].bindings).toEqual(['f40d4b75-b632-4608-bfae-6f6e2c6f8f56', { jobId: 'ccb5e83f-6669-4fef-9d45-5296dcbef1c6' }, 'NEW', 12])
    expect(startOrderStatusUpdateWorkflowMock).toBeCalledWith(12, 'access-token', 'SWODLR')
  })

  test('saves an error message if the create fails from an http error', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .get(/granules/)
      .reply(500, {
        errorType: 'Error',
        errorMessage: 'Unknown Error',
        stack: [
          'Error: Unknown Error'
        ]
      })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          id: 1,
          environment: 'prod',
          access_method: {
            optionDefinition: {
              conceptId: 'C2799438271-POCLOUD',
              name: 'SWOT Level 2 Water Mask Raster Image Data Product, Version 2.0'
            },
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR'
          },
          collection_id: 'C2799438271-POCLOUD',
          granule_params: {
            exclude: {},
            options: {},
            page_num: 1,
            sort_key: '-start_date',
            json_data: {
              params: {
                rasterResolution: 6,
                outputSamplingGridType: 'GEO',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G2938391118-POCLOUD': {
                  utmZoneAdjust: null,
                  mgrsBandAdjust: null
                },
                'G2938390924-POCLOUD': {
                  utmZoneAdjust: null,
                  mgrsBandAdjust: null
                }
              }
            },
            page_size: 2000,
            concept_id: [
              'G2938390910-POCLOUD',
              'G2938390924-POCLOUD'
            ],
            echo_collection_id: 'C2799438271-POCLOUD',
            two_d_coordinate_system: {}
          }
        })
      } else if (step === 2) {
        query.response([])
      }
    })

    const context = {}
    await expect(submitSwodlrOrder(mockSwodlrOrder, context)).rejects.toEqual(new Error('Unknown Error'))

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')
    expect(queries[1].bindings).toEqual(['create_failed', 'Unknown Error', 12])
  })

  test('saves an error message if the create fails in swodlr order', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .get(/granules/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G2938391118-POCLOUD',
            title: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_087F_20240414T225546_20240414T225558_PIC0_01'
          }, {
            id: 'G2938390924-POCLOUD',
            title: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_086F_20240414T225526_20240414T225547_PIC0_01'
          }
          ]
        }
      })

    nock(/swodlr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/api\/graphql/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{
          id: 1,
          environment: 'prod',
          access_method: {
            optionDefinition: {
              conceptId: 'C2799438271-POCLOUD',
              name: 'SWOT Level 2 Water Mask Raster Image Data Product, Version 2.0'
            },
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR'
          },
          collection_id: 'C2799438271-POCLOUD',
          granule_params: {
            exclude: {},
            options: {},
            page_num: 1,
            sort_key: '-start_date',
            json_data: {
              params: {
                rasterResolution: 6,
                outputSamplingGridType: 'GEO',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G2938391118-POCLOUD': {
                  utmZoneAdjust: null,
                  mgrsBandAdjust: null
                },
                'G2938390924-POCLOUD': {
                  utmZoneAdjust: null,
                  mgrsBandAdjust: null
                }
              }
            },
            page_size: 2000,
            concept_id: [
              'G2938390910-POCLOUD',
              'G2938390924-POCLOUD'
            ],
            echo_collection_id: 'C2799438271-POCLOUD',
            two_d_coordinate_system: {}
          }
        }])
      } else if (step === 2) {
        query.response([])
      }
    })

    const context = {}
    await expect(submitSwodlrOrder(mockSwodlrOrder, context)).rejects.toThrow('Test error message')

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')
    expect(queries[1].bindings).toEqual(['create_failed', 'Test error message', 12])
  })
})
