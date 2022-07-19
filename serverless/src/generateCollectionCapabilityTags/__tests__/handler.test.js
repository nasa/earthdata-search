import AWS from 'aws-sdk'
import nock from 'nock'
import MockDate from 'mockdate'

import * as deleteSystemToken from '../../util/urs/deleteSystemToken'
import * as getSystemToken from '../../util/urs/getSystemToken'
import * as getPageOfGranules from '../../util/cmr/getPageOfGranules'

import generateCollectionCapabilityTags from '../handler'

const OLD_ENV = process.env

const sqsCollectionCapabilities = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue()
})

AWS.SQS = jest.fn()
  .mockImplementationOnce(() => ({
    sendMessage: sqsCollectionCapabilities
  }))

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
  jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementationOnce(() => {})

  // Manage resetting ENV variables
  jest.resetModules()
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

describe('generateCollectionCapabilityTags', () => {
  describe('when no input is provided', () => {
    test('requests page 1 of cmr collections to tag', async () => {
      // Set the necessary ENV variables to ensure all values are tested
      process.env.tagQueueUrl = 'http://example.com/tagQueue'

      jest.spyOn(getPageOfGranules, 'getPageOfGranules').mockImplementationOnce(() => ([{
        id: 'G100000-EDSC'
      }]))

      nock(/cmr/)
        .matchHeader('Authorization', 'Bearer mocked-system-token')
        .post(/collections/, 'has_granules=true&page_num=1&page_size=300&include_granule_counts=true&include_tags=edsc.extra.serverless.%2A')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              granule_count: 1
            }]
          }
        }, {
          'cmr-hits': 1
        })

      const response = await generateCollectionCapabilityTags({})

      expect(sqsCollectionCapabilities).toBeCalledTimes(1)

      expect(sqsCollectionCapabilities.mock.calls[0]).toEqual([{
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.collection_capabilities',
          action: 'ADD',
          tagData: [{
            'concept-id': 'C100000-EDSC',
            data: {
              cloud_cover: false,
              day_night_flag: false,
              granule_online_access_flag: false,
              orbit_calculated_spatial_domains: false,
              updated_at: '1988-09-03T10:00:00.000Z'
            }
          }]
        }),
        QueueUrl: 'http://example.com/tagQueue'
      }])

      expect(response).toEqual({
        hasMoreCollections: false,
        pageNumber: 2
      })
    })
  })

  describe('when a page number is provided', () => {
    test('requests page 4 of cmr collections to tag', async () => {
      // Set the necessary ENV variables to ensure all values are tested
      process.env.tagQueueUrl = 'http://example.com/tagQueue'

      jest.spyOn(getPageOfGranules, 'getPageOfGranules').mockImplementationOnce(() => ([{
        id: 'G100000-EDSC'
      }]))

      nock(/cmr/)
        .matchHeader('Authorization', 'Bearer mocked-system-token')
        .post(/collections/, 'has_granules=true&page_num=4&page_size=300&include_granule_counts=true&include_tags=edsc.extra.serverless.%2A')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              granule_count: 1
            }]
          }
        }, {
          'cmr-hits': 1999
        })

      const response = await generateCollectionCapabilityTags({ pageNumber: 4 })

      expect(sqsCollectionCapabilities).toBeCalledTimes(1)

      expect(sqsCollectionCapabilities.mock.calls[0]).toEqual([{
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.collection_capabilities',
          action: 'ADD',
          tagData: [{
            'concept-id': 'C100000-EDSC',
            data: {
              cloud_cover: false,
              day_night_flag: false,
              granule_online_access_flag: false,
              orbit_calculated_spatial_domains: false,
              updated_at: '1988-09-03T10:00:00.000Z'
            }
          }]
        }),
        QueueUrl: 'http://example.com/tagQueue'
      }])

      expect(response).toEqual({
        hasMoreCollections: true,
        pageNumber: 5
      })
    })
  })

  describe('when a concept id is provided', () => {
    test('requests collections to tag by concept id', async () => {
      // Set the necessary ENV variables to ensure all values are tested
      process.env.tagQueueUrl = 'http://example.com/tagQueue'

      jest.spyOn(getPageOfGranules, 'getPageOfGranules').mockImplementationOnce(() => ([{
        id: 'G100000-EDSC'
      }]))

      nock(/cmr/)
        .matchHeader('Authorization', 'Bearer mocked-system-token')
        .post(/collections/, 'has_granules=true&page_num=1&page_size=300&include_granule_counts=true&include_tags=edsc.extra.serverless.%2A&concept_id=C100000-EDSC')
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC',
              granule_count: 1
            }]
          }
        }, {
          'cmr-hits': 1
        })

      const response = await generateCollectionCapabilityTags({ conceptId: 'C100000-EDSC' })

      expect(sqsCollectionCapabilities).toBeCalledTimes(1)

      expect(sqsCollectionCapabilities.mock.calls[0]).toEqual([{
        MessageBody: JSON.stringify({
          tagName: 'edsc.extra.serverless.collection_capabilities',
          action: 'ADD',
          tagData: [{
            'concept-id': 'C100000-EDSC',
            data: {
              cloud_cover: false,
              day_night_flag: false,
              granule_online_access_flag: false,
              orbit_calculated_spatial_domains: false,
              updated_at: '1988-09-03T10:00:00.000Z'
            }
          }]
        }),
        QueueUrl: 'http://example.com/tagQueue'
      }])

      expect(response).toEqual({
        hasMoreCollections: false,
        pageNumber: 2
      })
    })
  })
})
