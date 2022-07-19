import AWS from 'aws-sdk'
import nock from 'nock'

import * as deleteSystemToken from '../../util/urs/deleteSystemToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getSystemToken from '../../util/urs/getSystemToken'
import * as getSingleGranule from '../../util/cmr/getSingleGranule'
import fetchOptionDefinitions from '../handler'

const OLD_ENV = process.env

beforeEach(() => {
  jest.clearAllMocks()

  // Manage resetting ENV variables
  jest.resetModules()
  process.env = { ...OLD_ENV }
  delete process.env.NODE_ENV
})

afterEach(() => {
  // Restore any ENV variables overwritten in tests
  process.env = OLD_ENV
})

describe('fetchOptionDefinitions', () => {
  test('takes no action when no records are provided', async () => {
    const sqsOptionDefinitions = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsOptionDefinitions
      }))

    await fetchOptionDefinitions({}, {})

    expect(sqsOptionDefinitions).toBeCalledTimes(0)
  })

  test('submits the correct data to sqs when option definitions exist', async () => {
    // Set the necessary ENV variables to ensure all values are tested
    process.env.tagQueueUrl = 'http://example.com/tagQueue'

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementationOnce(() => 'mocked-system-token')
    jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementationOnce(() => {})
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({ echoRestRoot: 'http://echorest.example.com' }))
    jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({ id: 'G10000001-EDSC' }))

    nock(/echorest/)
      .matchHeader('Authorization', 'Bearer mocked-system-token')
      .post(/order_information/)
      .reply(200, [{
        order_information: {
          catalog_item_ref: {
            id: 'G10000001-EDSC',
            location: 'http://cmr-search-prod.ngap.earthdata.nasa.gov:8080/search/concepts/G10000001-EDSC',
            name: 'G10000001-EDSC'
          },
          option_definition_refs: [{
            id: '2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
            location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/option_definitions/2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
            name: 'EDSC_FTPPULL'
          }],
          orderable: true,
          price: 0
        }
      }])

    const sqsOptionDefinitions = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsOptionDefinitions
      }))

    const event = {
      Records: [
        {
          body: JSON.stringify({
            collectionId: 'C10000001-EDSC',
            tagData: {
              updated_at: '1984-07-02T16:00:00.000Z',
              id: 'S00000001-EDSC',
              type: 'ESI',
              url: 'http://mapserver.eol.ucar.edu/acadis/'
            }
          })
        }
      ]
    }

    await fetchOptionDefinitions(event, {})

    expect(sqsOptionDefinitions).toBeCalledTimes(1)

    expect(sqsOptionDefinitions.mock.calls[0]).toEqual([{
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.subset_service.echo_orders',
        action: 'ADD',
        tagData: [{
          'concept-id': 'C10000001-EDSC',
          data: {
            updated_at: '1984-07-02T16:00:00.000Z',
            id: 'S00000001-EDSC',
            type: 'ESI',
            url: 'http://mapserver.eol.ucar.edu/acadis/',
            option_definitions: [{
              id: '2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
              name: 'EDSC_FTPPULL'
            }]
          }
        }]
      }),
      QueueUrl: 'http://example.com/tagQueue'
    }])
  })

  test('does not submit data to sqs when no order information exist', async () => {
    // Set the necessary ENV variables to ensure all values are tested
    process.env.tagQueueUrl = 'http://example.com/tagQueue'

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementationOnce(() => 'mocked-system-token')
    jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementationOnce(() => {})
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({ echoRestRoot: 'http://echorest.example.com' }))
    jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({ id: 'G10000001-EDSC' }))

    nock(/echorest/)
      .matchHeader('Authorization', 'Bearer mocked-system-token')
      .post(/order_information/)
      .reply(200, [{
        order_information: {}
      }])

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const sqsOptionDefinitions = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsOptionDefinitions
      }))

    const event = {
      Records: [
        {
          body: JSON.stringify({
            collectionId: 'C10000001-EDSC',
            tagData: {
              updated_at: '1984-07-02T16:00:00.000Z',
              id: 'S00000001-EDSC',
              type: 'ESI',
              url: 'http://mapserver.eol.ucar.edu/acadis/'
            }
          })
        }
      ]
    }

    await fetchOptionDefinitions(event, {})

    // We should not send a message to sqs
    expect(sqsOptionDefinitions).toBeCalledTimes(0)

    // The first will output the number of records, the second will
    // contain the message we're looking for
    expect(consoleMock).toBeCalledTimes(3)

    expect(consoleMock.mock.calls[2]).toEqual([
      "No Option Definitions for C10000001-EDSC, skipping 'edsc.extra.serverless.subset_service.echo_orders' tag."
    ])
  })

  test('does not submit data to sqs when no order information exist', async () => {
    // Set the necessary ENV variables to ensure all values are tested
    process.env.tagQueueUrl = 'http://example.com/tagQueue'

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementationOnce(() => 'mocked-system-token')
    jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementationOnce(() => {})
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({ echoRestRoot: 'http://echorest.example.com' }))
    jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({ id: 'G10000001-EDSC' }))

    nock(/echorest/)
      .matchHeader('Authorization', 'Bearer mocked-system-token')
      .post(/order_information/)
      .reply(200, [])

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const sqsOptionDefinitions = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsOptionDefinitions
      }))

    const event = {
      Records: [
        {
          body: JSON.stringify({
            collectionId: 'C10000001-EDSC',
            tagData: {
              updated_at: '1984-07-02T16:00:00.000Z',
              id: 'S00000001-EDSC',
              type: 'ESI',
              url: 'http://mapserver.eol.ucar.edu/acadis/'
            }
          })
        }
      ]
    }

    await fetchOptionDefinitions(event, {})

    // We should not send a message to sqs
    expect(sqsOptionDefinitions).toBeCalledTimes(0)

    // The first will output the number of records, the second will
    // contain the message we're looking for
    expect(consoleMock).toBeCalledTimes(3)
  })

  test('does not submit data to sqs when no option definitions exist', async () => {
    // Set the necessary ENV variables to ensure all values are tested
    process.env.tagQueueUrl = 'http://example.com/tagQueue'

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementationOnce(() => 'mocked-system-token')
    jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementationOnce(() => {})
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({ echoRestRoot: 'http://echorest.example.com' }))
    jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({ id: 'G10000001-EDSC' }))

    nock(/echorest/)
      .matchHeader('Authorization', 'Bearer mocked-system-token')
      .post(/order_information/)
      .reply(200, [{
        order_information: {
          catalog_item_ref: {
            id: 'G10000001-EDSC',
            location: 'http://cmr-search-prod.ngap.earthdata.nasa.gov:8080/search/concepts/G10000001-EDSC',
            name: 'G10000001-EDSC'
          },
          option_definition_refs: [],
          orderable: true,
          price: 0
        }
      }])

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const sqsOptionDefinitions = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsOptionDefinitions
      }))

    const event = {
      Records: [
        {
          body: JSON.stringify({
            collectionId: 'C10000001-EDSC',
            tagData: {
              updated_at: '1984-07-02T16:00:00.000Z',
              id: 'S00000001-EDSC',
              type: 'ESI',
              url: 'http://mapserver.eol.ucar.edu/acadis/'
            }
          })
        }
      ]
    }

    await fetchOptionDefinitions(event, {})

    // We should not send a message to sqs
    expect(sqsOptionDefinitions).toBeCalledTimes(0)

    // The first will output the number of records, the second will
    // contain the message we're looking for
    expect(consoleMock).toBeCalledTimes(3)
  })

  test('catches and logs errors correctly', async () => {
    // Set the necessary ENV variables to ensure all values are tested
    process.env.tagQueueUrl = 'http://example.com/tagQueue'

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementationOnce(() => 'mocked-system-token')
    jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementationOnce(() => {})
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({ echoRestRoot: 'http://echorest.example.com' }))
    jest.spyOn(getSingleGranule, 'getSingleGranule').mockImplementationOnce(() => ({ id: 'G10000001-EDSC' }))

    nock(/echorest/)
      .matchHeader('Authorization', 'Bearer mocked-system-token')
      .post(/order_information/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

    const sqsOptionDefinitions = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsOptionDefinitions
      }))

    const event = {
      Records: [
        {
          body: JSON.stringify({
            collectionId: 'C10000001-EDSC',
            tagData: {
              updated_at: '1984-07-02T16:00:00.000Z',
              id: 'S00000001-EDSC',
              type: 'ESI',
              url: 'http://mapserver.eol.ucar.edu/acadis/'
            }
          })
        }
      ]
    }

    await fetchOptionDefinitions(event, {})

    // We should not send a message to sqs
    expect(sqsOptionDefinitions).toBeCalledTimes(0)

    // The first will output the number of records, the second will
    // contain the message we're looking for
    expect(consoleMock).toBeCalledTimes(2)

    expect(consoleMock.mock.calls[1]).toEqual([
      'Error (500): Test error message'
    ])
  })
})
