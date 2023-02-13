import AWS from 'aws-sdk'
import MockDate from 'mockdate'
import nock from 'nock'

import * as deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import * as getJwtToken from '../../util/getJwtToken'
import * as getEchoToken from '../../util/urs/getEchoToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'

import exportSearch from '../handler'

const OLD_ENV = process.env

const AWS_TEST_REGION = 'us-east-1'
const SQS_TEST_PORT = 9324
const SQS_TEST_HOST = `0.0.0.0:${SQS_TEST_PORT}`
const SQS_TEST_LOCALHOST = `localhost:${SQS_TEST_PORT}`
const SQS_TEST_QUEUE_NAME = 'REQUEST_SEARCH_EXPORT_TEST_QUEUE'
const SQS_TEST_ENDPOINT = `http://${SQS_TEST_HOST}`
const MOCK_ECHO_TOKEN = '1234-abcd-5678-efgh'

// need to configure here because the aws-sdk expects it
// without it, the handler will throw an error
AWS.config.update({
  accessKeyId: Math.random().toString(), // this will be ignored by ElasticMQ
  secretAccessKey: Math.random().toString(), // this will be ignored by ElasticMQ
  region: AWS_TEST_REGION
})

const sqs = new AWS.SQS({ endpoint: SQS_TEST_ENDPOINT })

let testSearchExportQueueUrl
beforeAll(async () => {
  // explicitly allow network connections to ElasticMQ (SQS-Compatible) server
  nock.enableNetConnect(host => host === SQS_TEST_HOST || host === SQS_TEST_LOCALHOST)

  // create a queue and save the url to it
  const { QueueUrl } = await sqs.createQueue({ QueueName: SQS_TEST_QUEUE_NAME }).promise()

  // we save the url here, so we can pass it to the handler via an environmental variable
  testSearchExportQueueUrl = QueueUrl
})

afterAll(async () => {
  await sqs.deleteQueue({ QueueUrl: testSearchExportQueueUrl }).promise()

  // re-disable all network connections, including those to localhost and 0.0.0.0
  nock.disableNetConnect()
})

beforeEach(async () => {
  jest.clearAllMocks()

  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')

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

  // reset hacks on built-ins
  MockDate.reset()
  jest.spyOn(global.Math, 'random').mockRestore();
})

describe('exportSearch', () => {
  test('returns csv response correctly', async () => {
    process.env.searchExportQueueUrl = testSearchExportQueueUrl

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    const format = 'csv'

    const event = {
      body: JSON.stringify({
        data: {
          format,
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const result = await exportSearch(event, {})

    const expectedKey = '66241fe6c79c644cfc52b7f39644f5b7394ce1f30d4a0dd4b2237c8ca669ddee';

    expect(result.body).toEqual(`{"key":"${expectedKey}"}`)

    const { Messages } = await sqs.receiveMessage({ QueueUrl: testSearchExportQueueUrl }).promise()
    expect(Messages).toHaveLength(1)

    const message = JSON.parse(Messages[0].Body);

    expect(message).toEqual({
      params: {
        format,
        query: {},
        variables: {}
      },
      extra: {
        earthdataEnvironment: "prod",
        jwt: 'mockJwt',
        key: expectedKey,
        requestId: 'asdf-1234-qwer-5678'
      }
    })
  })

  test('returns json response correctly', async () => {
    process.env.searchExportQueueUrl = testSearchExportQueueUrl

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    const format = 'json'
    const event = {
      body: JSON.stringify({
        data: {
          format,
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const result = await exportSearch(event, {})

    expect(result.body).toEqual("{\"key\":\"6d5ae367c8c99d6bdf0fe7c4bfb56fc5306991c59a0d6c316386598f6711716b\"}")

    const { Messages } = await sqs.receiveMessage({ QueueUrl: testSearchExportQueueUrl }).promise()
    expect(Messages).toHaveLength(1)

    const message = JSON.parse(Messages[0].Body);
    expect(message).toEqual({
      extra: {
        earthdataEnvironment: "prod",
        key: "6d5ae367c8c99d6bdf0fe7c4bfb56fc5306991c59a0d6c316386598f6711716b",
        jwt: "mockJwt",
        requestId: "asdf-1234-qwer-5678"
      },
      params: {
        format: format,
        query: {},
        variables: {}
      }
    })
  })

  test('responds correctly on malformed input', async () => {
    process.env.searchExportQueueUrl = testSearchExportQueueUrl

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
      graphQlHost: 'https://graphql.example.com'
    }))

    const event = {
      body: ""
    }

    const response = await exportSearch(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('SyntaxError: Unexpected end of JSON input')

    // retrieve message from queue
    const { Messages = [] } = await sqs.receiveMessage({ QueueUrl: testSearchExportQueueUrl }).promise()

    // check that no message was created
    expect(Messages).toHaveLength(0)
  })
})
