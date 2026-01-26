// Two classes are mocked in this test
/* eslint-disable max-classes-per-file */

import nock from 'nock'

import MockDate from 'mockdate'

import * as deleteSystemToken from '../../util/urs/deleteSystemToken'
import * as getSystemToken from '../../util/urs/getSystemToken'
import * as getSupportedGibsLayers from '../getSupportedGibsLayers'

import { gibsResponse } from './mocks'

import generateGibsTags from '../handler'

const OLD_ENV = process.env

const mocksqsSendMessage = vi.fn().mockResolvedValue()

vi.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: vi.fn(class {
    send = mocksqsSendMessage
  }),
  SendMessageCommand: vi.fn(class {
    constructor(params) {
      this.MessageBody = params.MessageBody
      this.QueueUrl = params.QueueUrl
    }
  })
}))

beforeEach(() => {
  vi.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
  vi.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => 'mocked-system-token')

  // Manage resetting ENV variables
  // TODO: This is causing problems with mocking knex but is noted as important for managing process.env
  vi.resetModules()
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
    process.env.TAG_QUEUE_URL = 'http://example.com/tagQueue'

    nock(/worldview/)
      .get(/wv\.json/)
      .reply(200, gibsResponse)

    await generateGibsTags({}, {})

    expect(mocksqsSendMessage.mock.calls.length).toEqual(5)

    expect(mocksqsSendMessage.mock.calls[0]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'ADD',
        requireGranules: false,
        tagData: {
          'concept-id': 'C1000000001-EDSC',
          data: [
            {
              format: 'png',
              group: 'overlays',
              layerPeriod: 'Daily',
              match: {
                time_start: '>=2002-06-01T00:00:00Z',
                time_end: '<=2011-10-04T00:00:00Z',
                day_night_flag: 'night'
              },
              product: 'AMSRE_Surface_Rain_Rate_Night',
              source: 'Aqua / AMSR-E',
              title: 'Surface Rain Rate (Night)',
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

    expect(mocksqsSendMessage.mock.calls[1]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'ADD',
        requireGranules: false,
        tagData: {
          'concept-id': 'C1000000002-EDSC',
          data: [
            {
              format: 'png',
              group: 'overlays',
              layerPeriod: 'Daily',
              match: {
                time_start: '>=2002-08-30T00:00:00Z',
                day_night_flag: 'day'
              },
              product: 'AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day',
              source: 'Aqua / AIRS',
              title: 'Methane (L2, 400 hPa, Day)',
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

    expect(mocksqsSendMessage.mock.calls[2]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'ADD',
        requireGranules: false,
        tagData: {
          'concept-id': 'C1000000003-EDSC',
          data: [
            {
              format: 'png',
              group: 'overlays',
              layerPeriod: 'Daily',
              match: {
                time_start: '>=2002-08-30T00:00:00Z',
                day_night_flag: 'day'
              },
              product: 'AIRS_L2_Methane_400hPa_Volume_Mixing_Ratio_Day',
              source: 'Aqua / AIRS',
              title: 'Methane (L2, 400 hPa, Day)',
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

    expect(mocksqsSendMessage.mock.calls[3]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'ADD',
        requireGranules: false,
        tagData: {
          'concept-id': 'C1000000004-EDSC',
          data: [{
            format: 'png',
            group: 'overlays',
            layerPeriod: 'Subdaily',
            match: {
              time_start: '>=2024-05-13T10:41:03Z',
              day_night_flag: 'unspecified'
            },
            product: 'TEMPO_L2_Ozone_Cloud_Fraction_Granule',
            source: 'TEMPO',
            title: 'Ozone (L2, Cloud Fraction, Subdaily) (BETA)',
            updated_at: '1988-09-03T10:00:00.000Z',
            antarctic: false,
            antarctic_resolution: null,
            arctic: false,
            arctic_resolution: null,
            geographic: true,
            geographic_resolution: '1km'
          }]
        }
      })
    }])

    expect(mocksqsSendMessage.mock.calls[4]).toEqual([{
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
                or: [{
                  concept_id: 'C1000000001-EDSC'
                }, {
                  concept_id: 'C1000000002-EDSC'
                }, {
                  concept_id: 'C1000000003-EDSC'
                }, {
                  concept_id: 'C1000000004-EDSC'
                }]
              }
            }]
          }
        }
      })
    }])
  })

  test('correctly generates and queues tag data when no collections are to be tagged', async () => {
    process.env.TAG_QUEUE_URL = 'http://example.com/tagQueue'

    vi.spyOn(getSupportedGibsLayers, 'getSupportedGibsLayers').mockReturnValue({})

    nock(/worldview/)
      .get(/wv\.json/)
      .reply(200, {
        layers: {}
      })

    await generateGibsTags({}, {})

    // 1 DELETE call
    expect(mocksqsSendMessage.mock.calls.length).toEqual(1)

    expect(mocksqsSendMessage.mock.calls[0]).toEqual([{
      QueueUrl: 'http://example.com/tagQueue',
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.gibs',
        action: 'REMOVE',
        searchCriteria: {
          condition: {
            tag: {
              tag_key: 'edsc.extra.serverless.gibs'
            }
          }
        }
      })
    }])
  })
})
