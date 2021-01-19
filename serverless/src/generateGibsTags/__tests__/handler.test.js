import AWS from 'aws-sdk'
import MockDate from 'mockdate'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getSupportedGibsLayers from '../getSupportedGibsLayers'

import generateGibsTags from '../handler'

const OLD_ENV = process.env

const sqsSendMessagePromise = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue()
})

AWS.SQS = jest.fn()
  .mockImplementationOnce(() => ({
    sendMessage: sqsSendMessagePromise
  }))
  .mockImplementationOnce(() => ({
    sendMessage: sqsSendMessagePromise
  }))
  .mockImplementationOnce(() => ({
    sendMessage: sqsSendMessagePromise
  }))

beforeEach(() => {
  jest.clearAllMocks()

  // Manage resetting ENV variables
  // TODO: This is causing problems with mocking knex but is noted as important for managing process.env
  // jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('1988-09-03T10:00:00.000Z')
})

afterEach(() => {
  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV

  MockDate.reset()
})

describe('generateGibsTags', () => {
  describe('when deployed environment is production', () => {
    test('correctly generates and queues tag data including custom products', async () => {
      process.env.tagQueueUrl = 'http://example.com/tagQueue'

      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementationOnce(() => 'prod')

      const getSupportedGibsLayersMock = jest.spyOn(getSupportedGibsLayers, 'getSupportedGibsLayers').mockImplementationOnce(() => ({
        MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily: {
          startDate: '2002-07-04T00:00:00Z',
          palette: {
            id: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'
          },
          description: 'modis/aqua/MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
          format: 'image/png',
          title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
          period: 'daily',
          layergroup: [
            'modis',
            'modis_aqua'
          ],
          group: 'overlays',
          dateRanges: [
            {
              startDate: '2002-07-04T00:00:00Z',
              dateInterval: '1',
              endDate: '2019-05-06T00:00:00Z'
            }
          ],
          projections: {
            geographic: {
              source: 'GIBS:geographic',
              matrixSet: '2km'
            }
          },
          subtitle: 'Aqua / MODIS',
          product: {
            query: {
              shortName: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
            },
            handler: 'List',
            name: 'PODAAC-MODAM-1D4N4'
          },
          type: 'wmts',
          id: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
          tags: 'ssc podaac PO.DAAC'
        },
        'MISR_Cloud_Stereo_Height_Histogram_Bin_1.5-20km_Monthly': {
          startDate: '2000-02-01',
          product: {
            query: {
              conceptId: ['C84942916-LARC']
            }
          },
          id: 'MISR_Cloud_Stereo_Height_Histogram_Bin_1.5-20km_Monthly',
          subtitle: 'Terra / MISR',
          format: 'image/png',
          title: 'Cloud Stereo Height (No Wind Correction, 1.5 - 2.0 km, Monthly)',
          type: 'wmts',
          projections: {
            geographic: {
              source: 'GIBS:geographic',
              matrixSet: '2km'
            }
          }
        }
      }))

      await generateGibsTags({}, {})

      expect(getSupportedGibsLayersMock).toBeCalledWith(true)

      expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
        QueueUrl: 'http://example.com/tagQueue',
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.gibs',
          action: 'ADD',
          requireGranules: false,
          tagData: {
            'concept-id': 'C84942916-LARC',
            data: [{
              match: {
                time_start: '>=2000-02-01'
              },
              product: 'MISR_Cloud_Stereo_Height_Histogram_Bin_1.5-20km_Monthly',
              title: 'Cloud Stereo Height (No Wind Correction, 1.5 - 2.0 km, Monthly)',
              source: 'Terra / MISR',
              format: 'png',
              updated_at: '1988-09-03T10:00:00.000Z',
              antarctic: false,
              antarctic_resolution: null,
              arctic: false,
              arctic_resolution: null,
              geographic: true,
              geographic_resolution: '2km'
            }]
          }
        })
      }])

      expect(sqsSendMessagePromise.mock.calls[1]).toEqual([{
        QueueUrl: 'http://example.com/tagQueue',
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.gibs',
          action: 'ADD',
          requireGranules: false,
          searchCriteria: {
            condition: {
              short_name: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
            }
          },
          tagData: [{
            match: {
              time_start: '>=2002-07-04T00:00:00Z'
            },
            product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
            group: 'overlays',
            title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
            source: 'Aqua / MODIS',
            format: 'png',
            updated_at: '1988-09-03T10:00:00.000Z',
            antarctic: false,
            antarctic_resolution: null,
            arctic: false,
            arctic_resolution: null,
            geographic: true,
            geographic_resolution: '2km'
          }]
        })
      }])

      expect(sqsSendMessagePromise.mock.calls[2]).toEqual([{
        QueueUrl: 'http://example.com/tagQueue',
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.gibs',
          action: 'REMOVE',
          searchCriteria: {
            condition: {
              and: [{
                tag: {
                  tag_key: 'edsc.extra.serverless.gibs'
                }
              }, {
                not: {
                  or: [
                    {
                      concept_id: 'C84942916-LARC'
                    }, {
                      short_name: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
                    }
                  ]
                }
              }]
            }
          }
        })
      }])
    })
  })

  describe('when deployed environment is production', () => {
    test('correctly generates and queues tag data excluding custom products', async () => {
      process.env.tagQueueUrl = 'http://example.com/tagQueue'

      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementationOnce(() => 'sit')

      const getSupportedGibsLayersMock = jest.spyOn(getSupportedGibsLayers, 'getSupportedGibsLayers').mockImplementationOnce(() => ({
        MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily: {
          startDate: '2002-07-04T00:00:00Z',
          palette: {
            id: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily'
          },
          description: 'modis/aqua/MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
          format: 'image/png',
          title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
          period: 'daily',
          layergroup: [
            'modis',
            'modis_aqua'
          ],
          group: 'overlays',
          dateRanges: [
            {
              startDate: '2002-07-04T00:00:00Z',
              dateInterval: '1',
              endDate: '2019-05-06T00:00:00Z'
            }
          ],
          projections: {
            geographic: {
              source: 'GIBS:geographic',
              matrixSet: '2km'
            }
          },
          subtitle: 'Aqua / MODIS',
          product: {
            query: {
              shortName: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
            },
            handler: 'List',
            name: 'PODAAC-MODAM-1D4N4'
          },
          type: 'wmts',
          id: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
          tags: 'ssc podaac PO.DAAC'
        },
        'MISR_Cloud_Stereo_Height_Histogram_Bin_1.5-20km_Monthly': {
          startDate: '2000-02-01',
          product: {
            query: {
              conceptId: ['C84942916-LARC']
            }
          },
          id: 'MISR_Cloud_Stereo_Height_Histogram_Bin_1.5-20km_Monthly',
          subtitle: 'Terra / MISR',
          format: 'image/png',
          title: 'Cloud Stereo Height (No Wind Correction, 1.5 - 2.0 km, Monthly)',
          type: 'wmts',
          projections: {
            geographic: {
              source: 'GIBS:geographic',
              matrixSet: '2km'
            }
          }
        }
      }))

      await generateGibsTags({}, {})

      expect(getSupportedGibsLayersMock).toBeCalledWith(false)

      expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
        QueueUrl: 'http://example.com/tagQueue',
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.gibs',
          action: 'ADD',
          requireGranules: false,
          tagData: {
            'concept-id': 'C84942916-LARC',
            data: [{
              match: {
                time_start: '>=2000-02-01'
              },
              product: 'MISR_Cloud_Stereo_Height_Histogram_Bin_1.5-20km_Monthly',
              title: 'Cloud Stereo Height (No Wind Correction, 1.5 - 2.0 km, Monthly)',
              source: 'Terra / MISR',
              format: 'png',
              updated_at: '1988-09-03T10:00:00.000Z',
              antarctic: false,
              antarctic_resolution: null,
              arctic: false,
              arctic_resolution: null,
              geographic: true,
              geographic_resolution: '2km'
            }]
          }
        })
      }])

      expect(sqsSendMessagePromise.mock.calls[1]).toEqual([{
        QueueUrl: 'http://example.com/tagQueue',
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.gibs',
          action: 'ADD',
          requireGranules: false,
          searchCriteria: {
            condition: {
              short_name: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
            }
          },
          tagData: [{
            match: {
              time_start: '>=2002-07-04T00:00:00Z'
            },
            product: 'MODIS_Aqua_L3_SST_MidIR_4km_Night_Daily',
            group: 'overlays',
            title: 'Sea Surface Temperature (L3, Night, Daily, Mid Infrared, 4 km)',
            source: 'Aqua / MODIS',
            format: 'png',
            updated_at: '1988-09-03T10:00:00.000Z',
            antarctic: false,
            antarctic_resolution: null,
            arctic: false,
            arctic_resolution: null,
            geographic: true,
            geographic_resolution: '2km'
          }]
        })
      }])

      expect(sqsSendMessagePromise.mock.calls[2]).toEqual([{
        QueueUrl: 'http://example.com/tagQueue',
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.gibs',
          action: 'REMOVE',
          searchCriteria: {
            condition: {
              and: [{
                tag: {
                  tag_key: 'edsc.extra.serverless.gibs'
                }
              }, {
                not: {
                  or: [
                    {
                      concept_id: 'C84942916-LARC'
                    }, {
                      short_name: 'MODIS_AQUA_L3_SST_MID-IR_DAILY_4KM_NIGHTTIME_V2014.0'
                    }
                  ]
                }
              }]
            }
          }
        })
      }])
    })
  })
})
