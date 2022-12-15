import nock from 'nock'
import AWS from 'aws-sdk'
import MockDate from 'mockdate'
import { relevantServices, relevantServiceCollections } from './mocks'
import * as deleteSystemToken from '../../util/urs/deleteSystemToken'
import * as getSystemToken from '../../util/urs/getSystemToken'
import * as pageAllCmrResults from '../../util/cmr/pageAllCmrResults'
import * as getRelevantServices from '../getRelevantServices'
import generateSubsettingTags from '../handler'

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

describe('generateSubsettingTags', () => {
  test('submits the correct data to sqs', async () => {
    // Set the necessary ENV variables to ensure all values are tested
    process.env.tagQueueUrl = 'http://example.com/tagQueue'
    process.env.optionDefinitionQueueUrl = 'http://example.com/optionDefinitionQueue'

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementationOnce(() => {})

    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer mocked-system-token')
      .get(/service_option_assignments/)
      .reply(200, [
        {
          service_option_assignment: {
            applies_only_to_granules: true,
            catalog_item_id: 'C00000002-EDSC',
            id: '00A6C11A-DCF0-50E9-74EC-2B02D51EBE85',
            service_entry_id: '5AE45EAE-C41E-04C0-087A-5C6FF266F58E',
            service_option_definition_id: '7914F90A-7A04-AD19-FAD7-A89F77949B25'
          }
        }
      ])

    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer mocked-system-token')
      .get(/service_option_definitions/)
      .reply(200, [
        {
          service_option_definition: {
            id: '7914F90A-7A04-AD19-FAD7-A89F77949B25',
            name: 'EDSC ESI Service'
          }
        }
      ])

    jest.spyOn(getRelevantServices, 'getRelevantServices').mockImplementationOnce(() => relevantServices)
    jest.spyOn(pageAllCmrResults, 'pageAllCmrResults').mockImplementation(() => relevantServiceCollections)

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
      .mockImplementationOnce(() => ({
        sendMessage: sqsSendMessagePromise
      }))
      .mockImplementationOnce(() => ({
        sendMessage: sqsSendMessagePromise
      }))
      .mockImplementationOnce(() => ({
        sendMessage: sqsSendMessagePromise
      }))
      .mockImplementationOnce(() => ({
        sendMessage: sqsSendMessagePromise
      }))

    // We set 'updated_at' in the subsetting tags so we need to mock the date here
    MockDate.set('1984-07-02T16:00:00.000Z')

    await generateSubsettingTags({}, {})

    MockDate.reset()

    // 4 calls to add tags to collections
    // 3 calls to remove stale tags
    expect(sqsSendMessagePromise).toBeCalledTimes(7)

    /**
     * We have to make a call for each service that we are going
     * to associate collections with. Our mocked data returns 4
     * relevant services which will result in 4 calls to sqs
     */
    expect(sqsSendMessagePromise.mock.calls[0]).toEqual([{
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.subset_service.esi',
        action: 'ADD',
        append: false,
        requireGranules: false,
        tagData: [{
          'concept-id': 'C00000001-EDSC',
          data: {
            updated_at: '1984-07-02T16:00:00.000Z',
            id: 'S00000001-EDSC',
            type: 'ESI',
            url: 'http://mapserver.eol.ucar.edu/acadis/'
          }
        }]
      }),
      QueueUrl: 'http://example.com/tagQueue'
    }])
    expect(sqsSendMessagePromise.mock.calls[1]).toEqual([{
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.subset_service.esi',
        action: 'ADD',
        append: false,
        requireGranules: false,
        tagData: [{
          'concept-id': 'C00000002-EDSC',
          data: {
            updated_at: '1984-07-02T16:00:00.000Z',
            id: 'S00000002-EDSC',
            type: 'ESI',
            service_option_definitions: [{
              id: '7914F90A-7A04-AD19-FAD7-A89F77949B25',
              name: 'EDSC ESI Service'
            }]
          }
        }, {
          'concept-id': 'C00000003-EDSC',
          data: {
            updated_at: '1984-07-02T16:00:00.000Z',
            id: 'S00000002-EDSC',
            type: 'ESI'
          }
        }]
      }),
      QueueUrl: 'http://example.com/tagQueue'
    }])
    expect(sqsSendMessagePromise.mock.calls[2]).toEqual([{
      MessageBody: JSON.stringify({
        collectionId: 'C00000009-EDSC',
        tagData: {
          updated_at: '1984-07-02T16:00:00.000Z',
          id: 'S00000003-EDSC',
          type: 'ECHO ORDERS',
          url: 'http://mapserver.eol.ucar.edu/acadis/'
        }
      }),
      QueueUrl: 'http://example.com/optionDefinitionQueue'
    }])
    expect(sqsSendMessagePromise.mock.calls[3]).toEqual([{
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.subset_service.opendap',
        action: 'ADD',
        append: false,
        requireGranules: false,
        tagData: [{
          'concept-id': 'C00000005-EDSC',
          data: {
            updated_at: '1984-07-02T16:00:00.000Z',
            id: 'S00000005-EDSC',
            type: 'OPeNDAP'
          }
        }]
      }),
      QueueUrl: 'http://example.com/tagQueue'
    }])

    /**
     * To remove stale tags we can provide CMR with the tag and
     * all collections that we want to disassociate data from because
     * we dont have specific data that we care about. Our mocked data
     * returns three relevant tags (ESI, ECHO ORDERS and OPeNDAP)
     * which will result in 3 calls to sqs
     */
    expect(sqsSendMessagePromise.mock.calls[4]).toEqual([{
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.subset_service.esi',
        action: 'REMOVE',
        searchCriteria: {
          condition: {
            and: [
              {
                tag: {
                  tag_key: 'edsc.extra.serverless.subset_service.esi'
                }
              },
              {
                not: {
                  or: [
                    {
                      concept_id: 'C00000001-EDSC'
                    }, {
                      concept_id: 'C00000002-EDSC'
                    }, {
                      concept_id: 'C00000003-EDSC'
                    }
                  ]
                }
              }
            ]
          }
        }
      }),
      QueueUrl: 'http://example.com/tagQueue'
    }])
    expect(sqsSendMessagePromise.mock.calls[5]).toEqual([{
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.subset_service.opendap',
        action: 'REMOVE',
        searchCriteria: {
          condition: {
            and: [
              {
                tag: {
                  tag_key: 'edsc.extra.serverless.subset_service.opendap'
                }
              },
              {
                not: {
                  or: [
                    {
                      concept_id: 'C00000005-EDSC'
                    }
                  ]
                }
              }
            ]
          }
        }
      }),
      QueueUrl: 'http://example.com/tagQueue'
    }])
    expect(sqsSendMessagePromise.mock.calls[6]).toEqual([{
      MessageBody: JSON.stringify({
        tagName: 'edsc.extra.serverless.subset_service.echo_orders',
        action: 'REMOVE',
        searchCriteria: {
          condition: {
            and: [
              {
                tag: {
                  tag_key: 'edsc.extra.serverless.subset_service.echo_orders'
                }
              },
              {
                not: {
                  or: [
                    {
                      concept_id: 'C00000009-EDSC'
                    }
                  ]
                }
              }
            ]
          }
        }
      }),
      QueueUrl: 'http://example.com/tagQueue'
    }])
  })

  test('catches and logs errors from the service option assignments http request correctly', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer mocked-system-token')
      .get(/service_option_assignments/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
    jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementationOnce(() => {})

    const response = await generateSubsettingTags({}, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Test error message')
  })
})
