import nock from 'nock'

import AWS from 'aws-sdk'
import MockDate from 'mockdate'

import * as getSystemToken from '../../util/urs/getSystemToken'

import { gibsResponse } from './mocks'

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

  jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

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
  test('correctly generates and queues tag data including custom products', async () => {
    process.env.tagQueueUrl = 'http://example.com/tagQueue'

    nock(/worldview/)
      .get(/wv\.json/)
      .reply(200, gibsResponse)

    await generateGibsTags({}, {})

    // 14 ADD calls for the unique concept ids and 1 DELETE call
    expect(sqsSendMessagePromise.mock.calls.length).toEqual(15)

    expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'ADD',
        requireGranules: false,
        tagData: {
          'concept-id': 'C1000000001-EDSC',
          data: [
            {
              match: {
                time_start: '>=2002-06-01T00:00:00Z',
                time_end: '<=2011-10-04T00:00:00Z',
                day_night_flag: 'night'
              },
              product: 'AMSRE_Surface_Rain_Rate_Night',
              group: 'overlays',
              title: 'Surface Rain Rate (Night)',
              source: 'Aqua / AMSR-E',
              format: 'png',
              updated_at: '1988-09-03T10:00:00.000Z',
              antarctic: false,
              antarctic_resolution: null,
              arctic: false,
              arctic_resolution: null,
              geographic: true,
              geographic_resolution: '2km'
            }
          ]
        }
      })
    }])

    expect(sqsSendMessagePromise.mock.calls[1]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'ADD',
        requireGranules: false,
        tagData: {
          'concept-id': 'C1000000002-EDSC',
          data: [
            {
              match: {
                time_start: '>=2002-08-30T00:00:00Z',
                day_night_flag: 'day'
              },
              product: 'AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day',
              group: 'overlays',
              title: 'Methane (L2, 400 hPa, Day)',
              source: 'Aqua / AIRS',
              format: 'png',
              updated_at: '1988-09-03T10:00:00.000Z',
              antarctic: false,
              antarctic_resolution: null,
              arctic: false,
              arctic_resolution: null,
              geographic: true,
              geographic_resolution: '2km'
            }
          ]
        }
      })
    }])

    expect(sqsSendMessagePromise.mock.calls[2]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'ADD',
        requireGranules: false,
        tagData: {
          'concept-id': 'C1000000003-EDSC',
          data: [
            {
              match: {
                time_start: '>=2002-08-30T00:00:00Z',
                day_night_flag: 'day'
              },
              product: 'AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day',
              group: 'overlays',
              title: 'Methane (L2, 400 hPa, Day)',
              source: 'Aqua / AIRS',
              format: 'png',
              updated_at: '1988-09-03T10:00:00.000Z',
              antarctic: false,
              antarctic_resolution: null,
              arctic: false,
              arctic_resolution: null,
              geographic: true,
              geographic_resolution: '2km'
            }
          ]
        }
      })
    }])

    expect(sqsSendMessagePromise.mock.calls[14]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'REMOVE',
        searchCriteria: {
          condition: {
            and: [
              {
                tag: {
                  tag_key: 'edsc.extra.serverless.gibs'
                }
              },
              {
                not: {
                  or: [
                    {
                      concept_id: 'C1000000001-EDSC'
                    },
                    {
                      concept_id: 'C1000000002-EDSC'
                    },
                    {
                      concept_id: 'C1000000003-EDSC'
                    },
                    {
                      concept_id: 'C191855458-LARC'
                    },
                    {
                      concept_id: 'C43677721-LARC'
                    },
                    {
                      concept_id: 'C43677725-LARC'
                    },
                    {
                      concept_id: 'C191855459-LARC'
                    },
                    {
                      concept_id: 'C7227850-LARC_ASDC'
                    },
                    {
                      concept_id: 'C7085910-LARC_ASDC'
                    },
                    {
                      concept_id: 'C7612165-LARC_ASDC'
                    },
                    {
                      concept_id: 'C6011924-LARC_ASDC'
                    },
                    {
                      concept_id: 'C43677719-LARC'
                    },
                    {
                      concept_id: 'C61095981-LARC'
                    },
                    {
                      concept_id: 'C84942916-LARC'
                    }
                  ]
                }
              }
            ]
          }
        }
      })
    }])
  })
})
